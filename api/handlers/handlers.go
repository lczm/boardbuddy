package handlers

import (
	"encoding/json"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/lczm/boardbuddy/api/models"
)

// GetClimbs handles GET /api/climbs?cursor=&page_size=&name=&board_id=
func GetClimbs(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	// cursor & size
	cursor := q.Get("cursor") // empty string for first page
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
	resp, err := models.GetPaginatedClimbs(cursor, pageSize, nameFilter, boardID)
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

// ServeImage handles GET /api/images/{filename}
func ServeImage(w http.ResponseWriter, r *http.Request) {
	filename := chi.URLParam(r, "filename")
	if filename == "" {
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	// Sanitize filename to prevent directory traversal
	filename = filepath.Base(filename)
	if strings.Contains(filename, "..") || strings.Contains(filename, "/") {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}

	// Construct the file path
	imagePath := filepath.Join("images", filename)

	// Serve the file
	http.ServeFile(w, r, imagePath)
}
