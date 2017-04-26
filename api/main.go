package api

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"errors"
	"strings"
	"golang.org/x/net/context"
	"eritis_be/firebase"
	"path/filepath"
	"html/template"
	"cloud.google.com/go/storage"
	"fmt"
	"google.golang.org/appengine/user"
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


*/

const LIVE_ENV_PROJECT_ID string = "eritis-150320"
const DEV_ENV_PROJECT_ID string = "eritis-be-dev"
const GLR_ENV_PROJECT_ID string = "eritis-be-glr"

// keep a ref to init the app only once
var firebaseApp *firebase.App

func init() {

	http.HandleFunc("/api/login/", authHandler(HandleLogin))

	//meetings
	http.HandleFunc("/api/meeting/", authHandler(HandleMeeting))
	http.HandleFunc("/api/meetings/", authHandler(HandleMeeting))

	//coach
	http.HandleFunc("/api/coachs/", authHandler(HandleCoachs))

	//coachee
	http.HandleFunc("/api/coachees/", authHandler(HandleCoachees))

	//contact, no need to be authenticated to send a contact request
	http.HandleFunc("/api/v1/contact/", nonAuthHandler(handleContact))

	//get contract plan
	http.HandleFunc("/api/v1/plans/", nonAuthHandler(handleContractPlan))

	//cron
	http.HandleFunc("/api/v1/cron/", nonAuthHandler(handleCron))

	//test email
	http.HandleFunc("/api/email/", sendTestEmail)

	//update Service Account file to datastore
	http.Handle("/api/upload_service_account/", &templateHandler{filename: "upload.html"})
	http.HandleFunc("/api/upload_service_account/uploader", serviceAccountUploaderHandler)
	http.HandleFunc("/api/read_service_account/", serviceAccountGetHandler)

	http.HandleFunc("/api/welcome/", welcome)
}

func welcome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "text/html; charset=utf-8")
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "welcome")

	u := user.Current(ctx)
	if u == nil {
		url, _ := user.LoginURL(ctx, "/")
		fmt.Fprintf(w, `<a href="%s">Sign in or register</a>`, url)
		log.Debugf(ctx, "welcome, redirect to login")
		return
	}
	url, _ := user.LogoutURL(ctx, "/")
	fmt.Fprintf(w, `Welcome, %s! (<a href="%s">sign out</a>)`, u, url)
	log.Debugf(ctx, "welcome, redirect to logout")

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
func getFirebaseJsonPath(ctx context.Context) (string, error) {
	appId := appengine.AppID(ctx)
	log.Debugf(ctx, "appId %s", appId)

	pathToJson := ""

	if strings.EqualFold(LIVE_ENV_PROJECT_ID, appId) {
		pathToJson = "eritis-be-live-firebase.json"
	} else if strings.EqualFold(DEV_ENV_PROJECT_ID, appId) {
		pathToJson = "eritis-be-dev-firebase.json"
	} else if strings.EqualFold(GLR_ENV_PROJECT_ID, appId) {
		pathToJson = "eritis-be-glr-firebase.json"
	} else {
		return "", errors.New("AppId doesn't match any environment")
	}

	log.Debugf(ctx, "getFirebaseJsonPath path %s", pathToJson)

	return pathToJson, nil
}


//returns a firebase admin json
func getFirebaseJsonReader(ctx context.Context) (*storage.Reader, error) {
	appId := appengine.AppID(ctx)
	log.Debugf(ctx, "appId %s", appId)

	pathToJson, err := getFirebaseJsonPath(ctx)
	if err != nil {
		return nil, err
	}
	rdr, err := getReaderFromBucket(ctx, pathToJson)
	if err != nil {
		return nil, err
	}
	return rdr, nil
}

func isLiveEnvironment(ctx context.Context) bool {
	appId := appengine.AppID(ctx)
	log.Debugf(ctx, "isLiveEnvironment, appId : %s", appId)

	if strings.EqualFold(LIVE_ENV_PROJECT_ID, appId) {
		return true
	} else {
		return false
	}
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

			if !appengine.IsDevAppServer() {

				token := r.Header.Get("Authorization")
				log.Debugf(ctx, "authHandler auth token: %s", token)

				// If the token is empty...
				if token == "" {
					// If we get here, the required token is missing
					RespondErr(ctx, w, r, errors.New("invalid token"), http.StatusUnauthorized)
					return
				}

				//read the Bearer param
				if len(token) >= 1 {
					token = strings.TrimPrefix(token, "Bearer ")
				}

				log.Debugf(ctx, "authHandler token: %s", token)

				// If the token is empty...
				if token == "" {
					// If we get here, the required token is missing
					RespondErr(ctx, w, r, errors.New("invalid token"), http.StatusUnauthorized)
					return
				}

				log.Debugf(ctx, "authHandler VERIFY token")

				//init Firebase with the correct .json

				reader, err := getFirebaseJsonReader(ctx)
				if err != nil {
					log.Debugf(ctx, "authHandler, get json path failed %s", err)
					RespondErr(ctx, w, r, err, http.StatusUnauthorized)
					return
				}

				if firebaseApp == nil {
					firebaseApp, err = firebase.InitializeApp(&firebase.Options{
						ServiceAccountReader: reader,
					})
					if err != nil {
						log.Debugf(ctx, "authHandler InitializeApp failed %s", err)
						RespondErr(ctx, w, r, err, http.StatusUnauthorized)
						return
					}
				} else {
					log.Debugf(ctx, "authHandler, firebaseApp already init")
				}

				//verify token only in PROD
				auth, _ := firebase.GetAuth()
				decodedToken, err := auth.VerifyIDToken(token, ctx)
				if err != nil {
					log.Debugf(ctx, "authHandler VerifyIDToken failed %s", err)
					RespondErr(ctx, w, r, err, http.StatusUnauthorized)
					return
				}

				if err == nil {
					uid, found := decodedToken.UID()
					log.Debugf(ctx, "authHandler decodedToken uid %s, found %s", uid, found)
				}

				uid, found := decodedToken.UID()
				if !found {
					RespondErr(ctx, w, r, errors.New("UID not found"), http.StatusUnauthorized)
				}

				log.Debugf(ctx, "authHandler, UID: %s", uid)
			}



			//auth ok, continue
			handler(w, r)
		}
	}
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




