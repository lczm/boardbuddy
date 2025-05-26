package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/lczm/boardbuddy/api/models"
)

// GetClimbs handles GET /api/climbs?page=&page_size=&name=&board_id=
func GetClimbs(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()

	// page & size
	page := 1
	if p := q.Get("page"); p != "" {
		if v, err := strconv.Atoi(p); err == nil && v > 0 {
			page = v
		}
	}
	pageSize := 10
	if ps := q.Get("page_size"); ps != "" {
		if v, err := strconv.Atoi(ps); err == nil && v > 0 && v <= 100 {
			pageSize = v
		}
	}

	// filters
	nameFilter := q.Get("name")
	var boardID uint
	if b := q.Get("board_id"); b != "" {
		if v, err := strconv.ParseUint(b, 10, 32); err == nil {
			boardID = uint(v)
		}
	}

	resp, err := models.GetPaginatedClimbs(page, pageSize, nameFilter, boardID)
	if err != nil {
		http.Error(w, "Failed to retrieve climbs: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// GetBoardOptions handles GET /api/boards to retrieve all board options
func GetBoardOptions(w http.ResponseWriter, r *http.Request) {
	boards, err := models.GetBoardOptions()
	if err != nil {
		http.Error(w, "Failed to retrieve board options: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(struct {
		Boards []models.BoardOption `json:"boards"`
	}{Boards: boards})
}
