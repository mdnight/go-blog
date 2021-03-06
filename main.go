package main

import (
	"github.com/mdnight/go-blog/jsonstructs"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
)

var (
	base, _     = ioutil.ReadFile(filepath.Join("view", "base.html"))
	posthtml, _ = ioutil.ReadFile(filepath.Join("view", "post.html"))
)

func init() {
}

func errorHandler(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	if status == http.StatusNotFound {
		http.Error(w, http.StatusText(status), status)
	}
}

func index(w http.ResponseWriter, r *http.Request) {
	dir, _ := filepath.Split(r.URL.Path)
	if dir != "/" && dir != "/blog/" {
		errorHandler(w, r, http.StatusNotFound)
		return
	}
	w.Write(base)
}

func about(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/about/" {
		errorHandler(w, r, http.StatusNotFound)
		return
	}
	w.Write(base)
}

func archive(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/archive/" {
		errorHandler(w, r, http.StatusNotFound)
		return
	}
}

func post(w http.ResponseWriter, r *http.Request) {
	dir, file := filepath.Split(r.URL.Path)
	if dir != "/post/" && file == "" {
		errorHandler(w, r, http.StatusNotFound)
		return
	}
	w.Write(posthtml)
}

func json(w http.ResponseWriter, r *http.Request) {
	dir, file := filepath.Split(r.URL.Path)
	if dir == "/json/" || file == "" {
		errorHandler(w, r, http.StatusNotFound)
		return
	}
	switch dir {
	case "/json/postspreview/":
		l := jsonstructs.HomeJSON{}
		page, err := strconv.Atoi(file)
		if err != nil || page == 0 {
			page = 1
		}
		json, err := l.Marshal(page)
		if err != nil {
			log.Println(err.Error())
		}
		w.Write(json)
	case "/json/post/":
		l := jsonstructs.Post{}
		file = strings.Replace(file, ".json", ".txt", 1)
		json, err := l.Marshal(file)

		if err == nil {
			w.Write(json)
			return
		}
		log.Println(err.Error())
	case "/json/about/":
		if file != "about.json" {
			errorHandler(w, r, http.StatusNotFound)
			return
		}
		body, err := ioutil.ReadFile(filepath.Join("configs", file))
		if err != nil {
			log.Println(err.Error())
			return
		}
		w.Write(body)

	case "/json/common/":
		if file != "common.json" {
			errorHandler(w, r, http.StatusNotFound)
			return
		}
		body, err := ioutil.ReadFile(filepath.Join("configs", file))
		if err != nil {
			log.Println(err.Error())
			return
		}
		w.Write(body)

	default:
		errorHandler(w, r, http.StatusNotFound)
	}
	return

}

func img(w http.ResponseWriter, r *http.Request) {
	dir, file := filepath.Split(r.URL.Path)
	if dir == "/img/" && file != "" {
		if body, err := ioutil.ReadFile(filepath.Join("storage", "imgs", file)); err == nil {
			w.Write(body)
			return
		}
	}
	errorHandler(w, r, http.StatusNotFound)
	return
}

func main() {

	fs := http.FileServer(http.Dir("assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))
	http.HandleFunc("/blog/", index)
	http.HandleFunc("/", index)
	http.HandleFunc("/about/", about)
	http.HandleFunc("/archive/", archive)
	http.HandleFunc("/post/", post)
	http.HandleFunc("/json/", json)
	http.HandleFunc("/img/", img)

	if err := http.ListenAndServe(":9090", nil); err != nil {
		panic(err)
	}

}
