from golang:latest
expose 9090
workdir /go/src/go-blog
copy . .
run go-wrapper download
run go-wrapper install
cmd ["go-wrapper", "run"]

