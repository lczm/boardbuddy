package config

import (
	"fmt"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var KilterDB *gorm.DB

func ConnectKilterDB() {
	// Use WAL mode for better concurrency and performance
	dsn := fmt.Sprintf(
		"file:%s?_journal_mode=WAL&"+
			"_synchronous=NORMAL&"+
			"_cache_size=20000&"+ // ~80 MiB cache
			"_mmap_size=157286400&"+ // cap at 150 MiB
			"_temp_store=MEMORY&"+
			"_foreign_keys=ON",
		"kilter.db",
	)

	var err error
	// TODO : add more in the future
	// only kilter for now
	KilterDB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	log.Println("Kilter Database connection established")
}
