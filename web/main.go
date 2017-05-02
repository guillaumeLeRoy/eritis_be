package web

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/user"
	"google.golang.org/appengine/log"
	"fmt"
)

func init() {
	//tmpl, err := template.ParseGlob("templates/*.tmpl.html")
	//if err != nil {
	//	http.Handle("/", errHandler(err.Error(), http.StatusInternalServerError))
	//	return
	//}
	//http.Handle("/questions/", templateHandler(tmpl, "question"))
	//http.Handle("/", templateHandler(tmpl, "index"))

	//http.Handle("/", adminHandler(http.FileServer(http.Dir("dist"))));
	http.Handle("/admin/", adminHandler());
}

// remember that http.HandlerFunc is a valid http.Handler too
func adminHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		log.Debugf(ctx, "adminHandler, url %s", r.URL.Path)

		u := user.Current(ctx)

		if u != nil {
			log.Debugf(ctx, "adminHandler, is admin ? %s, email %s", u.Admin, u.Email)
		} else {
			log.Debugf(ctx, "adminHandler, no user")
			//url, _ := user.LoginURL(ctx, "dist/index.html")
			url, _ := user.LoginURL(ctx, "admin/coach-selector")
			fmt.Fprintf(w, `<a href="%s">Sign in or register</a>`, url)
			return
		}

		http.ServeFile(w, r, "dist/index.html")
		//handler.ServeHTTP(w, r)
	})

}

//func templateHandler(tmpl *template.Template, name string) http.Handler {
//	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
//		ctx := appengine.NewContext(r)
//		if ok := ensureUser(ctx, w, r); !ok {
//			return
//		}
//		err := tmpl.ExecuteTemplate(w, name, nil)
//		if err != nil {
//			http.Error(w, err.Error(), http.StatusInternalServerError)
//		}
//	})
//}
//
//// errHandler gets an http.Handler that reports the specified
//// error.
//func errHandler(err string, code int) http.Handler {
//	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
//		http.Error(w, err, code)
//	})
//}
//
//// ensureUser makes sure a user is logged in, or redirects the the
//// login page.
//// Returns true if a user is logged in.
//func ensureUser(ctx context.Context, w http.ResponseWriter, r *http.Request) bool {
//	me := user.Current(ctx)
//	if me == nil {
//		loginURL, err := user.LoginURL(ctx, r.URL.Path)
//		if err != nil {
//			http.Error(w, err.Error(), http.StatusInternalServerError)
//			return false
//		}
//		http.Redirect(w, r, loginURL, http.StatusTemporaryRedirect)
//		return false
//	}
//	return true
//}
