# build go bianry
FROM golang:alpine AS builder

RUN apk add --no-cache \
    gcc \
    musl-dev \
    sqlite-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o api .

# copy over the binary and run
FROM alpine

# install ca-certificates if your API makes HTTPS calls
RUN apk add --no-cache ca-certificates

# copy the built binary
COPY --from=builder /app/api .

# copy the kilter db, ideally should just download
# the db within the container on startup to be clean
# but this is a good enough workaround for now
# whoever is building just has to ensure the db exists first
COPY kilter.db .

# exposed port
EXPOSE 8082

# default run to always sync kilter
ENTRYPOINT ["./api"]
