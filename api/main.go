package main

import (
	"log"
	"net/http"

	"github.com/lczm/boardbuddy/api/config"
	"github.com/lczm/boardbuddy/api/routes"
)

func main() {
	// init, get all db connections
	config.ConnectKilterDB()

	// get the router and run
	r := routes.SetupRoutes()
	log.Fatal(http.ListenAndServe(":8082", r))
}
