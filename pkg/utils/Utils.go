package utils

import (
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"strings"
	"errors"
	"google.golang.org/appengine/mail"
	"crypto/aes"
	"encoding/base64"
	"io"
	"crypto/cipher"
	"crypto/rand"
	"fmt"
)

const LIVE_ENV_PROJECT_ID string = "eritis-150320"
const DEV_ENV_PROJECT_ID string = "eritis-be-dev"
const GLR_ENV_PROJECT_ID string = "eritis-be-glr"

const CONTACT_ERITIS = "diana@eritis.co.uk";

const INVITE_KEY = "a very very very very secret key"

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

func SendEmailToGivenEmail(ctx context.Context, emailAddress string, subject string, message string) error {
	addrs := []string{emailAddress}

	msg := &mail.Message{
		Sender:  CONTACT_ERITIS,
		To:      addrs,
		Subject: subject,
		Body:    message,
	}

	if err := mail.Send(ctx, msg); err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}

	return nil
}


//create a link to invite a Coachee. it generates a token to hide coachee's email in the link
func CreateInviteLink(ctx context.Context, emailAddress string) (string, error) {
	key := []byte(INVITE_KEY) // 32 bytes
	plaintext := []byte(emailAddress)

	var baseToken string
	for {
		//generate token
		ciphertext, err := encrypt(key, plaintext)
		if err != nil {
			return "", err
		}
		baseToken = base64.StdEncoding.EncodeToString(ciphertext)
		log.Debugf(ctx, "createInviteLink, baseToken %s", baseToken)
		if !strings.Contains(baseToken,"/"){
			break;
		}
	}

	log.Debugf(ctx, "createInviteLink, final baseToken %s", baseToken)

	appId := appengine.AppID(ctx)
	log.Debugf(ctx, "createInviteLink, appId %s", appId)

	var baseUrl string
	if appengine.IsDevAppServer() {
		baseUrl = "http://localhost:4200"
	} else if strings.EqualFold(LIVE_ENV_PROJECT_ID, appId) {
		baseUrl = "https://eritis.com"
	} else if strings.EqualFold(DEV_ENV_PROJECT_ID, appId) {
		baseUrl = "https://eritis-be-dev.appspot.com"
	} else if strings.EqualFold(GLR_ENV_PROJECT_ID, appId) {
		baseUrl = "https://eritis-be-glr.appspot.com"
	} else {
		return "", errors.New("createInviteLink, AppId doesn't match any environment")
	}

	var finalLink = fmt.Sprintf("%s/signup_coachee?token=%s", baseUrl, baseToken)
	return finalLink, nil
}

func GetEmailFromInviteToken(ctx context.Context, token string) (string, error) {
	key := []byte(INVITE_KEY) // 32 bytes

	decodedToken, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		return "", err
	}

	log.Debugf(ctx, "GetEmailFromInviteToken, decodedToken %s", decodedToken)

	plaintext, err := decrypt(key, decodedToken)
	if err != nil {
		return "", err
	}
	log.Debugf(ctx, "GetEmailFromInviteToken, plaintext %s", plaintext)

	return string(plaintext), nil
}

//func main() {
//	fmt.Printf("%s\n", plaintext)
//	ciphertext, err := encrypt(key, plaintext)
//	if err != nil {
//		log.Fatal(err)
//	}
//	fmt.Printf("%0x\n", ciphertext)
//	result, err := decrypt(key, ciphertext)
//	if err != nil {
//		log.Fatal(err)
//	}
//	fmt.Printf("%s\n", result)
//}

func encrypt(key, text []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	b := base64.StdEncoding.EncodeToString(text)
	ciphertext := make([]byte, aes.BlockSize + len(b))
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return nil, err
	}
	cfb := cipher.NewCFBEncrypter(block, iv)
	cfb.XORKeyStream(ciphertext[aes.BlockSize:], []byte(b))
	return ciphertext, nil
}

func decrypt(key, text []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	if len(text) < aes.BlockSize {
		return nil, errors.New("ciphertext too short")
	}
	iv := text[:aes.BlockSize]
	text = text[aes.BlockSize:]
	cfb := cipher.NewCFBDecrypter(block, iv)
	cfb.XORKeyStream(text, text)
	data, err := base64.StdEncoding.DecodeString(string(text))
	if err != nil {
		return nil, err
	}
	return data, nil
}