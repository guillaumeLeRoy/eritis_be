package utils

import (
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"strings"
	"errors"
)

const LIVE_ENV_PROJECT_ID string = "eritis-150320"
const DEV_ENV_PROJECT_ID string = "eritis-be-dev"
const GLR_ENV_PROJECT_ID string = "eritis-be-glr"

func IsLiveEnvironment(ctx context.Context) bool {
	appId := appengine.AppID(ctx)
	log.Debugf(ctx, "isLiveEnvironment, appId : %s", appId)

	if strings.EqualFold(LIVE_ENV_PROJECT_ID, appId) {
		return true
	} else {
		return false
	}
}

//returns a firebase admin json
func GetFirebaseJsonPath(ctx context.Context) (string, error) {
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
