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
	"google.golang.org/appengine/file"
	"cloud.google.com/go/storage"
	"io/ioutil"
	"net/http"
	"google.golang.org/api/iterator"
	"time"
	"strconv"
)

const LIVE_ENV_PROJECT_ID string = "eritis-150320"
const DEV_ENV_PROJECT_ID string = "eritis-be-dev"
const GLR_ENV_PROJECT_ID string = "eritis-be-glr"

const CONTACT_ERITIS = "diana@eritis.co.uk"

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
	log.Debugf(ctx, "SendEmailToGivenEmail %s", emailAddress)

	addrs := []string{emailAddress}

	msg := &mail.Message{
		Sender:   CONTACT_ERITIS,
		To:       addrs,
		Subject:  subject,
		HTMLBody: message,
	}

	if err := mail.Send(ctx, msg); err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}

	log.Debugf(ctx, "SendEmailToGivenEmail DONE")

	return nil
}

type InviteType int

const (
	INVITE_COACH   InviteType = 1 + iota
	INVITE_COACHEE
	INVITE_RH
)

func GetSiteUrl(ctx context.Context) (string, error) {

	appId := appengine.AppID(ctx)
	log.Debugf(ctx, "GetSiteUrl, appId %s", appId)

	var baseUrl string
	if appengine.IsDevAppServer() {
		baseUrl = "http://localhost:4200"
	} else if strings.EqualFold(LIVE_ENV_PROJECT_ID, appId) {
		baseUrl = "https://eritis.fr"
	} else if strings.EqualFold(DEV_ENV_PROJECT_ID, appId) {
		baseUrl = "https://eritis-be-dev.appspot.com"
	} else if strings.EqualFold(GLR_ENV_PROJECT_ID, appId) {
		baseUrl = "https://eritis-be-glr.appspot.com"
	} else {
		return "", errors.New("GetSiteUrl, AppId doesn't match any environment")
	}

	return baseUrl, nil
}

func GetStorageUrl(ctx context.Context) (string, error) {

	appId := appengine.AppID(ctx)
	log.Debugf(ctx, "GetStorageUrl, appId %s", appId)

	var baseUrl string
	if appengine.IsDevAppServer() {
		baseUrl = "https://storage.googleapis.com/eritis-be-glr.appspot.com"
	} else if strings.EqualFold(LIVE_ENV_PROJECT_ID, appId) {
		baseUrl = "https://storage.googleapis.com/eritis-150320.appspot.com"
	} else if strings.EqualFold(DEV_ENV_PROJECT_ID, appId) {
		baseUrl = "https://storage.googleapis.com/eritis-be-dev.appspot.com"
	} else if strings.EqualFold(GLR_ENV_PROJECT_ID, appId) {
		baseUrl = "https://storage.googleapis.com/eritis-be-glr.appspot.com"
	} else {
		return "", errors.New("GetStorageUrl, AppId doesn't match any environment")
	}

	return baseUrl, nil
}

//create a link to invite a Coachee. it generates a token to hide coachee's email in the link
func CreateInviteLink(ctx context.Context, emailAddress string, invType InviteType) (string, error) {
	key := []byte(INVITE_KEY) // 32 bytes
	plaintext := []byte(emailAddress)

	//generate token
	ciphertext, err := encrypt(key, plaintext)
	if err != nil {
		return "", err
	}
	baseToken := base64.URLEncoding.EncodeToString(ciphertext)
	log.Debugf(ctx, "createInviteLink, baseToken %s", baseToken)

	baseUrl, err := GetSiteUrl(ctx)
	if err != nil {
		return "", err
	}

	var redirect string
	switch invType {
	case INVITE_COACH:
		redirect = "signup_coach"
	case INVITE_COACHEE:
		redirect = "signup_coachee"
	case INVITE_RH:
		redirect = "signup_rh"
	}

	var finalLink = fmt.Sprintf("%s/%s?token=%s", baseUrl, redirect, baseToken)
	return finalLink, nil
}

func GetEmailFromInviteToken(ctx context.Context, token string) (string, error) {
	key := []byte(INVITE_KEY) // 32 bytes

	decodedToken, err := base64.URLEncoding.DecodeString(token)
	if err != nil {
		return "", err
	}

	plaintext, err := decrypt(key, decodedToken)
	if err != nil {
		return "", err
	}
	log.Debugf(ctx, "GetEmailFromInviteToken, plaintext %s", plaintext)

	return string(plaintext), nil
}

func GetEmailHash(ctx context.Context, email string) (string, error) {
	log.Debugf(ctx, "GetEmailHash, email %s", email)

	plaintext := []byte(email)
	ciphertext := base64.URLEncoding.EncodeToString(plaintext)
	log.Debugf(ctx, "GetEmailHash, hash %s", ciphertext)

	return ciphertext, nil
}

func encrypt(key, text []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	b := base64.URLEncoding.EncodeToString(text)

	ciphertext := make([]byte, aes.BlockSize+len(b))
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
	data, err := base64.URLEncoding.DecodeString(string(text))
	if err != nil {
		return nil, err
	}
	return data, nil
}

func GetReaderFromBucket(ctx context.Context, fileName string) (*storage.Reader, error) {
	bucketName, err := file.DefaultBucketName(ctx)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "handle read, bucket name %s", bucketName)

	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "handle read, storage client created")

	bucketHandler := client.Bucket(bucketName)

	obj := bucketHandler.Object(fileName)

	log.Debugf(ctx, "handle read, obj created")

	reader, err := obj.NewReader(ctx)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "handle read, reader created")

	//defer reader.Close()
	//if _, err := io.Copy(os.Stdout, reader); err != nil {
	//	return
	//}

	return reader, nil
}

func uploadFile(ctx context.Context, fileName string, fileId string, suffix string, data []byte) (string, error) {

	log.Debugf(ctx, "handle file upload, read ok")

	bucketName, err := file.DefaultBucketName(ctx)
	if err != nil {
		return "", err
	}

	log.Debugf(ctx, "handle file upload, bucket name %s", bucketName)

	client, err := storage.NewClient(ctx)
	if err != nil {
		return "", err
	}

	log.Debugf(ctx, "handle file upload, storage client created")

	bucketHandler := client.Bucket(bucketName)

	// search for existing image using UID
	var searchQuery = fmt.Sprintf("%s_%s", fileId, suffix)
	q := &storage.Query{Prefix: searchQuery}
	it := bucketHandler.Objects(ctx, q)
	for {
		objAttrs, err := it.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return "", err
		}
		log.Debugf(ctx, "handle file upload, iterator, name %s", objAttrs.Name)

		// delete already existing image
		if err := bucketHandler.Object(objAttrs.Name).Delete(ctx); err != nil {
			return "", err
		}
		log.Debugf(ctx, "handle file upload, previous image deleted")
	}

	log.Debugf(ctx, "handle file upload, iterator DONE")

	// rename file, just keep file format
	split := strings.Split(fileName, ".")
	// split should have 2 values ( xxx.jpg )
	if len(split) != 2 {
		if err != nil {
			return "", errors.New("Incorrect filename")
		}
	}
	var newFileName = fmt.Sprintf("%s_%s_%s_%s", fileId, suffix, strconv.Itoa(time.Now().Minute()), strconv.Itoa(time.Now().Second()))
	fileName = strings.Replace(fileName, split[0], newFileName, -1)

	// save new image
	writer := bucketHandler.Object(fileName).NewWriter(ctx)
	writer.ACL = []storage.ACLRule{{storage.AllUsers, storage.RoleReader}}
	size, err := writer.Write(data)
	if err != nil {
		return "", err
	}

	log.Debugf(ctx, "handle file upload, size %s", size) // TODO limit file size
	log.Debugf(ctx, "handle file upload, fileName %s", fileName)

	// Close, just like writing a file.
	if err := writer.Close(); err != nil {
		return "", err
	}

	return fileName, nil
}

func UploadPictureProfile(r *http.Request, uid string, suffix string) (string, error) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "UploadPictureProfile for uid %s", uid)

	// get file to upload
	fileToUpload, header, err := r.FormFile("uploadFile")
	if err != nil {
		return "", err
	}
	log.Debugf(ctx, "handle file upload, got file")

	// read data
	data, err := ioutil.ReadAll(fileToUpload)
	if err != nil {
		return "", err
	}

	fileName, err := uploadFile(ctx, header.Filename, uid, suffix, data)
	if err != nil {
		return "", err
	}

	return fileName, nil
}

func UploadPossibleCoachAssurance(r *http.Request, uid string, suffix string) (string, error) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "UploadPossibleCoachAssurance, uid %s", uid)

	// get file to upload
	fileToUpload, header, err := r.FormFile("uploadFile")
	if err != nil {
		return "", err
	}
	log.Debugf(ctx, "handle file upload, got file")

	// read data
	data, err := ioutil.ReadAll(fileToUpload)
	if err != nil {
		return "", err
	}

	fileName, err := uploadFile(ctx, header.Filename, uid, suffix, data)
	if err != nil {
		return "", err
	}

	return fileName, nil
}
