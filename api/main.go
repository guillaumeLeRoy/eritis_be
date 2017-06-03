package api

import (
	"net/http"
	"eritis_be/pkg/handler"
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"strings"
	"errors"
	"cloud.google.com/go/storage"
	"eritis_be/pkg/response"
	"path/filepath"
	"eritis_be/firebase"
	"google.golang.org/appengine/user"
	"html/template"
	"eritis_be/pkg/utils"
)

/* ######## HOW TO SERVE DIFFERENT ENVIRONMENTS #######

##### LIVE ENV ######
serve locally :
dev_appserver.py -A eritis-150320 dispatch.yaml default/app.yaml api/app.yaml web/app.yaml firebase/app.yaml --enable_sendmail --default_gcs_bucket_name eritis-be-glr.appspot.com

deploy :
goapp deploy -application eritis-150320 -version 1 default/app.yaml api/app.yaml web/app.yaml firebase/app.yaml
appcfg.py -A eritis-150320 update_dispatch .
appcfg.py update_indexes -A eritis-150320 ./default

##### DEV ENV ######
serve locally :
dev_appserver.py -A eritis-be-dev dispatch.yaml default/app.yaml api/app.yaml web/app.yaml firebase/app.yaml --enable_sendmail

deploy :
goapp deploy -application eritis-be-dev -version 1 default/app.yaml api/app.yaml web/app.yaml firebase/app.yaml
appcfg.py -A eritis-be-dev update_dispatch .
appcfg.py update_indexes -A eritis-be-dev ./default



##### GLR ENV ######
serve :
dev_appserver.py -A eritis-be-glr dispatch.yaml default/app.yaml api/app.yaml web/app.yaml firebase/app.yaml --enable_sendmail

deploy :
goapp deploy -application eritis-be-glr -version 1 default/app.yaml api/app.yaml web/app.yaml firebase/app.yaml
appcfg.py -A eritis-be-glr update_dispatch .
appcfg.py update_indexes -A eritis-be-glr ./default


CRON :
gcloud app deploy cron.yaml

rollback :
appcfg.py rollback /Users/guillaume/go_path_appengine/src/eritis_be/firebase/ -A eritis-be-dev -V 1

*/

// keep a ref to init the app only once
var firebaseApp *firebase.App

func init() {

	http.HandleFunc("/api/login/", authHandler(handler.HandleLogin))

	//admin
	//http.HandleFunc("/api/v1/admins/", adminHandler(nonAuthHandler(handler.HandleAdmin)))
	http.HandleFunc("/api/v1/admins/", nonAuthHandler(handler.HandleAdmin))

	//meetings
	http.HandleFunc("/api/meeting/", authHandler(handler.HandleMeeting))
	http.HandleFunc("/api/v1/meeting/", authHandler(handler.HandleMeeting))
	http.HandleFunc("/api/meetings/", authHandler(handler.HandleMeeting))
	http.HandleFunc("/api/v1/meetings/", authHandler(handler.HandleMeeting))

	//coach
	http.HandleFunc("/api/coachs/", authHandler(handler.HandleCoachs))
	http.HandleFunc("/api/v1/coachs/", authHandler(handler.HandleCoachs))

	//coachee
	http.HandleFunc("/api/coachees/", authHandler(handler.HandleCoachees))
	http.HandleFunc("/api/v1/coachees/", authHandler(handler.HandleCoachees))

	//rh
	http.HandleFunc("/api/v1/rhs/", authHandler(handler.HandlerRH))

	//contact, no need to be authenticated to send a contact request
	http.HandleFunc("/api/v1/contact/", nonAuthHandler(handler.HandleContact))

	//get contract plan
	http.HandleFunc("/api/v1/plans/", nonAuthHandler(handler.HandleContractPlan))

	//cron
	http.HandleFunc("/api/v1/cron/", nonAuthHandler(handler.HandleCron))

	//potentials
	http.HandleFunc("/api/v1/potentials/", nonAuthHandler(handler.HandlePotential))


	//test email
	http.HandleFunc("/api/email/", handler.HandlerTestEmail)

	//update Service Account file to datastore
	http.Handle("/api/upload_service_account/", &templateHandler{filename: "upload.html"})
	http.HandleFunc("/api/upload_service_account/uploader", handler.ServiceAccountUploaderHandler)
	http.HandleFunc("/api/read_service_account/", handler.ServiceAccountGetHandler)

}

func nonAuthHandler(handler func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)

		log.Debugf(ctx, "nonAuthHandler start")

		//handle preflight in here
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

		if (r.Method == "OPTIONS") {
			log.Debugf(ctx, "authHandler, handle OPTIONS")
			w.WriteHeader(http.StatusOK)
		} else {
			handler(w, r)
		}
	}
}


//returns a firebase admin json
func getFirebaseJsonReader(ctx context.Context) (*storage.Reader, error) {
	appId := appengine.AppID(ctx)
	log.Debugf(ctx, "appId %s", appId)

	pathToJson, err := utils.GetFirebaseJsonPath(ctx)
	if err != nil {
		return nil, err
	}
	rdr, err := handler.GetReaderFromBucket(ctx, pathToJson)
	if err != nil {
		return nil, err
	}
	return rdr, nil
}

func authHandler(handler func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)

		log.Debugf(ctx, "authHandler start")

		//handle preflight in here
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

		//check token validity

		if (r.Method == "OPTIONS") {
			log.Debugf(ctx, "authHandler, handle OPTIONS")

			w.WriteHeader(http.StatusOK)
		} else {
			log.Debugf(ctx, "authHandler, handle all requests")

			log.Debugf(ctx, "IsDevAppServer: %v", appengine.IsDevAppServer())

			u := user.Current(ctx)
			log.Debugf(ctx, "authHandler, user %s", u)
			if u != nil {
				log.Debugf(ctx, "authHandler, is admin ? %s, email %s", u.Admin, u.Email)
				if u.Admin {
					//no auth needed
					handler(w, r)
					return
				} else {
					response.RespondErr(ctx, w, r, errors.New("Need to be an admin"), http.StatusUnauthorized)
					return
				}
			}

			//only very Firebase Token if we are on a server and NOT an admin
			if !appengine.IsDevAppServer() {
				err := verifyFirebaseAuth(ctx, w, r)
				if err != nil {
					response.RespondErr(ctx, w, r, err, http.StatusUnauthorized)
					return
				}
			}

			//auth ok, continue
			handler(w, r)
		}
	}
}
func verifyFirebaseAuth(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	token := r.Header.Get("Authorization")
	log.Debugf(ctx, "authHandler auth token: %s", token)

	// If the token is empty...
	if token == "" {
		// If we get here, the required token is missing
		return errors.New("invalid token")
	}

	//read the Bearer param
	if len(token) >= 1 {
		token = strings.TrimPrefix(token, "Bearer ")
	}

	log.Debugf(ctx, "authHandler token: %s", token)

	// If the token is empty...
	if token == "" {
		// If we get here, the required token is missing
		return errors.New("invalid token")
	}

	log.Debugf(ctx, "authHandler VERIFY token")

	//init Firebase with the correct .json

	reader, err := getFirebaseJsonReader(ctx)
	if err != nil {
		log.Debugf(ctx, "authHandler, get json path failed %s", err)
		return err
	}

	if firebaseApp == nil {
		firebaseApp, err = firebase.InitializeApp(&firebase.Options{
			ServiceAccountReader: reader,
		})
		if err != nil {
			log.Debugf(ctx, "authHandler InitializeApp failed %s", err)
			return err

		}
	} else {
		log.Debugf(ctx, "authHandler, firebaseApp already init")
	}

	//verify token only in PROD
	auth, _ := firebase.GetAuth()
	decodedToken, err := auth.VerifyIDToken(token, ctx)
	if err != nil {
		log.Debugf(ctx, "authHandler VerifyIDToken failed %s", err)
		return err
	}

	if err == nil {
		uid, found := decodedToken.UID()
		log.Debugf(ctx, "authHandler decodedToken uid %s, found %s", uid, found)
	}

	uid, found := decodedToken.UID()
	if !found {
		return errors.New("UID not found")
	}

	log.Debugf(ctx, "authHandler, UID: %s", uid)

	return nil
}

// templ represents a single template
type templateHandler struct {
	filename string
	templ    *template.Template
}

// ServeHTTP handles the HTTP request.
func (t *templateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if t.templ == nil {
		t.templ = template.Must(template.ParseFiles(filepath.Join("templates", t.filename)))
	}

	data := map[string]interface{}{
		"Host": r.Host,
	}

	t.templ.Execute(w, data)
}

func adminHandler(handler func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		log.Debugf(ctx, "adminHandler, url %s", r.URL.Path)

		u := user.Current(ctx)

		if u != nil {
			log.Debugf(ctx, "adminHandler, is admin ? %s, email %s", u.Admin, u.Email)

			if !u.Admin {
				log.Debugf(ctx, "adminHandler, restricted access")
				response.RespondErr(ctx, w, r, errors.New("restricted access"), http.StatusUnauthorized)
				return
			}

			//auth ok, continue
			handler(w, r)

		} else {
			log.Debugf(ctx, "adminHandler, no user")
			//url, _ := user.LoginURL(ctx, "dist/index.html")
			url, _ := user.LoginURL(ctx, "admin")
			//fmt.Fprintf(w, `<a href="%s">Sign in or register</a>`, url)

			//fmt.Fprint("sign in %s",url)
			response.RespondErr(ctx, w, r, errors.New(url), http.StatusOK)

			return
		}
	}

}

//// remember that http.HandlerFunc is a valid http.Handler too
//func adminRemoteHandler() http.Handler {
//	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
//		ctx := appengine.NewContext(r)
//		log.Debugf(ctx, "adminHandler, url %s", r.URL.Path)
//
//		u := user.Current(ctx)
//
//		if u != nil {
//			log.Debugf(ctx, "adminHandler, is admin ? %s, email %s", u.Admin, u.Email)
//
//			if !u.Admin {
//				log.Debugf(ctx, "adminHandler, restricted access")
//				fmt.Fprintf(w, `<h1>This is a restricted area</h1>`)
//				return
//			}
//		} else {
//			log.Debugf(ctx, "adminHandler, no user")
//			//url, _ := user.LoginURL(ctx, "dist/index.html")
//			url, _ := user.LoginURL(ctx, "admin")
//			fmt.Fprintf(w, `<a href="%s">Sign in or register</a>`, url)
//			return
//		}
//
//		//log.Debugf(ctx, "adminHandler, serve index.html")
//		//
//		//http.ServeFile(w, r, "dist/index.html")
//		//
//		//log.Debugf(ctx, "adminHandler, DONE")
//
//	})
//
//}




