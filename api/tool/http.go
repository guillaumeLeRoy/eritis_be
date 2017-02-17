package tool

import (
	"net/http"
	"encoding/json"
	"golang.org/x/net/context"
	"bytes"
	"google.golang.org/appengine/log"
	"strings"
)

func Decode(r *http.Request, v interface{}) error {
	err := json.NewDecoder(r.Body).Decode(v)
	if err != nil {
		return err
	}
	if valid, ok := v.(interface {
		OK() error
	}); ok {
		err = valid.OK()
		if err != nil {
			return err
		}
	}
	return nil
}

func Respond(ctx context.Context, w http.ResponseWriter, r *http.Request, v interface{}, code int) {
	var buf bytes.Buffer
	err := json.NewEncoder(&buf).Encode(v)

	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	_, err = buf.WriteTo(w)

	log.Debugf(ctx, "respond ---> %s", v)

	if err != nil {
		log.Errorf(ctx, "respond: %s", err)
	}
}

func RespondErr(ctx context.Context, w http.ResponseWriter, r *http.Request, err error, code int) {

	log.Errorf(ctx, "respondErr: %s", err)

	errObj := struct {
		Error string `json:"error"`
	}{Error: err.Error() }
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	err = json.NewEncoder(w).Encode(errObj)
	if err != nil {
		log.Errorf(ctx, "respondErr: %s", err)
	}
}

func PathParams(ctx context.Context, r *http.Request, pattern string) map[string]string {

	log.Debugf(ctx, "PathParams %s", r.URL.Path)

	params := map[string]string{}
	//remove any extra '/' before or after the url
	trim := strings.Trim(r.URL.Path, "/")
	pathSegs := strings.Split(trim, "/")

	log.Debugf(ctx, "PathParams, segs %s", pathSegs)

	for i, seg := range strings.Split(strings.Trim(pattern, "/"), "/") {
		if i > len(pathSegs) - 1 {
			return params
		}
		params[seg] = pathSegs[i]
	}
	return params
}