package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/lczm/boardbuddy/api/models"
)

func GetClimbs(w http.ResponseWriter, r *http.Request) {
	// try to get the query params if they exist
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("page_size")

	// default query params if they dont exist
	page := 1
	pageSize := 10

	// try to parse query params
	if pageStr != "" {
		parsedPage, err := strconv.Atoi(pageStr)
		if err == nil && parsedPage > 0 {
			page = parsedPage
		}
	}
	if pageSizeStr != "" {
		parsedPageSize, err := strconv.Atoi(pageSizeStr)
		if err == nil && parsedPageSize > 0 && parsedPageSize <= 100 {
			pageSize = parsedPageSize
		}
	}

	// get the data and respond
	paginatedResponse, err := models.GetPaginatedClimbs(page, pageSize)
	if err != nil {
		http.Error(w, "Failed to retrieve climbs: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(paginatedResponse)
}
