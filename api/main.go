package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"

	"github.com/lczm/boardbuddy/api/config"
	"github.com/lczm/boardbuddy/api/routes"
	"github.com/spf13/cobra"
)

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
