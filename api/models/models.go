package models

import (
	"fmt"
	"strings"

	"github.com/lczm/boardbuddy/api/config"
)

// Climb represents a climb along with its board images.
type Climb struct {
	UUID           string `json:"uuid"`
	SetterName     string `json:"setter_name"`
	ClimbName      string `json:"climb_name"`
	Description    string `json:"description"`
	Frames         string `json:"frames"`
	ProductSizeID  uint   `json:"product_size_id"`
	ImageFilenames string `json:"image_filenames"` // JSON array string of image filenames
}

// PaginatedClimbsResponse holds paginated climbs along with images.
type PaginatedClimbsResponse struct {
	Climbs     []Climb `json:"climbs"`
	TotalCount int64   `json:"total_count"`
	Page       int     `json:"page"`
	PageSize   int     `json:"page_size"`
	TotalPages int     `json:"total_pages"`
}

// BoardOption represents a board (product_size) option for filtering climbs.
type BoardOption struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func GetPaginatedClimbs(page, pageSize int, nameFilter string, boardID uint) (*PaginatedClimbsResponse, error) {
	nameFilter = strings.TrimSpace(nameFilter)
	likePattern := "%" + nameFilter + "%"

	// get total count for paginated response
	countQuery := `
SELECT COUNT(*)
  FROM (
    SELECT c.uuid, ps.id
      FROM climbs AS c
      JOIN layouts AS l
        ON c.layout_id = l.id
      JOIN product_sizes AS ps
        ON ps.product_id   = l.product_id
       AND ps.edge_left   <= c.edge_left
       AND ps.edge_right  >= c.edge_right
       AND ps.edge_bottom <= c.edge_bottom
       AND ps.edge_top    >= c.edge_top
      JOIN product_sizes_layouts_sets AS psl
        ON psl.product_size_id = ps.id
       AND psl.layout_id       = l.id
     WHERE c.is_listed = 1
       AND c.name LIKE ?
       ` + optionalBoardFilterSQL(boardID) + `
     GROUP BY c.uuid, ps.id
  ) sub;`

	var totalCount int64
	if err := config.KilterDB.Raw(countQuery, likePattern).Scan(&totalCount).Error; err != nil {
		return nil, fmt.Errorf("count climbs: %w", err)
	}

	// calculate pagination offsets
	offset := (page - 1) * pageSize

	// get the climbs, with uuid, name, description, frames, product_size_id, and image filenames
	dataQuery := `
SELECT
  c.uuid,
  c.setter_username   AS setter_name,
  c.name              AS climb_name,
  c.description,
  c.frames,
  ps.id                AS product_size_id,
  json_group_array(psl.image_filename) AS image_filenames
FROM climbs AS c
JOIN layouts AS l
  ON c.layout_id = l.id
JOIN product_sizes AS ps
  ON ps.product_id   = l.product_id
 AND ps.edge_left   <= c.edge_left
 AND ps.edge_right  >= c.edge_right
 AND ps.edge_bottom <= c.edge_bottom
 AND ps.edge_top    >= c.edge_top
JOIN product_sizes_layouts_sets AS psl
  ON psl.product_size_id = ps.id
 AND psl.layout_id       = l.id
WHERE c.is_listed = 1
  AND c.name LIKE ?
  ` + optionalBoardFilterSQL(boardID) + `
GROUP BY c.uuid, ps.id
LIMIT ? OFFSET ?;`

	var climbs []Climb
	if err := config.KilterDB.Raw(dataQuery, likePattern, pageSize, offset).Scan(&climbs).Error; err != nil {
		return nil, fmt.Errorf("fetch climbs: %w", err)
	}

	// compute total pages
	totalPages := int(totalCount) / pageSize
	if int(totalCount)%pageSize > 0 {
		totalPages++
	}

	return &PaginatedClimbsResponse{
		Climbs:     climbs,
		TotalCount: totalCount,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, nil
}

// get all listed boards
func GetBoardOptions() ([]BoardOption, error) {
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
