package api
//
//import (
//	"google.golang.org/appengine/datastore"
//	"errors"
//	"crypto/md5"
//	"io"
//	"fmt"
//	"strings"
//	"golang.org/x/net/context"
//	"google.golang.org/appengine/log"
//)
////
////import (
////	"google.golang.org/appengine/datastore"
////	"crypto/md5"
////	"io"
////	"fmt"
////	"strings"
////	"golang.org/x/net/context"
////	"errors"
////	"google.golang.org/appengine/log"
////)
////
////type User struct {
////	Key         *datastore.Key `json:"id" datastore:"-"`
////	FirebaseUID string `json:"firebase_id"`
////	DisplayName string `json:"display_name"`
////	AvatarURL   string `json:"avatar_url"`
////	Score       int `json:"score"`
////	Status      Status `json:"status"` // coach or coachee
////}
////
////type UserCard struct {
////	Key         *datastore.Key `json:"id"`
////	DisplayName string         `json:"display_name"`
////	AvatarURL   string         `json:"avatar_url"`
////}
////
////User status
//type Status int
//
//const (
//	COACH Status = 1 + iota
//	COACHEE
//)
//
//////func UserFromAEUser(ctx context.Context) (*User, error) {
//////	aeuser := user.Current(ctx)
//////	if (aeuser == nil) {
//////		return nil, errors.New("User not log in")
//////	}
//////
//////	var appUser User
//////	appUser.Key = datastore.NewKey(ctx, "User", aeuser.ID, 0, nil)
//////	err := datastore.Get(ctx, appUser.Key, &appUser)
//////	if err != nil && err != datastore.ErrNoSuchEntity {
//////		return nil, err
//////	}
//////
//////	if err == nil {
//////		return &appUser, nil
//////	}
//////
//////	appUser.UserID = aeuser.ID
//////	appUser.DisplayName = aeuser.String()
//////	appUser.AvatarURL = gravatarURL(aeuser.Email)
//////	log.Infof(ctx, "saving new user: %s", aeuser.String())
//////	appUser.Key, err = datastore.Put(ctx, appUser.Key, &appUser)
//////	if err != nil {
//////		return nil, err
//////	}
//////	return &appUser, nil
//////}
////
//// ErrNoUser is the error that is returned when the
//// datastore instance is unable to provide a User because it doesn't exist.
//var ErrNoUser = errors.New("user : No user found")
//
//////get User for the given user id
////func getUser(ctx context.Context, key *datastore.Key) (*User, error) {
////	var user User
////	err := datastore.Get(ctx, key, &user)
////	if err != nil {
////		return nil, err
////	}
////	user.Key = key
////
////	log.Debugf(ctx, "UserFromFirebaseUser")
////
////	return &user, nil
////}
//
////func UserFromFirebaseUser(ctx context.Context, fbUser *FirebaseUser) (*User, error) {
////	log.Debugf(ctx, "UserFromFirebaseUser")
////
////	var appUser User
////	appUser.Key = datastore.NewIncompleteKey(ctx, "User", nil)
////
////	//create new user
////	appUser.FirebaseUID = fbUser.UID
////	appUser.DisplayName = fbUser.Email
////	appUser.AvatarURL = gravatarURL(fbUser.Email)
////	appUser.Status = fbUser.Status
////
////	//log.Infof(ctx, "saving new user: %s", aeuser.String())
////	log.Debugf(ctx, "saving new user, firebase id  : %s, email : %s ", fbUser.UID, fbUser.Email)
////
////	key, err := datastore.Put(ctx, appUser.Key, &appUser)
////	if err != nil {
////		return nil, err
////	}
////	appUser.Key = key
////
////	return &appUser, nil
////}
//
//func gravatarURL(email string) string {
//	m := md5.New()
//	io.WriteString(m, strings.ToLower(email))
//	return fmt.Sprintf("//www.gravatar.com/avatar/%x", m.Sum(nil))
//}
//
////func (u User) Card() UserCard {
////	return UserCard{
////		Key:         u.Key,
////		DisplayName: u.DisplayName,
////		AvatarURL:   u.AvatarURL,
////	}
////}