package handler

import (
	"net/http"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"io/ioutil"
	"cloud.google.com/go/storage"
	"google.golang.org/appengine/file"
	"eritis_be/pkg/response"
	"eritis_be/pkg/utils"
)

func ServiceAccountUploaderHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle file upload")

	fileToUpload, header, err := r.FormFile("jsonFile")
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	log.Debugf(ctx, "handle file upload, got file")

	data, err := ioutil.ReadAll(fileToUpload)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handle file upload, read ok")

	//filename := path.Join("avatars", path.Ext(header.Filename))
	//err = ioutil.WriteFile(filename, data, 0777)
	//if err != nil {
	//	http.Error(w, err.Error(), http.StatusInternalServerError)
	//	return
	//}
	//io.WriteString(w, "Successful")

	bucketName, err := file.DefaultBucketName(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handle file upload, bucket name %s", bucketName)

	client, err := storage.NewClient(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handle file upload, storage client created")

	bucketHandler := client.Bucket(bucketName)

	writer := bucketHandler.Object(header.Filename).NewWriter(ctx)
	size, err := writer.Write(data)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handle file upload, size %s", size)

	// Close, just like writing a file.
	if err := writer.Close(); err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handle file upload, DONE")

	//client.NewWriter(d.ctx, bucket, fileName)
	response.Respond(ctx, w, r, nil, http.StatusOK)

}

func ServiceAccountGetHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle read service account")

	reader, err := utils.GetReaderFromBucket(ctx, "eritis-be-glr-firebase.json")
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	log.Debugf(ctx, "handle read, reader created")

	defer reader.Close()
	//if _, err := io.Copy(os.Stdout, reader); err != nil {
	//	response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	//	return
	//}
	// Prints "This object contains text."

	log.Debugf(ctx, "handle read, DONE")

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

