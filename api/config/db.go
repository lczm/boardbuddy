package config

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var KilterDB *gorm.DB

func ConnectKilterDB() {
	var err error
	// TODO : add more in the future
	// only kilter for now
	KilterDB, err = gorm.Open(sqlite.Open("kilter.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	log.Println("Kilter Database connection established")
}
