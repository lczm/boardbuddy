package models

import "github.com/lczm/boardbuddy/api/config"

type Climb struct {
	UUID           string `json:"uuid" gorm:"column:uuid;primaryKey"`
	LayoutID       uint   `json:"layout_id" gorm:"column:layout_id"`
	SetterID       uint   `json:"setter_id" gorm:"column:setter_id"`
	SetterUsername string `json:"setter_username" gorm:"column:setter_username"`
	Name           string `json:"name" gorm:"column:name"`
	Description    string `json:"description" gorm:"column:description"`
	Hsm            uint   `json:"hsm" gorm:"column:hsm"`
	EdgeLeft       int    `json:"edge_left" gorm:"column:edge_left"`
	EdgeRight      int    `json:"edge_right" gorm:"column:edge_right"`
	EdgeBottom     int    `json:"edge_bottom" gorm:"column:edge_bottom"`
	EdgeTop        int    `json:"edge_top" gorm:"column:edge_top"`
	Angle          *int   `json:"angle" gorm:"column:angle"`
	FramesCount    uint   `json:"frames_count" gorm:"column:frames_count;default:1"`
	FramesPace     uint   `json:"frames_pace" gorm:"column:frames_pace;default:0"`
	Frames         string `json:"frames" gorm:"column:frames"`
	IsDraft        bool   `json:"is_draft" gorm:"column:is_draft;default:0"`
	IsListed       bool   `json:"is_listed" gorm:"column:is_listed"`
	CreatedAt      string `json:"created_at" gorm:"column:created_at"`
}

func (Climb) TableName() string {
	return "climbs"
}

type ProductSizeLayoutSet struct {
	ID            uint   `json:"id" gorm:"column:id;primaryKey"`
	ProductSizeID uint   `json:"product_size_id" gorm:"column:product_size_id"`
	LayoutID      uint   `json:"layout_id" gorm:"column:layout_id"`
	SetID         uint   `json:"set_id" gorm:"column:set_id"`
	ImageFilename string `json:"image_filename" gorm:"column:image_filename"`
	IsListed      bool   `json:"is_listed" gorm:"column:is_listed"`
}

func (ProductSizeLayoutSet) TableName() string {
	return "product_sizes_layouts_sets"
}

// the paginated response for the general climbing data
type PaginatedClimbsResponse struct {
	Climbs     []Climb `json:"climbs"`
	TotalCount int64   `json:"total_count"`
	Page       int     `json:"page"`
	PageSize   int     `json:"page_size"`
	TotalPages int     `json:"total_pages"`
}

func GetPaginatedClimbs(page, pageSize int) (*PaginatedClimbsResponse, error) {
	var climbs []Climb
	var totalCount int64

	// get totalCount
	if err := config.KilterDB.Model(&Climb{}).Count(&totalCount).Error; err != nil {
		return nil, err
	}

	// get paginated data
	offset := (page - 1) * pageSize
	if err := config.KilterDB.Offset(offset).Limit(pageSize).Find(&climbs).Error; err != nil {
		return nil, err
	}

	// calculate how many total pages there are, so the frontend knows how many to page through
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

func GetAllProductSizeLayoutSets() ([]ProductSizeLayoutSet, error) {
	var layouts []ProductSizeLayoutSet
	result := config.KilterDB.Find(&layouts)
	return layouts, result.Error
}
