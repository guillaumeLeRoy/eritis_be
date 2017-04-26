package api

import (
	"net/http"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"io/ioutil"
	"cloud.google.com/go/storage"
	"google.golang.org/appengine/file"
	"golang.org/x/net/context"
)

func serviceAccountUploaderHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle file upload")

	fileToUpload, header, err := r.FormFile("jsonFile")
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	log.Debugf(ctx, "handle file upload, got file")

	data, err := ioutil.ReadAll(fileToUpload)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
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
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handle file upload, bucket name %s", bucketName)

	client, err := storage.NewClient(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handle file upload, storage client created")

	bucketHandler := client.Bucket(bucketName)

	writer := bucketHandler.Object(header.Filename).NewWriter(ctx)
	size, err := writer.Write(data)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handle file upload, size %s", size)

	// Close, just like writing a file.
	if err := writer.Close(); err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handle file upload, DONE")

	//client.NewWriter(d.ctx, bucket, fileName)
	Respond(ctx, w, r, nil, http.StatusOK)

}

func serviceAccountGetHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle read service account")

	reader, err := getReaderFromBucket(ctx, "eritis-be-glr-firebase.json")
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	log.Debugf(ctx, "handle read, reader created")

	defer reader.Close()
	//if _, err := io.Copy(os.Stdout, reader); err != nil {
	//	RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	//	return
	//}
	// Prints "This object contains text."

	log.Debugf(ctx, "handle read, DONE")

	Respond(ctx, w, r, nil, http.StatusOK)
}

func getReaderFromBucket(ctx context.Context, fileName string) (*storage.Reader, error) {
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