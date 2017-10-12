package jsonstructs

import (
	"encoding/json"
	"io/ioutil"
	"path/filepath"
	"strings"
)

//Post stores single post preview
type Post struct {
	Name string `json:"name"`
	Text string `json:"text"`
	Date string `json:"date"`
	URL  string `json:"url"`
}

//HomeJSON stores homepage posts previews
type HomeJSON struct {
	Posts []Post `json:"posts"`
}

func loadFile(filename string) ([]byte, error) {
	body, err := ioutil.ReadFile(filename)
	if err != nil {
		return []byte{}, err
	}
	return body, nil
}

func parseJSON(body []byte, structJSON interface{}) error {
	err := json.Unmarshal(body, structJSON)
	return err
}

//Marshal generates structure of posts list
func (l *HomeJSON) Marshal(page int) ([]byte, error) {
	var posts []Post
	postFiles, _ := ioutil.ReadDir(filepath.Join("storage", "posts"))
	pagesAmount := func(count int) int {
		tmp := count / 10
		if count%10 > 0 {
			tmp++
		}
		return tmp
	}(len(postFiles))
	if page >= pagesAmount {
		page = pagesAmount
		tmp := make([]Post, len(postFiles)%10)
		posts = tmp
		postFiles = postFiles[len(postFiles)-len(posts):]
	} else {
		tmp := make([]Post, 10)
		posts = tmp
		postFiles = postFiles[page*10 : page*10+10]
	}
	for key, val := range postFiles {
		posts[key].Name = func(s string) string {
			s = strings.TrimRight(s, ".txt")
			s = strings.Replace(s, "_", " ", -1)
			return s
		}(val.Name())
		posts[key].Date = val.ModTime().Format("Jan 2 2006")
		tmp, err := loadFile(filepath.Join("storage", "posts", val.Name()))
		if err != nil {
			panic(err)
		}
		posts[key].Text = string(tmp)[:400] + "..."
		posts[key].URL = filepath.Join("post", val.Name())
	}
	l.Posts = posts
	return json.Marshal(l)
}

func (l *Post) Marshal(name string) ([]byte, error) {
	body, err := loadFile(filepath.Join("storage", "posts", name))
	if err != nil {
		return []byte{}, err
	}
	l.Text = string(body)
	l.Name = func(s string) string {
		s = strings.TrimRight(s, ".txt")
		s = strings.Replace(s, "_", " ", -1)
		return s
	}(name)
	l.Date = func(dir, name string) string {
		files, _ := ioutil.ReadDir(dir)
		for _, val := range files {
			if val.Name() == name {
				return val.ModTime().Format("Jan 2 2006")
			}
		}
		return "Jan 1 2017"
	}(filepath.Dir("storage"), name)
	return json.Marshal(l)
}
