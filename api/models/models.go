package models

import (
	"fmt"
	"strings"
	"time"

	"github.com/lczm/boardbuddy/api/config"
	"github.com/patrickmn/go-cache"
)

// GradeInfo represents grade information for a specific angle
type GradeInfo struct {
	Boulder string `json:"boulder"`
	Route   string `json:"route"`
}

// Climb represents a climb along with its board images.
type Climb struct {
	UUID           string               `json:"uuid"`
	SetterName     string               `json:"setter_name"`
	ClimbName      string               `json:"climb_name"`
	Description    string               `json:"description"`
	Frames         string               `json:"frames"`
	ImageFilenames string               `json:"image_filenames"` // JSON array string of image filenames
	Grades         map[string]GradeInfo `json:"grades"`          // angle -> {boulder, route}
	CreatedAt      string               `json:"created_at"`
}

// CursorPaginatedClimbsResponse holds cursor-paginated climbs along with images.
type CursorPaginatedClimbsResponse struct {
	Climbs     []Climb `json:"climbs"`
	HasMore    bool    `json:"has_more"`
	NextCursor string  `json:"next_cursor,omitempty"`
	PageSize   int     `json:"page_size"`
}

// BoardOption represents a board (product_size) option for filtering climbs.
type BoardOption struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

var c = cache.New(7*24*time.Hour, 10*time.Minute)

func GetPaginatedClimbs(cursor string, pageSize int, nameFilter string, boardID uint) (*CursorPaginatedClimbsResponse, error) {
	cacheKey := fmt.Sprintf("climbs-cursor-%s-%d-%s-%d", cursor, pageSize, nameFilter, boardID)
	if x, found := c.Get(cacheKey); found {
		return x.(*CursorPaginatedClimbsResponse), nil
	}

	nameFilter = strings.TrimSpace(nameFilter)
	likePattern := "%" + nameFilter + "%"

	// Build the cursor condition for pagination
	cursorCondition := ""
	var args []interface{}

	if cursor == "" {
		// First page - no cursor condition
		args = []interface{}{likePattern}
	} else {
		// Subsequent pages - filter by cursor (created_at timestamp)
		cursorCondition = "AND c.created_at < ?"
		args = []interface{}{likePattern, cursor}
	}

	// Optimized query - group by climb UUID to avoid duplicates
	query := `
SELECT 
  c.uuid,
  c.setter_username AS setter_name,
  c.name AS climb_name,
  c.description,
  c.frames,
  c.created_at,
  COALESCE(
    (SELECT json_group_array(DISTINCT psl.image_filename) 
     FROM product_sizes_layouts_sets psl 
     JOIN product_sizes ps2 ON psl.product_size_id = ps2.id
     WHERE ps2.product_id = l.product_id AND psl.layout_id = l.id AND
           ps2.edge_left <= c.edge_left AND
           ps2.edge_right >= c.edge_right AND
           ps2.edge_bottom <= c.edge_bottom AND
           ps2.edge_top >= c.edge_top),
    '[]'
  ) AS image_filenames
FROM climbs c
JOIN layouts l ON c.layout_id = l.id
JOIN product_sizes ps ON (
  ps.product_id = l.product_id AND
  ps.edge_left <= c.edge_left AND
  ps.edge_right >= c.edge_right AND
  ps.edge_bottom <= c.edge_bottom AND
  ps.edge_top >= c.edge_top
)
WHERE c.is_listed = 1 
  AND c.name LIKE ? 
  ` + cursorCondition + `
  ` + optionalBoardFilterSQL(boardID) + `
GROUP BY c.uuid
ORDER BY c.created_at DESC, c.uuid DESC
LIMIT ?`

	args = append(args, pageSize+1) // Get one extra to check for more pages

	var climbs []Climb
	if err := config.KilterDB.Raw(query, args...).Scan(&climbs).Error; err != nil {
		return nil, fmt.Errorf("fetch climbs: %w", err)
	}

	// Check if there are more pages
	hasMore := len(climbs) > pageSize
	if hasMore {
		climbs = climbs[:pageSize] // Remove the extra record
	}

	// Fetch grades for all climbs
	if err := populateClimbGrades(climbs); err != nil {
		return nil, fmt.Errorf("populate grades: %w", err)
	}

	// Get next cursor from the last item
	var nextCursor string
	if hasMore && len(climbs) > 0 {
		nextCursor = climbs[len(climbs)-1].CreatedAt
	}

	resp := &CursorPaginatedClimbsResponse{
		Climbs:     climbs,
		HasMore:    hasMore,
		NextCursor: nextCursor,
		PageSize:   pageSize,
	}

	// Cache for shorter time since this is more dynamic
	c.Set(cacheKey, resp, 5*time.Minute)
	return resp, nil
}

// get all listed boards
func GetBoardOptions() ([]BoardOption, error) {
	cacheKey := "boardOptions"
	if x, found := c.Get(cacheKey); found {
		return x.([]BoardOption), nil
	}
	var boards []BoardOption
	query := `
SELECT
  ps.id   AS id,
  ps.name AS name
FROM product_sizes AS ps
JOIN products AS p
  ON ps.product_id = p.id
WHERE ps.is_listed = 1
  AND p.is_listed  = 1
ORDER BY ps.position;`
	if err := config.KilterDB.Raw(query).Scan(&boards).Error; err != nil {
		return nil, fmt.Errorf("fetch boards: %w", err)
	}
	c.Set(cacheKey, boards, cache.DefaultExpiration)
	return boards, nil
}

// helper to use for in-query sql
// optionalBoardFilterSQL returns SQL snippet to filter
func optionalBoardFilterSQL(boardID uint) string {
	if boardID == 0 {
		return ""
	}
	return fmt.Sprintf("AND ps.id = %d", boardID)
}

// populateClimbGrades fetches and populates grade information for a list of climbs
func populateClimbGrades(climbs []Climb) error {
	if len(climbs) == 0 {
		return nil
	}

	// Initialize grades map for each climb
	for i := range climbs {
		climbs[i].Grades = make(map[string]GradeInfo)
	}

	// Extract unique climb UUIDs for batch fetching
	climbUUIDs := make([]string, len(climbs))
	climbIndexMap := make(map[string][]int) // UUID -> slice indices

	for i, climb := range climbs {
		climbUUIDs[i] = climb.UUID
		climbIndexMap[climb.UUID] = append(climbIndexMap[climb.UUID], i)
	}

	// Build placeholders for IN clause
	placeholders := strings.Repeat("?,", len(climbUUIDs))
	placeholders = placeholders[:len(placeholders)-1] // Remove trailing comma

	// Query to get climb stats with grade information
	query := fmt.Sprintf(`
SELECT 
	cs.climb_uuid,
	cs.angle,
	cs.display_difficulty,
	dg.boulder_name,
	dg.route_name
FROM climb_stats cs
JOIN difficulty_grades dg ON CAST(cs.display_difficulty AS INTEGER) = dg.difficulty
WHERE cs.climb_uuid IN (%s)
ORDER BY cs.climb_uuid, cs.angle`, placeholders)

	// Convert climbUUIDs to interface{} slice for the query
	args := make([]interface{}, len(climbUUIDs))
	for i, uuid := range climbUUIDs {
		args[i] = uuid
	}

	// Execute query
	type GradeResult struct {
		ClimbUUID   string  `db:"climb_uuid"`
		Angle       int     `db:"angle"`
		Difficulty  float64 `db:"display_difficulty"`
		BoulderName string  `db:"boulder_name"`
		RouteName   string  `db:"route_name"`
	}

	var results []GradeResult
	if err := config.KilterDB.Raw(query, args...).Scan(&results).Error; err != nil {
		return fmt.Errorf("fetch climb grades: %w", err)
	}

	// Populate grades for each climb
	for _, result := range results {
		if indices, exists := climbIndexMap[result.ClimbUUID]; exists {
			angleStr := fmt.Sprintf("%d", result.Angle)
			gradeInfo := GradeInfo{
				Boulder: result.BoulderName,
				Route:   result.RouteName,
			}

			// Set grades for all climbs with this UUID (there might be duplicates for different product sizes)
			for _, idx := range indices {
				climbs[idx].Grades[angleStr] = gradeInfo
			}
		}
	}

	return nil
}
