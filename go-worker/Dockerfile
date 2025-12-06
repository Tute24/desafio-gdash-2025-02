FROM golang:1.25.4

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o worker worker.go
#builds an ./worker executable from worker.go

CMD ["./worker"]