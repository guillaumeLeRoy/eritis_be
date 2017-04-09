var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { PromiseObservable } from "rxjs/observable/PromiseObservable";
import { Http, Headers } from "@angular/http";
import { environment } from "../../environments/environment";
import { FirebaseService } from "./firebase.service";
import { Coach } from "../model/Coach";
import { Coachee } from "../model/coachee";
var AuthService = AuthService_1 = (function () {
    function AuthService(firebase, router, httpService) {
        this.firebase = firebase;
        this.router = router;
        this.httpService = httpService;
        this.onAuthStateChangedCalled = false;
        // private user: User
        this.isUserAuth = new BehaviorSubject(false); //NOT auth by default
        // private ApiUserSubject = new BehaviorSubject<ApiUser>(null);//NOT auth by default
        this.ApiUserSubject = new Subject(); //NOT auth by default
        /* flag to know if we are in the sign in or sign up process. Block updateAuthStatus(FBuser) is true */
        this.isSignInOrUp = false;
        this.ApiUser = null;
        firebase.auth().onAuthStateChanged(function (user) {
            console.log("onAuthStateChanged, user : " + user);
            this.onAuthStateChangedCalled = true;
            this.updateAuthStatus(user);
        }.bind(this));
        console.log("ctr done");
    }
    AuthService.prototype.getConnectedUser = function () {
        return this.ApiUser;
    };
    AuthService.prototype.getConnectedUserObservable = function () {
        return this.ApiUserSubject.asObservable();
    };
    AuthService.prototype.isAuthenticated = function () {
        return this.isUserAuth.asObservable();
    };
    AuthService.prototype.post = function (path, params, body) {
        var _this = this;
        var method = this.getConnectedApiUser().flatMap(function (firebaseUser) {
            return _this.getHeader(firebaseUser).flatMap(function (headers) {
                return _this.httpService.post(_this.generatePath(path, params), body, { headers: headers });
            });
        });
        return method;
    };
    AuthService.prototype.postNotAuth = function (path, params, body) {
        return this.httpService.post(this.generatePath(path, params), body);
    };
    AuthService.prototype.put = function (path, params, body) {
        var _this = this;
        var method = this.getConnectedApiUser().flatMap(function (firebaseUser) {
            return _this.getHeader(firebaseUser).flatMap(function (headers) {
                return _this.httpService.put(_this.generatePath(path, params), body, { headers: headers });
            });
        });
        return method;
    };
    AuthService.prototype.get = function (path, params) {
        var _this = this;
        console.log("1. get");
        var method = this.getConnectedApiUser().flatMap(function (firebaseUser) {
            return _this.getHeader(firebaseUser).flatMap(function (headers) {
                console.log("4. start request");
                return _this.httpService.get(_this.generatePath(path, params), { headers: headers });
            });
        });
        return method;
    };
    AuthService.prototype.getConnectedApiUser = function () {
        console.log("2. getConnectedApiUser");
        if (this.ApiUser) {
            console.log("getConnectedApiUser, user OK");
            return Observable.of(this.ApiUser);
        }
        else {
            console.log("getConnectedApiUser, NO user");
            //check if onAuthStateChanged was called
            if (this.onAuthStateChangedCalled) {
                console.log("getConnectedApiUser, user state changed already call");
                //now we know we really don't have a user
                return Observable.throw('No current user');
            }
            else {
                console.log("getConnectedApiUser, wait for change state");
                return this.ApiUserSubject.map(function (apiUser) {
                    if (apiUser) {
                        console.log("getConnectedApiUser, got event, with user");
                        return apiUser;
                    }
                    else {
                        console.log("getConnectedApiUser, got event, no user after state change");
                        return Observable.throw('No user after state changed');
                    }
                });
            }
        }
    };
    AuthService.prototype.getHeader = function (user) {
        console.log("3. getHeader");
        if (user) {
            console.log("getHeader, currentUser : ", user);
            var token = user.firebaseToken;
            if (token) {
                console.log("getHeader, token : ", token);
                var headers = new Headers();
                headers.append('Authorization', 'Bearer ' + token);
                return Observable.of(headers);
            }
            else {
                return Observable.throw('No token');
            }
        }
        else {
            console.log("getHeader, NO user");
            return Observable.throw('No current user');
        }
    };
    AuthService.prototype.generatePath = function (path, params) {
        console.log("generatePath, path : ", path);
        console.log("generatePath, params : ", params);
        var completedPath = "";
        var segs = path.split("/");
        var paramIndex = 0;
        for (var _i = 0, segs_1 = segs; _i < segs_1.length; _i++) {
            var seg = segs_1[_i];
            if (seg == "" || seg == null) {
                continue;
            }
            console.log("generatePath, seg : ", seg);
            console.log("generatePath, paramIndex : ", paramIndex);
            completedPath += "/";
            if (seg.charAt(0) == ":") {
                completedPath += params[paramIndex];
                paramIndex++;
            }
            else {
                completedPath += seg;
            }
        }
        //always add a "/" at the end
        completedPath += "/";
        console.log("generatePath, completedPath : ", completedPath);
        console.log("generatePath, BACKEND_BASE_URL : ", environment.BACKEND_BASE_URL);
        return environment.BACKEND_BASE_URL + completedPath;
    };
    AuthService.prototype.updateAuthStatus = function (fbUser) {
        var _this = this;
        console.log("updateAuthStatus isSignInOrUp : ", this.isSignInOrUp);
        if (this.isSignInOrUp) {
            return;
        }
        console.log("updateAuthStatus user : ", fbUser);
        if (fbUser) {
            if (this.ApiUser == null) {
                console.log("updateAuthStatus, get A USER");
                var firebaseObs = PromiseObservable.create(fbUser.getToken());
                firebaseObs.subscribe(function (token) {
                    //get user from API
                    _this.getUserForFirebaseId(fbUser.uid, token).subscribe();
                });
            }
            else {
                console.log("updateAuthStatus already have a user API");
            }
        }
        else {
            console.log("updateAuthStatus NO user");
            this.ApiUser = null;
            this.ApiUserSubject.next(null);
            this.isUserAuth.next(false);
        }
    };
    /* when we obtained a User from the API ( coach or coachee ) */
    AuthService.prototype.onAPIuserObtained = function (user, firebaseToken) {
        console.log("onAPIuserObtained, user : ", user);
        if (user) {
            //keep current user
            this.ApiUser = user;
            //save token
            this.ApiUser.firebaseToken = firebaseToken;
            //dispatch
            this.ApiUserSubject.next(user);
            this.isUserAuth.next(true);
        }
        else {
            this.ApiUserSubject.next(null);
            this.isUserAuth.next(false);
        }
        return user;
    };
    AuthService.prototype.getUserForFirebaseId = function (firebaseId, token) {
        var _this = this;
        console.log("getUserForFirebaseId : ", firebaseId);
        var params = [firebaseId];
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
        return this.httpService.get(this.generatePath(AuthService_1.LOGIN, params), { headers: headers }).map(function (response) {
            var apiUser = response.json();
            var res = _this.parseAPIuser(apiUser);
            console.log("getUserForFirebaseId, apiUser : ", apiUser);
            // console.log("getUserForFirebaseId, token : ", token);
            return _this.onAPIuserObtained(res, token);
        });
    };
    AuthService.prototype.signUpCoachee = function (user) {
        return this.signup(user, AuthService_1.POST_SIGN_UP_COACHEE);
    };
    AuthService.prototype.signUpCoach = function (user) {
        return this.signup(user, AuthService_1.POST_SIGN_UP_COACH);
    };
    AuthService.prototype.signup = function (user, path) {
        var _this = this;
        console.log("1. user signUp : ", user);
        this.isSignInOrUp = true;
        //create user with email and pwd
        var firebasePromise = this.firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(function (fbUser) {
            console.log("2. authService, user sign up, success : ", fbUser);
            //user successfully sign up in Firebase
            console.log("3. fb user, start getToken");
            return fbUser.getToken();
        });
        var firebaseObs = PromiseObservable.create(firebasePromise);
        return firebaseObs.flatMap(function (token) {
            //user should be ok just after a sign up
            var fbUser = _this.firebase.auth().currentUser;
            var body = {
                email: fbUser.email,
                uid: fbUser.uid,
            };
            var params = [fbUser.uid];
            var headers = new Headers();
            headers.append('Authorization', 'Bearer ' + token);
            // start sign up request
            return _this.httpService.post(_this.generatePath(path, params), body, { headers: headers })
                .map(function (response) {
                var APIuser = response.json();
                console.log("signUp, APIuser : ", APIuser);
                // return json;
                _this.isSignInOrUp = false;
                return _this.onAPIuserObtained(_this.parseAPIuser(APIuser), token);
            });
        });
    };
    AuthService.prototype.parseAPIuser = function (user) {
        console.log("parseAPIuser, user :", user);
        if (user.coach) {
            user = user.coach;
            //coach
            return this.parseCoach(user);
        }
        else if (user.coachee) {
            user = user.coachee;
            //coachee
            return this.parseCoachee(user);
        }
        return null;
    };
    AuthService.prototype.parseCoach = function (json) {
        var coach = new Coach(json.id);
        coach.email = json.email;
        coach.display_name = json.display_name;
        coach.avatar_url = json.avatar_url;
        coach.start_date = json.start_date;
        coach.description = json.description;
        return coach;
    };
    AuthService.prototype.parseCoachee = function (json) {
        var coachee = new Coachee(json.id);
        coachee.id = json.id;
        coachee.email = json.email;
        coachee.display_name = json.display_name;
        coachee.avatar_url = json.avatar_url;
        coachee.start_date = json.start_date;
        coachee.selectedCoach = json.selectedCoach;
        return coachee;
    };
    AuthService.prototype.signIn = function (user) {
        var _this = this;
        console.log("1. user signIn : ", user);
        this.isSignInOrUp = true;
        //fb sign in with email and pwd
        var firebasePromise = this.firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(function (fbUser) {
            console.log("2. authService, user sign up, success : ", fbUser);
            //user successfully sign up in Firebase
            console.log("3. fb user, start getToken");
            return fbUser.getToken();
        });
        var firebaseObs = PromiseObservable.create(firebasePromise);
        return firebaseObs.flatMap(function (token) {
            //user should be ok just after a sign up
            var fbUser = _this.firebase.auth().currentUser;
            //now sign up in AppEngine
            _this.isSignInOrUp = false;
            return _this.getUserForFirebaseId(fbUser.uid, token);
        });
    };
    AuthService.prototype.loginOut = function () {
        console.log("user loginOut");
        this.firebase.auth().signOut();
        this.updateAuthStatus(null);
        this.router.navigate(['/welcome']);
    };
    AuthService.prototype.updateCoacheeForId = function (id, displayName, avatarUrl) {
        var _this = this;
        console.log("updateCoacheeForId, id", id);
        var body = {
            display_name: displayName,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_COACHEE, params, body).map(function (response) {
            return _this.onUserResponse(response);
        });
    };
    AuthService.prototype.updateCoachForId = function (id, displayName, description, avatarUrl) {
        var _this = this;
        console.log("updateCoachDisplayNameForId, id", id);
        var body = {
            display_name: displayName,
            description: description,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_COACH, params, body).map(function (response) {
            //convert to coach
            return _this.onUserResponse(response);
        });
    };
    /**
     *
     * @param coacheeId
     * @param coachId
     * @returns {Observable<R>}
     */
    AuthService.prototype.updateCoacheeSelectedCoach = function (coacheeId, coachId) {
        var _this = this;
        console.log("updateCoacheeSelectedCoach, coacheeId", coacheeId);
        console.log("updateCoacheeSelectedCoach, coachId", coachId);
        var params = [coacheeId, coachId];
        return this.put(AuthService_1.UPDATE_COACHEE_SELECTED_COACH, params, null).map(function (response) {
            //convert to coachee
            return _this.parseCoachee(response.json());
        });
    };
    AuthService.prototype.onUserResponse = function (response) {
        var json = response.json();
        console.log("onUserResponse, response json : ", json);
        var res = this.parseAPIuser(json);
        console.log("onUserResponse, parsed user : ", res);
        //dispatch
        return this.onAPIuserObtained(res, this.ApiUser.firebaseToken);
    };
    return AuthService;
}());
AuthService.UPDATE_COACH = "/coachs/:id";
AuthService.UPDATE_COACHEE = "/coachees/:id";
AuthService.UPDATE_COACHEE_SELECTED_COACH = "/coachees/:coacheeId/coach/:coachId";
AuthService.POST_SIGN_UP_COACH = "/login/:firebaseId/coach";
AuthService.POST_SIGN_UP_COACHEE = "/login/:firebaseId/coachee";
AuthService.LOGIN = "/login/:firebaseId";
AuthService.GET_COACHS = "/coachs";
AuthService.GET_COACH_FOR_ID = "/coachs/:id";
AuthService.GET_COACHEE_FOR_ID = "/coachees/:id";
/*Meeting*/
AuthService.POST_MEETING = "/meeting";
AuthService.GET_MEETING_REVIEWS = "/meeting/:meetingId/reviews";
AuthService.POST_MEETING_REVIEW = "/meeting/:meetingId/review";
AuthService.CLOSE_MEETING = "/meeting/:meetingId/close";
AuthService.GET_MEETINGS_FOR_COACHEE_ID = "/meetings/coachee/:coacheeId";
AuthService.GET_MEETINGS_FOR_COACH_ID = "/meetings/coach/:coachId";
AuthService.POST_MEETING_POTENTIAL_DATE = "/meeting/:meetingId/potential";
AuthService.GET_MEETING_POTENTIAL_DATES = "/meeting/:meetingId/potentials";
AuthService.PUT_POTENTIAL_DATE_TO_MEETING = "/meeting/:meetingId/potential/:potentialId"; //set the potential date as the meeting selected date
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [FirebaseService, Router, Http])
], AuthService);
export { AuthService };
var AuthService_1;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/auth.service.js.map