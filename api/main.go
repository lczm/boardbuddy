// @title BoardBuddy API
// @version 1.0
// @description API for managing climbing board routes and data. Features cursor-based pagination, grade information for multiple board angles, and comprehensive filtering capabilities.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8082
// @BasePath /api
// @schemes http

// @externalDocs.description BoardBuddy API Documentation
// @externalDocs.url https://github.com/lczm/boardbuddy/blob/main/api/API.md

package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/hashicorp/go-getter"
	"github.com/lczm/boardbuddy/api/config"
	_ "github.com/lczm/boardbuddy/api/docs"
	"github.com/lczm/boardbuddy/api/routes"
	"github.com/spf13/cobra"
)

func downloadImage(url, filePath string) error {
	client := &getter.Client{
		Src:  url,
		Dst:  filePath,
		Mode: getter.ClientModeFile,
	}
	return client.Get()
}

func downloadAllImages(imagesDir string) error {
	// get all filenames
	query := `SELECT DISTINCT image_filename FROM product_sizes_layouts_sets WHERE image_filename != ''`
	var imageFilenames []string
	if err := config.KilterDB.Raw(query).Scan(&imageFilenames).Error; err != nil {
		return fmt.Errorf("failed to query image filenames: %v", err)
	}
	for i, filename := range imageFilenames {
		imageURL := fmt.Sprintf("https://api.kilterboardapp.com/img/%s", filename)
		baseName := filepath.Base(filename)
		localPath := filepath.Join(imagesDir, baseName)
		if _, err := os.Stat(localPath); err == nil {
			fmt.Printf("Image %d/%d already exists: %s\n", i+1, len(imageFilenames), baseName)
			continue
		}
		fmt.Printf("Downloading image %d/%d: %s\n", i+1, len(imageFilenames), baseName)
		if err := downloadImage(imageURL, localPath); err != nil {
			fmt.Printf("Failed to download %s: %v\n", baseName, err)
		} else {
			fmt.Printf("Successfully downloaded: %s\n", baseName)
		}
	}

	fmt.Println("Download completed")
	return nil
}

func main() {
	var syncKilter bool

	rootCmd := &cobra.Command{
		Use: "boardbuddy",
		Run: func(cmd *cobra.Command, args []string) {
			if syncKilter {
				// Execute the database sync command
				syncKilterCommand := exec.Command("boardlib", "database", "kilter", "kilter.db")
				syncKilterCommand.Stdout = os.Stdout
				syncKilterCommand.Stderr = os.Stderr
				err := syncKilterCommand.Run()
				if err != nil {
					log.Fatalf("Failed to sync database: %v", err)
				}
				fmt.Println("Kilter Database sync completed")
				return
			}
			// init, get all db connections
			config.ConnectKilterDB()

			// ensure images folder exists
			imagesDir := "images"
			if _, err := os.Stat(imagesDir); os.IsNotExist(err) {
				err := os.MkdirAll(imagesDir, 0755)
				if err := downloadAllImages(imagesDir); err != nil {
					log.Fatalf("Error downloading images: %v", err)
				}
				if err != nil {
					log.Fatalf("Failed to create images directory: %v", err)
				}
			}

			// get the router and run
			r := routes.SetupRoutes()
			log.Fatal(http.ListenAndServe(":8082", r))
		},
	}

	// specify the flag needed
	rootCmd.Flags().BoolVar(&syncKilter, "sync-kilter", false, "Sync the Kilter database")

	if err := rootCmd.Execute(); err != nil {
		log.Fatalf("Error executing command: %v", err)
		os.Exit(1)
	}
}
