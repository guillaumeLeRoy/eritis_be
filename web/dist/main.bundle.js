webpackJsonp([0,4],{

/***/ 1002:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(368);


/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__environments_environment__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__firebase_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__model_Coach__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__model_HR__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__model_PotentialCoachee__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__model_PotentialRh__ = __webpack_require__(405);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__session_service__ = __webpack_require__(92);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var AuthService = (function () {
    function AuthService(firebase, router, httpService, sessionService) {
        this.firebase = firebase;
        this.router = router;
        this.httpService = httpService;
        this.sessionService = sessionService;
        this.onAuthStateChangedCalled = false;
        // private user: User
        this.isUserAuth = new __WEBPACK_IMPORTED_MODULE_2_rxjs__["BehaviorSubject"](false); //NOT auth by default
        this.ApiUserSubject = new __WEBPACK_IMPORTED_MODULE_2_rxjs__["BehaviorSubject"](null); //NOT auth by default
        // private ApiUserSubject = new Subject<ApiUser>();//NOT auth by default
        /* flag to know if we are in the sign in or sign up process. Block updateAuthStatus(FBuser) is true */
        this.isSignInOrUp = false;
        this.ApiUser = null;
        firebase.auth().onAuthStateChanged(function (user) {
            console.log("onAuthStateChanged, user : " + user);
            this.onAuthStateChangedCalled = true;
            this.updateAuthStatus(user);
        }.bind(this));
        console.log("ctr done");
        console.log("ctr done");
        // let date = (new Date());
        // date.setHours(date.getHours() + 1);
        // console.log('COOKIE', date);
        // if (this.cookieService.get('ACTIVE_SESSION') === undefined)
        //   if (this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
        //     this.cookieService.put('ACTIVE_SESSION', 'true', {expires: date.toDateString()});
    }
    AuthService_1 = AuthService;
    /*
     * Get connected user from backend
     */
    AuthService.prototype.refreshConnectedUser = function () {
        console.log("refreshConnectedUser");
        var obs = this.refreshConnectedUserAsObservable();
        if (obs != null) {
            obs.subscribe();
        }
    };
    /*
     * Get connected user from backend
     */
    AuthService.prototype.refreshConnectedUserAsObservable = function () {
        console.log("refreshConnectedUser");
        if (this.ApiUser != null) {
            if (this.ApiUser instanceof __WEBPACK_IMPORTED_MODULE_7__model_Coach__["a" /* Coach */]) {
                return this.fetchCoach(this.ApiUser.id);
            }
            else if (this.ApiUser instanceof __WEBPACK_IMPORTED_MODULE_8__model_Coachee__["a" /* Coachee */]) {
                return this.fetchCoachee(this.ApiUser.id);
            }
            else if (this.ApiUser instanceof __WEBPACK_IMPORTED_MODULE_9__model_HR__["a" /* HR */]) {
                return this.fetchRh(this.ApiUser.id);
            }
        }
        else {
            console.log("refreshConnectedUser, no connected user");
        }
        return null;
    };
    AuthService.prototype.fetchCoach = function (userId) {
        var _this = this;
        var param = [userId];
        var obs = this.get(AuthService_1.GET_COACH_FOR_ID, param);
        return obs.map(function (res) {
            console.log("fetchCoach, obtained from API : ", res);
            var coach = __WEBPACK_IMPORTED_MODULE_7__model_Coach__["a" /* Coach */].parseCoach(res.json());
            _this.onAPIuserObtained(coach, _this.ApiUser.firebaseToken);
            return coach;
        });
    };
    AuthService.prototype.fetchCoachee = function (userId) {
        var _this = this;
        var param = [userId];
        var obs = this.get(AuthService_1.GET_COACHEE_FOR_ID, param);
        return obs.map(function (res) {
            console.log("fetchCoachee, obtained from API : ", res);
            var coachee = __WEBPACK_IMPORTED_MODULE_8__model_Coachee__["a" /* Coachee */].parseCoachee(res.json());
            _this.onAPIuserObtained(coachee, _this.ApiUser.firebaseToken);
            return coachee;
        });
    };
    AuthService.prototype.fetchRh = function (userId) {
        var _this = this;
        var param = [userId];
        var obs = this.get(AuthService_1.GET_HR_FOR_ID, param);
        return obs.map(function (res) {
            console.log("fetchRh, obtained from API : ", res);
            var rh = __WEBPACK_IMPORTED_MODULE_9__model_HR__["a" /* HR */].parseRh(res.json());
            _this.onAPIuserObtained(rh, _this.ApiUser.firebaseToken);
            return rh;
        });
    };
    AuthService.prototype.getConnectedUser = function () {
        return this.ApiUser;
    };
    AuthService.prototype.getConnectedUserObservable = function () {
        return this.ApiUserSubject.asObservable();
    };
    AuthService.prototype.isAuthenticated = function () {
        return this.isUserAuth.asObservable();
    };
    /*
     *
     * define POST methods
     * */
    AuthService.prototype.post = function (path, params, body, options, isAdmin) {
        var _this = this;
        if (isAdmin) {
            return this.internal_post(path, params, body, options, true);
        }
        else {
            return this.getConnectedApiUser().flatMap(function (firebaseUser) {
                return _this.getHeader(firebaseUser).flatMap(function (headers) {
                    //todo to change
                    if (options != undefined) {
                        for (var _i = 0, _a = options.headers.keys(); _i < _a.length; _i++) {
                            var headerKey = _a[_i];
                            headers.append(headerKey, options.headers.get(headerKey));
                        }
                    }
                    return _this.internal_post(path, params, body, { headers: headers });
                });
            });
        }
    };
    AuthService.prototype.postNotAuth = function (path, params, body) {
        return this.internal_post(path, params, body);
    };
    AuthService.prototype.internal_post = function (path, params, body, options, isAdmin) {
        return this.httpService.post(this.generatePath(path, params, isAdmin), body, options);
    };
    /*
     *
     * define PUT
     * */
    AuthService.prototype.put = function (path, params, body, options, isAdmin) {
        var _this = this;
        if (isAdmin) {
            return this.internal_put(path, params, body, options, true);
        }
        else {
            return this.getConnectedApiUser().flatMap(function (firebaseUser) {
                return _this.getHeader(firebaseUser).flatMap(function (headers) {
                    // add params headers to received ones
                    if (options != null) {
                        for (var _i = 0, _a = headers.keys(); _i < _a.length; _i++) {
                            var headerKey = _a[_i];
                            options.headers.append(headerKey, headers.get(headerKey));
                        }
                    }
                    else {
                        options = { headers: headers };
                    }
                    // for (let headerKey of options.headers.keys()) {
                    //   headers.append(headerKey, options.headers.get(headerKey));
                    // }
                    // return this.httpService.put(this.generatePath(path, params), body, {headers: headers})
                    return _this.internal_put(path, params, body, options);
                });
            });
        }
    };
    AuthService.prototype.putNotAuth = function (path, params, body, options) {
        // let headers = new Headers();
        // if (options != null)
        //   for (let headerKey of options.headers.keys()) {
        //     headers.append(headerKey, options.headers.get(headerKey));
        //   }
        // return this.httpService.put(this.generatePath(path, params), body, {headers: headers})
        return this.internal_put(path, params, body, options);
    };
    AuthService.prototype.internal_put = function (path, params, body, options, isAdmin) {
        // let headers = new Headers();
        // if (options != null)
        //   for (let headerKey of options.headers.keys()) {
        //     headers.append(headerKey, options.headers.get(headerKey));
        //   }
        return this.httpService.put(this.generatePath(path, params, isAdmin), body, options);
    };
    /*
     *
     * define GET
     * */
    AuthService.prototype.get = function (path, params, isAdmin) {
        return this.getWithSearchParams(path, params, null, isAdmin);
    };
    AuthService.prototype.getWithSearchParams = function (path, params, searchParams, isAdmin) {
        var _this = this;
        if (isAdmin) {
            return this.internal_get(path, params, { search: searchParams }, true);
        }
        else {
            return this.getConnectedApiUser().flatMap(function (firebaseUser) {
                return _this.getHeader(firebaseUser).flatMap(function (headers) {
                    return _this.internal_get(path, params, { headers: headers, search: searchParams });
                });
            });
        }
    };
    AuthService.prototype.getNotAuth = function (path, params) {
        return this.internal_get(path, params).map(function (res) {
            return res;
        }, function (error) {
            console.log("getNotAuth, error", error);
        });
    };
    AuthService.prototype.internal_get = function (path, params, options, isAdmin) {
        return this.httpService.get(this.generatePath(path, params, isAdmin), options);
    };
    /*
     *
     * define DELETE
     * */
    AuthService.prototype.delete = function (path, params, isAdmin) {
        var _this = this;
        var method = this.getConnectedApiUser().flatMap(function (firebaseUser) {
            return _this.getHeader(firebaseUser).flatMap(function (headers) {
                console.log("4. start request");
                return _this.httpService.delete(_this.generatePath(path, params, isAdmin), { headers: headers });
            });
        });
        return method;
    };
    /*
     *
     * OPEN api
     * */
    AuthService.prototype.getPotentialCoachee = function (path, params) {
        return this.httpService.get(this.generatePath(path, params)).map(function (res) {
            return __WEBPACK_IMPORTED_MODULE_10__model_PotentialCoachee__["a" /* PotentialCoachee */].parsePotentialCoachee(res.json());
        });
    };
    AuthService.prototype.getPotentialRh = function (path, params) {
        return this.httpService.get(this.generatePath(path, params)).map(function (res) {
            return __WEBPACK_IMPORTED_MODULE_11__model_PotentialRh__["a" /* PotentialRh */].parsePotentialRh(res.json());
        });
    };
    AuthService.prototype.getConnectedApiUser = function () {
        console.log("2. getConnectedApiUser");
        if (this.ApiUser) {
            console.log("getConnectedApiUser, user OK");
            return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(this.ApiUser);
        }
        else {
            console.log("getConnectedApiUser, NO user");
            //check if onAuthStateChanged was called
            if (this.onAuthStateChangedCalled) {
                console.log("getConnectedApiUser, user state changed already call");
                //now we know we really don't have a user
                return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].throw('No current user');
            }
            else {
                console.log("getConnectedApiUser, wait for change state");
                return this.ApiUserSubject.asObservable();
                // .map(
                //   (apiUser: ApiUser) => {
                //     if (apiUser) {
                //       console.log("getConnectedApiUser, got event, with user");
                //       return apiUser;
                //     } else {
                //       console.log("getConnectedApiUser, got event, no user after state change");
                //       return Observable.throw('No user after state changed');
                //     }
                //   }
                // );
            }
        }
    };
    AuthService.prototype.getHeader = function (user) {
        console.log("getHeader");
        if (user) {
            // console.log("getHeader, currentUser : ", user);
            var token = user.firebaseToken;
            if (token) {
                // console.log("getHeader, token : ", token);
                var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_http__["c" /* Headers */]();
                headers.append('Authorization', 'Bearer ' + token);
                return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(headers);
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].throw('No token');
            }
        }
        else {
            console.log("getHeader, NO user");
            return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].throw('No current user');
        }
    };
    AuthService.prototype.generatePath = function (path, params, isAdmin) {
        // console.log("generatePath, path : ", path);
        // console.log("generatePath, params : ", params);
        var completedPath = "";
        //add a "admin" if necessary
        if (isAdmin) {
            completedPath += "/admins";
        }
        var segs = path.split("/");
        var paramIndex = 0;
        for (var _i = 0, segs_1 = segs; _i < segs_1.length; _i++) {
            var seg = segs_1[_i];
            if (seg == "" || seg == null) {
                continue;
            }
            // console.log("generatePath, seg : ", seg);
            // console.log("generatePath, paramIndex : ", paramIndex);
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
        // console.log("generatePath, completedPath : ", completedPath);
        // console.log("generatePath, BACKEND_BASE_URL : ", environment.BACKEND_BASE_URL);
        var finalUrl = __WEBPACK_IMPORTED_MODULE_5__environments_environment__["a" /* environment */].BACKEND_BASE_URL + completedPath;
        console.log("generatePath, finalUrl : ", finalUrl);
        return finalUrl;
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
                var firebaseObs = __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__["PromiseObservable"].create(fbUser.getToken());
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
        var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_http__["c" /* Headers */]();
        headers.append('Authorization', 'Bearer ' + token);
        return this.httpService.get(this.generatePath(AuthService_1.LOGIN, params), { headers: headers }).map(function (response) {
            var apiUser = response.json();
            var res = _this.parseAPIuser(apiUser);
            console.log("getUserForFirebaseId, apiUser : ", apiUser);
            // console.log("getUserForFirebaseId, token : ", token);
            return _this.onAPIuserObtained(res, token);
        });
    };
    AuthService.prototype.signUpCoach = function (user) {
        return this.signup(user, AuthService_1.POST_SIGN_UP_COACH);
    };
    AuthService.prototype.signUpCoachee = function (user) {
        //add plan
        return this.signup(user, AuthService_1.POST_SIGN_UP_COACHEE);
    };
    AuthService.prototype.signUpRh = function (user) {
        return this.signup(user, AuthService_1.POST_SIGN_UP_HR);
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
        var firebaseObs = __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__["PromiseObservable"].create(firebasePromise);
        return firebaseObs.flatMap(function (token) {
            //user should be ok just after a sign up
            var fbUser = _this.firebase.auth().currentUser;
            var body = {
                email: fbUser.email,
                uid: fbUser.uid,
                plan_id: user.contractPlanId
            };
            var params = [fbUser.uid];
            var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_http__["c" /* Headers */]();
            headers.append('Authorization', 'Bearer ' + token);
            // start sign up request
            return _this.internal_post(path, params, body, { headers: headers })
                .map(function (response) {
                var loginResponse = response.json();
                console.log("signUp, loginResponse : ", loginResponse);
                _this.sessionService.saveSessionTTL();
                // return json;
                _this.isSignInOrUp = false;
                return _this.onAPIuserObtained(_this.parseAPIuser(loginResponse), token);
            });
        });
    };
    AuthService.prototype.parseAPIuser = function (response) {
        console.log("parseAPIuser, response :", response);
        if (response.coach) {
            var coach = response.coach;
            //coach
            return __WEBPACK_IMPORTED_MODULE_7__model_Coach__["a" /* Coach */].parseCoach(coach);
        }
        else if (response.coachee) {
            var coachee = response.coachee;
            //coachee
            return __WEBPACK_IMPORTED_MODULE_8__model_Coachee__["a" /* Coachee */].parseCoachee(coachee);
        }
        else if (response.rh) {
            var rh = response.rh;
            return __WEBPACK_IMPORTED_MODULE_9__model_HR__["a" /* HR */].parseRh(rh);
        }
        return null;
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
        var firebaseObs = __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__["PromiseObservable"].create(firebasePromise);
        return firebaseObs
            .flatMap(function (token) {
            //user should be ok just after a sign up
            var fbUser = _this.firebase.auth().currentUser;
            _this.sessionService.saveSessionTTL();
            //now sign up in AppEngine
            _this.isSignInOrUp = false;
            return _this.getUserForFirebaseId(fbUser.uid, token);
        })
            .flatMap(function (user) {
            return _this.updateUserTimeZone(user);
        });
    };
    AuthService.prototype.updateUserTimeZone = function (user) {
        var body = {
            "time_zone_offset": new Date().getTimezoneOffset().toString()
        };
        var params = [user.id];
        var path;
        if (user instanceof __WEBPACK_IMPORTED_MODULE_7__model_Coach__["a" /* Coach */]) {
            path = AuthService_1.PUT_COACH_TIMEZONE;
        }
        else if (user instanceof __WEBPACK_IMPORTED_MODULE_8__model_Coachee__["a" /* Coachee */]) {
            path = AuthService_1.PUT_COACHEE_TIMEZONE;
        }
        else if (user instanceof __WEBPACK_IMPORTED_MODULE_9__model_HR__["a" /* HR */]) {
            path = AuthService_1.PUT_HR_TIMEZONE;
        }
        return this.put(path, params, body).map(function (response) {
            // return Coach.parseCoach(response.json());
            return user;
        });
    };
    AuthService.prototype.loginOut = function () {
        console.log("user loginOut");
        this.firebase.auth().signOut();
        this.updateAuthStatus(null);
        this.sessionService.clearSession();
        this.router.navigate(['/']);
        Materialize.toast('Vous avez été déconnecté', 3000, 'rounded');
    };
    AuthService.prototype.updateCoacheeForId = function (id, first_name, last_name, avatarUrl) {
        console.log("updateCoacheeForId, id", id);
        var body = {
            first_name: first_name,
            last_name: last_name,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_COACHEE, params, body).map(function (response) {
            return __WEBPACK_IMPORTED_MODULE_8__model_Coachee__["a" /* Coachee */].parseCoachee(response.json());
        });
    };
    AuthService.prototype.updateCoachForId = function (id, firstName, lastName, description, avatarUrl) {
        console.log("updateCoachForId, id", id);
        var body = {
            first_name: firstName,
            last_name: lastName,
            description: description,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_COACH, params, body).map(function (response) {
            //convert to coach
            return __WEBPACK_IMPORTED_MODULE_7__model_Coach__["a" /* Coach */].parseCoach(response.json());
        });
    };
    AuthService.prototype.updateRhForId = function (id, firstName, lastName, description, avatarUrl) {
        console.log("updateRhForId, id", id);
        var body = {
            first_name: firstName,
            last_name: lastName,
            description: description,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_HR, params, body).map(function (response) {
            //convert to HR
            return __WEBPACK_IMPORTED_MODULE_9__model_HR__["a" /* HR */].parseRh(response.json());
        });
    };
    /* contract plan*/
    AuthService.GET_CONTRACT_PLANS = "/v1/plans/";
    AuthService.LOGIN = "/v1/login/:firebaseId";
    AuthService.POST_POTENTIAL_COACHEE = "/v1/potentials/coachees";
    AuthService.POST_POTENTIAL_COACH = "/v1/potentials/coachs";
    AuthService.POST_POTENTIAL_RH = "/v1/potentials/rhs";
    AuthService.GET_POTENTIAL_COACHEE_FOR_TOKEN = "/v1/potentials/coachees/:token";
    AuthService.GET_POTENTIAL_COACH_FOR_TOKEN = "/v1/potentials/coachs/:token";
    AuthService.GET_POTENTIAL_RH_FOR_TOKEN = "/v1/potentials/rhs/:token";
    /* Possible coach */
    AuthService.UPDATE_POSSIBLE_COACH = "/v1/possible_coachs";
    AuthService.UPDATE_POSSIBLE_COACH_PICTURE = "/v1/possible_coachs/profile_picture";
    AuthService.UPDATE_POSSIBLE_COACH_INSURANCE_DOC = "/v1/possible_coachs/insurance";
    /* coachee */
    AuthService.UPDATE_COACHEE = "/v1/coachees/:id";
    AuthService.POST_SIGN_UP_COACHEE = "/v1/coachees";
    AuthService.GET_COACHEES = "/v1/coachees";
    AuthService.GET_COACHEE_FOR_ID = "/v1/coachees/:id";
    AuthService.GET_COACHEE_NOTIFICATIONS = "/v1/coachees/:id/notifications";
    AuthService.PUT_COACHEE_NOTIFICATIONS_READ = "/v1/coachees/:id/notifications/read";
    AuthService.PUT_COACHEE_PROFILE_PICT = "/v1/coachees/:id/profile_picture";
    AuthService.PUT_COACHEE_TIMEZONE = "/v1/coachees/:id/timezone";
    /* coach */
    AuthService.UPDATE_COACH = "/v1/coachs/:id";
    AuthService.POST_SIGN_UP_COACH = "/v1/coachs";
    AuthService.GET_COACHS = "/v1/coachs";
    AuthService.GET_COACH_FOR_ID = "/v1/coachs/:id";
    AuthService.GET_COACH_NOTIFICATIONS = "/v1/coachs/:id/notifications";
    AuthService.PUT_COACH_NOTIFICATIONS_READ = "/v1/coachs/:id/notifications/read";
    AuthService.PUT_COACH_PROFILE_PICT = "/v1/coachs/:id/profile_picture";
    AuthService.PUT_COACH_TIMEZONE = "/v1/coachs/:id/timezone";
    /* HR */
    AuthService.GET_HRS = "/v1/rhs";
    AuthService.UPDATE_HR = "/v1/rhs/:id";
    AuthService.POST_SIGN_UP_HR = "/v1/rhs";
    AuthService.GET_COACHEES_FOR_HR = "/v1/rhs/:uid/coachees";
    AuthService.GET_POTENTIAL_COACHEES_FOR_HR = "/v1/rhs/:uid/potentials";
    AuthService.GET_HR_FOR_ID = "/v1/rhs/:id";
    AuthService.GET_USAGE_RATE_FOR_HR = "/v1/rhs/:id/usage";
    AuthService.GET_HR_NOTIFICATIONS = "/v1/rhs/:id/notifications";
    AuthService.PUT_HR_NOTIFICATIONS_READ = "/v1/rhs/:id/notifications/read";
    AuthService.POST_COACHEE_OBJECTIVE = "/v1/rhs/:uidRH/coachees/:uidCoachee/objective"; //create new objective for this coachee
    AuthService.PUT_HR_PROFILE_PICT = "/v1/rhs/:id/profile_picture";
    AuthService.PUT_HR_TIMEZONE = "/v1/rhs/:id/timezone";
    /* admin */
    AuthService.GET_ADMIN = "/v1/user";
    AuthService.ADMIN_GET_POSSIBLE_COACHS = "/v1/possible_coachs";
    AuthService.ADMIN_GET_POSSIBLE_COACH = "/v1/possible_coachs/:id";
    /* Meeting */
    AuthService.POST_MEETING = "/v1/meetings";
    AuthService.PUT_MEETING = "/v1/meetings/:meetingId";
    AuthService.DELETE_MEETING = "/v1/meetings/:meetingId";
    AuthService.GET_MEETING_REVIEWS = "/v1/meetings/:meetingId/reviews";
    AuthService.PUT_MEETING_REVIEW = "/v1/meetings/:meetingId/reviews"; //add or replace meeting review
    AuthService.CLOSE_MEETING = "/v1/meetings/:meetingId/close"; // close meeting
    AuthService.GET_MEETINGS_FOR_COACHEE_ID = "/v1/meetings/coachees/:coacheeId";
    AuthService.GET_MEETINGS_FOR_COACH_ID = "/v1/meetings/coachs/:coachId";
    AuthService.POST_MEETING_POTENTIAL_DATE = "/v1/meetings/:meetingId/potentials";
    AuthService.GET_MEETING_POTENTIAL_DATES = "/v1/meetings/:meetingId/potentials";
    AuthService.PUT_FINAL_DATE_TO_MEETING = "/v1/meetings/:meetingId/dates/:potentialId"; //set the potential date as the meeting selected date
    AuthService.GET_AVAILABLE_MEETINGS = "/v1/meetings"; //get available meetings ( meetings with NO coach associated )
    AuthService.PUT_COACH_TO_MEETING = "/v1/meetings/:meetingId/coachs/:coachId"; //associate coach with meeting
    AuthService = AuthService_1 = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_6__firebase_service__["a" /* FirebaseService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__firebase_service__["a" /* FirebaseService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__angular_http__["d" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_http__["d" /* Http */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_12__session_service__["a" /* SessionService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_12__session_service__["a" /* SessionService */]) === "function" && _d || Object])
    ], AuthService);
    return AuthService;
    var AuthService_1, _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/auth.service.js.map

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoaderSpinnerComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LoaderSpinnerComponent = (function () {
    function LoaderSpinnerComponent() {
    }
    LoaderSpinnerComponent.prototype.ngOnInit = function () {
    };
    LoaderSpinnerComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'loader-spinner',
            template: __webpack_require__(714),
            styles: [__webpack_require__(644)]
        }),
        __metadata("design:paramtypes", [])
    ], LoaderSpinnerComponent);
    return LoaderSpinnerComponent;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/loader-spinner.component.js.map

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Coach__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__MeetingDate__ = __webpack_require__(91);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Meeting; });



var Meeting = (function () {
    function Meeting() {
    }
    Meeting.parseFromBE = function (json) {
        console.log("parseFromBE, json : ", json);
        var meeting = new Meeting();
        meeting.id = json.id;
        if (json.coach != null) {
            meeting.coach = __WEBPACK_IMPORTED_MODULE_0__Coach__["a" /* Coach */].parseCoach(json.coach);
        }
        if (json.coachee != null) {
            meeting.coachee = __WEBPACK_IMPORTED_MODULE_1__Coachee__["a" /* Coachee */].parseCoachee(json.coachee);
        }
        meeting.isOpen = json.isOpen;
        if (json.agreed_date != null) {
            meeting.agreed_date = __WEBPACK_IMPORTED_MODULE_2__MeetingDate__["a" /* MeetingDate */].parseFromBE(json.agreed_date);
        }
        // convert dates to use milliseconds ....
        meeting.created_date = json.created_date * 1000; //todo convert to unix time
        console.log("parseFromBE, Meeting created: ", meeting);
        return meeting;
    };
    return Meeting;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/Meeting.js.map

/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Coach__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__model_HR__ = __webpack_require__(56);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoachCoacheeService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
///<reference path="auth.service.ts"/>






var CoachCoacheeService = (function () {
    function CoachCoacheeService(apiService) {
        this.apiService = apiService;
    }
    /* Coach endpoints */
    CoachCoacheeService.prototype.getAllCoachs = function (isAdmin) {
        console.log("getAllCoachs, start request");
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_COACHS, null, isAdmin).map(function (res) {
            var resArray = res.json();
            var coachs = new Array();
            for (var _i = 0, resArray_1 = resArray; _i < resArray_1.length; _i++) {
                var c = resArray_1[_i];
                coachs.push(__WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */].parseCoach(c));
            }
            return coachs;
        });
    };
    CoachCoacheeService.prototype.getCoachForId = function (coachId, isAdmin) {
        console.log("getCoachForId, start request");
        var params = [coachId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_COACH_FOR_ID, params, isAdmin).map(function (response) {
            console.log("getCoachForId, got coach", response);
            return __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */].parseCoach(response.json());
        }, function (error) {
            console.log("getCoachForId, error", error);
        });
    };
    CoachCoacheeService.prototype.updateCoachProfilePicture = function (coachId, avatarFile) {
        var params = [coachId];
        var formData = new FormData();
        formData.append('uploadFile', avatarFile, avatarFile.name);
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* Headers */]();
        headers.append('Accept', 'application/json');
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].PUT_COACH_PROFILE_PICT, params, formData, { headers: headers }, true)
            .map(function (res) { return res.json(); });
    };
    /* Coachee endpoints */
    CoachCoacheeService.prototype.getCoachees = function (isAdmin) {
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_COACHEES, null, isAdmin).map(function (res) {
            var resArray = res.json();
            var coachees = new Array();
            for (var _i = 0, resArray_2 = resArray; _i < resArray_2.length; _i++) {
                var c = resArray_2[_i];
                coachees.push(__WEBPACK_IMPORTED_MODULE_4__model_Coachee__["a" /* Coachee */].parseCoachee(c));
            }
            return coachees;
        });
    };
    CoachCoacheeService.prototype.getCoacheeForId = function (coacheeId, isAdmin) {
        console.log("getCoacheeForId, start request");
        var params = [coacheeId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_COACHEE_FOR_ID, params, isAdmin).map(function (response) {
            console.log("getCoacheeForId, got coachee", response);
            return __WEBPACK_IMPORTED_MODULE_4__model_Coachee__["a" /* Coachee */].parseCoachee(response.json());
        }, function (error) {
            console.log("getCoacheeForId, error", error);
        });
    };
    /* HR endpoints */
    CoachCoacheeService.prototype.getRhs = function (isAdmin) {
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_HRS, null, isAdmin).map(function (res) {
            var resArray = res.json();
            var hrs = new Array();
            for (var _i = 0, resArray_3 = resArray; _i < resArray_3.length; _i++) {
                var c = resArray_3[_i];
                hrs.push(__WEBPACK_IMPORTED_MODULE_5__model_HR__["a" /* HR */].parseRh(c));
            }
            return hrs;
        });
    };
    CoachCoacheeService.prototype.getRhForId = function (rhId, isAdmin) {
        console.log("getRhForId, start request");
        var params = [rhId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_HR_FOR_ID, params, isAdmin).map(function (response) {
            console.log("getRhForId, got rh", response);
            var rh = __WEBPACK_IMPORTED_MODULE_5__model_HR__["a" /* HR */].parseRh(response.json());
            return rh;
        }, function (error) {
            console.log("getRhForId, error", error);
        });
    };
    CoachCoacheeService.prototype.getAllCoacheesForRh = function (rhId, isAdmin) {
        console.log("getAllCoacheesForRh, start request");
        var params = [rhId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_COACHEES_FOR_HR, params, isAdmin).map(function (response) {
            var json = response.json();
            var coachees = new Array;
            for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
                var jsonCoachee = json_1[_i];
                coachees.push(__WEBPACK_IMPORTED_MODULE_4__model_Coachee__["a" /* Coachee */].parseCoachee(jsonCoachee));
            }
            console.log("getAllCoacheesForRh, coachees : ", coachees);
            return coachees;
        });
    };
    CoachCoacheeService.prototype.getAllPotentialCoacheesForRh = function (rhId, isAdmin) {
        console.log("getAllPotentialCoacheesForRh, start request");
        var params = [rhId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_POTENTIAL_COACHEES_FOR_HR, params, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getAllPotentialCoacheesForRh, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getUsageRate = function (rhId) {
        console.log("getUsageRate, start request");
        var param = [rhId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_USAGE_RATE_FOR_HR, param).map(function (response) {
            var json = response.json();
            console.log("getUsageRate, response json : ", json);
            return json;
        });
    };
    /**
     * Add a new objective to this coachee.
     * @param coacheeId
     * @param rhId
     * @param objective
     */
    CoachCoacheeService.prototype.addObjectiveToCoachee = function (rhId, coacheeId, objective) {
        var param = [rhId, coacheeId];
        var body = {
            "objective": objective
        };
        return this.apiService.post(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].POST_COACHEE_OBJECTIVE, param, body).map(function (response) {
            var json = response.json();
            console.log("POST coachee new objective, response json : ", json);
            return json;
        });
    };
    /* Potentials endpoints */
    CoachCoacheeService.prototype.getPotentialCoachee = function (token) {
        console.log("getPotentialCoachee, start request");
        var param = [token];
        return this.apiService.getPotentialCoachee(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_POTENTIAL_COACHEE_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.getPotentialCoach = function (token) {
        console.log("getPotentialCoach, start request");
        var param = [token];
        return this.apiService.getPotentialCoachee(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_POTENTIAL_COACH_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.getPotentialRh = function (token) {
        console.log("getPotentialRh, start request");
        var param = [token];
        return this.apiService.getPotentialRh(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_POTENTIAL_RH_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.postPotentialCoachee = function (body) {
        console.log("postPotentialCoachee, start request");
        return this.apiService.post(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].POST_POTENTIAL_COACHEE, null, body).map(function (response) {
            var json = response.json();
            console.log("postPotentialCoachee, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getAllNotificationsForUser = function (user) {
        console.log("getAllNotifications, start request");
        var param = [user.id];
        var path = __WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_COACHEE_NOTIFICATIONS;
        if (user instanceof __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */]) {
            path = __WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_COACH_NOTIFICATIONS;
        }
        else if (user instanceof __WEBPACK_IMPORTED_MODULE_5__model_HR__["a" /* HR */]) {
            path = __WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_HR_NOTIFICATIONS;
        }
        return this.apiService.get(path, param).map(function (response) {
            var json = response.json();
            console.log("getAllNotifications, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.readAllNotificationsForUser = function (user) {
        console.log("readAllNotifications, start request");
        var param = [user.id];
        var path = __WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].PUT_COACHEE_NOTIFICATIONS_READ;
        if (user instanceof __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */]) {
            path = __WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].PUT_COACH_NOTIFICATIONS_READ;
        }
        else if (user instanceof __WEBPACK_IMPORTED_MODULE_5__model_HR__["a" /* HR */]) {
            path = __WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].PUT_HR_NOTIFICATIONS_READ;
        }
        return this.apiService.put(path, param, null).map(function (response) {
            console.log("readAllNotifications done");
        }, function (error) {
            console.log('readAllNotifications error', error);
        });
    };
    CoachCoacheeService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */]) === "function" && _a || Object])
    ], CoachCoacheeService);
    return CoachCoacheeService;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/coach_coachee.service.js.map

/***/ }),

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AdminComponent = (function () {
    function AdminComponent(router, adminHttpService) {
        this.router = router;
        this.adminHttpService = adminHttpService;
        this.admin = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    AdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.getAdmin();
    };
    AdminComponent.prototype.getAdmin = function () {
        var _this = this;
        if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
            this.adminHttpService.getAdmin().subscribe(function (admin) {
                console.log('getAdmin, obtained', admin);
                _this.admin.next(admin);
            }, function (error) {
                console.log('getAdmin, error obtained', error);
            });
        }
    };
    AdminComponent.prototype.isOnProfile = function () {
        var admin = new RegExp('/profile');
        return admin.test(this.router.url);
    };
    AdminComponent.prototype.navigateAdminHome = function () {
        console.log("navigateAdminHome");
        this.router.navigate(['/admin']);
    };
    AdminComponent.prototype.navigateToSignup = function () {
        console.log("navigateToSignup");
        this.router.navigate(['admin/signup']);
    };
    AdminComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-admin',
            template: __webpack_require__(690),
            styles: [__webpack_require__(621)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _b || Object])
    ], AdminComponent);
    return AdminComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin.component.js.map

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminCoacheesListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminCoacheesListComponent = (function () {
    function AdminCoacheesListComponent(apiService) {
        this.apiService = apiService;
        this.loading = true;
        this.coachees = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    AdminCoacheesListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    AdminCoacheesListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    AdminCoacheesListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoacheesSub != null) {
            this.getAllCoacheesSub.unsubscribe();
        }
    };
    AdminCoacheesListComponent.prototype.fetchData = function () {
        var _this = this;
        this.loading = true;
        this.getAllCoacheesSub = this.apiService.getCoachees(true).subscribe(function (coachees) {
            console.log('getAllCoachees subscribe, coachees : ', coachees);
            //filter coachee with NO selected coachs
            var notAssociatedCoachees = new Array();
            for (var _i = 0, coachees_1 = coachees; _i < coachees_1.length; _i++) {
                var coachee = coachees_1[_i];
                if (coachee.selectedCoach == null) {
                    notAssociatedCoachees.push(coachee);
                }
            }
            _this.loading = false;
            _this.coachees.next(notAssociatedCoachees);
        });
    };
    AdminCoacheesListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-admin-coachees-list',
            template: __webpack_require__(691),
            styles: [__webpack_require__(622)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _a || Object])
    ], AdminCoacheesListComponent);
    return AdminCoacheesListComponent;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin-coachees-list.component.js.map

/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminCoachsListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminCoachsListComponent = (function () {
    function AdminCoachsListComponent(apiService) {
        this.apiService = apiService;
        this.loading = true;
        this.coachs = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    AdminCoachsListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    AdminCoachsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    AdminCoachsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoachsSub != null) {
            this.getAllCoachsSub.unsubscribe();
        }
    };
    AdminCoachsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.loading = true;
        this.getAllCoachsSub = this.apiService.getAllCoachs(true).subscribe(function (coachs) {
            console.log('getAllCoachs subscribe, coachs : ', coachs);
            _this.loading = false;
            _this.coachs.next(coachs);
        });
    };
    AdminCoachsListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-admin-coachs-list',
            template: __webpack_require__(693),
            styles: [__webpack_require__(624)],
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _a || Object])
    ], AdminCoachsListComponent);
    return AdminCoachsListComponent;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin-coachs-list.component.js.map

/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeAdminComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HomeAdminComponent = (function () {
    function HomeAdminComponent() {
    }
    HomeAdminComponent.prototype.ngOnInit = function () {
    };
    HomeAdminComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-home-admin',
            template: __webpack_require__(695),
            styles: [__webpack_require__(626)]
        }),
        __metadata("design:paramtypes", [])
    ], HomeAdminComponent);
    return HomeAdminComponent;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/home-admin.component.js.map

/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_adminAPI_service__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminPossibleCoachsListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminPossibleCoachsListComponent = (function () {
    function AdminPossibleCoachsListComponent(apiService) {
        this.apiService = apiService;
        this.loading = true;
        this.possibleCoachs = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    AdminPossibleCoachsListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    AdminPossibleCoachsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    AdminPossibleCoachsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllPossibleCoachsSub != null) {
            this.getAllPossibleCoachsSub.unsubscribe();
        }
    };
    AdminPossibleCoachsListComponent.prototype.updateList = function () {
        this.fetchData();
    };
    AdminPossibleCoachsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.loading = true;
        this.getAllPossibleCoachsSub = this.apiService.getPossibleCoachs().subscribe(function (coachs) {
            console.log('getAllPossibleCoachsSub subscribe, coachs : ', coachs);
            _this.loading = false;
            _this.possibleCoachs.next(coachs);
        });
    };
    AdminPossibleCoachsListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-admin-possible-coachs-list',
            template: __webpack_require__(696),
            styles: [__webpack_require__(627)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _a || Object])
    ], AdminPossibleCoachsListComponent);
    return AdminPossibleCoachsListComponent;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin-possible-coachs-list.component.js.map

/***/ }),

/***/ 232:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminRhsListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminRhsListComponent = (function () {
    function AdminRhsListComponent(apiService) {
        this.apiService = apiService;
        this.loading = true;
        this.rhs = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    AdminRhsListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    AdminRhsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    AdminRhsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllrhsSub != null) {
            this.getAllrhsSub.unsubscribe();
        }
    };
    AdminRhsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.loading = true;
        this.getAllrhsSub = this.apiService.getRhs(true)
            .subscribe(function (rhs) {
            console.log('getAllrhsSub subscribe, rhs : ', rhs);
            _this.loading = false;
            _this.rhs.next(rhs);
        });
    };
    AdminRhsListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-admin-rhs-list',
            template: __webpack_require__(698),
            styles: [__webpack_require__(629)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _a || Object])
    ], AdminRhsListComponent);
    return AdminRhsListComponent;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin-rhs-list.component.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_firebase_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngx_cookie__ = __webpack_require__(72);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = (function () {
    function AppComponent(firebaseService, cookieService) {
        this.firebaseService = firebaseService;
        this.cookieService = cookieService;
        this.showCookiesMessage = false;
        console.log("AppComponent ctr, env : ", __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */]);
        firebaseService.init();
    }
    AppComponent.prototype.ngOnInit = function () {
        // Cookie Headband
        this.showCookiesMessage = this.cookieService.get('ACCEPTS_COOKIES') === undefined;
    };
    AppComponent.prototype.hideCookieHeadband = function () {
        $('#cookie_headband').fadeOut();
        this.cookieService.put('ACCEPTS_COOKIES', 'true');
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-root',
            template: __webpack_require__(700)
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_firebase_service__["a" /* FirebaseService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_firebase_service__["a" /* FirebaseService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3_ngx_cookie__["b" /* CookieService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_ngx_cookie__["b" /* CookieService */]) === "function" && _b || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app.component.js.map

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Message; });
var Message = (function () {
    function Message(name, text, photoUrl, imageUrl) {
        this.name = name;
        this.text = text;
        this.photoUrl = photoUrl;
        this.imageUrl = imageUrl;
    }
    return Message;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/message.js.map

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var DashboardComponent = (function () {
    function DashboardComponent(authService, cd) {
        this.authService = authService;
        this.cd = cd;
        this.user = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    DashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    DashboardComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.getConnectedUser();
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    DashboardComponent.prototype.getConnectedUser = function () {
        var _this = this;
        this.connectedUserSubscription = this.authService.getConnectedUserObservable()
            .subscribe(function (user) {
            console.log('getConnectedUser, user', user);
            _this.onUserObtained(user);
            _this.cd.detectChanges();
        });
    };
    DashboardComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        // if (user) {
        this.user.next(user);
        // }
    };
    DashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-dashboard',
            template: __webpack_require__(705),
            styles: [__webpack_require__(635)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object])
    ], DashboardComponent);
    return DashboardComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/dashboard.component.js.map

/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CookiePolicyComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CookiePolicyComponent = (function () {
    function CookiePolicyComponent() {
    }
    CookiePolicyComponent.prototype.ngOnInit = function () {
    };
    CookiePolicyComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-cookie-policy',
            template: __webpack_require__(711),
            styles: [__webpack_require__(641)]
        }),
        __metadata("design:paramtypes", [])
    ], CookiePolicyComponent);
    return CookiePolicyComponent;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/cookie-policy.component.js.map

/***/ }),

/***/ 237:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LegalNoticeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LegalNoticeComponent = (function () {
    function LegalNoticeComponent() {
    }
    LegalNoticeComponent.prototype.ngOnInit = function () {
    };
    LegalNoticeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-legal-notice',
            template: __webpack_require__(712),
            styles: [__webpack_require__(642)]
        }),
        __metadata("design:paramtypes", [])
    ], LegalNoticeComponent);
    return LegalNoticeComponent;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/legal-notice.component.js.map

/***/ }),

/***/ 238:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TermsOfUseComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TermsOfUseComponent = (function () {
    function TermsOfUseComponent() {
    }
    TermsOfUseComponent.prototype.ngOnInit = function () {
    };
    TermsOfUseComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-terms-of-use',
            template: __webpack_require__(713),
            styles: [__webpack_require__(643)]
        }),
        __metadata("design:paramtypes", [])
    ], TermsOfUseComponent);
    return TermsOfUseComponent;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/terms-of-use.component.js.map

/***/ }),

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CodeDeontologieComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CodeDeontologieComponent = (function () {
    function CodeDeontologieComponent(router) {
        this.router = router;
    }
    CodeDeontologieComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    CodeDeontologieComponent.prototype.goToCoachRegister = function () {
        this.router.navigate(['/register_coach/step1']);
    };
    CodeDeontologieComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-code-deontologie',
            template: __webpack_require__(715),
            styles: [__webpack_require__(645)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object])
    ], CodeDeontologieComponent);
    return CodeDeontologieComponent;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/code-deontologie.component.js.map

/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__environments_environment__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ngx_cookie__ = __webpack_require__(72);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterCoachFormComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var RegisterCoachFormComponent = (function () {
    function RegisterCoachFormComponent(formBuilder, authService, router, cookieService) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.cookieService = cookieService;
        this.onRegisterLoading = false;
        this.hasSavedValues = false;
    }
    RegisterCoachFormComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        if (!this.hasAcceptedConditions()) {
            this.router.navigate(['register_coach/step1']);
        }
        this.registerForm = this.formBuilder.group({
            email: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
            firstname: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            lastname: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            avatar_url: [''],
            linkedin_url: [''],
            description: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            phoneNumber: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            lang1: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            lang2: [''],
            lang3: [''],
            career: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            degree: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            extraActivities: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            coachingExperience: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            remoteCoachingExperience: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            experienceShortSession: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            coachingSpecifics: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            supervision: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            therapyElements: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            ca1: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            ca2: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            ca3: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            percentageCoachingInRevenue: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            legalStatus: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            invoice_entity: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            invoice_siret_number: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            invoice_address: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            invoice_postcode: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            invoice_city: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            insurance_document: ['']
        });
        this.getSavedFormValues();
    };
    RegisterCoachFormComponent.prototype.hasAcceptedConditions = function () {
        var cookie = this.cookieService.get('COACH_REGISTER_CONDITIONS_ACCEPTED');
        console.log('Coach register conditions accepted, ', cookie);
        if (cookie !== null && cookie !== undefined) {
            return true;
        }
    };
    // private hasSavedFormValues() {
    //   let cookie = this.cookieService.get('COACH_REGISTER_FORM_VALUES');
    //   console.log('hasSavedFormValues, ', cookie);
    //   if (cookie !== null && cookie !== undefined) {
    //     this.hasSavedValues = true;
    //   }
    // }
    RegisterCoachFormComponent.prototype.getSavedFormValues = function () {
        var cookie = this.cookieService.getObject('COACH_REGISTER_FORM_VALUES');
        console.log("getSavedFormValues", cookie);
        if (cookie !== null && cookie !== undefined) {
            this.registerForm = this.formBuilder.group({
                email: [cookie['email'], [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
                firstname: [cookie['firstname'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                lastname: [cookie['lastname'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                avatar: [cookie['avatar']],
                linkedin_url: [cookie['linkedin_url']],
                description: [cookie['description'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                phoneNumber: [cookie['phoneNumber'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                lang1: [cookie['lang1'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                lang2: [cookie['lang2']],
                lang3: [cookie['lang3']],
                career: [cookie['career'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                degree: [cookie['degree'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                extraActivities: [cookie['extraActivities'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                coachingExperience: [cookie['coachingExperience'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                remoteCoachingExperience: [cookie['remoteCoachingExperience'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                experienceShortSession: [cookie['experienceShortSession'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                coachingSpecifics: [cookie['coachingSpecifics'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                supervision: [cookie['supervision'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                therapyElements: [cookie['therapyElements'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                ca1: [cookie['ca1'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                ca2: [cookie['ca2'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                ca3: [cookie['ca3'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                percentageCoachingInRevenue: [cookie['percentageCoachingInRevenue']],
                legalStatus: [cookie['legalStatus'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                invoice_entity: [cookie['invoice_entity'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                invoice_siret_number: [cookie['invoice_siret_number'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                invoice_address: [cookie['invoice_address'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                invoice_postcode: [cookie['invoice_postcode'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                invoice_city: [cookie['invoice_city'], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                insurance_document: [cookie['insurance_document']]
            });
        }
    };
    RegisterCoachFormComponent.prototype.saveFormValues = function () {
        var date = (new Date());
        date.setFullYear(2030);
        if (this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
            this.cookieService.putObject('COACH_REGISTER_FORM_VALUES', this.registerForm.value, { expires: date.toDateString() });
    };
    RegisterCoachFormComponent.prototype.filePreview = function (event, type) {
        console.log('filePreview', event.target.files[0]);
        if (type === 'avatar') {
            this.avatarUrl = event.target.files[0];
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        }
        if (type === 'insurance') {
            this.insuranceUrl = event.target.files[0];
        }
    };
    RegisterCoachFormComponent.prototype.onRegister = function () {
        var _this = this;
        console.log('onRegister');
        this.onRegisterLoading = true;
        return this.updatePossibleCoach().flatMap(function (res) {
            console.log("onRegister, userCreated");
            return _this.updatePossibleCoachPicture();
        }).flatMap(function (res) {
            console.log("onRegister upadateinsurance");
            return _this.updatePossibleCoachinsuranceDoc();
        }).subscribe(function (res) {
            console.log("onRegister success", res);
            Materialize.toast('Votre candidature a été envoyée !', 3000, 'rounded');
            _this.onRegisterLoading = false;
            if (_this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
                _this.cookieService.put('COACH_REGISTER_FORM_SENT', 'true');
            _this.router.navigate(['register_coach/step3']);
        }, function (error) {
            console.log('onRegister error', error);
            Materialize.toast('Impossible de soumettre votre candidature', 3000, 'rounded');
            _this.onRegisterLoading = false;
        });
    };
    RegisterCoachFormComponent.prototype.displayAutoCompleteButton = function () {
        return !__WEBPACK_IMPORTED_MODULE_6__environments_environment__["a" /* environment */].production;
    };
    /**
     * Complete the form with fake values
     */
    RegisterCoachFormComponent.prototype.autoCompleteForm = function () {
        console.log('autoCompleteForm');
        this.getSavedFormValues();
    };
    RegisterCoachFormComponent.prototype.updatePossibleCoach = function () {
        console.log('updatePossibleCoach');
        var body = {
            'email': this.registerForm.value.email,
            'first_name': this.registerForm.value.firstname,
            'last_name': this.registerForm.value.lastname,
            'description': this.registerForm.value.description,
            'mobile_phone_number': this.registerForm.value.phoneNumber,
            'languages': this.registerForm.value.lang1 + "_" + this.registerForm.value.lang2 + "_" + this.registerForm.value.lang3,
            'linkedin_url': this.registerForm.value.linkedin_url,
            'career': this.registerForm.value.career,
            'extraActivities': this.registerForm.value.extraActivities,
            'degree': this.registerForm.value.degree,
            'experience_coaching': this.registerForm.value.coachingExperience,
            'experience_remote_coaching': this.registerForm.value.remoteCoachingExperience,
            'experienceShortSession': this.registerForm.value.experienceShortSession,
            'coachingSpecifics': this.registerForm.value.coachingSpecifics,
            'supervisor': this.registerForm.value.supervision,
            'therapyElements': this.registerForm.value.therapyElements,
            'legal_status': this.registerForm.value.legalStatus,
            'revenues_last_3_years': this.registerForm.value.ca1 + "_" + this.registerForm.value.ca2 + "_" + this.registerForm.value.ca2,
            'percentage_coaching_in_revenue': this.registerForm.value.percentageCoachingInRevenue,
            'invoice_entity': this.registerForm.value.invoice_entity,
            'invoice_siret_number': this.registerForm.value.invoice_siret_number,
            'invoice_address': this.registerForm.value.invoice_address,
            'invoice_city': this.registerForm.value.invoice_city,
            'invoice_postcode': this.registerForm.value.invoice_postcode,
        };
        var params = [];
        return this.authService.putNotAuth(__WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */].UPDATE_POSSIBLE_COACH, params, body).map(function (response) {
            var res = response.json();
            console.log('updatePossibleCoach success', res);
            return res;
        }, function (error) {
            console.log('updatePossibleCoach error', error);
        });
    };
    RegisterCoachFormComponent.prototype.updatePossibleCoachPicture = function () {
        console.log('updatePossibleCoachPicture');
        if (this.avatarUrl !== undefined) {
            var formData = new FormData();
            formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);
            formData.append('email', this.registerForm.value.email);
            var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_http__["c" /* Headers */]();
            headers.append('Accept', 'application/json');
            var params = [];
            return this.authService.putNotAuth(__WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */].UPDATE_POSSIBLE_COACH_PICTURE, params, formData, { headers: headers }).map(function (response) {
                var res = response.json();
                console.log('updatePossibleCoachPicture success', res);
                return res;
            }, function (error) {
                console.log('updatePossibleCoachPicture error', error);
            });
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(null);
        }
    };
    RegisterCoachFormComponent.prototype.updatePossibleCoachinsuranceDoc = function () {
        console.log('updatePossibleCoachinsuranceDoc');
        if (this.insuranceUrl !== undefined) {
            var formData = new FormData();
            formData.append('uploadFile', this.insuranceUrl, this.insuranceUrl.name);
            formData.append('email', this.registerForm.value.email);
            var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_http__["c" /* Headers */]();
            headers.append('Accept', 'application/json');
            var params = [];
            return this.authService.putNotAuth(__WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */].UPDATE_POSSIBLE_COACH_INSURANCE_DOC, params, formData, { headers: headers }).map(function (response) {
                var res = response.json();
                console.log('updatePossibleCoachinsuranceDoc success', res);
                return res;
            }, function (error) {
                console.log('updatePossibleCoachinsuranceDoc error', error);
            });
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(null);
        }
    };
    RegisterCoachFormComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-register-coach-form',
            template: __webpack_require__(716),
            styles: [__webpack_require__(646)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_7_ngx_cookie__["b" /* CookieService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7_ngx_cookie__["b" /* CookieService */]) === "function" && _d || Object])
    ], RegisterCoachFormComponent);
    return RegisterCoachFormComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/register-coach-form.component.js.map

/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ngx_cookie__ = __webpack_require__(72);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterCoachMessageComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RegisterCoachMessageComponent = (function () {
    function RegisterCoachMessageComponent(router, cookieService) {
        this.router = router;
        this.cookieService = cookieService;
    }
    RegisterCoachMessageComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        if (!this.isRegistered()) {
            this.router.navigate(['register_coach/step2']);
        }
    };
    RegisterCoachMessageComponent.prototype.goToWelcomePage = function () {
        // Clean cookies
        this.cookieService.remove('COACH_REGISTER_CONDITIONS_ACCEPTED');
        this.cookieService.remove('COACH_REGISTER_FORM_SENT');
        this.router.navigate(['/welcome']);
    };
    RegisterCoachMessageComponent.prototype.isRegistered = function () {
        var cookie = this.cookieService.get('COACH_REGISTER_FORM_SENT');
        console.log('Coach register form sent, ', cookie);
        if (cookie !== null && cookie !== undefined) {
            return true;
        }
    };
    RegisterCoachMessageComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-register-coach-message',
            template: __webpack_require__(717),
            styles: [__webpack_require__(647)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2_ngx_cookie__["b" /* CookieService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ngx_cookie__["b" /* CookieService */]) === "function" && _b || Object])
    ], RegisterCoachMessageComponent);
    return RegisterCoachMessageComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/register-coach-message.component.js.map

/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ngx_cookie__ = __webpack_require__(72);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RegisterCoachComponent = (function () {
    function RegisterCoachComponent(router, cookieService) {
        this.router = router;
        this.cookieService = cookieService;
    }
    RegisterCoachComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    RegisterCoachComponent.prototype.goToDeontologie = function () {
        this.router.navigate(['/register_coach/code_deontologie']);
    };
    RegisterCoachComponent.prototype.goToForm = function () {
        this.router.navigate(['/register_coach/step2']);
    };
    RegisterCoachComponent.prototype.hasAcceptedConditions = function () {
        var cookie = this.cookieService.get('COACH_REGISTER_CONDITIONS_ACCEPTED');
        console.log('Coach register conditions accepted, ', cookie);
        if (cookie !== null && cookie !== undefined) {
            return true;
        }
    };
    RegisterCoachComponent.prototype.setAcceptedConditions = function () {
        console.log('Coach register accept conditions');
        if (this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
            this.cookieService.put('COACH_REGISTER_CONDITIONS_ACCEPTED', 'true');
    };
    RegisterCoachComponent.prototype.deleteAcceptedConditions = function () {
        console.log('Coach register refuse conditions');
        this.cookieService.remove('COACH_REGISTER_CONDITIONS_ACCEPTED');
    };
    RegisterCoachComponent.prototype.toggleAcceptedConditions = function () {
        if (this.hasAcceptedConditions())
            this.deleteAcceptedConditions();
        else
            this.setAcceptedConditions();
    };
    RegisterCoachComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-register-coach',
            template: __webpack_require__(718),
            styles: [__webpack_require__(648)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2_ngx_cookie__["b" /* CookieService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ngx_cookie__["b" /* CookieService */]) === "function" && _b || Object])
    ], RegisterCoachComponent);
    return RegisterCoachComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/register-coach.component.js.map

/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_firebase_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_PromiseObservable__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_PromiseObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_observable_PromiseObservable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_Utils__ = __webpack_require__(57);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SigninComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SigninComponent = (function () {
    function SigninComponent(formBuilder, authService, router, firebase) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.firebase = firebase;
        this.error = false;
        this.loginLoading = false;
    }
    SigninComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.signInForm = this.formBuilder.group({
            email: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].pattern(__WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].EMAIL_REGEX)]],
            password: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
        });
    };
    SigninComponent.prototype.onSignIn = function () {
        var _this = this;
        ga('send', 'event', {
            eventCategory: 'signin',
            eventLabel: 'start',
            eventAction: 'click',
        });
        // Activate spinner loader
        this.loginLoading = true;
        // reset errors
        this.error = false;
        this.errorMessage = '';
        this.authService.signIn(this.signInForm.value)
            .subscribe(function (user) {
            ga('send', 'event', {
                eventCategory: 'signin',
                eventLabel: 'success|userId:' + user.id,
                eventAction: 'api response',
            });
            console.log('onSignIn, user obtained', user);
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/dashboard']);
            // Materialize.toast('Bonjour ' + user.first_name + ' !', 3000, 'rounded');
            _this.loginLoading = false;
        }, function (error) {
            ga('send', 'event', {
                eventCategory: 'signin',
                eventLabel: 'error:' + error,
                eventAction: 'api response',
            });
            console.log('onSignIn, error obtained', error);
            Materialize.toast("Le mot de passe ou l'adresse mail est incorrect", 3000, 'rounded');
            _this.loginLoading = false;
            //this.error = true;
            //this.errorMessage = error;
        });
    };
    SigninComponent.prototype.goToSignUp = function () {
        this.router.navigate(['/signup']);
    };
    SigninComponent.prototype.onForgotPasswordClicked = function () {
        console.log('onForgotPasswordClicked');
        this.startForgotPasswordFlow();
    };
    /*************************************
     ----------- Modal control for forgot password ------------
     *************************************/
    SigninComponent.prototype.updateForgotPasswordModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#forgot_password_modal').openModal();
        }
        else {
            $('#forgot_password_modal').closeModal();
        }
    };
    SigninComponent.prototype.startForgotPasswordFlow = function () {
        console.log('startForgotPasswordFlow');
        this.updateForgotPasswordModalVisibility(true);
    };
    SigninComponent.prototype.cancelForgotPasswordModal = function () {
        this.updateForgotPasswordModalVisibility(false);
        this.forgotEmail = null;
    };
    SigninComponent.prototype.validateForgotPasswordModal = function () {
        var _this = this;
        console.log('validateForgotPasswordModal');
        // make sure forgotEmail has a value
        var firebaseObs = __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_PromiseObservable__["PromiseObservable"].create(this.firebase.sendPasswordResetEmail(this.forgotEmail));
        firebaseObs.subscribe(function () {
            console.log("sendPasswordResetEmail ");
            Materialize.toast("Email envoyé", 3000, 'rounded');
            _this.cancelForgotPasswordModal();
        }, function (error) {
            /**
             * {code: "auth/invalid-email", message: "The email address is badly formatted."}code: "auth/invalid-email"message: "The email address is badly formatted."__proto__: Error
             *
             * O {code: "auth/user-not-found", message: "There is no user record corresponding to this identifier. The user may have been deleted."}code: "auth/user-not-found"message: "There is no user record corresponding to this identifier. The user may have been deleted."__proto__: Error
             */
            console.log("sendPasswordResetEmail fail reason", error);
            if (error != undefined) {
                if (error.code == "auth/invalid-email") {
                    Materialize.toast("L'email n'est pas correctement formatté", 3000, 'rounded');
                    return;
                }
                else if (error.code == "auth/user-not-found") {
                    Materialize.toast("L'email ne correspond à aucun de nos utilisateurs", 3000, 'rounded');
                    return;
                }
            }
            Materialize.toast("Une erreur est survenue", 3000, 'rounded');
        });
    };
    SigninComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-signin',
            template: __webpack_require__(719),
            styles: [__webpack_require__(649)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__service_firebase_service__["a" /* FirebaseService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_firebase_service__["a" /* FirebaseService */]) === "function" && _d || Object])
    ], SigninComponent);
    return SigninComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signin.component.js.map

/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_adminAPI_service__ = __webpack_require__(65);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupAdminComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignUpType;
(function (SignUpType) {
    SignUpType[SignUpType["COACH"] = 0] = "COACH";
    SignUpType[SignUpType["COACHEE"] = 1] = "COACHEE";
    SignUpType[SignUpType["RH"] = 2] = "RH";
    SignUpType[SignUpType["NULL"] = 3] = "NULL";
})(SignUpType || (SignUpType = {}));
var SignupAdminComponent = (function () {
    /* ----- END Contract Plan ----*/
    function SignupAdminComponent(formBuilder, authService, adminAPIService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.adminAPIService = adminAPIService;
        this.router = router;
        this.signUpSelectedType = SignUpType.RH;
        this.sendLoading = false;
        console.log("constructor");
    }
    SignupAdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        console.log("ngOnInit");
        // this.signUpTypes = [SignUpType.COACH, SignUpType.COACHEE, SignUpType.RH];
        this.signUpTypes = [SignUpType.COACH, SignUpType.RH];
        this.signUpForm = this.formBuilder.group({
            email: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].compose([
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required,
                    this.isEmail
                ])],
            name: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            lastname: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            company: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]
        });
        this.getListOfContractPlans();
    };
    SignupAdminComponent.prototype.onSelectPlan = function (plan) {
        console.log("onSelectPlan, plan ", plan);
        this.mSelectedPlan = plan;
    };
    SignupAdminComponent.prototype.onSignUpSubmitted = function () {
        console.log("onSignUp");
        if (this.signUpSelectedType == SignUpType.COACH) {
            console.log("onSignUp, coach");
            this.createPotentialCoach(this.signUpForm.value.email);
        }
        else if (this.signUpSelectedType == SignUpType.RH) {
            this.createPotentialRh(this.signUpForm.value.email, this.signUpForm.value.name, this.signUpForm.value.lastname, this.signUpForm.value.company);
        }
        else {
            Materialize.toast('Vous devez sélectionner un type', 3000, 'rounded');
        }
    };
    SignupAdminComponent.prototype.createPotentialRh = function (email, name, lastname, company) {
        var _this = this;
        console.log('createPotentialRh');
        this.sendLoading = true;
        var body = {
            "email": email,
            "first_name": name,
            "last_name": lastname,
            "company_name": company
        };
        this.adminAPIService.createPotentialRh(body).subscribe(function (res) {
            console.log('createPotentialRh, res', res);
            Materialize.toast('Collaborateur RH ajouté !', 3000, 'rounded');
            _this.sendLoading = false;
        }, function (error) {
            console.log('createPotentialRh, error', error);
            Materialize.toast("Impossible d'ajouter le RH", 3000, 'rounded');
            _this.sendLoading = false;
        });
    };
    SignupAdminComponent.prototype.createPotentialCoach = function (email) {
        console.log('createPotentialCoach');
        this.adminAPIService.createPotentialCoach(email).subscribe(function (res) {
            console.log('createPotentialCoach, res', res);
            Materialize.toast('Collaborateur Coach ajouté !', 3000, 'rounded');
        }, function (error) {
            console.log('createPotentialCoach, error', error);
            Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
        });
    };
    SignupAdminComponent.prototype.getListOfContractPlans = function () {
        var _this = this;
        this.authService.getNotAuth(__WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */].GET_CONTRACT_PLANS, null).subscribe(function (response) {
            var json = response.json();
            console.log("getListOfContractPlans, response json : ", json);
            _this.plans = __WEBPACK_IMPORTED_MODULE_4_rxjs__["Observable"].of(json);
            // this.cd.detectChanges();
        });
    };
    SignupAdminComponent.prototype.isEmail = function (control) {
        if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
            console.log("email NOT ok");
            // this.test = false
            return { noEmail: true };
        }
        // this.test = true
        console.log("email ok");
    };
    SignupAdminComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    SignupAdminComponent.prototype.getSignUpTypeName = function (type) {
        switch (type) {
            case SignUpType.COACH:
                return "Coach";
            case SignUpType.COACHEE:
                return "Coaché";
            case SignUpType.RH:
                return "RH";
        }
    };
    SignupAdminComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-signup',
            template: __webpack_require__(720),
            styles: [__webpack_require__(650)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_5__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _d || Object])
    ], SignupAdminComponent);
    return SignupAdminComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signup-admin.component.js.map

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignupCoachComponent = (function () {
    function SignupCoachComponent(formBuilder, authService, coachCoacheeService, router, route) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.router = router;
        this.route = route;
        this.error = false;
        this.errorMessage = "";
        console.log("constructor");
    }
    SignupCoachComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        console.log("ngOnInit");
        // meetingId should be in the router
        this.route.queryParams.subscribe(function (params) {
            var token = params['token'];
            console.log("ngOnInit, param token", token);
            _this.coachCoacheeService.getPotentialCoach(token).subscribe(function (coach) {
                console.log("getPotentialCoach, data obtained", coach);
                _this.potentialCoachObs = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(coach);
                _this.potentialCoach = coach;
            }, function (error) {
                console.log("getPotentialCoach, error obtained", error);
            });
        });
        this.signUpForm = this.formBuilder.group({
            password: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].minLength(6)
                ])
            ],
            confirmPassword: ['',
                [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required,
                    this.isEqualPassword.bind(this)]
            ],
        });
    };
    SignupCoachComponent.prototype.onSignUpSubmitted = function () {
        var _this = this;
        console.log("onSignUp");
        //reset errors
        this.error = false;
        this.errorMessage = '';
        console.log("onSignUp, coachee");
        var user = this.signUpForm.value;
        user.email = this.potentialCoach.email;
        this.authService.signUpCoach(user).subscribe(function (data) {
            console.log("onSignUp, data obtained", data);
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/dashboard']);
        }, function (error) {
            console.log("onSignUp, error obtained", error);
            _this.error = true;
            _this.errorMessage = error;
        });
    };
    SignupCoachComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    SignupCoachComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-signup-coach',
            template: __webpack_require__(721),
            styles: [__webpack_require__(651)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */]) === "function" && _e || Object])
    ], SignupCoachComponent);
    return SignupCoachComponent;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signup-coach.component.js.map

/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupCoacheeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignupCoacheeComponent = (function () {
    /* ----- END Contract Plan ----*/
    function SignupCoacheeComponent(formBuilder, authService, coachCoacheeService, router, route) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.router = router;
        this.route = route;
        this.error = false;
        this.errorMessage = "";
        console.log("constructor");
    }
    SignupCoacheeComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        console.log("ngOnInit");
        // meetingId should be in the router
        this.route.queryParams.subscribe(function (params) {
            var token = params['token'];
            console.log("ngOnInit, param token", token);
            _this.coachCoacheeService.getPotentialCoachee(token).subscribe(function (coachee) {
                //TODO use this potential coachee
                console.log("getPotentialCoachee, data obtained", coachee);
                _this.potentialCoacheeObs = __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(coachee);
                _this.potentialCoachee = coachee;
            }, function (error) {
                console.log("getPotentialCoachee, error obtained", error);
            });
        });
        this.signUpForm = this.formBuilder.group({
            password: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].compose([
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required,
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].minLength(6)
                ])
            ],
            confirmPassword: ['',
                [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required,
                    this.isEqualPassword.bind(this)]
            ],
        });
    };
    SignupCoacheeComponent.prototype.onSignUpSubmitted = function () {
        var _this = this;
        console.log("onSignUp");
        //reset errors
        this.error = false;
        this.errorMessage = '';
        console.log("onSignUp, coachee");
        var user = this.signUpForm.value;
        user.email = this.potentialCoachee.email;
        user.contractPlanId = this.potentialCoachee.plan.plan_id;
        this.authService.signUpCoachee(user).subscribe(function (data) {
            console.log("onSignUp, data obtained", data);
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/dashboard']);
        }, function (error) {
            console.log("onSignUp, error obtained", error);
            _this.error = true;
            _this.errorMessage = error;
        });
    };
    SignupCoacheeComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    SignupCoacheeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-signup-coachee',
            template: __webpack_require__(722),
            styles: [__webpack_require__(652)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["f" /* ActivatedRoute */]) === "function" && _e || Object])
    ], SignupCoacheeComponent);
    return SignupCoacheeComponent;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signup-coachee.component.js.map

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupRhComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignupRhComponent = (function () {
    function SignupRhComponent(formBuilder, authService, coachCoacheeService, router, route) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.router = router;
        this.route = route;
        this.sendLoading = false;
        console.log("constructor");
    }
    SignupRhComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        console.log("ngOnInit");
        // meetingId should be in the router
        this.route.queryParams.subscribe(function (params) {
            var token = params['token'];
            console.log("ngOnInit, param token", token);
            _this.coachCoacheeService.getPotentialRh(token).subscribe(function (rh) {
                console.log("getPotentialRh, data obtained", rh);
                _this.potentialRhObs = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(rh);
                _this.potentialRh = rh;
            }, function (error) {
                console.log("getPotentialRh, error obtained", error);
            });
        });
        this.signUpForm = this.formBuilder.group({
            password: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].minLength(6)
                ])
            ],
            confirmPassword: ['',
                [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required,
                    this.isEqualPassword.bind(this)]
            ],
        });
    };
    SignupRhComponent.prototype.onSignUpSubmitted = function () {
        var _this = this;
        console.log("onSignUp");
        this.sendLoading = true;
        console.log("onSignUp, rh");
        var user = this.signUpForm.value;
        user.email = this.potentialRh.email;
        this.authService.signUpRh(user).subscribe(function (data) {
            console.log("onSignUp, data obtained", data);
            _this.sendLoading = false;
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/dashboard']);
            Materialize.toast('Inscription terminée !', 3000, 'rounded');
        }, function (error) {
            console.log("onSignUp, error obtained", error);
            _this.sendLoading = false;
            Materialize.toast('Impossible de finaliser votre inscription', 3000, 'rounded');
            if (error.code == 'auth/email-already-in-use') {
                Materialize.toast("L'adresse mail est déjà utilisée par un autre compte", 3000, 'rounded');
            }
        });
    };
    SignupRhComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    SignupRhComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-signup-rh',
            template: __webpack_require__(723),
            styles: [__webpack_require__(653)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */]) === "function" && _e || Object])
    ], SignupRhComponent);
    return SignupRhComponent;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signup-rh.component.js.map

/***/ }),

/***/ 248:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_MeetingDate__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_Utils__ = __webpack_require__(57);
/* unused harmony export I18n */
/* unused harmony export CustomDatepickerI18n */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingDateComponent; });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var I18N_VALUES = {
    'fr': {
        weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
        months: __WEBPACK_IMPORTED_MODULE_7__utils_Utils__["a" /* Utils */].months
    }
    // other languages you would support
};
// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
var I18n = (function () {
    function I18n() {
        this.language = 'fr';
    }
    I18n = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], I18n);
    return I18n;
}());

// Define custom service providing the months and weekdays translations
var CustomDatepickerI18n = (function (_super) {
    __extends(CustomDatepickerI18n, _super);
    function CustomDatepickerI18n(_i18n) {
        var _this = _super.call(this) || this;
        _this._i18n = _i18n;
        return _this;
    }
    CustomDatepickerI18n.prototype.getWeekdayShortName = function (weekday) {
        return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
    };
    CustomDatepickerI18n.prototype.getMonthShortName = function (month) {
        return I18N_VALUES[this._i18n.language].months[month - 1];
    };
    CustomDatepickerI18n.prototype.getMonthFullName = function (month) {
        return this.getMonthShortName(month);
    };
    CustomDatepickerI18n = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [I18n])
    ], CustomDatepickerI18n);
    return CustomDatepickerI18n;
}(__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbDatepickerI18n */]));

var MeetingDateComponent = (function () {
    function MeetingDateComponent(router, route, meetingService, authService, cd) {
        this.router = router;
        this.route = route;
        this.meetingService = meetingService;
        this.authService = authService;
        this.cd = cd;
        this.loading = false;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        this.days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        this.now = new Date();
        this.dateModel = null;
        this.timeRange = [10, 18];
        this.isEditingPotentialDate = false;
        this.potentialDatesArray = new Array();
    }
    MeetingDateComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        console.log("MeetingDateComponent onInit");
        // meetingId should be in the router
        this.route.params.subscribe(function (params) {
            _this.meetingId = params['meetingId'];
            console.log("route param, meetingId : " + _this.meetingId);
            if (_this.meetingId != undefined) {
                _this.loadMeetingPotentialTimes(_this.meetingId);
            }
        });
        var user = this.authService.getConnectedUser();
        if (user) {
            this.onConnectedUserReceived(user);
        }
        else {
            this.subscriptionConnectUser = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('ngOnInit, sub received user', user);
                _this.onConnectedUserReceived(user);
            });
        }
    };
    MeetingDateComponent.prototype.onConnectedUserReceived = function (user) {
        this.connectedUser = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(user);
        this.cd.detectChanges();
    };
    MeetingDateComponent.prototype.bookOrUpdateADate = function () {
        console.log('bookADate, dateModel : ', this.dateModel);
        var minDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[0], 0);
        var maxDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[1], 0);
        if (this.isEditingPotentialDate) {
            this.mEditingPotentialTime.start_date = minDate.valueOf();
            this.mEditingPotentialTime.end_date = maxDate.valueOf();
            this.potentialDates = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(this.potentialDatesArray);
            this.cd.detectChanges();
            //reset progress bar values
            this.resetValues();
            Materialize.toast('Plage modifiée !', 3000, 'rounded');
        }
        else {
            var dateToSave = new __WEBPACK_IMPORTED_MODULE_4__model_MeetingDate__["a" /* MeetingDate */]();
            dateToSave.start_date = minDate.valueOf();
            dateToSave.end_date = maxDate.valueOf();
            this.addPotentialDate(dateToSave);
        }
    };
    MeetingDateComponent.prototype.unbookAdate = function (meetingDate) {
        this.potentialDatesArray.splice(this.potentialDatesArray.indexOf(meetingDate), 1);
        this.potentialDates = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(this.potentialDatesArray);
        this.cd.detectChanges();
    };
    MeetingDateComponent.prototype.modifyPotentialDate = function (meetingDate) {
        console.log('modifyPotentialDate, meetingDate', meetingDate);
        //switch to edit mode
        this.isEditingPotentialDate = true;
        this.mEditingPotentialTime = meetingDate;
        // position time selector
        var startTime = __WEBPACK_IMPORTED_MODULE_7__utils_Utils__["a" /* Utils */].getHoursFromTimestamp(meetingDate.start_date);
        var endTime = __WEBPACK_IMPORTED_MODULE_7__utils_Utils__["a" /* Utils */].getHoursFromTimestamp(meetingDate.end_date);
        this.updateTimeSelector(startTime, endTime);
        // correctly position the date on the calendar
        this.dateModel = __WEBPACK_IMPORTED_MODULE_7__utils_Utils__["a" /* Utils */].timestampToNgbDate(meetingDate.start_date);
    };
    MeetingDateComponent.prototype.updateTimeSelector = function (minHour, maxHour) {
        this.timeRange = [minHour, maxHour];
    };
    MeetingDateComponent.prototype.resetValues = function () {
        this.mEditingPotentialTime = null;
        this.isEditingPotentialDate = false;
        this.updateTimeSelector(10, 18);
    };
    MeetingDateComponent.prototype.getHoursAndMinutesFromTimestamp = function (timestamp) {
        return __WEBPACK_IMPORTED_MODULE_7__utils_Utils__["a" /* Utils */].getHoursAndMinutesFromTimestamp(timestamp);
    };
    MeetingDateComponent.prototype.timeIntToString = function (hour) {
        return __WEBPACK_IMPORTED_MODULE_7__utils_Utils__["a" /* Utils */].timeIntToString(hour);
    };
    MeetingDateComponent.prototype.timestampToString = function (timestamp) {
        return __WEBPACK_IMPORTED_MODULE_7__utils_Utils__["a" /* Utils */].timestampToString(timestamp);
    };
    MeetingDateComponent.prototype.ngbDateToString = function (date) {
        return __WEBPACK_IMPORTED_MODULE_7__utils_Utils__["a" /* Utils */].ngbDateToString(date);
    };
    MeetingDateComponent.prototype.timestampToNgbDateStruct = function (timestamp) {
        return __WEBPACK_IMPORTED_MODULE_7__utils_Utils__["a" /* Utils */].timestampToNgbDate(timestamp);
    };
    MeetingDateComponent.prototype.compareDates = function (date1, date2) {
        return (date1.year === date2.year) && (date1.month === date2.month) && (date1.day === date2.day);
    };
    MeetingDateComponent.prototype.hasPotentialDate = function (date) {
        for (var i in this.potentialDatesArray) {
            if (this.compareDates(this.timestampToNgbDateStruct(this.potentialDatesArray[i].start_date), date)) {
                return true;
            }
        }
        return false;
    };
    MeetingDateComponent.prototype.isDisabled = function (date, current) {
        var now = new Date();
        var newDate = new Date(date.year, date.month - 1, date.day);
        // TODO add this to block next month days
        // TODO date.month !== current.month ||
        return (newDate.getDay() === 6
            || newDate.getDay() === 0
            || date.year < now.getFullYear()
            || (date.month < now.getMonth() + 1 && date.year <= now.getFullYear())
            || (date.year <= now.getFullYear() && date.month === now.getMonth() + 1 && date.day < now.getDate())
            || (date.year === now.getFullYear() && date.month === now.getMonth() + 1 && date.day < now.getDate() + 3));
    };
    /**
     * Fetch from API potential times for the given meeting id.
     * @param meetingId
     */
    MeetingDateComponent.prototype.loadMeetingPotentialTimes = function (meetingId) {
        var _this = this;
        this.meetingService.getMeetingPotentialTimes(meetingId).subscribe(function (dates) {
            console.log('loadMeetingPotentialTimes : ', dates);
            if (dates != null) {
                //clear array
                _this.potentialDatesArray = new Array();
                //add received dates
                (_a = _this.potentialDatesArray).push.apply(_a, dates);
            }
            _this.potentialDates = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(dates);
            _this.cd.detectChanges();
            var _a;
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingDateComponent.prototype.addPotentialDate = function (date) {
        //add received dates
        this.potentialDatesArray.push(date);
        this.potentialDates = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(this.potentialDatesArray);
        this.cd.detectChanges();
        Materialize.toast('Plage ajoutée !', 3000, 'rounded');
    };
    /* Call this method to check if all required params are correctly set. */
    MeetingDateComponent.prototype.canFinish = function () {
        var canFinish = this.meetingGoal != null
            && this.meetingContext != null
            && this.potentialDatesArray.length > 2;
        return canFinish;
    };
    /* Save the different dates and set goal and context.
     * Navigate to the list of meetings */
    MeetingDateComponent.prototype.finish = function () {
        var _this = this;
        console.log('finish, meetingGoal : ', this.meetingGoal);
        console.log('finish, meetingContext : ', this.meetingContext);
        this.loading = true;
        // create or update meeting
        // save GOAL and CONTEXT
        // save meeting dates
        this.connectedUser
            .take(1)
            .flatMap(function (user) {
            if (_this.meetingId != null) {
                return _this.meetingService
                    .updateMeeting(user.id, _this.meetingId, _this.meetingContext, _this.meetingGoal, _this.potentialDatesArray);
            }
            else {
                return _this.meetingService
                    .createMeeting(user.id, _this.meetingContext, _this.meetingGoal, _this.potentialDatesArray);
            }
        })
            .flatMap(function (meeting) {
            return _this.authService.refreshConnectedUserAsObservable();
        })
            .subscribe(function (user) {
            _this.router.navigate(['/meetings']);
            _this.loading = false;
            Materialize.toast('Vos disponibilités on été enregitrées !', 3000, 'rounded');
            _this.router.navigate(['dashboard/meetings']);
        }, function (error) {
            console.log('getOrCreateMeeting error', error);
            _this.loading = false;
            Materialize.toast("Impossible d'enregistrer vos disponibilités", 3000, 'rounded');
        });
    };
    MeetingDateComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionConnectUser) {
            this.subscriptionConnectUser.unsubscribe();
        }
    };
    //callback when "goal" for this meeting has changed
    MeetingDateComponent.prototype.onGoalValueUpdated = function (goal) {
        console.log('onGoalUpdated goal', goal);
        this.meetingGoal = goal;
    };
    //callback when "context" for this meeting has changed
    MeetingDateComponent.prototype.onContextValueUpdated = function (context) {
        console.log('onContextValueUpdated context', context);
        this.meetingContext = context;
    };
    MeetingDateComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-meeting-date',
            template: __webpack_require__(724),
            styles: [__webpack_require__(654)],
            providers: [I18n, { provide: __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbDatepickerI18n */], useClass: CustomDatepickerI18n }] // define custom NgbDatepickerI18n provider
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_6__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _e || Object])
    ], MeetingDateComponent);
    return MeetingDateComponent;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-date.component.js.map

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_Coach__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__model_MeetingDate__ = __webpack_require__(91);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AvailableMeetingsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var AvailableMeetingsComponent = (function () {
    function AvailableMeetingsComponent(authService, meetingService, cd, router) {
        this.authService = authService;
        this.meetingService = meetingService;
        this.cd = cd;
        this.router = router;
        this.hasAvailableMeetings = false;
        this.loading = true;
    }
    AvailableMeetingsComponent.prototype.ngOnInit = function () {
    };
    AvailableMeetingsComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.loading = true;
        this.getConnectedUser();
    };
    AvailableMeetingsComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy');
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
        if (this.getAllMeetingsSubscription) {
            this.getAllMeetingsSubscription.unsubscribe();
        }
    };
    AvailableMeetingsComponent.prototype.getConnectedUser = function () {
        var _this = this;
        this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser');
            _this.onUserObtained(user);
        });
    };
    AvailableMeetingsComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.user = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(user);
            if (user instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coach__["a" /* Coach */]) {
                // coach
                console.log('get a coach');
                this.getAllMeetings();
            }
        }
    };
    AvailableMeetingsComponent.prototype.getAllMeetings = function () {
        var _this = this;
        this.getAllMeetingsSubscription = this.meetingService.getAvailableMeetings().subscribe(function (meetings) {
            console.log('got getAllMeetings', meetings);
            _this.availableMeetings = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(meetings);
            _this.hasAvailableMeetings = (meetings != null && meetings.length > 0);
            _this.loading = false;
            _this.cd.detectChanges();
        });
    };
    AvailableMeetingsComponent.prototype.confirmPotentialDate = function (meetingId) {
        var _this = this;
        console.log('confirmPotentialDate : ', meetingId);
        var minDate = new Date(this.selectedDate);
        minDate.setHours(this.selectedHour);
        var maxDate = new Date(this.selectedDate);
        maxDate.setHours(this.selectedHour + 1);
        var timestampMin = +minDate.valueOf();
        var timestampMax = +maxDate.valueOf();
        var newDate = new __WEBPACK_IMPORTED_MODULE_6__model_MeetingDate__["a" /* MeetingDate */]();
        newDate.start_date = timestampMin;
        newDate.end_date = timestampMax;
        // create new date TODO :date could be set directly
        return this.meetingService.addPotentialDateToMeeting(meetingId, newDate)
            .flatMap(function (meetingDate) {
            console.log('test, onSubmitValidateMeeting 3');
            console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
            // validate date
            return _this.meetingService.setFinalDateToMeeting(meetingId, meetingDate.id);
        });
    };
    AvailableMeetingsComponent.prototype.onSubmitValidateMeeting = function () {
        var _this = this;
        console.log('onSubmitValidateMeeting');
        this.user
            .take(1)
            .flatMap(function (user) {
            console.log('test, onSubmitValidateMeeting 1');
            return _this.meetingService.associateCoachToMeeting(_this.selectedMeeting.id, user.id);
        }).flatMap(function (meeting) {
            console.log('on meeting associated : ', meeting);
            console.log('test, onSubmitValidateMeeting 2');
            return _this.confirmPotentialDate(meeting.id);
        }).subscribe(function (meeting) {
            console.log('on meeting associated : ', meeting);
            console.log('test, onSubmitValidateMeeting 4');
            _this.coachValidateModalVisibility(false);
            //navigate to dashboard
            _this.router.navigate(['dashboard/meetings']);
            _this.cd.detectChanges();
        }, function (error) {
            console.log('get potentials dates error', error);
            Materialize.toast('Erreur lors de la validation du meeting', 3000, 'rounded');
        });
    };
    AvailableMeetingsComponent.prototype.coachValidateModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coach_cancel_meeting').openModal();
        }
        else {
            $('#coach_cancel_meeting').closeModal();
        }
    };
    AvailableMeetingsComponent.prototype.openCoachValidateMeetingModal = function ($event) {
        this.selectedMeeting = $event.meeting;
        this.selectedDate = $event.selectedDate;
        this.selectedHour = $event.selectedHour;
        this.coachValidateModalVisibility(true);
    };
    AvailableMeetingsComponent.prototype.cancelCoachValidateMeeting = function () {
        this.coachValidateModalVisibility(false);
    };
    AvailableMeetingsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-available-meetings',
            template: __webpack_require__(726),
            styles: [__webpack_require__(656)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_meetings_service__["a" /* MeetingsService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _d || Object])
    ], AvailableMeetingsComponent);
    return AvailableMeetingsComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/available-meetings.component.js.map

/***/ }),

/***/ 250:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_Coach__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_HR__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MeetingListComponent = (function () {
    function MeetingListComponent(authService, cd) {
        this.authService = authService;
        this.cd = cd;
        this.user = new __WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    MeetingListComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.getConnectedUser();
    };
    MeetingListComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    MeetingListComponent.prototype.getConnectedUser = function () {
        var _this = this;
        console.log('onRefreshRequested');
        this.connectedUserSubscription = this.authService.getConnectedUserObservable()
            .subscribe(function (user) {
            _this.onUserObtained(user);
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.onUserObtained = function (user) {
        console.log('toto, onUserObtained, user : ', user);
        // if (user) {
        this.user.next(user);
        // }
    };
    MeetingListComponent.prototype.isUserACoach = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_2__model_Coach__["a" /* Coach */];
    };
    MeetingListComponent.prototype.isUserACoachee = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_3__model_Coachee__["a" /* Coachee */];
    };
    MeetingListComponent.prototype.isUserARh = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_4__model_HR__["a" /* HR */];
    };
    MeetingListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-meeting-list',
            template: __webpack_require__(731),
            styles: [__webpack_require__(661)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object])
    ], MeetingListComponent);
    return MeetingListComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-list.component.js.map

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingListRhComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MeetingListRhComponent = (function () {
    function MeetingListRhComponent(coachCoacheeService, cd) {
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.loading1 = true;
        this.loading2 = true;
        this.isAdmin = false;
        this.onStartAddNewObjectiveFlow = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.hasCollaborators = false;
        this.hasPotentialCollaborators = false;
    }
    MeetingListRhComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('ngOnInit');
        this.loading1 = true;
        this.loading2 = true;
        this.userSubscription = this.user.subscribe(function (user) {
            _this.onUserObtained(user);
        });
    };
    MeetingListRhComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoacheesForRhSubscription)
            this.getAllCoacheesForRhSubscription.unsubscribe();
        if (this.getAllPotentialCoacheesForRhSubscription)
            this.getAllPotentialCoacheesForRhSubscription.unsubscribe();
        if (this.userSubscription)
            this.userSubscription.unsubscribe();
    };
    MeetingListRhComponent.prototype.startAddNewObjectiveFlow = function (coacheeId) {
        this.onStartAddNewObjectiveFlow.emit(coacheeId);
    };
    // call from parent
    MeetingListRhComponent.prototype.onNewObjectifAdded = function () {
        var _this = this;
        console.log('onNewObjectifAdded');
        this.user.first().subscribe(function (user) {
            _this.onUserObtained(user);
        });
    };
    MeetingListRhComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            // rh
            console.log('get a rh');
            this.getAllCoacheesForRh(user.id);
            this.getAllPotentialCoacheesForRh(user.id);
            //this.getAllContractPlans();
        }
    };
    MeetingListRhComponent.prototype.getAllCoacheesForRh = function (rhId) {
        var _this = this;
        this.getAllCoacheesForRhSubscription = this.coachCoacheeService.getAllCoacheesForRh(rhId, this.isAdmin)
            .subscribe(function (coachees) {
            console.log('got coachees for rh', coachees);
            _this.coachees = __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(coachees);
            if (coachees !== null && coachees.length > 0)
                _this.hasCollaborators = true;
            _this.cd.detectChanges();
            _this.loading1 = false;
        });
    };
    MeetingListRhComponent.prototype.getAllPotentialCoacheesForRh = function (rhId) {
        var _this = this;
        this.getAllPotentialCoacheesForRhSubscription = this.coachCoacheeService.getAllPotentialCoacheesForRh(rhId, this.isAdmin)
            .subscribe(function (coachees) {
            console.log('got potentialCoachees for rh', coachees);
            _this.potentialCoachees = __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(coachees);
            if (coachees !== null && coachees.length > 0)
                _this.hasPotentialCollaborators = true;
            _this.cd.detectChanges();
            _this.loading2 = false;
        });
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"]) === "function" && _a || Object)
    ], MeetingListRhComponent.prototype, "user", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], MeetingListRhComponent.prototype, "isAdmin", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], MeetingListRhComponent.prototype, "onStartAddNewObjectiveFlow", void 0);
    MeetingListRhComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-meeting-list-rh',
            template: __webpack_require__(733),
            styles: [__webpack_require__(663)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object])
    ], MeetingListRhComponent);
    return MeetingListRhComponent;
    var _a, _b, _c;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-list-rh.component.js.map

/***/ }),

/***/ 252:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PotentialCoachee; });
/**
 * Created by guillaume on 18/05/2017.
 */
var PotentialCoachee = (function () {
    function PotentialCoachee(id) {
        this.id = id;
    }
    PotentialCoachee.parsePotentialCoachee = function (json) {
        var potentialCoachee = new PotentialCoachee(json.id);
        potentialCoachee.email = json.email;
        potentialCoachee.start_date = json.create_date;
        potentialCoachee.plan = json.plan;
        return potentialCoachee;
    };
    return PotentialCoachee;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/PotentialCoachee.js.map

/***/ }),

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__session_service__ = __webpack_require__(92);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = (function () {
    function AuthGuard(authService, sessionService) {
        this.authService = authService;
        this.sessionService = sessionService;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.canActivateChild = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        //if (this.authService.isAuthenticated() && cookie) { return true; }
        if (this.sessionService.isSessionActive()) {
            this.sessionService.saveSessionTTL();
            return true;
        }
        // Pas de session active, on redirige vers welcome
        this.authService.loginOut();
        return false;
    };
    AuthGuard = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__session_service__["a" /* SessionService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__session_service__["a" /* SessionService */]) === "function" && _b || Object])
    ], AuthGuard);
    return AuthGuard;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/auth-guard.service.js.map

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__session_service__ = __webpack_require__(92);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotAuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NotAuthGuard = (function () {
    function NotAuthGuard(router, sessionService) {
        this.router = router;
        this.sessionService = sessionService;
    }
    NotAuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    NotAuthGuard.prototype.checkLogin = function (url) {
        // if (this.authService.isAuthenticated()) { return true; }
        if (!this.sessionService.isSessionActive()) {
            return true;
        }
        // Une session est active, on redirige vers le dashboard
        this.router.navigate(['dashboard']);
        return false;
    };
    NotAuthGuard = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__session_service__["a" /* SessionService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__session_service__["a" /* SessionService */]) === "function" && _b || Object])
    ], NotAuthGuard);
    return NotAuthGuard;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/not-auth-guard.js.map

/***/ }),

/***/ 255:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileCoachAdminComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ProfileCoachAdminComponent = (function () {
    function ProfileCoachAdminComponent(apiService, cd, route) {
        this.apiService = apiService;
        this.cd = cd;
        this.route = route;
        this.loading = true;
        this.avatarLoading = false;
        this.coach = new __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    ProfileCoachAdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.getCoach();
    };
    ProfileCoachAdminComponent.prototype.ngAfterViewInit = function () {
        console.log("afterViewInit");
        // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
    };
    ProfileCoachAdminComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoach) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoach.unsubscribe();
        }
        if (this.subscriptionGetRoute) {
            console.log("Unsubscribe route");
            this.subscriptionGetRoute.unsubscribe();
        }
    };
    ProfileCoachAdminComponent.prototype.getCoach = function () {
        var _this = this;
        this.subscriptionGetCoach = this.route.params.subscribe(function (params) {
            var coachId = params['id'];
            _this.subscriptionGetCoach = _this.apiService.getCoachForId(coachId, true).subscribe(function (coach) {
                console.log("gotCoach", coach);
                _this.coach.next(coach);
                _this.loading = false;
            });
        });
    };
    ProfileCoachAdminComponent.prototype.previewPicture = function (event) {
        console.log('filePreview', event.target.files[0]);
        this.avatarFile = event.target.files[0];
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    ProfileCoachAdminComponent.prototype.uploadAvatarPicture = function () {
        var _this = this;
        if (this.avatarFile !== null && this.avatarFile !== undefined) {
            console.log("Upload avatar");
            this.avatarLoading = true;
            this.coach.asObservable().last().flatMap(function (coach) {
                return _this.apiService.updateCoachProfilePicture(coach.id, _this.avatarFile);
            }).subscribe(function (res) {
                // refresh page
                console.log("Upload avatar, DONE, res : " + res);
                _this.avatarLoading = false;
                window.location.reload();
            }, function (error) {
                Materialize.toast('Impossible de modifier votre photo', 3000, 'rounded');
                _this.avatarLoading = false;
            });
        }
    };
    ProfileCoachAdminComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-profile-coach-admin',
            template: __webpack_require__(734),
            styles: [__webpack_require__(664)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* ActivatedRoute */]) === "function" && _c || Object])
    ], ProfileCoachAdminComponent);
    return ProfileCoachAdminComponent;
    var _a, _b, _c;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-coach-admin.component.js.map

/***/ }),

/***/ 256:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_Coach__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_http__ = __webpack_require__(49);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ProfileCoachComponent = (function () {
    function ProfileCoachComponent(authService, cd, formBuilder, coachService, route) {
        this.authService = authService;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.route = route;
        this.isOwner = false;
        this.updateUserLoading = false;
        this.loading = true;
    }
    ProfileCoachComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.formCoach = this.formBuilder.group({
            firstName: ['', __WEBPACK_IMPORTED_MODULE_6__angular_forms__["Validators"].required],
            lastName: ['', __WEBPACK_IMPORTED_MODULE_6__angular_forms__["Validators"].required],
            description: ['', __WEBPACK_IMPORTED_MODULE_6__angular_forms__["Validators"].required],
        });
        this.getCoachAndUser();
    };
    ProfileCoachComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoach) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoach.unsubscribe();
        }
        if (this.subscriptionGetRoute) {
            console.log("Unsubscribe route");
            this.subscriptionGetRoute.unsubscribe();
        }
    };
    ProfileCoachComponent.prototype.getCoachAndUser = function () {
        var _this = this;
        console.log("getCoach");
        this.subscriptionGetRoute = this.route.params.subscribe(function (params) {
            var coachId = params['id'];
            _this.subscriptionGetCoach = _this.coachService.getCoachForId(coachId).subscribe(function (coach) {
                console.log("gotCoach", coach);
                _this.setFormValues(coach);
                _this.mcoach = coach;
                _this.coach = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(coach);
                console.log("getUser");
                var user = _this.authService.getConnectedUser();
                _this.isOwner = (user instanceof __WEBPACK_IMPORTED_MODULE_3__model_Coach__["a" /* Coach */]) && (coach.email === user.email);
                _this.cd.detectChanges();
                _this.loading = false;
            }, function (error) {
                console.log('getCoach, error', error);
            });
        });
    };
    ProfileCoachComponent.prototype.setFormValues = function (coach) {
        this.formCoach.setValue({
            firstName: coach.first_name,
            lastName: coach.last_name,
            description: coach.description
        });
    };
    ProfileCoachComponent.prototype.submitCoachProfilUpdate = function () {
        var _this = this;
        console.log("submitCoachProfilUpdate");
        this.updateUserLoading = true;
        this.coach.last().flatMap(function (coach) {
            console.log("submitCoachProfilUpdate, coach obtained");
            return _this.authService.updateCoachForId(coach.id, _this.formCoach.value.firstName, _this.formCoach.value.lastName, _this.formCoach.value.description, _this.mcoach.avatar_url);
        }).flatMap(function (coach) {
            console.log('Upload user success', coach);
            if (_this.avatarUrl !== null && _this.avatarUrl !== undefined) {
                console.log("Upload avatar");
                var params = [_this.mcoach.id];
                var formData = new FormData();
                formData.append('uploadFile', _this.avatarUrl, _this.avatarUrl.name);
                var headers = new __WEBPACK_IMPORTED_MODULE_7__angular_http__["c" /* Headers */]();
                headers.append('Accept', 'application/json');
                //todo call coachCoacheeAPIservice
                return _this.authService.put(__WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */].PUT_COACH_PROFILE_PICT, params, formData, { headers: headers })
                    .map(function (res) { return res.json(); })
                    .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].throw(error); });
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(coach);
            }
        }).subscribe(function (coach) {
            console.log('Upload avatar success', coach);
            _this.updateUserLoading = false;
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            //refresh page
            setTimeout('', 1000);
            // window.location.reload();
        }, function (error) {
            console.log('Upload avatar error', error);
            _this.updateUserLoading = false;
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileCoachComponent.prototype.filePreview = function (event) {
        if (event.target.files && event.target.files[0]) {
            this.avatarUrl = event.target.files[0];
            console.log("filePreview", this.avatarUrl);
            var reader = new FileReader();
            reader.onload = function (e) {
                // $('#avatar-preview').attr('src', e.target.result);
                $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    ProfileCoachComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-profile-coach',
            template: __webpack_require__(735),
            styles: [__webpack_require__(665)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_6__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__angular_forms__["FormBuilder"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["f" /* ActivatedRoute */]) === "function" && _e || Object])
    ], ProfileCoachComponent);
    return ProfileCoachComponent;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-coach.component.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileCoacheeAdminComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ProfileCoacheeAdminComponent = (function () {
    function ProfileCoacheeAdminComponent(router, cd, apiService, route) {
        this.router = router;
        this.cd = cd;
        this.apiService = apiService;
        this.route = route;
        this.loading = true;
        this.coachee = new __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    ProfileCoacheeAdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.getCoachee();
    };
    ProfileCoacheeAdminComponent.prototype.ngAfterViewInit = function () {
    };
    ProfileCoacheeAdminComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoachee) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoachee.unsubscribe();
        }
        if (this.subscriptionGetRoute) {
            console.log("Unsubscribe route");
            this.subscriptionGetRoute.unsubscribe();
        }
    };
    ProfileCoacheeAdminComponent.prototype.getCoachee = function () {
        var _this = this;
        this.subscriptionGetRoute = this.route.params.subscribe(function (params) {
            var coacheeId = params['id'];
            _this.subscriptionGetCoachee = _this.apiService.getCoacheeForId(coacheeId, true).subscribe(function (coachee) {
                console.log("gotCoachee", coachee);
                _this.coachee.next(coachee);
                _this.rhId = coachee.associatedRh.id;
                // this.cd.detectChanges();
                _this.loading = false;
            });
        });
    };
    ProfileCoacheeAdminComponent.prototype.goToRhProfile = function () {
        this.router.navigate(['admin/profile/rh', this.rhId]);
    };
    ProfileCoacheeAdminComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-profile-coachee-admin',
            template: __webpack_require__(736),
            styles: [__webpack_require__(666)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* ActivatedRoute */]) === "function" && _d || Object])
    ], ProfileCoacheeAdminComponent);
    return ProfileCoacheeAdminComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-coachee-admin.component.js.map

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_http__ = __webpack_require__(49);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileCoacheeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ProfileCoacheeComponent = (function () {
    function ProfileCoacheeComponent(authService, cd, formBuilder, coachService, route) {
        this.authService = authService;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.route = route;
        this.isOwner = false;
        this.updateUserLoading = false;
        this.loading = true;
    }
    ProfileCoacheeComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit");
        window.scrollTo(0, 0);
        this.loading = true;
        this.formCoachee = this.formBuilder.group({
            firstName: ['', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required],
            lastName: ['', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required],
            avatar: ['', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required]
        });
        this.getCoacheeAndUser();
    };
    ProfileCoacheeComponent.prototype.ngOnDestroy = function () {
        console.log("ngOnDestroy");
        if (this.subscriptionGetCoachee) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoachee.unsubscribe();
        }
        if (this.subscriptionGetRoute) {
            console.log("Unsubscribe subscriptionGetRoute");
            this.subscriptionGetRoute.unsubscribe();
        }
    };
    ProfileCoacheeComponent.prototype.getCoacheeAndUser = function () {
        var _this = this;
        this.subscriptionGetRoute = this.route.params.subscribe(function (params) {
            var coacheeId = params['id'];
            _this.subscriptionGetCoachee = _this.coachService.getCoacheeForId(coacheeId).subscribe(function (coachee) {
                console.log("gotCoachee", coachee);
                _this.setFormValues(coachee);
                _this.coachee = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(coachee);
                console.log("getUser");
                var user = _this.authService.getConnectedUser();
                _this.isOwner = (user instanceof __WEBPACK_IMPORTED_MODULE_2__model_Coachee__["a" /* Coachee */]) && (coachee.email === user.email);
                _this.cd.detectChanges();
                _this.loading = false;
            });
        });
    };
    ProfileCoacheeComponent.prototype.setFormValues = function (coachee) {
        this.formCoachee.setValue({
            firstName: coachee.first_name,
            lastName: coachee.last_name,
            avatar: coachee.avatar_url
        });
    };
    ProfileCoacheeComponent.prototype.submitCoacheeProfilUpdate = function () {
        var _this = this;
        console.log("submitCoacheeProfilUpdate");
        this.updateUserLoading = true;
        this.coachee.last().flatMap(function (coachee) {
            console.log("submitCoacheeProfilUpdate, coachee obtained");
            return _this.authService.updateCoacheeForId(coachee.id, _this.formCoachee.value.firstName, _this.formCoachee.value.lastName, _this.formCoachee.value.avatar);
        }).flatMap(function (coachee) {
            console.log('Upload user success', coachee);
            if (_this.avatarUrl != null && _this.avatarUrl !== undefined) {
                console.log("Upload avatar");
                var params = [coachee.id];
                var formData = new FormData();
                formData.append('uploadFile', _this.avatarUrl, _this.avatarUrl.name);
                var headers = new __WEBPACK_IMPORTED_MODULE_7__angular_http__["c" /* Headers */]();
                headers.append('Accept', 'application/json');
                return _this.authService.put(__WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */].PUT_COACHEE_PROFILE_PICT, params, formData, { headers: headers })
                    .map(function (res) { return res.json(); })
                    .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].throw(error); });
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(coachee);
            }
        }).subscribe(function (coachee) {
            console.log('Upload avatar success', coachee);
            _this.updateUserLoading = false;
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            //refresh page
            setTimeout('', 1000);
            // window.location.reload();
        }, function (error) {
            console.log('Upload avatar error', error);
            _this.updateUserLoading = false;
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileCoacheeComponent.prototype.filePreview = function (event) {
        if (event.target.files && event.target.files[0]) {
            this.avatarUrl = event.target.files[0];
            console.log("filePreview", this.avatarUrl);
            var reader = new FileReader();
            reader.onload = function (e) {
                // $('#avatar-preview').attr('src', e.target.result);
                $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    ProfileCoacheeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-profile-coachee',
            template: __webpack_require__(737),
            styles: [__webpack_require__(667)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormBuilder"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_6__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */]) === "function" && _e || Object])
    ], ProfileCoacheeComponent);
    return ProfileCoacheeComponent;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-coachee.component.js.map

/***/ }),

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePossibleCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ProfilePossibleCoachComponent = (function () {
    function ProfilePossibleCoachComponent(apiService, router, cd, route) {
        this.apiService = apiService;
        this.router = router;
        this.cd = cd;
        this.route = route;
        this.loading = true;
    }
    ProfilePossibleCoachComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.getCoach();
    };
    ProfilePossibleCoachComponent.prototype.getCoach = function () {
        var _this = this;
        console.log("getCoach");
        this.subscriptionGetCoach = this.route.params.subscribe(function (params) {
            var coachId = params['id'];
            _this.apiService.getPossibleCoach(coachId).subscribe(function (possibleCoach) {
                console.log("getPossibleCoach", possibleCoach);
                _this.possibleCoach = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(possibleCoach);
                _this.cd.detectChanges();
                _this.loading = false;
            }, function (error) {
                console.log('getCoach, error', error);
                _this.loading = false;
            });
        });
    };
    ProfilePossibleCoachComponent.prototype.ngAfterViewInit = function () {
        console.log("afterViewInit");
        // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
    };
    ProfilePossibleCoachComponent.prototype.sendInvite = function () {
        var _this = this;
        this.possibleCoach.take(1).subscribe(function (coach) {
            var email = coach.email;
            console.log('sendInvite, email', email);
            _this.apiService.createPotentialCoach(email).subscribe(function (res) {
                console.log('createPotentialCoach, res', res);
                _this.getCoach();
                Materialize.toast('Invitation envoyée au Coach !', 3000, 'rounded');
            }, function (error) {
                console.log('createPotentialCoach, error', error);
                Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
            });
        });
    };
    ProfilePossibleCoachComponent.prototype.goToPossibleCoachsAdmin = function () {
        this.router.navigate(['admin/possible_coachs-list']);
    };
    ProfilePossibleCoachComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoach) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoach.unsubscribe();
        }
    };
    ProfilePossibleCoachComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-possible-coach',
            template: __webpack_require__(738),
            styles: [__webpack_require__(668)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* ActivatedRoute */]) === "function" && _d || Object])
    ], ProfilePossibleCoachComponent);
    return ProfilePossibleCoachComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-possible-coach.component.js.map

/***/ }),

/***/ 260:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileRhAdminComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ProfileRhAdminComponent = (function () {
    function ProfileRhAdminComponent(route, apiService) {
        this.route = route;
        this.apiService = apiService;
        this.loading = true;
        this.rh = new __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    ProfileRhAdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.getRh();
    };
    ProfileRhAdminComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetRh) {
            console.log("Unsubscribe rh");
            this.subscriptionGetRh.unsubscribe();
        }
        if (this.subscriptionGetRoute) {
            console.log("Unsubscribe route");
            this.subscriptionGetRoute.unsubscribe();
        }
    };
    ProfileRhAdminComponent.prototype.getRh = function () {
        var _this = this;
        console.log("getRh");
        this.subscriptionGetRoute = this.route.params.subscribe(function (params) {
            var rhId = params['id'];
            _this.subscriptionGetRh = _this.apiService.getRhForId(rhId, true).subscribe(function (rh) {
                console.log("gotRh", rh);
                _this.rh.next(rh);
                // this.cd.detectChanges();
                _this.loading = false;
            }, function (error) {
                console.log('getRh, error', error);
                _this.loading = false;
            });
        });
    };
    ProfileRhAdminComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-profile-rh-admin',
            template: __webpack_require__(740),
            styles: [__webpack_require__(670)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* ActivatedRoute */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _b || Object])
    ], ProfileRhAdminComponent);
    return ProfileRhAdminComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-rh-admin.component.js.map

/***/ }),

/***/ 261:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_HR__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_BehaviorSubject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileRhComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ProfileRhComponent = (function () {
    function ProfileRhComponent(authService, formBuilder, route, coachService) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.route = route;
        this.coachService = coachService;
        this.isOwner = false;
        this.updateUserLoading = false;
        this.loading = true;
        this.rhObs = new __WEBPACK_IMPORTED_MODULE_8_rxjs_BehaviorSubject__["BehaviorSubject"](null);
    }
    ProfileRhComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.formRh = this.formBuilder.group({
            firstName: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            lastName: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
            description: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]
        });
        this.getRhAndUser();
    };
    ProfileRhComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetRh) {
            console.log("Unsubscribe rh");
            this.subscriptionGetRh.unsubscribe();
        }
        if (this.subscriptionGetRoute) {
            console.log("Unsubscribe user");
            this.subscriptionGetRoute.unsubscribe();
        }
    };
    ProfileRhComponent.prototype.getRhAndUser = function () {
        var _this = this;
        console.log("getRh");
        this.subscriptionGetRoute = this.route.params.subscribe(function (params) {
            var rhId = params['id'];
            _this.subscriptionGetRh = _this.coachService.getRhForId(rhId).subscribe(function (rh) {
                console.log("gotRh", rh);
                _this.setFormValues(rh);
                console.log("getUser");
                var user = _this.authService.getConnectedUser();
                _this.isOwner = (user instanceof __WEBPACK_IMPORTED_MODULE_3__model_HR__["a" /* HR */]) && (rh.email === user.email);
                // this.cd.detectChanges();
                _this.loading = false;
                _this.rhObs.next(rh);
            }, function (error) {
                console.log('getRh, error', error);
                _this.loading = false;
            });
        });
    };
    ProfileRhComponent.prototype.setFormValues = function (rh) {
        this.formRh.setValue({
            firstName: rh.first_name,
            lastName: rh.last_name,
            description: rh.description,
        });
    };
    ProfileRhComponent.prototype.submitRhProfilUpdate = function () {
        var _this = this;
        console.log("submitRhProfilUpdate");
        this.updateUserLoading = true;
        this.rhObs.asObservable().take(1).flatMap(function (rh) {
            console.log("submitRhProfilUpdate, rh obtained");
            return _this.authService.updateRhForId(rh.id, _this.formRh.value.firstName, _this.formRh.value.lastName, _this.formRh.value.description, rh.avatar_url);
        }).flatMap(function (rh) {
            if (_this.avatarUrl != null && _this.avatarUrl !== undefined) {
                console.log("Upload avatar");
                var params = [rh.id];
                var formData = new FormData();
                formData.append('uploadFile', _this.avatarUrl, _this.avatarUrl.name);
                var headers = new __WEBPACK_IMPORTED_MODULE_7__angular_http__["c" /* Headers */]();
                headers.append('Accept', 'application/json');
                return _this.authService.put(__WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */].PUT_HR_PROFILE_PICT, params, formData, { headers: headers })
                    .map(function (res) { return res.json(); })
                    .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error); });
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(rh);
            }
        }).subscribe(function (rh) {
            console.log('Upload avatar success', rh);
            _this.updateUserLoading = false;
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            //refresh page
            setTimeout('', 1000);
            // window.location.reload();
        }, function (error) {
            console.log('rh update, error', error);
            _this.updateUserLoading = false;
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileRhComponent.prototype.filePreview = function (event) {
        if (event.target.files && event.target.files[0]) {
            this.avatarUrl = event.target.files[0];
            console.log("filePreview", this.avatarUrl);
            var reader = new FileReader();
            reader.onload = function (e) {
                // $('#avatar-preview').attr('src', e.target.result);
                $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    ProfileRhComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-profile-rh',
            template: __webpack_require__(741),
            styles: [__webpack_require__(671)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_6__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _d || Object])
    ], ProfileRhComponent);
    return ProfileRhComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-rh.component.js.map

/***/ }),

/***/ 262:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ngx_cookie__ = __webpack_require__(72);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WelcomeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var WelcomeComponent = (function () {
    function WelcomeComponent(authService, router, formBuilder, cookieService) {
        this.authService = authService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.cookieService = cookieService;
    }
    WelcomeComponent.prototype.ngOnInit = function () {
        // Clean cookies
        this.cookieService.remove('COACH_REGISTER_CONDITIONS_ACCEPTED');
        this.cookieService.remove('COACH_REGISTER_FORM_SENT');
        this.contactForm = this.formBuilder.group({
            name: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            mail: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            message: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required]],
        });
    };
    WelcomeComponent.prototype.ngOnDestroy = function () {
    };
    /**
     * Start API request to contact Eritis
     */
    WelcomeComponent.prototype.onContactSubmit = function () {
        var _this = this;
        var body = {
            name: this.contactForm.value.name,
            email: this.contactForm.value.mail,
            message: this.contactForm.value.message
        };
        console.log("onContactSubmit, values : ", this.contactForm);
        console.log("onContactSubmit, values : ", this.contactForm.value);
        this.authService.postNotAuth("v1/contact", null, body).subscribe(function (res) {
            console.log("contact, response json : ", res);
            Materialize.toast('Votre demande de contact a bien été envoyée', 4000);
            _this.contactForm.value.name = "";
            _this.contactForm.value.mail = "";
            _this.contactForm.value.message = "";
        }, function (error) {
            Materialize.toast('Une erreur est survenue', 4000);
        });
    };
    WelcomeComponent.prototype.goToCoachRegister = function () {
        this.router.navigate(['/register_coach/step1']);
    };
    WelcomeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-welcome',
            template: __webpack_require__(742),
            styles: [__webpack_require__(672)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4_ngx_cookie__["b" /* CookieService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4_ngx_cookie__["b" /* CookieService */]) === "function" && _d || Object])
    ], WelcomeComponent);
    return WelcomeComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/welcome.component.js.map

/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "eritis-mountain-bg-2.cbc21344ba5faf2ce1c2.jpg";

/***/ }),

/***/ 367:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 367;


/***/ }),

/***/ 368:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(409);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(376);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app___ = __webpack_require__(395);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app___["a" /* AppModule */]);
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/main.js.map

/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Meeting__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_MeetingDate__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__model_MeetingReview__ = __webpack_require__(403);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingsService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MeetingsService = (function () {
    function MeetingsService(apiService) {
        this.apiService = apiService;
    }
    MeetingsService.prototype.getAllMeetingsForCoacheeId = function (coacheeId, isAdmin) {
        console.log("getAllMeetingsForCoacheeId, coacheeId : ", coacheeId);
        var param = [coacheeId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_MEETINGS_FOR_COACHEE_ID, param, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getAllMeetingsForCoacheeId, response json : ", json);
            var res = response.json();
            var meetings = new Array();
            for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                var meeting = res_1[_i];
                meetings.push(__WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */].parseFromBE(meeting));
            }
            return meetings;
        });
    };
    MeetingsService.prototype.getAllMeetingsForCoachId = function (coachId, isAdmin) {
        console.log("getAllMeetingsForCoachId, coachId : ", coachId);
        var param = [coachId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_MEETINGS_FOR_COACH_ID, param, isAdmin)
            .map(function (response) {
            console.log("getAllMeetingsForCoachId, response : ", response);
            var res = response.json();
            var meetings = new Array();
            for (var _i = 0, res_2 = res; _i < res_2.length; _i++) {
                var meeting = res_2[_i];
                if (meeting != null) {
                    meetings.push(__WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */].parseFromBE(meeting));
                }
            }
            return meetings;
        });
    };
    /**
     * Create a meeting for the given Coachee
     * @param coacheeId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.createMeeting = function (coacheeId, context, goal, dates) {
        console.log("createMeeting coacheeId %s", coacheeId); //todo check if userId ok
        var body = this.getUpdateOrCreateMeetingRequestBody(coacheeId, context, goal, dates);
        return this.apiService.post(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].POST_MEETING, null, body).map(function (response) {
            var meeting = __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */].parseFromBE(response.json());
            console.log("createMeeting, response json : ", meeting);
            return meeting;
        });
    };
    /**
     * Update a meeting
     * @param coacheeId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.updateMeeting = function (coacheeId, meetingId, context, goal, dates) {
        console.log("updateMeeting coacheeId %s", coacheeId); //todo check if userId ok
        var body = this.getUpdateOrCreateMeetingRequestBody(coacheeId, context, goal, dates);
        var param = [meetingId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].PUT_MEETING, param, body).map(function (response) {
            var meeting = __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */].parseFromBE(response.json());
            console.log("updateMeeting, response json : ", meeting);
            return meeting;
        });
    };
    /**
     * Delete a meeting
     * @returns {Observable<Response>}
     */
    MeetingsService.prototype.deleteMeeting = function (meetingId) {
        var param = [meetingId];
        return this.apiService.delete(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].DELETE_MEETING, param);
    };
    /**
     * Close the given meeting with a comment
     * Only a Coach can close a meeting.
     * @param meetingId
     * @param comment
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.closeMeeting = function (meetingId, result, utility) {
        console.log("closeMeeting, meetingId %s, result : %s, utility : %s", meetingId, result, utility);
        var body = {
            result: result,
            utility: utility,
        };
        var param = [meetingId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].CLOSE_MEETING, param, body).map(function (response) {
            var meeting = __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */].parseFromBE(response.json());
            console.log("closeMeeting, response meeting : ", meeting);
            return meeting;
        });
    };
    /**
     * Add this date as a Potential Date for the given meeting
     * @param meetingId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.addPotentialDateToMeeting = function (meetingId, date) {
        console.log("addPotentialDateToMeeting");
        // convert milliSec to sec ...
        var secDate = {};
        secDate.start_date = date.start_date / 1000;
        secDate.end_date = date.end_date / 1000;
        var body = JSON.stringify(secDate);
        console.log("addPotentialDateToMeeting, body %s", body);
        var param = [meetingId];
        return this.apiService.post(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].POST_MEETING_POTENTIAL_DATE, param, body)
            .map(function (response) {
            var meetingDate = __WEBPACK_IMPORTED_MODULE_4__model_MeetingDate__["a" /* MeetingDate */].parseFromBE(response.json());
            console.log("addPotentialDateToMeeting, response meetingDate : ", meetingDate);
            return meetingDate;
        });
    };
    /**
     * Fetch all potential dates for the given meeting
     * Backend returns dates in Unix time in seconds but but MeetingDate deals with timestamp.
     * @param meetingId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.getMeetingPotentialTimes = function (meetingId, isAdmin) {
        console.log("getMeetingPotentialTimes, meetingId : ", meetingId);
        var param = [meetingId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_MEETING_POTENTIAL_DATES, param, isAdmin).map(function (response) {
            var dates = response.json();
            console.log("getMeetingPotentialTimes, response json : ", dates);
            var datesMilli = new Array();
            for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
                var date = dates_1[_i];
                var dateMilli = __WEBPACK_IMPORTED_MODULE_4__model_MeetingDate__["a" /* MeetingDate */].parseFromBE(date);
                datesMilli.push(dateMilli);
            }
            return datesMilli;
        });
    };
    //get all MeetingReview for context == SESSION_CONTEXT
    MeetingsService.prototype.getMeetingContext = function (meetingId, isAdmin) {
        console.log("getMeetingContext");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_5__model_MeetingReview__["a" /* MEETING_REVIEW_TYPE_SESSION_CONTEXT */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getMeetingContext, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == SESSION_GOAL
    MeetingsService.prototype.getMeetingGoal = function (meetingId, isAdmin) {
        console.log("getMeetingGoal");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_5__model_MeetingReview__["b" /* MEETING_REVIEW_TYPE_SESSION_GOAL */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getMeetingGoal, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RESULT
    MeetingsService.prototype.getSessionReviewResult = function (meetingId, isAdmin) {
        console.log("getSessionReviewResult");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_5__model_MeetingReview__["c" /* MEETING_REVIEW_TYPE_SESSION_RESULT */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewResult, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_UTILITY
    MeetingsService.prototype.getSessionReviewUtility = function (meetingId, isAdmin) {
        console.log("getSessionReviewUtility");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_5__model_MeetingReview__["d" /* MEETING_REVIEW_TYPE_SESSION_UTILITY */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewUtility, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RATE
    MeetingsService.prototype.getSessionReviewRate = function (meetingId, isAdmin) {
        console.log("getSessionReviewRate");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_5__model_MeetingReview__["e" /* MEETING_REVIEW_TYPE_SESSION_RATE */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewRate, response json : ", json);
            return json;
        });
    };
    /**
     * Add a rate for this meeting
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.addSessionRateToMeeting = function (meetingId, rate) {
        console.log("addSessionRateToMeeting, meetingId %s, rate : %s", meetingId, rate);
        var body = {
            type: __WEBPACK_IMPORTED_MODULE_5__model_MeetingReview__["e" /* MEETING_REVIEW_TYPE_SESSION_RATE */],
            value: rate,
        };
        var param = [meetingId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].PUT_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addSessionRateToMeeting, response json : ", json);
            return json;
        });
    };
    MeetingsService.prototype.setFinalDateToMeeting = function (meetingId, potentialDateId) {
        console.log("setFinalDateToMeeting, meetingId %s, potentialId %s", meetingId, potentialDateId);
        var param = [meetingId, potentialDateId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].PUT_FINAL_DATE_TO_MEETING, param, null).map(function (response) {
            var meeting = response.json();
            console.log("setFinalDateToMeeting, response json : ", meeting);
            return meeting;
        });
    };
    /**
     * Fetch all meetings where no coach is associated
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.getAvailableMeetings = function () {
        console.log("getAvailableMeetings");
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_AVAILABLE_MEETINGS, null).map(function (response) {
            var res = response.json();
            var meetings = new Array();
            for (var _i = 0, res_3 = res; _i < res_3.length; _i++) {
                var meeting = res_3[_i];
                meetings.push(__WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */].parseFromBE(meeting));
            }
            console.log("getAvailableMeetings");
            return meetings;
        });
    };
    /**
     * Associated this coach with this meeting
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.associateCoachToMeeting = function (meetingId, coachId) {
        console.log("associateCoachToMeeting");
        var param = [meetingId, coachId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].PUT_COACH_TO_MEETING, param, null).map(function (response) {
            var meeting = __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */].parseFromBE(response.json());
            return meeting;
        });
    };
    MeetingsService.prototype.getUpdateOrCreateMeetingRequestBody = function (coacheeId, context, goal, dates) {
        var contextBody = {
            value: context,
            type: __WEBPACK_IMPORTED_MODULE_5__model_MeetingReview__["a" /* MEETING_REVIEW_TYPE_SESSION_CONTEXT */],
        };
        var goalBody = {
            value: goal,
            type: __WEBPACK_IMPORTED_MODULE_5__model_MeetingReview__["b" /* MEETING_REVIEW_TYPE_SESSION_GOAL */],
        };
        // convert milliSec to sec ...
        var datesInSeconds = new Array();
        for (var _i = 0, dates_2 = dates; _i < dates_2.length; _i++) {
            var date = dates_2[_i];
            var secDate = {};
            secDate.start_date = date.start_date / 1000;
            secDate.end_date = date.end_date / 1000;
            datesInSeconds.push(secDate);
        }
        var body = {
            coacheeId: coacheeId,
            context: contextBody,
            goal: goalBody,
            dates: datesInSeconds
        };
        return JSON.stringify(body);
    };
    MeetingsService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */]) === "function" && _a || Object])
    ], MeetingsService);
    return MeetingsService;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meetings.service.js.map

/***/ }),

/***/ 380:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminCoacheeItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminCoacheeItemComponent = (function () {
    function AdminCoacheeItemComponent(router) {
        this.router = router;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    AdminCoacheeItemComponent.prototype.ngOnInit = function () {
    };
    AdminCoacheeItemComponent.prototype.goToCoacheeProfile = function (coacheeId) {
        window.scrollTo(0, 0);
        console.log("goToCoacheeProfileAdmin, %s", coacheeId);
        this.router.navigate(['admin/profile/coachee', coacheeId]);
    };
    AdminCoacheeItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    AdminCoacheeItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    AdminCoacheeItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    AdminCoacheeItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Coachee__["a" /* Coachee */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Coachee__["a" /* Coachee */]) === "function" && _a || Object)
    ], AdminCoacheeItemComponent.prototype, "coachee", void 0);
    AdminCoacheeItemComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-admin-coachee-item',
            template: __webpack_require__(692),
            styles: [__webpack_require__(623)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === "function" && _b || Object])
    ], AdminCoacheeItemComponent);
    return AdminCoacheeItemComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin-coachee-item.component.js.map

/***/ }),

/***/ 381:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_Coach__ = __webpack_require__(40);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminCoachItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminCoachItemComponent = (function () {
    function AdminCoachItemComponent(router) {
        this.router = router;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    AdminCoachItemComponent.prototype.ngOnInit = function () {
        console.log("AdminCoachItemComponent, ngOnInit : ", this.coach);
    };
    AdminCoachItemComponent.prototype.goToCoachProfile = function (coachId) {
        console.log("goToCoachProfile, %s : ", coachId);
        window.scrollTo(0, 0);
        this.router.navigate(['admin/profile/coach', coachId]);
    };
    AdminCoachItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    AdminCoachItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    AdminCoachItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    AdminCoachItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__model_Coach__["a" /* Coach */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__model_Coach__["a" /* Coach */]) === "function" && _a || Object)
    ], AdminCoachItemComponent.prototype, "coach", void 0);
    AdminCoachItemComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-admin-coach-item',
            template: __webpack_require__(694),
            styles: [__webpack_require__(625)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
    ], AdminCoachItemComponent);
    return AdminCoachItemComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin-coach-item.component.js.map

/***/ }),

/***/ 382:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_PossibleCoach__ = __webpack_require__(404);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminPossibleCoachItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AdminPossibleCoachItemComponent = (function () {
    function AdminPossibleCoachItemComponent(router, apiService) {
        this.router = router;
        this.apiService = apiService;
        this.coachAdded = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    AdminPossibleCoachItemComponent.prototype.ngOnInit = function () {
        console.log("AdminPossibleCoachItemComponent, ngOnInit : ", this.coach);
    };
    AdminPossibleCoachItemComponent.prototype.goToCoachProfile = function (coachId) {
        this.router.navigate(['admin/profile/possible-coach', coachId]);
    };
    AdminPossibleCoachItemComponent.prototype.sendInvite = function (email) {
        var _this = this;
        console.log('sendInvite, email', email);
        this.apiService.createPotentialCoach(email).subscribe(function (res) {
            console.log('createPotentialCoach, res', res);
            _this.coachAdded.emit(null);
            Materialize.toast('Invitation envoyée au Coach !', 3000, 'rounded');
        }, function (error) {
            console.log('createPotentialCoach, error', error);
            Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
        });
    };
    AdminPossibleCoachItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    AdminPossibleCoachItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    AdminPossibleCoachItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    AdminPossibleCoachItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], AdminPossibleCoachItemComponent.prototype, "coachAdded", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__model_PossibleCoach__["a" /* PossibleCoach */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__model_PossibleCoach__["a" /* PossibleCoach */]) === "function" && _a || Object)
    ], AdminPossibleCoachItemComponent.prototype, "coach", void 0);
    AdminPossibleCoachItemComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-admin-possible-coach-item',
            template: __webpack_require__(697),
            styles: [__webpack_require__(628)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _c || Object])
    ], AdminPossibleCoachItemComponent);
    return AdminPossibleCoachItemComponent;
    var _a, _b, _c;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin-possible-coach-item.component.js.map

/***/ }),

/***/ 383:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_HR__ = __webpack_require__(56);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminRhItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminRhItemComponent = (function () {
    function AdminRhItemComponent(router) {
        this.router = router;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    AdminRhItemComponent.prototype.ngOnInit = function () {
    };
    AdminRhItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    AdminRhItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    AdminRhItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    AdminRhItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    AdminRhItemComponent.prototype.goToRhProfile = function () {
        this.router.navigate(['admin/profile/rh', this.rh.id]);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__model_HR__["a" /* HR */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__model_HR__["a" /* HR */]) === "function" && _a || Object)
    ], AdminRhItemComponent.prototype, "rh", void 0);
    AdminRhItemComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-admin-rh-item',
            template: __webpack_require__(699),
            styles: [__webpack_require__(630)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
    ], AdminRhItemComponent);
    return AdminRhItemComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin-rh-item.component.js.map

/***/ }),

/***/ 384:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__header_auth_header_auth_header_component__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_session_service__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_routing__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__login_signup_signup_admin_signup_admin_component__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__login_signin_signin_component__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__welcome_welcome_component__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__chat_chat_component__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__chat_chat_item_component__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__admin_coachs_list_coach_item_admin_coach_item_component__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_angular_calendar__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__angular_platform_browser_animations__ = __webpack_require__(377);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ng_bootstrap_ng_bootstrap__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__meeting_meeting_list_meeting_list_component__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__meeting_meeting_list_coachee_meeting_item_coachee_meeting_item_coachee_component__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__meeting_meeting_date_pre_meeting_pre_meeting_component__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__user_profile_coach_profile_coach_component__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__user_profile_coachee_profile_coachee_component__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__meeting_meeting_list_coach_meeting_item_coach_meeting_item_coach_component__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__service_firebase_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__meeting_meeting_date_meeting_date_component__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_primeng_components_slider_slider__ = __webpack_require__(687);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_primeng_components_slider_slider___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_28_primeng_components_slider_slider__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29_ng2_page_scroll__ = __webpack_require__(681);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__service_adminAPI_service__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__admin_admin_component__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__meeting_meeting_list_rh_meeting_item_rh_meeting_item_rh_component__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__user_profile_rh_profile_rh_component__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__login_signup_signup_coachee_signup_coachee_component__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__login_signup_signup_coach_signup_coach_component__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__login_signup_signup_rh_signup_rh_component__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__meeting_meeting_list_coach_available_meetings_available_meetings_component__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__admin_coachs_list_admin_coachs_list_component__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__admin_coachees_list_admin_coachees_list_component__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__admin_rhs_list_admin_rhs_list_component__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__meeting_meeting_list_coach_meeting_list_coach_meeting_list_coach_component__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__meeting_meeting_list_coachee_meeting_list_coachee_meeting_list_coachee_component__ = __webpack_require__(400);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__meeting_meeting_list_rh_meeting_list_rh_meeting_list_rh_component__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__admin_coachees_list_coachee_item_admin_coachee_item_component__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__admin_rhs_list_rh_item_admin_rh_item_component__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__login_register_register_coach_register_coach_component__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__login_register_register_coach_code_deontologie_code_deontologie_component__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__login_register_register_coach_register_coach_form_register_coach_form_component__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__login_register_register_coach_register_coach_message_register_coach_message_component__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__admin_possible_coachs_list_admin_possible_coachs_list_component__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__admin_possible_coachs_list_possible_coach_item_admin_possible_coach_item_component__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__user_profile_coach_profile_coach_admin_profile_coach_admin_component__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__user_profile_possible_coach_profile_possible_coach_component__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__user_profile_coachee_profile_coachee_admin_profile_coachee_admin_component__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__user_profile_rh_profile_rh_admin_profile_rh_admin_component__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56_ngx_cookie__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57_ng_scrollreveal__ = __webpack_require__(677);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__loader_loader_spinner_loader_spinner_component__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__shared_shared_module__ = __webpack_require__(407);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__footer_footer_component__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__legals_legal_notice_legal_notice_component__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__legals_terms_of_use_terms_of_use_component__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__legals_cookie_policy_cookie_policy_component__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_64__user_profile_profile_header_profile_header_component__ = __webpack_require__(408);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_65__admin_home_admin_home_admin_component__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_66__dashboard_coachee_dashboard_coachee_dashboard_component__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_67__dashboard_coach_dashboard_coach_dashboard_component__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_68__dashboard_rh_dashboard_rh_dashboard_component__ = __webpack_require__(390);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_69__dashboard_dashboard_component__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_70__service_auth_guard_service__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_71__service_not_auth_guard__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_72__header_welcome_header_welcome_header_component__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_73__header_simple_header_simple_header_component__ = __webpack_require__(393);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
















 // lib

























































var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_8__login_signup_signup_admin_signup_admin_component__["a" /* SignupAdminComponent */],
                __WEBPACK_IMPORTED_MODULE_9__login_signin_signin_component__["a" /* SigninComponent */],
                __WEBPACK_IMPORTED_MODULE_23__user_profile_coach_profile_coach_component__["a" /* ProfileCoachComponent */],
                __WEBPACK_IMPORTED_MODULE_24__user_profile_coachee_profile_coachee_component__["a" /* ProfileCoacheeComponent */],
                __WEBPACK_IMPORTED_MODULE_33__user_profile_rh_profile_rh_component__["a" /* ProfileRhComponent */],
                __WEBPACK_IMPORTED_MODULE_11__welcome_welcome_component__["a" /* WelcomeComponent */],
                __WEBPACK_IMPORTED_MODULE_12__chat_chat_component__["a" /* ChatComponent */],
                __WEBPACK_IMPORTED_MODULE_13__chat_chat_item_component__["a" /* ChatItemComponent */],
                __WEBPACK_IMPORTED_MODULE_14__admin_coachs_list_coach_item_admin_coach_item_component__["a" /* AdminCoachItemComponent */],
                __WEBPACK_IMPORTED_MODULE_20__meeting_meeting_list_meeting_list_component__["a" /* MeetingListComponent */],
                __WEBPACK_IMPORTED_MODULE_21__meeting_meeting_list_coachee_meeting_item_coachee_meeting_item_coachee_component__["a" /* MeetingItemCoacheeComponent */],
                __WEBPACK_IMPORTED_MODULE_25__meeting_meeting_list_coach_meeting_item_coach_meeting_item_coach_component__["a" /* MeetingItemCoachComponent */],
                __WEBPACK_IMPORTED_MODULE_27__meeting_meeting_date_meeting_date_component__["a" /* MeetingDateComponent */],
                __WEBPACK_IMPORTED_MODULE_22__meeting_meeting_date_pre_meeting_pre_meeting_component__["a" /* PreMeetingComponent */],
                __WEBPACK_IMPORTED_MODULE_38__admin_coachs_list_admin_coachs_list_component__["a" /* AdminCoachsListComponent */],
                __WEBPACK_IMPORTED_MODULE_31__admin_admin_component__["a" /* AdminComponent */],
                __WEBPACK_IMPORTED_MODULE_32__meeting_meeting_list_rh_meeting_item_rh_meeting_item_rh_component__["a" /* MeetingItemRhComponent */],
                __WEBPACK_IMPORTED_MODULE_34__login_signup_signup_coachee_signup_coachee_component__["a" /* SignupCoacheeComponent */],
                __WEBPACK_IMPORTED_MODULE_35__login_signup_signup_coach_signup_coach_component__["a" /* SignupCoachComponent */],
                __WEBPACK_IMPORTED_MODULE_36__login_signup_signup_rh_signup_rh_component__["a" /* SignupRhComponent */],
                __WEBPACK_IMPORTED_MODULE_37__meeting_meeting_list_coach_available_meetings_available_meetings_component__["a" /* AvailableMeetingsComponent */],
                __WEBPACK_IMPORTED_MODULE_39__admin_coachees_list_admin_coachees_list_component__["a" /* AdminCoacheesListComponent */],
                __WEBPACK_IMPORTED_MODULE_40__admin_rhs_list_admin_rhs_list_component__["a" /* AdminRhsListComponent */],
                __WEBPACK_IMPORTED_MODULE_41__meeting_meeting_list_coach_meeting_list_coach_meeting_list_coach_component__["a" /* MeetingListCoachComponent */],
                __WEBPACK_IMPORTED_MODULE_42__meeting_meeting_list_coachee_meeting_list_coachee_meeting_list_coachee_component__["a" /* MeetingListCoacheeComponent */],
                __WEBPACK_IMPORTED_MODULE_43__meeting_meeting_list_rh_meeting_list_rh_meeting_list_rh_component__["a" /* MeetingListRhComponent */],
                __WEBPACK_IMPORTED_MODULE_44__admin_coachees_list_coachee_item_admin_coachee_item_component__["a" /* AdminCoacheeItemComponent */],
                __WEBPACK_IMPORTED_MODULE_45__admin_rhs_list_rh_item_admin_rh_item_component__["a" /* AdminRhItemComponent */],
                __WEBPACK_IMPORTED_MODULE_46__login_register_register_coach_register_coach_component__["a" /* RegisterCoachComponent */],
                __WEBPACK_IMPORTED_MODULE_47__login_register_register_coach_code_deontologie_code_deontologie_component__["a" /* CodeDeontologieComponent */],
                __WEBPACK_IMPORTED_MODULE_48__login_register_register_coach_register_coach_form_register_coach_form_component__["a" /* RegisterCoachFormComponent */],
                __WEBPACK_IMPORTED_MODULE_49__login_register_register_coach_register_coach_message_register_coach_message_component__["a" /* RegisterCoachMessageComponent */],
                __WEBPACK_IMPORTED_MODULE_50__admin_possible_coachs_list_admin_possible_coachs_list_component__["a" /* AdminPossibleCoachsListComponent */],
                __WEBPACK_IMPORTED_MODULE_51__admin_possible_coachs_list_possible_coach_item_admin_possible_coach_item_component__["a" /* AdminPossibleCoachItemComponent */],
                __WEBPACK_IMPORTED_MODULE_52__user_profile_coach_profile_coach_admin_profile_coach_admin_component__["a" /* ProfileCoachAdminComponent */],
                __WEBPACK_IMPORTED_MODULE_53__user_profile_possible_coach_profile_possible_coach_component__["a" /* ProfilePossibleCoachComponent */],
                __WEBPACK_IMPORTED_MODULE_54__user_profile_coachee_profile_coachee_admin_profile_coachee_admin_component__["a" /* ProfileCoacheeAdminComponent */],
                __WEBPACK_IMPORTED_MODULE_55__user_profile_rh_profile_rh_admin_profile_rh_admin_component__["a" /* ProfileRhAdminComponent */],
                __WEBPACK_IMPORTED_MODULE_58__loader_loader_spinner_loader_spinner_component__["a" /* LoaderSpinnerComponent */],
                __WEBPACK_IMPORTED_MODULE_60__footer_footer_component__["a" /* FooterComponent */],
                __WEBPACK_IMPORTED_MODULE_61__legals_legal_notice_legal_notice_component__["a" /* LegalNoticeComponent */],
                __WEBPACK_IMPORTED_MODULE_62__legals_terms_of_use_terms_of_use_component__["a" /* TermsOfUseComponent */],
                __WEBPACK_IMPORTED_MODULE_63__legals_cookie_policy_cookie_policy_component__["a" /* CookiePolicyComponent */],
                __WEBPACK_IMPORTED_MODULE_64__user_profile_profile_header_profile_header_component__["a" /* ProfileHeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_65__admin_home_admin_home_admin_component__["a" /* HomeAdminComponent */],
                __WEBPACK_IMPORTED_MODULE_66__dashboard_coachee_dashboard_coachee_dashboard_component__["a" /* CoacheeDashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_67__dashboard_coach_dashboard_coach_dashboard_component__["a" /* CoachDashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_68__dashboard_rh_dashboard_rh_dashboard_component__["a" /* RhDashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_69__dashboard_dashboard_component__["a" /* DashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_72__header_welcome_header_welcome_header_component__["a" /* WelcomeHeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_5__header_auth_header_auth_header_component__["a" /* AuthHeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_73__header_simple_header_simple_header_component__["a" /* SimpleHeaderComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_17__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_7__app_routing__["a" /* routing */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["ReactiveFormsModule"],
                __WEBPACK_IMPORTED_MODULE_16_angular_calendar__["a" /* CalendarModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_18__ng_bootstrap_ng_bootstrap__["a" /* NgbModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_28_primeng_components_slider_slider__["SliderModule"],
                __WEBPACK_IMPORTED_MODULE_29_ng2_page_scroll__["a" /* Ng2PageScrollModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_56_ngx_cookie__["a" /* CookieModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_57_ng_scrollreveal__["a" /* NgsRevealModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_59__shared_shared_module__["a" /* SharedModule */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_10__service_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_70__service_auth_guard_service__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_71__service_not_auth_guard__["a" /* NotAuthGuard */], __WEBPACK_IMPORTED_MODULE_15__service_coach_coachee_service__["a" /* CoachCoacheeService */], __WEBPACK_IMPORTED_MODULE_19__service_meetings_service__["a" /* MeetingsService */], __WEBPACK_IMPORTED_MODULE_26__service_firebase_service__["a" /* FirebaseService */], __WEBPACK_IMPORTED_MODULE_30__service_adminAPI_service__["a" /* AdminAPIService */], __WEBPACK_IMPORTED_MODULE_6__service_session_service__["a" /* SessionService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app.module.js.map

/***/ }),

/***/ 385:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__login_signin_signin_component__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_signup_signup_admin_signup_admin_component__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__welcome_welcome_component__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__meeting_meeting_list_meeting_list_component__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__user_profile_coach_profile_coach_component__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__user_profile_coachee_profile_coachee_component__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__meeting_meeting_date_meeting_date_component__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__admin_coachs_list_admin_coachs_list_component__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__admin_admin_component__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__user_profile_rh_profile_rh_component__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__login_signup_signup_coachee_signup_coachee_component__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__login_signup_signup_coach_signup_coach_component__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__login_signup_signup_rh_signup_rh_component__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__meeting_meeting_list_coach_available_meetings_available_meetings_component__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__admin_coachees_list_admin_coachees_list_component__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__admin_rhs_list_admin_rhs_list_component__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__login_register_register_coach_register_coach_component__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__login_register_register_coach_register_coach_form_register_coach_form_component__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__login_register_register_coach_register_coach_message_register_coach_message_component__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__login_register_register_coach_code_deontologie_code_deontologie_component__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__admin_possible_coachs_list_admin_possible_coachs_list_component__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__user_profile_coach_profile_coach_admin_profile_coach_admin_component__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__user_profile_possible_coach_profile_possible_coach_component__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_app_user_profile_coachee_profile_coachee_admin_profile_coachee_admin_component__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__user_profile_rh_profile_rh_admin_profile_rh_admin_component__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__legals_legal_notice_legal_notice_component__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__legals_terms_of_use_terms_of_use_component__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__legals_cookie_policy_cookie_policy_component__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__admin_home_admin_home_admin_component__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__service_auth_guard_service__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__service_not_auth_guard__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__dashboard_dashboard_component__ = __webpack_require__(235);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routing; });

































var APP_ROUTES = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: __WEBPACK_IMPORTED_MODULE_3__welcome_welcome_component__["a" /* WelcomeComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_31__service_not_auth_guard__["a" /* NotAuthGuard */]] },
    //{path: 'chat', component: ChatComponent},
    { path: 'signin', component: __WEBPACK_IMPORTED_MODULE_1__login_signin_signin_component__["a" /* SigninComponent */] },
    { path: 'dashboard', component: __WEBPACK_IMPORTED_MODULE_32__dashboard_dashboard_component__["a" /* DashboardComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_30__service_auth_guard_service__["a" /* AuthGuard */]], canActivateChild: [__WEBPACK_IMPORTED_MODULE_30__service_auth_guard_service__["a" /* AuthGuard */]],
        children: [
            { path: '', redirectTo: 'meetings', pathMatch: 'full' },
            { path: 'profile_rh/:id', component: __WEBPACK_IMPORTED_MODULE_10__user_profile_rh_profile_rh_component__["a" /* ProfileRhComponent */] },
            { path: 'profile_coach/:id', component: __WEBPACK_IMPORTED_MODULE_5__user_profile_coach_profile_coach_component__["a" /* ProfileCoachComponent */] },
            { path: 'profile_coachee/:id', component: __WEBPACK_IMPORTED_MODULE_6__user_profile_coachee_profile_coachee_component__["a" /* ProfileCoacheeComponent */] },
            { path: 'meetings', component: __WEBPACK_IMPORTED_MODULE_4__meeting_meeting_list_meeting_list_component__["a" /* MeetingListComponent */] },
            { path: 'date/:meetingId', component: __WEBPACK_IMPORTED_MODULE_7__meeting_meeting_date_meeting_date_component__["a" /* MeetingDateComponent */] },
            { path: 'date', component: __WEBPACK_IMPORTED_MODULE_7__meeting_meeting_date_meeting_date_component__["a" /* MeetingDateComponent */] },
            { path: 'available_meetings', component: __WEBPACK_IMPORTED_MODULE_14__meeting_meeting_list_coach_available_meetings_available_meetings_component__["a" /* AvailableMeetingsComponent */] }
        ]
    },
    { path: 'legal-notice', component: __WEBPACK_IMPORTED_MODULE_26__legals_legal_notice_legal_notice_component__["a" /* LegalNoticeComponent */] },
    { path: 'terms-of-use', component: __WEBPACK_IMPORTED_MODULE_27__legals_terms_of_use_terms_of_use_component__["a" /* TermsOfUseComponent */] },
    { path: 'cookie-policy', component: __WEBPACK_IMPORTED_MODULE_28__legals_cookie_policy_cookie_policy_component__["a" /* CookiePolicyComponent */] },
    { path: 'register_coach/step1', component: __WEBPACK_IMPORTED_MODULE_17__login_register_register_coach_register_coach_component__["a" /* RegisterCoachComponent */] },
    { path: 'register_coach/code_deontologie', component: __WEBPACK_IMPORTED_MODULE_20__login_register_register_coach_code_deontologie_code_deontologie_component__["a" /* CodeDeontologieComponent */] },
    { path: 'register_coach/step2', component: __WEBPACK_IMPORTED_MODULE_18__login_register_register_coach_register_coach_form_register_coach_form_component__["a" /* RegisterCoachFormComponent */] },
    { path: 'register_coach/step3', component: __WEBPACK_IMPORTED_MODULE_19__login_register_register_coach_register_coach_message_register_coach_message_component__["a" /* RegisterCoachMessageComponent */] },
    { path: 'signup_coachee', component: __WEBPACK_IMPORTED_MODULE_11__login_signup_signup_coachee_signup_coachee_component__["a" /* SignupCoacheeComponent */] },
    { path: 'signup_coach', component: __WEBPACK_IMPORTED_MODULE_12__login_signup_signup_coach_signup_coach_component__["a" /* SignupCoachComponent */] },
    { path: 'signup_rh', component: __WEBPACK_IMPORTED_MODULE_13__login_signup_signup_rh_signup_rh_component__["a" /* SignupRhComponent */] },
    { path: 'admin', component: __WEBPACK_IMPORTED_MODULE_9__admin_admin_component__["a" /* AdminComponent */],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: __WEBPACK_IMPORTED_MODULE_29__admin_home_admin_home_admin_component__["a" /* HomeAdminComponent */] },
            { path: 'signup', component: __WEBPACK_IMPORTED_MODULE_2__login_signup_signup_admin_signup_admin_component__["a" /* SignupAdminComponent */] },
            { path: 'coachs-list', component: __WEBPACK_IMPORTED_MODULE_8__admin_coachs_list_admin_coachs_list_component__["a" /* AdminCoachsListComponent */] },
            { path: 'coachees-list', component: __WEBPACK_IMPORTED_MODULE_15__admin_coachees_list_admin_coachees_list_component__["a" /* AdminCoacheesListComponent */] },
            { path: 'rhs-list', component: __WEBPACK_IMPORTED_MODULE_16__admin_rhs_list_admin_rhs_list_component__["a" /* AdminRhsListComponent */] },
            { path: 'possible_coachs-list', component: __WEBPACK_IMPORTED_MODULE_21__admin_possible_coachs_list_admin_possible_coachs_list_component__["a" /* AdminPossibleCoachsListComponent */] },
            { path: 'profile/coach/:id', component: __WEBPACK_IMPORTED_MODULE_22__user_profile_coach_profile_coach_admin_profile_coach_admin_component__["a" /* ProfileCoachAdminComponent */] },
            { path: 'profile/coachee/:id', component: __WEBPACK_IMPORTED_MODULE_24_app_user_profile_coachee_profile_coachee_admin_profile_coachee_admin_component__["a" /* ProfileCoacheeAdminComponent */] },
            { path: 'profile/possible-coach/:id', component: __WEBPACK_IMPORTED_MODULE_23__user_profile_possible_coach_profile_possible_coach_component__["a" /* ProfilePossibleCoachComponent */] },
            { path: 'profile/rh/:id', component: __WEBPACK_IMPORTED_MODULE_25__user_profile_rh_profile_rh_admin_profile_rh_admin_component__["a" /* ProfileRhAdminComponent */] }
        ]
    },
];
var routing = __WEBPACK_IMPORTED_MODULE_0__angular_router__["e" /* RouterModule */].forRoot(APP_ROUTES);
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app.routing.js.map

/***/ }),

/***/ 386:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__message__ = __webpack_require__(234);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ChatItemComponent = (function () {
    function ChatItemComponent() {
    }
    ChatItemComponent.prototype.changeBackground = function () {
        if (this.message.photoUrl != null) {
            return { 'background-image': 'url(' + this.message.photoUrl + ')' };
        }
        else {
            return null;
        }
    };
    ChatItemComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__message__["a" /* Message */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__message__["a" /* Message */]) === "function" && _a || Object)
    ], ChatItemComponent.prototype, "message", void 0);
    ChatItemComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-chat-item',
            template: __webpack_require__(701),
            styles: [__webpack_require__(631)]
        }),
        __metadata("design:paramtypes", [])
    ], ChatItemComponent);
    return ChatItemComponent;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/chat-item.component.js.map

/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__message__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_firebase_service__ = __webpack_require__(66);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ChatComponent = (function () {
    function ChatComponent(firebase, authService, cd, myElement) {
        this.firebase = firebase;
        this.authService = authService;
        this.cd = cd;
        this.myElement = myElement;
        this.userAuth = true;
        this.userAuth = true;
        this.messages = new Array();
    }
    ChatComponent.prototype.changeBackground = function () {
        return { 'background-image': 'url(' + "http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg" + ')' };
    };
    ChatComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.messagesRef = this.firebase.getInstance().database().ref('messages');
        var hElement = this.myElement.nativeElement;
        this.userName = hElement.querySelector("#user-name");
        this.messageInput = hElement.querySelector("#message");
        console.log("ngAfterViewInit : ", this.userName);
        this.subscription = this.authService.isAuthenticated().subscribe(function (authStatus) {
            if (authStatus) {
                console.log("user is authent");
                // Set the user's profile pic and name.
                // this.userPic.style.backgroundImage = 'url(' + "http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg" + ')';
                _this.userName.textContent = "toto is here";
                // Show user's profile and sign-out button.
                // Hide sign-in button.
                // We load currently existing chat messages.
                _this.loadMessages();
                //load top questions
                // this.recipeService.getTopQuestions().subscribe(
                //   response => {
                //     console.log("top questions response : ", response)
                //   }
                // )
            }
            else {
                console.log("user is NOT authent");
            }
            _this.userAuth = authStatus;
            _this.cd.detectChanges();
        });
    };
    ChatComponent.prototype.ngOnInit = function () {
        var hElement = this.myElement.nativeElement;
        var test = hElement.querySelector("#user-name");
        console.log("ngOnInit : ", test);
    };
    ChatComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    /**
     * Loads chat messages history and listens for upcoming ones.
     */
    ChatComponent.prototype.loadMessages = function () {
        // Make sure we remove all previous listeners.
        this.messagesRef.off();
        // Loads the last 12 messages and listen for new ones.
        var setMessage = function (data) {
            console.log("setMessage, data : ", data);
            var val = data.val();
            this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
        }.bind(this);
        this.messagesRef.limitToLast(12).on('child_added', setMessage);
        this.messagesRef.limitToLast(12).on('child_changed', setMessage);
    };
    ChatComponent.prototype.displayMessage = function (key, name, text, picUrl, imageUri) {
        console.log("displayMessage, key : ", key);
        console.log("displayMessage, name : ", name);
        this.messages.push(new __WEBPACK_IMPORTED_MODULE_2__message__["a" /* Message */](name, text, picUrl, imageUri));
        this.cd.detectChanges();
    };
    // Saves a new message on the Firebase DB.
    ChatComponent.prototype.saveMessage = function (text) {
        console.debug('saveMessage, input : ', text);
        if (text != null) {
            this.messagesRef.push({
                name: "username",
                text: text,
                // photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
                photoUrl: 'assets/profile_placeholder.png'
            }).then(function () {
                console.error('message added');
                // Clear message text field and SEND button state.
                // FriendlyChat.resetMaterialTextfield(this.messageInput);
                // this.toggleButton();
            }.bind(this)).catch(function (error) {
                console.error('Error writing new message to Firebase Database', error);
            });
        }
    };
    ChatComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-chat',
            template: __webpack_require__(702),
            styles: [__webpack_require__(632)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__service_firebase_service__["a" /* FirebaseService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_firebase_service__["a" /* FirebaseService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _d || Object])
    ], ChatComponent);
    return ChatComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/chat.component.js.map

/***/ }),

/***/ 388:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoachDashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CoachDashboardComponent = (function () {
    function CoachDashboardComponent(cd) {
        this.cd = cd;
    }
    CoachDashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    CoachDashboardComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.userSubscription = this.user.subscribe(function (coach) {
            // maybe do sth one day
        });
    };
    CoachDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"]) === "function" && _a || Object)
    ], CoachDashboardComponent.prototype, "user", void 0);
    CoachDashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-coach-dashboard',
            template: __webpack_require__(703),
            styles: [__webpack_require__(633)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object])
    ], CoachDashboardComponent);
    return CoachDashboardComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/coach-dashboard.component.js.map

/***/ }),

/***/ 389:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoacheeDashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CoacheeDashboardComponent = (function () {
    function CoacheeDashboardComponent(router) {
        this.router = router;
    }
    CoacheeDashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    CoacheeDashboardComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
    };
    CoacheeDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    CoacheeDashboardComponent.prototype.navigateToCreateSession = function () {
        var _this = this;
        console.log('navigateToCreateSession');
        if (this.user != null) {
            this.user.take(1).subscribe(function (user) {
                if (user == null) {
                    console.log('no connected user');
                    return;
                }
                _this.router.navigate(['dashboard/date']);
            });
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"]) === "function" && _a || Object)
    ], CoacheeDashboardComponent.prototype, "user", void 0);
    CoacheeDashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-coachee-dashboard',
            template: __webpack_require__(704),
            styles: [__webpack_require__(634)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
    ], CoacheeDashboardComponent);
    return CoacheeDashboardComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/coachee-dashboard.component.js.map

/***/ }),

/***/ 390:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_HR__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_ContractPlan__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_Utils__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__meeting_meeting_list_rh_meeting_list_rh_meeting_list_rh_component__ = __webpack_require__(251);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RhDashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var RhDashboardComponent = (function () {
    function RhDashboardComponent(coachCoacheeService, cd, formBuilder, authService) {
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.selectedPlan = new __WEBPACK_IMPORTED_MODULE_4__model_ContractPlan__["a" /* ContractPlan */](-1);
        this.signInForm = this.formBuilder.group({
            email: ['', [__WEBPACK_IMPORTED_MODULE_5__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_5__angular_forms__["Validators"].pattern(__WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].EMAIL_REGEX)]],
            first_name: [''],
            last_name: [''],
        });
    }
    RhDashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    RhDashboardComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('ngAfterViewInit');
        this.userSubscription = this.user.subscribe(function (hr) {
            _this.onUserObtained(hr);
        });
    };
    RhDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
        if (this.GetUsageRateSubscription) {
            this.GetUsageRateSubscription.unsubscribe();
        }
        if (this.updateCoacheeObjectiveSubscription) {
            this.updateCoacheeObjectiveSubscription.unsubscribe();
        }
    };
    RhDashboardComponent.prototype.onRefreshAllRequested = function () {
        console.log('onRefreshAllRequested');
        // call API GET user
        this.authService.refreshConnectedUser();
    };
    RhDashboardComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.getUsageRate(user.id);
        }
    };
    RhDashboardComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.GetUsageRateSubscription = this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.HrUsageRate = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(rate);
            _this.cd.detectChanges();
        });
    };
    /*************************************
     ----------- Modal control for new coachee's objective ------------
     *************************************/
    RhDashboardComponent.prototype.updateCoacheeObjectivePanelVisibility = function (visible) {
        if (visible) {
            $('#add_new_objective_modal').openModal();
        }
        else {
            $('#add_new_objective_modal').closeModal();
        }
    };
    RhDashboardComponent.prototype.makeAPICallToAddNewObjective = function (user) {
        var _this = this;
        this.updateCoacheeObjectivePanelVisibility(false);
        //call API
        this.updateCoacheeObjectiveSubscription = this.coachCoacheeService.addObjectiveToCoachee(user.id, this.addNewObjectiveCoacheeId, this.coacheeNewObjective)
            .subscribe(function (obj) {
            console.log('addObjectiveToCoachee, SUCCESS', obj);
            // close modal
            _this.updateCoacheeObjectivePanelVisibility(false);
            _this.meetingListComponent.onNewObjectifAdded();
            Materialize.toast("L'objectif a été modifié !", 3000, 'rounded');
            _this.coacheeNewObjective = null;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('addObjectiveToCoachee, error', error);
            Materialize.toast("Imposible de modifier l'objectif", 3000, 'rounded');
        });
    };
    RhDashboardComponent.prototype.startAddNewObjectiveFlow = function (coacheeId) {
        console.log('startAddNewObjectiveFlow, coacheeId : ', coacheeId);
        this.updateCoacheeObjectivePanelVisibility(true);
        this.addNewObjectiveCoacheeId = coacheeId;
    };
    RhDashboardComponent.prototype.cancelAddNewObjectiveModal = function () {
        this.updateCoacheeObjectivePanelVisibility(false);
    };
    RhDashboardComponent.prototype.validateAddNewObjectiveModal = function () {
        var _this = this;
        console.log('validateAddNewObjectiveModal');
        this.user.take(1).subscribe(function (user) {
            console.log('validateAddNewObjectiveModal, got connected user');
            if (user instanceof __WEBPACK_IMPORTED_MODULE_2__model_HR__["a" /* HR */]) {
                _this.makeAPICallToAddNewObjective(user);
            }
            _this.cd.detectChanges();
        });
        return;
    };
    /*************************************
     ----------- Modal control for Potential Coachee ------------
     *************************************/
    RhDashboardComponent.prototype.addPotentialCoacheeModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#add_potential_coachee_modal').openModal();
        }
        else {
            $('#add_potential_coachee_modal').closeModal();
        }
    };
    RhDashboardComponent.prototype.cancelAddPotentialCoachee = function () {
        // this.potentialCoacheeEmail = null;
        this.addPotentialCoacheeModalVisibility(false);
    };
    RhDashboardComponent.prototype.validateAddPotentialCoachee = function () {
        // console.log('validateAddPotentialCoachee, potentialCoacheeEmail : ', this.potentialCoacheeEmail);
        var _this = this;
        this.addPotentialCoacheeModalVisibility(false);
        this.user.take(1).subscribe(function (user) {
            // let body = {
            //   "email": this.potentialCoacheeEmail,
            //   "plan_id": this.selectedPlan.plan_id,
            //   "rh_id": user.id,
            //   "first_name": this.potentialCoacheeFirstName,
            //   "last_name": this.potentialCoacheeLastName,
            // };
            // force Plan
            _this.selectedPlan.plan_id = 1;
            var body = {
                "email": _this.signInForm.value.email,
                "plan_id": _this.selectedPlan.plan_id,
                "rh_id": user.id,
                "first_name": _this.signInForm.value.first_name,
                "last_name": _this.signInForm.value.last_name,
            };
            console.log('postPotentialCoachee, body', body);
            _this.coachCoacheeService.postPotentialCoachee(body).subscribe(function (res) {
                console.log('postPotentialCoachee, res', res);
                _this.signInForm = _this.formBuilder.group({
                    email: ['', [__WEBPACK_IMPORTED_MODULE_5__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_5__angular_forms__["Validators"].pattern(__WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].EMAIL_REGEX)]],
                    first_name: [''],
                    last_name: [''],
                });
                Materialize.toast('Manager ajouté !', 3000, 'rounded');
                _this.onRefreshAllRequested();
            }, function (errorRes) {
                var json = errorRes.json();
                console.log('postPotentialCoachee, error', json);
                if (json.error == "EMAIL_ALREADY_USED") {
                    Materialize.toast("Impossible d'ajouter le manager, cet email est déjà utilisé", 3000, 'rounded');
                }
                else {
                    Materialize.toast("Impossible d'ajouter le manager", 3000, 'rounded');
                }
            });
        });
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_8__meeting_meeting_list_rh_meeting_list_rh_meeting_list_rh_component__["a" /* MeetingListRhComponent */]),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_8__meeting_meeting_list_rh_meeting_list_rh_meeting_list_rh_component__["a" /* MeetingListRhComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__meeting_meeting_list_rh_meeting_list_rh_meeting_list_rh_component__["a" /* MeetingListRhComponent */]) === "function" && _a || Object)
    ], RhDashboardComponent.prototype, "meetingListComponent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"]) === "function" && _b || Object)
    ], RhDashboardComponent.prototype, "user", void 0);
    RhDashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-rh-dashboard',
            template: __webpack_require__(706),
            styles: [__webpack_require__(636)]
        }),
        __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_forms__["FormBuilder"]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_7__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__service_auth_service__["a" /* AuthService */]) === "function" && _f || Object])
    ], RhDashboardComponent);
    return RhDashboardComponent;
    var _a, _b, _c, _d, _e, _f;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/rh-dashboard.component.js.map

/***/ }),

/***/ 391:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-footer',
            template: __webpack_require__(707),
            styles: [__webpack_require__(637)]
        }),
        __metadata("design:paramtypes", [])
    ], FooterComponent);
    return FooterComponent;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/footer.component.js.map

/***/ }),

/***/ 392:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_Coach__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__model_HR__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_Utils__ = __webpack_require__(57);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthHeaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var AuthHeaderComponent = (function () {
    function AuthHeaderComponent(router, meetingService, authService, coachCoacheeService, cd) {
        this.router = router;
        this.meetingService = meetingService;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.isAdmin = false;
        this.hasAvailableMeetings = false;
    }
    AuthHeaderComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.router.events.subscribe(function (evt) {
            window.scrollTo(0, 0);
        });
    };
    AuthHeaderComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('ngAfterViewInit');
        this.userSubscription = this.user.subscribe(function (user) {
            _this.onUserObtained(user);
        });
        this.initJS();
    };
    AuthHeaderComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy');
        if (this.routerEventSubscription)
            this.routerEventSubscription.unsubscribe();
        if (this.userSubscription)
            this.userSubscription.unsubscribe();
        if (this.getAvailableMeetingsSubscription)
            this.getAvailableMeetingsSubscription.unsubscribe();
        if (this.getAllNotifSubscription)
            this.getAllNotifSubscription.unsubscribe();
        if (this.readAllNotifSubscription)
            this.readAllNotifSubscription.unsubscribe();
    };
    AuthHeaderComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained : ' + user);
        if (user) {
            this.mUser = user;
            this.fetchNotificationsForUser(user);
            if (this.isUserACoach(user)) {
                this.getAvailableMeetings();
            }
        }
    };
    AuthHeaderComponent.prototype.onLogout = function () {
        console.log("login out");
        $('.button-collapse').sideNav('hide');
        this.authService.loginOut();
    };
    AuthHeaderComponent.prototype.onSignUp = function () {
        this.router.navigate(['/signup']);
    };
    AuthHeaderComponent.prototype.goToHome = function () {
        console.log('goToHome');
        if (!this.isAdmin) {
            console.log('goToHomeUser');
            this.goToMeetings();
        }
        else {
            console.log('goToHomeAdmin');
            this.navigateAdminHome();
        }
    };
    AuthHeaderComponent.prototype.goToWelcomePage = function () {
        $('.button-collapse').sideNav('hide');
        this.router.navigate(['welcome']);
    };
    AuthHeaderComponent.prototype.goToMeetings = function () {
        this.router.navigate(['dashboard/meetings']);
    };
    AuthHeaderComponent.prototype.goToAvailableSessions = function () {
        this.router.navigate(['dashboard/available_meetings']);
    };
    AuthHeaderComponent.prototype.goToProfile = function () {
        var _this = this;
        this.user.take(1).subscribe(function (user) {
            if (_this.isUserACoach(user)) {
                _this.router.navigate(['dashboard/profile_coach', user.id]);
            }
            else if (_this.isUserACoachee(user)) {
                _this.router.navigate(['dashboard/profile_coachee', user.id]);
            }
            else if (_this.isUserARh(user)) {
                _this.router.navigate(['dashboard/profile_rh', user.id]);
            }
        });
    };
    // call API to inform that notifications have been read
    // updateNotificationRead() {
    //   let user = this.authService.getConnectedUser();
    //   let obs: Observable<Response>;
    //   if (user != null) {
    //     if (user instanceof Coach) {
    //       let params = [user.id];
    //       obs = this.authService.put(AuthService.PUT_COACH_NOTIFICATIONS_READ, params, null);
    //     } else if (user instanceof Coachee) {
    //       let params = [user.id];
    //       obs = this.authService.put(AuthService.PUT_COACHEE_NOTIFICATIONS_READ, params, null);
    //     }
    //
    //     if (obs != null) {
    //       obs.subscribe((response: Response) => {
    //         console.log('updateNotificationRead response : ' + response);
    //       }).unsubscribe();
    //     }
    //
    //   }
    // }
    AuthHeaderComponent.prototype.isUserACoach = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coach__["a" /* Coach */];
    };
    AuthHeaderComponent.prototype.isUserACoachee = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_5__model_Coachee__["a" /* Coachee */];
    };
    AuthHeaderComponent.prototype.isUserARh = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_6__model_HR__["a" /* HR */];
    };
    AuthHeaderComponent.prototype.isEditingProfile = function () {
        var profileCoach = new RegExp('/profile_coach');
        var profileCoachee = new RegExp('/profile_coachee');
        var profileRh = new RegExp('/profile_rh');
        return profileCoach.test(this.router.url) || profileCoachee.test(this.router.url) || profileRh.test(this.router.url);
    };
    // canDisplayListOfCoach(): boolean {
    //   if (this.mUser == null)
    //     return false;
    //
    //   if (this.mUser instanceof Coach)
    //     return false;
    //   else
    //     return true;
    // }
    AuthHeaderComponent.prototype.getAvailableMeetings = function () {
        var _this = this;
        this.getAvailableMeetingsSubscription = this.meetingService.getAvailableMeetings().subscribe(function (meetings) {
            console.log('got getAvailableMeetings', meetings);
            if (meetings != null && meetings.length > 0)
                _this.hasAvailableMeetings = true;
            _this.cd.detectChanges();
        });
    };
    AuthHeaderComponent.prototype.fetchNotificationsForUser = function (user) {
        var _this = this;
        var param = user;
        this.getAllNotifSubscription = this.coachCoacheeService.getAllNotificationsForUser(param).subscribe(function (notifs) {
            console.log('fetchNotificationsForUser : ' + notifs);
            //Sort notifs by date
            if (notifs != null) {
                notifs.sort(function (a, b) {
                    var d1 = new Date(a.date);
                    var d2 = new Date(b.date);
                    var res = d1.getUTCFullYear() - d2.getUTCFullYear();
                    if (res === 0)
                        res = d1.getUTCMonth() - d2.getUTCMonth();
                    if (res === 0)
                        res = d1.getUTCDate() - d2.getUTCDate();
                    if (res === 0)
                        res = d1.getUTCHours() - d2.getUTCHours();
                    return res;
                });
            }
            _this.notifications = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(notifs);
            _this.cd.detectChanges();
        });
    };
    AuthHeaderComponent.prototype.printDateString = function (date) {
        return __WEBPACK_IMPORTED_MODULE_9__utils_Utils__["a" /* Utils */].dateToString(date) + ' - ' + __WEBPACK_IMPORTED_MODULE_9__utils_Utils__["a" /* Utils */].getHoursAndMinutesFromDate(date);
    };
    AuthHeaderComponent.prototype.readAllNotifications = function () {
        var _this = this;
        this.readAllNotifSubscription = this.coachCoacheeService.readAllNotificationsForUser(this.mUser)
            .subscribe(function (response) {
            console.log("getAllNotifications OK", response);
            _this.fetchNotificationsForUser(_this.mUser);
            _this.cd.detectChanges();
        });
    };
    /******* Admin page *****/
    AuthHeaderComponent.prototype.navigateAdminHome = function () {
        console.log("navigateAdminHome");
        this.router.navigate(['/admin']);
    };
    AuthHeaderComponent.prototype.navigateToSignup = function () {
        console.log("navigateToSignup");
        this.router.navigate(['admin/signup']);
    };
    AuthHeaderComponent.prototype.navigateToCoachsList = function () {
        console.log("navigateToCoachsList");
        this.router.navigate(['admin/coachs-list']);
    };
    AuthHeaderComponent.prototype.navigateToCoacheesList = function () {
        console.log("navigateToCoacheesList");
        this.router.navigate(['admin/coachees-list']);
    };
    AuthHeaderComponent.prototype.navigateToRhsList = function () {
        console.log("navigateToRhsList");
        this.router.navigate(['admin/rhs-list']);
    };
    AuthHeaderComponent.prototype.navigateToPossibleCoachsList = function () {
        console.log("navigateToPossibleCoachsList");
        this.router.navigate(['admin/possible_coachs-list']);
    };
    AuthHeaderComponent.prototype.initJS = function () {
        $('.button-collapse').sideNav({
            menuWidth: 400,
            edge: 'left',
            closeOnClick: true,
            draggable: true // Choose whether you can drag to open on touch screens
        });
        $('.dropdown-button-notifs').dropdown({
            inDuration: 300,
            outDuration: 125,
            constrain_width: false,
            hover: false,
            alignment: 'right',
            gutter: 0,
            belowOrigin: true // Displays dropdown below the button
        });
        $('.dropdown-button-profile').dropdown({
            inDuration: 300,
            outDuration: 125,
            constrain_width: false,
            hover: false,
            alignment: 'right',
            gutter: 0,
            belowOrigin: true // Displays dropdown below the button
        });
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"]) === "function" && _a || Object)
    ], AuthHeaderComponent.prototype, "user", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], AuthHeaderComponent.prototype, "isAdmin", void 0);
    AuthHeaderComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-auth-header',
            template: __webpack_require__(708),
            styles: [__webpack_require__(638)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_8__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_7__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _f || Object])
    ], AuthHeaderComponent);
    return AuthHeaderComponent;
    var _a, _b, _c, _d, _e, _f;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/auth-header.component.js.map

/***/ }),

/***/ 393:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SimpleHeaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SimpleHeaderComponent = (function () {
    function SimpleHeaderComponent(router) {
        this.router = router;
    }
    SimpleHeaderComponent.prototype.ngOnInit = function () {
    };
    SimpleHeaderComponent.prototype.goToHome = function () {
        console.log('goToHome');
        this.goToWelcomePage();
    };
    SimpleHeaderComponent.prototype.goToWelcomePage = function () {
        $('.button-collapse').sideNav('hide');
        this.router.navigate(['welcome']);
    };
    SimpleHeaderComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-simple-header',
            template: __webpack_require__(709),
            styles: [__webpack_require__(639)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object])
    ], SimpleHeaderComponent);
    return SimpleHeaderComponent;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/simple-header.component.js.map

/***/ }),

/***/ 394:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_observable_PromiseObservable__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_observable_PromiseObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_observable_PromiseObservable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_firebase_service__ = __webpack_require__(66);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WelcomeHeaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var WelcomeHeaderComponent = (function () {
    function WelcomeHeaderComponent(router, cd, firebase) {
        this.router = router;
        this.cd = cd;
        this.firebase = firebase;
    }
    WelcomeHeaderComponent.prototype.ngOnInit = function () {
    };
    WelcomeHeaderComponent.prototype.toggleLoginStatus = function () {
        $('#signin').slideToggle('slow');
    };
    WelcomeHeaderComponent.prototype.goToRegisterCoach = function () {
        this.router.navigate(['register_coach/step1']);
    };
    /*************************************
     ----------- Modal control for forgot password ------------
     *************************************/
    WelcomeHeaderComponent.prototype.onForgotPasswordClicked = function () {
        console.log('onForgotPasswordClicked');
        this.startForgotPasswordFlow();
    };
    WelcomeHeaderComponent.prototype.updateForgotPasswordModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#forgot_password_modal').openModal();
        }
        else {
            $('#forgot_password_modal').closeModal();
        }
    };
    WelcomeHeaderComponent.prototype.startForgotPasswordFlow = function () {
        console.log('startForgotPasswordFlow');
        this.updateForgotPasswordModalVisibility(true);
    };
    WelcomeHeaderComponent.prototype.cancelForgotPasswordModal = function () {
        this.updateForgotPasswordModalVisibility(false);
        this.forgotEmail = null;
    };
    WelcomeHeaderComponent.prototype.validateForgotPasswordModal = function () {
        var _this = this;
        console.log('validateForgotPasswordModal');
        // make sure forgotEmail has a value
        var firebaseObs = __WEBPACK_IMPORTED_MODULE_2_rxjs_observable_PromiseObservable__["PromiseObservable"].create(this.firebase.sendPasswordResetEmail(this.forgotEmail));
        firebaseObs.subscribe(function () {
            console.log("sendPasswordResetEmail ");
            Materialize.toast("Email envoyé", 3000, 'rounded');
            _this.cancelForgotPasswordModal();
            _this.cd.detectChanges();
        }, function (error) {
            /**
             * {code: "auth/invalid-email", message: "The email address is badly formatted."}code: "auth/invalid-email"message: "The email address is badly formatted."__proto__: Error
             *
             * O {code: "auth/user-not-found", message: "There is no user record corresponding to this identifier. The user may have been deleted."}code: "auth/user-not-found"message: "There is no user record corresponding to this identifier. The user may have been deleted."__proto__: Error
             */
            console.log("sendPasswordResetEmail fail reason", error);
            if (error != undefined) {
                if (error.code == "auth/invalid-email") {
                    Materialize.toast("L'email n'est pas correctement formatté", 3000, 'rounded');
                    return;
                }
                else if (error.code == "auth/user-not-found") {
                    Materialize.toast("L'email ne correspond à aucun de nos utilisateurs", 3000, 'rounded');
                    return;
                }
            }
            Materialize.toast("Une erreur est survenue", 3000, 'rounded');
        }).unsubscribe();
    };
    WelcomeHeaderComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-welcome-header',
            template: __webpack_require__(710),
            styles: [__webpack_require__(640)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__service_firebase_service__["a" /* FirebaseService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_firebase_service__["a" /* FirebaseService */]) === "function" && _c || Object])
    ], WelcomeHeaderComponent);
    return WelcomeHeaderComponent;
    var _a, _b, _c;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/welcome-header.component.js.map

/***/ }),

/***/ 395:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(233);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(384);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__app_module__["a"]; });


//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/index.js.map

/***/ }),

/***/ 396:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__ = __webpack_require__(37);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PreMeetingComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PreMeetingComponent = (function () {
    function PreMeetingComponent(meetingService) {
        this.meetingService = meetingService;
        this.meetingGoal = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.meetingContext = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    PreMeetingComponent.prototype.ngOnInit = function () {
        console.log("PreMeetingComponent onInit");
        if (this.meetingId != undefined) {
            this.getMeetingGoal();
            this.getMeetingContext();
        }
    };
    /* Get from API review goal for the given meeting */
    PreMeetingComponent.prototype.getMeetingGoal = function () {
        var _this = this;
        this.meetingService.getMeetingGoal(this.meetingId).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != undefined && reviews.length > 0) {
                _this.updateGoalValue(reviews[0].value);
            }
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    /* Get from API all review context for the given meeting */
    PreMeetingComponent.prototype.getMeetingContext = function () {
        var _this = this;
        this.meetingService.getMeetingContext(this.meetingId).subscribe(function (reviews) {
            console.log("getMeetingContext, got context : ", reviews);
            if (reviews != undefined && reviews.length > 0) {
                _this.updateContextValue(reviews[0].value);
            }
        }, function (error) {
            console.log('getMeetingContext error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    PreMeetingComponent.prototype.onGoalValueChanged = function (event) {
        var goal = event.target.value;
        console.log('onGoalValueChanged res', goal);
        this.updateGoalValue(goal);
    };
    PreMeetingComponent.prototype.onContextValueChanged = function (event) {
        var context = event.target.value;
        console.log('onContextValueChanged res', context);
        this.updateContextValue(context);
    };
    PreMeetingComponent.prototype.updateGoalValue = function (goal) {
        this.uiMeetingGoal = goal;
        this.meetingGoal.emit(this.uiMeetingGoal);
    };
    PreMeetingComponent.prototype.updateContextValue = function (context) {
        this.uiMeetingContext = context;
        this.meetingContext.emit(this.uiMeetingContext);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], PreMeetingComponent.prototype, "meetingId", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], PreMeetingComponent.prototype, "meetingGoal", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], PreMeetingComponent.prototype, "meetingContext", void 0);
    PreMeetingComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-pre-meeting',
            template: __webpack_require__(725),
            styles: [__webpack_require__(655)]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */]) === "function" && _a || Object])
    ], PreMeetingComponent);
    return PreMeetingComponent;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/pre-meeting.component.js.map

/***/ }),

/***/ 397:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Meeting__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_Utils__ = __webpack_require__(57);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingItemCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MeetingItemCoachComponent = (function () {
    function MeetingItemCoachComponent(authService, meetingService, cd, router) {
        this.authService = authService;
        this.meetingService = meetingService;
        this.cd = cd;
        this.router = router;
        this.isAdmin = false;
        this.onValidateDateBtnClickEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.cancelMeetingBtnClickEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onCloseMeetingBtnClickEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.showDetails = false;
        this.selectedDate = '0';
        this.selectedHour = 0;
        $('select').material_select();
    }
    MeetingItemCoachComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit");
        this.onRefreshRequested();
        this.coachee = this.meeting.coachee;
        $('select').material_select();
    };
    MeetingItemCoachComponent.prototype.ngAfterViewInit = function () {
        console.log("ngAfterViewInit");
        this.getGoal();
        this.getContext();
        this.getReviewValue();
        this.getReviewNextStep();
        this.getSessionReviewTypeRate();
        this.loadMeetingPotentialTimes();
        this.loadPotentialDays();
        $('select').material_select();
    };
    MeetingItemCoachComponent.prototype.ngOnDestroy = function () {
        console.log("ngOnDestroy");
        if (this.mSessionReviewSubscription != null) {
            this.mSessionReviewSubscription.unsubscribe();
        }
        if (this.mSessionReviewResultSubscription != null) {
            this.mSessionReviewResultSubscription.unsubscribe();
        }
        if (this.mSessionReviewRateSubscription != null) {
            this.mSessionReviewRateSubscription.unsubscribe();
        }
        if (this.mSessionContextSubscription != null) {
            this.mSessionContextSubscription.unsubscribe();
        }
        if (this.mSessionGoalSubscription != null) {
            this.mSessionGoalSubscription.unsubscribe();
        }
        if (this.mSessionPotentialTimesSubscription != null) {
            this.mSessionPotentialTimesSubscription.unsubscribe();
        }
        if (this.connectedUserSubscription != null) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    MeetingItemCoachComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable()
                .subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingItemCoachComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.user = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(user);
            this.cd.detectChanges();
        }
    };
    MeetingItemCoachComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.mSessionPotentialTimesSubscription = this.meetingService.getMeetingPotentialTimes(this.meeting.id, this.isAdmin)
            .subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
            if (dates != null) {
                dates.sort(function (a, b) {
                    var d1 = new Date(a.start_date);
                    var d2 = new Date(b.start_date);
                    var res = d1.getUTCFullYear() - d2.getUTCFullYear();
                    if (res === 0)
                        res = d1.getUTCMonth() - d2.getUTCMonth();
                    if (res === 0)
                        res = d1.getUTCDate() - d2.getUTCDate();
                    if (res === 0)
                        res = d1.getUTCHours() - d2.getUTCHours();
                    return res;
                });
            }
            _this.potentialDatesArray = dates;
            _this.potentialDates = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(dates);
            _this.cd.detectChanges();
            _this.loadPotentialDays();
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoachComponent.prototype.onCloseMeetingBtnClick = function () {
        this.onCloseMeetingBtnClickEmitter.emit(this.meeting.id);
    };
    MeetingItemCoachComponent.prototype.getGoal = function () {
        var _this = this;
        this.loading = true;
        this.mSessionGoalSubscription = this.meetingService.getMeetingGoal(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null)
                _this.goal = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(reviews[0].value);
            else
                _this.goal = null;
            _this.cd.detectChanges();
            _this.hasGoal = (_this.goal != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getContext = function () {
        var _this = this;
        this.loading = true;
        this.mSessionContextSubscription = this.meetingService.getMeetingContext(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getMeetingContext, got context : ", reviews);
            if (reviews != null)
                _this.context = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(reviews[0].value);
            else
                _this.context = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of('n/a');
            _this.loading = false;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('getMeetingContext error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getReviewValue = function () {
        var _this = this;
        this.loading = true;
        this.mSessionReviewSubscription = this.meetingService.getSessionReviewUtility(this.meeting.id, this.isAdmin)
            .subscribe(function (reviews) {
            console.log("getMeetingValue, got goal : ", reviews);
            if (reviews != null)
                _this.reviewValue = reviews[0].value;
            else
                _this.reviewValue = null;
            _this.cd.detectChanges();
            _this.hasValue = (_this.reviewValue != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingValue error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getReviewNextStep = function () {
        var _this = this;
        this.loading = true;
        this.mSessionReviewResultSubscription = this.meetingService.getSessionReviewResult(this.meeting.id, this.isAdmin)
            .subscribe(function (reviews) {
            console.log("getMeetingNextStep, : ", reviews);
            if (reviews != null)
                _this.reviewNextStep = reviews[0].value;
            else
                _this.reviewNextStep = null;
            _this.cd.detectChanges();
            _this.hasNextStep = (_this.reviewNextStep != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingNextStep error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getSessionReviewTypeRate = function () {
        var _this = this;
        this.loading = true;
        this.mSessionReviewRateSubscription = this.meetingService.getSessionReviewRate(this.meeting.id, this.isAdmin)
            .subscribe(function (reviews) {
            console.log("getSessionReviewTypeRate, got rate : ", reviews);
            if (reviews != null)
                _this.sessionRate = reviews[0].value;
            else
                _this.sessionRate = null;
            _this.cd.detectChanges();
            _this.hasRate = (_this.sessionRate != null);
            _this.loading = false;
        }, function (error) {
            console.log('getSessionReviewTypeRate error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.loadPotentialDays = function () {
        console.log("loadPotentialDays");
        var days = new Array();
        if (this.potentialDatesArray != null) {
            for (var _a = 0, _b = this.potentialDatesArray; _a < _b.length; _a++) {
                var date = _b[_a];
                var d = new Date(date.start_date);
                // remove hours and minute
                d.setHours(0);
                d.setMinutes(0);
                // avoid duplicates
                if (days.indexOf(d.toString()) < 0)
                    days.push(d.toString());
            }
        }
        this.potentialDays = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(days);
        this.cd.detectChanges();
        console.log("potentialDays", days);
    };
    MeetingItemCoachComponent.prototype.loadPotentialHours = function (selected) {
        console.log("loadPotentialHours", selected);
        var hours = [];
        for (var _a = 0, _b = this.potentialDatesArray; _a < _b.length; _a++) {
            var date = _b[_a];
            // TODO could be improved
            if (__WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].getDayAndMonthFromTimestamp(date.start_date) === __WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].getDate(selected)) {
                for (var _i = __WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].getHoursFromTimestamp(date.start_date); _i < __WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].getHoursFromTimestamp(date.end_date); _i++) {
                    hours.push(_i);
                }
            }
        }
        this.potentialHours = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(hours);
        this.cd.detectChanges();
        console.log("potentialHours", hours);
    };
    MeetingItemCoachComponent.prototype.timestampToString = function (timestamp) {
        return __WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].timestampToString(timestamp);
    };
    MeetingItemCoachComponent.prototype.hoursAndMinutesFromTimestamp = function (timestamp) {
        return __WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].getHoursAndMinutesFromTimestamp(timestamp);
    };
    MeetingItemCoachComponent.prototype.timeIntToString = function (hour) {
        return __WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].timeIntToString(hour);
    };
    MeetingItemCoachComponent.prototype.goToCoacheeProfile = function (coacheeId) {
        if (this.isAdmin)
            this.router.navigate(['admin/profile/coachee', coacheeId]);
        else
            this.router.navigate(['dashboard/profile_coachee', coacheeId]);
    };
    MeetingItemCoachComponent.prototype.onValidateDateClick = function () {
        this.onValidateDateBtnClickEmitter.emit({
            selectedDate: this.selectedDate,
            selectedHour: this.selectedHour,
            meeting: this.meeting
        });
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */]) === "function" && _a || Object)
    ], MeetingItemCoachComponent.prototype, "meeting", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], MeetingItemCoachComponent.prototype, "isAdmin", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], MeetingItemCoachComponent.prototype, "onValidateDateBtnClickEmitter", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], MeetingItemCoachComponent.prototype, "cancelMeetingBtnClickEmitter", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], MeetingItemCoachComponent.prototype, "onCloseMeetingBtnClickEmitter", void 0);
    MeetingItemCoachComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-meeting-item-coach',
            template: __webpack_require__(727),
            styles: [__webpack_require__(657)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _e || Object])
    ], MeetingItemCoachComponent);
    return MeetingItemCoachComponent;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-item-coach.component.js.map

/***/ }),

/***/ 398:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingListCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MeetingListCoachComponent = (function () {
    /**
     *
     * @param meetingsService
     * @param coachCoacheeService
     * @param authService
     * @param cd
     */
    function MeetingListCoachComponent(coachCoacheeService, meetingsService, cd) {
        this.coachCoacheeService = coachCoacheeService;
        this.meetingsService = meetingsService;
        this.cd = cd;
        this.loading = true;
        this.isAdmin = false;
        this.meetingsOpenedCount = 0;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
        this.hasUnbookedMeeting = false;
    }
    MeetingListCoachComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListCoachComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('ngAfterViewInit');
        this.loading = true;
        this.userSubscription = this.user.subscribe(function (coach) {
            _this.onUserObtained(coach);
        });
    };
    MeetingListCoachComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy');
        if (this.getAllMeetingsForCoachIdSubscription) {
            this.getAllMeetingsForCoachIdSubscription.unsubscribe();
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    };
    MeetingListCoachComponent.prototype.onRefreshListRequested = function () {
        var _this = this;
        console.log('onRefreshRequested');
        this.refreshSubscription = this.user.first().subscribe(function (user) {
            _this.onUserObtained(user);
        });
    };
    MeetingListCoachComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.getAllMeetingsForCoach(user.id);
        }
    };
    MeetingListCoachComponent.prototype.getAllMeetingsForCoach = function (coachId) {
        var _this = this;
        this.getAllMeetingsForCoachIdSubscription = this.meetingsService.getAllMeetingsForCoachId(coachId, this.isAdmin)
            .subscribe(function (meetings) {
            console.log('got meetings for coach', meetings);
            _this.onMeetingsObtained(meetings);
        }, function (error) {
            console.log('got meetings for coach ERROR', error);
            _this.loading = false;
        });
    };
    MeetingListCoachComponent.prototype.onMeetingsObtained = function (meetings) {
        console.log('got meetings for coach', meetings);
        this.meetingsArray = meetings;
        this.meetings = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(meetings);
        this.getBookedMeetings();
        this.getUnbookedMeetings();
        this.getClosedMeetings();
        this.loading = false;
        console.log('got meetings, loading', this.loading);
        this.cd.detectChanges();
    };
    MeetingListCoachComponent.prototype.getClosedMeetings = function () {
        console.log('getClosedMeetings');
        if (this.meetingsArray != null) {
            var closed = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && !meeting.isOpen) {
                    closed.push(meeting);
                    this.hasClosedMeeting = true;
                }
            }
            this.meetingsClosed = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(closed);
        }
    };
    MeetingListCoachComponent.prototype.getBookedMeetings = function () {
        console.log('getBookedMeetings');
        this.meetingsOpenedCount = 0;
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                console.log('getBookedMeetings, meeting : ', meeting);
                if (meeting != null && meeting.isOpen && meeting.agreed_date != undefined) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                    console.log('getBookedMeetings, add meeting');
                    this.meetingsOpenedCount++;
                }
            }
            this.meetingsOpened = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(opened);
        }
    };
    MeetingListCoachComponent.prototype.getUnbookedMeetings = function () {
        console.log('getUnbookedMeetings');
        if (this.meetingsArray != null) {
            var unbooked = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && meeting.isOpen && !meeting.agreed_date) {
                    unbooked.push(meeting);
                    this.hasUnbookedMeeting = true;
                }
            }
            this.meetingsUnbooked = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(unbooked);
        }
    };
    MeetingListCoachComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.rhUsageRate = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(rate);
        });
    };
    /*************************************
     ----------- Modal control ------------
     *************************************/
    MeetingListCoachComponent.prototype.coachCancelModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coach_cancel_meeting').openModal();
        }
        else {
            $('#coach_cancel_meeting').closeModal();
        }
    };
    MeetingListCoachComponent.prototype.openCoachCancelMeetingModal = function (meeting) {
        this.meetingToCancel = meeting;
        this.coachCancelModalVisibility(true);
    };
    /*************************************
     ----------- Modal control to close a sessions ------------
     *************************************/
    MeetingListCoachComponent.prototype.updateCloseSessionModalVisibility = function (visible) {
        if (visible) {
            $('#complete_session_modal').openModal();
        }
        else {
            $('#complete_session_modal').closeModal();
        }
    };
    MeetingListCoachComponent.prototype.starCloseSessionFlow = function (meetingId) {
        console.log('startAddNewObjectiveFlow, coacheeId : ', meetingId);
        this.updateCloseSessionModalVisibility(true);
        this.meetingToReportId = meetingId;
    };
    MeetingListCoachComponent.prototype.cancelCloseSessionModal = function () {
        this.updateCloseSessionModalVisibility(false);
    };
    MeetingListCoachComponent.prototype.validateCloseSessionModal = function () {
        var _this = this;
        console.log('validateCloseSessionModal');
        //TODO start loader
        this.meetingsService.closeMeeting(this.meetingToReportId, this.sessionResult, this.sessionUtility).subscribe(function (meeting) {
            console.log("submitCloseMeetingForm, got meeting : ", meeting);
            // TODO stop loader
            //hide modal
            _this.updateCloseSessionModalVisibility(false);
            //refresh list of meetings
            _this.onRefreshListRequested();
            Materialize.toast('Le compte-rendu a été envoyé !', 3000, 'rounded');
        }, function (error) {
            console.log('closeMeeting error', error);
            //TODO display error
            Materialize.toast('Impossible de clore la séance', 3000, 'rounded');
        });
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], MeetingListCoachComponent.prototype, "isAdmin", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"]) === "function" && _a || Object)
    ], MeetingListCoachComponent.prototype, "user", void 0);
    MeetingListCoachComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-meeting-list-coach',
            template: __webpack_require__(728),
            styles: [__webpack_require__(658)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object])
    ], MeetingListCoachComponent);
    return MeetingListCoachComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-list-coach.component.js.map

/***/ }),

/***/ 399:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Meeting__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_Utils__ = __webpack_require__(57);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingItemCoacheeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MeetingItemCoacheeComponent = (function () {
    function MeetingItemCoacheeComponent(router, meetingService, cd) {
        this.router = router;
        this.meetingService = meetingService;
        this.cd = cd;
        // @Output()
        // onMeetingCancelled = new EventEmitter<any>();
        this.cancelMeetingTimeEvent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onRateSessionBtnClickedEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    MeetingItemCoacheeComponent.prototype.ngOnInit = function () {
        this.coach = this.meeting.coach;
        console.log("ngOnInit, coach : ", this.coach);
        this.loadMeetingPotentialTimes();
        this.getGoal();
        this.getContext();
        this.getSessionCoachReview();
    };
    MeetingItemCoacheeComponent.prototype.ngOnDestroy = function () {
        console.log("ngOnDestroy");
        if (this.mSessionReviewUtilitySubscription != null) {
            this.mSessionReviewUtilitySubscription.unsubscribe();
        }
        if (this.mSessionReviewResultSubscription != null) {
            this.mSessionReviewResultSubscription.unsubscribe();
        }
        if (this.mSessionReviewRateSubscription != null) {
            this.mSessionReviewRateSubscription.unsubscribe();
        }
        if (this.mSessionContextSubscription != null) {
            this.mSessionContextSubscription.unsubscribe();
        }
        if (this.mSessionGoalSubscription != null) {
            this.mSessionGoalSubscription.unsubscribe();
        }
        if (this.mSessionPotentialTimesSubscription != null) {
            this.mSessionPotentialTimesSubscription.unsubscribe();
        }
    };
    MeetingItemCoacheeComponent.prototype.timestampToString = function (timestamp) {
        return __WEBPACK_IMPORTED_MODULE_5__utils_Utils__["a" /* Utils */].timestampToString(timestamp);
    };
    MeetingItemCoacheeComponent.prototype.hoursAndMinutesFromTimestamp = function (timestamp) {
        return __WEBPACK_IMPORTED_MODULE_5__utils_Utils__["a" /* Utils */].getHoursAndMinutesFromTimestamp(timestamp);
    };
    MeetingItemCoacheeComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    MeetingItemCoacheeComponent.prototype.getSessionCoachReview = function () {
        this.getSessionReviewTypeResult();
        this.getSessionReviewTypeUtility();
        this.getSessionReviewTypeRate();
    };
    MeetingItemCoacheeComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.loading = true;
        this.mSessionPotentialTimesSubscription = this.meetingService.getMeetingPotentialTimes(this.meeting.id, this.isAdmin).subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
            _this.potentialDates = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(dates);
            _this.cd.detectChanges();
            _this.loading = false;
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoacheeComponent.prototype.getGoal = function () {
        var _this = this;
        this.loading = true;
        this.mSessionGoalSubscription = this.meetingService.getMeetingGoal(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null) {
                _this.hasGoal = true;
                _this.goal = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(reviews[0].value);
            }
            else {
                _this.hasGoal = false;
                _this.goal = null;
            }
            _this.cd.detectChanges();
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getContext = function () {
        var _this = this;
        this.loading = true;
        this.mSessionContextSubscription = this.meetingService.getMeetingContext(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getMeetingContext, got context : ", reviews);
            if (reviews != null) {
                _this.hasContext = true;
                _this.context = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(reviews[0].value);
            }
            else {
                _this.hasContext = false;
                _this.context = null;
            }
            _this.loading = false;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('getMeetingContext error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getSessionReviewTypeResult = function () {
        var _this = this;
        this.loading = true;
        this.mSessionReviewResultSubscription = this.meetingService.getSessionReviewResult(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getSessionReviewTypeResult, got result : ", reviews);
            if (reviews != null) {
                _this.sessionResult = reviews[0].value;
            }
            else {
                _this.sessionResult = null;
            }
            _this.cd.detectChanges();
            _this.hasSessionResult = (_this.sessionResult != null);
            _this.loading = false;
        }, function (error) {
            console.log('getReviewResult error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getSessionReviewTypeUtility = function () {
        var _this = this;
        this.loading = true;
        this.mSessionReviewUtilitySubscription = this.meetingService.getSessionReviewUtility(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getSessionReviewTypeUtility, got goal : ", reviews);
            if (reviews != null) {
                _this.sessionUtility = reviews[0].value;
            }
            else {
                _this.sessionUtility = null;
            }
            _this.cd.detectChanges();
            _this.hasSessionUtility = (_this.sessionUtility != null);
            _this.loading = false;
        }, function (error) {
            console.log('getSessionReviewTypeUtility error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getSessionReviewTypeRate = function () {
        var _this = this;
        this.loading = true;
        this.mSessionReviewRateSubscription = this.meetingService.getSessionReviewRate(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getSessionReviewTypeRate, got rate : ", reviews);
            if (reviews != null) {
                _this.sessionRate = reviews[0].value;
            }
            else {
                _this.sessionRate = null;
            }
            _this.cd.detectChanges();
            _this.hasRate = (_this.sessionRate != null);
            _this.loading = false;
        }, function (error) {
            console.log('getSessionReviewTypeRate error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.goToModifyDate = function (meetingId) {
        window.scrollTo(0, 0);
        this.router.navigate(['dashboard/date', meetingId]);
    };
    MeetingItemCoacheeComponent.prototype.openModal = function () {
        this.cancelMeetingTimeEvent.emit(this.meeting); //TODO to improve
        // $('#deleteModal').openModal();
    };
    MeetingItemCoacheeComponent.prototype.goToChatRoom = function () {
        console.log('goToChatRoom');
        window.open(this.meeting.coach.chat_room_url, "_blank");
    };
    MeetingItemCoacheeComponent.prototype.goToCoachProfile = function (coachId) {
        window.scrollTo(0, 0);
        if (this.isAdmin)
            this.router.navigate(['admin/profile/coach', coachId]);
        else
            this.router.navigate(['dashboard/profile_coach', coachId]);
    };
    MeetingItemCoacheeComponent.prototype.rateSession = function () {
        console.log('rateSession');
        this.onRateSessionBtnClickedEmitter.emit(this.meeting.id);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */]) === "function" && _a || Object)
    ], MeetingItemCoacheeComponent.prototype, "meeting", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], MeetingItemCoacheeComponent.prototype, "isAdmin", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], MeetingItemCoacheeComponent.prototype, "cancelMeetingTimeEvent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], MeetingItemCoacheeComponent.prototype, "onRateSessionBtnClickedEmitter", void 0);
    MeetingItemCoacheeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-meeting-item-coachee',
            template: __webpack_require__(729),
            styles: [__webpack_require__(659)],
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object])
    ], MeetingItemCoacheeComponent);
    return MeetingItemCoacheeComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-item-coachee.component.js.map

/***/ }),

/***/ 40:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Coach; });
/**
 * Created by guillaume on 01/02/2017.
 */
var Coach = (function () {
    function Coach(id) {
        this.id = id;
    }
    Coach.parseCoach = function (json) {
        console.log("parseCoach, json : ", json);
        var coach = new Coach(json.id);
        coach.email = json.email;
        coach.first_name = json.first_name;
        coach.last_name = json.last_name;
        coach.avatar_url = json.avatar_url;
        coach.start_date = json.start_date;
        coach.score = json.score;
        coach.sessionsCount = json.sessions_count;
        coach.description = json.description;
        coach.chat_room_url = json.chat_room_url;
        coach.linkedin_url = json.linkedin_url;
        coach.training = json.training;
        coach.degree = json.degree;
        coach.extraActivities = json.extraActivities;
        coach.coachForYears = json.coachForYears;
        coach.coachingExperience = json.coachingExperience;
        coach.coachingHours = json.coachingHours;
        coach.supervisor = json.supervisor;
        coach.favoriteCoachingSituation = json.favoriteCoachingSituation;
        coach.status = json.status;
        coach.revenues = json.revenue;
        coach.insurance_url = json.insurance_url;
        coach.invoice_address = json.invoice_address;
        coach.invoice_city = json.invoice_city;
        coach.invoice_entity = json.invoice_entity;
        coach.invoice_postcode = json.invoice_postcode;
        coach.languages = json.languages;
        coach.experienceShortSession = json.experienceShortSession;
        coach.coachingSpecifics = json.coachingSpecifics;
        coach.therapyElements = json.therapyElements;
        return coach;
    };
    return Coach;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/Coach.js.map

/***/ }),

/***/ 400:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingListCoacheeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MeetingListCoacheeComponent = (function () {
    function MeetingListCoacheeComponent(meetingsService, authService, cd) {
        this.meetingsService = meetingsService;
        this.authService = authService;
        this.cd = cd;
        this.loading = true;
        this.isAdmin = false;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
        this.sessionRate = '0';
        this.sessionPreRate = '0';
    }
    MeetingListCoacheeComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.loading = true;
    };
    MeetingListCoacheeComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('ngAfterViewInit');
        this.userSubscription = this.user.subscribe(function (user) {
            _this.onUserObtained(user);
        });
    };
    MeetingListCoacheeComponent.prototype.ngOnDestroy = function () {
        if (this.getAllMeetingsForCoacheeIdSubscription) {
            this.getAllMeetingsForCoacheeIdSubscription.unsubscribe();
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    };
    MeetingListCoacheeComponent.prototype.onRefreshAllRequested = function () {
        console.log('onRefreshAllRequested');
        // call API GET user
        this.authService.refreshConnectedUser();
    };
    MeetingListCoacheeComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.getAllMeetingsForCoachee(user.id);
        }
    };
    MeetingListCoacheeComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.loading = true;
        this.getAllMeetingsForCoacheeIdSubscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId, this.isAdmin)
            .subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            _this.onMeetingsObtained(meetings);
        }, function (error) {
            console.log('got meetings for coachee ERROR', error);
            _this.loading = false;
        });
    };
    MeetingListCoacheeComponent.prototype.onMeetingsObtained = function (meetings) {
        console.log('got meetings for coachee', meetings);
        this.meetingsArray = meetings;
        this.meetings = __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(meetings);
        this.getOpenedMeetings();
        this.getClosedMeetings();
        this.loading = false;
        console.log('got meetings, loading', this.loading);
        this.cd.detectChanges();
    };
    MeetingListCoacheeComponent.prototype.getOpenedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = new Array();
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting.isOpen) {
                    console.log('getOpenedMeetings, add open meeting');
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(opened);
        }
    };
    MeetingListCoacheeComponent.prototype.getClosedMeetings = function () {
        console.log('getClosedMeetings');
        if (this.meetingsArray != null) {
            var closed = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (!meeting.isOpen) {
                    console.log('getClosedMeetings, add close meeting');
                    closed.push(meeting);
                    this.hasClosedMeeting = true;
                }
            }
            this.meetingsClosed = __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(closed);
        }
    };
    /*************************************
     ----------- Modal control ------------
     *************************************/
    MeetingListCoacheeComponent.prototype.coacheeDeleteModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coachee_delete_meeting_modal').openModal();
        }
        else {
            $('#coachee_delete_meeting_modal').closeModal();
        }
    };
    MeetingListCoacheeComponent.prototype.openCoacheeDeleteMeetingModal = function (meeting) {
        this.meetingToCancel = meeting;
        this.coacheeDeleteModalVisibility(true);
    };
    MeetingListCoacheeComponent.prototype.cancelCoacheeDeleteMeeting = function () {
        this.coacheeDeleteModalVisibility(false);
        this.meetingToCancel = null;
    };
    MeetingListCoacheeComponent.prototype.validateCoacheeDeleteMeeting = function () {
        var _this = this;
        console.log('validateCoacheeDeleteMeeting');
        var meetingId = this.meetingToCancel.id;
        this.coacheeDeleteModalVisibility(false);
        this.meetingToCancel = null;
        this.meetingsService.deleteMeeting(meetingId).subscribe(function (response) {
            console.log('confirmCancelMeeting, res', response);
            _this.onRefreshAllRequested();
            Materialize.toast('Meeting supprimé !', 3000, 'rounded');
        }, function (error) {
            console.log('confirmCancelMeeting, error', error);
            Materialize.toast('Impossible de supprimer le meeting', 3000, 'rounded');
        });
    };
    /*************************************
     ----------- Modal control - rate session ------------
     *************************************/
    MeetingListCoacheeComponent.prototype.setSessionRate = function (value) {
        this.sessionRate = value.toString();
    };
    MeetingListCoacheeComponent.prototype.setSessionPreRate = function (value) {
        this.sessionPreRate = value.toString();
    };
    MeetingListCoacheeComponent.prototype.updateRateSessionModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#rate_session_modal').openModal();
        }
        else {
            $('#rate_session_modal').closeModal();
        }
    };
    MeetingListCoacheeComponent.prototype.openRateSessionModal = function (meetingId) {
        this.rateSessionMeetingId = meetingId;
        this.updateRateSessionModalVisibility(true);
    };
    MeetingListCoacheeComponent.prototype.cancelRateSessionModal = function () {
        this.updateRateSessionModalVisibility(false);
        this.rateSessionMeetingId = null;
        this.sessionRate = null;
    };
    MeetingListCoacheeComponent.prototype.validateRateSessionModal = function () {
        var _this = this;
        console.log('validateRateSessionModal');
        this.meetingsService.addSessionRateToMeeting(this.rateSessionMeetingId, this.sessionRate).subscribe(function (response) {
            console.log('validateRateSessionModal, res', response);
            _this.onRefreshAllRequested();
            _this.updateRateSessionModalVisibility(false);
            Materialize.toast('Votre coach vient d\'être noté !', 3000, 'rounded');
        }, function (error) {
            console.log('validateRateSessionModal, error', error);
            _this.updateRateSessionModalVisibility(false);
            Materialize.toast('Impossible de noter votre coach', 3000, 'rounded');
        });
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"]) === "function" && _a || Object)
    ], MeetingListCoacheeComponent.prototype, "user", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], MeetingListCoacheeComponent.prototype, "isAdmin", void 0);
    MeetingListCoacheeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-meeting-list-coachee',
            template: __webpack_require__(730),
            styles: [__webpack_require__(660)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object])
    ], MeetingListCoacheeComponent);
    return MeetingListCoacheeComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-list-coachee.component.js.map

/***/ }),

/***/ 401:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_PotentialCoachee__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_Utils__ = __webpack_require__(57);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingItemRhComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MeetingItemRhComponent = (function () {
    function MeetingItemRhComponent(meetingsService, cd, router) {
        this.meetingsService = meetingsService;
        this.cd = cd;
        this.router = router;
        this.isAdmin = false;
        /**
         * Event emitted when user clicks on the "Objective" btn.
         * @type {EventEmitter<string>} the coacheeId
         */
        this.onUpdateObjectiveBtnClick = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        this.showDetails = false;
        this.hasBookedMeeting = false;
        this.goals = {};
        this.sessionRates = {};
    }
    MeetingItemRhComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit, coachee : ', this.coachee);
        if (this.coachee != null) {
            this.getAllMeetingsForCoachee(this.coachee.id);
        }
    };
    MeetingItemRhComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit, coachee : ', this.coachee);
    };
    MeetingItemRhComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy');
        if (this.mGetAllMeetingsSubscription != null) {
            this.mGetAllMeetingsSubscription.unsubscribe();
        }
        if (this.mSessionReviewRateSubscription != null) {
            this.mSessionReviewRateSubscription.unsubscribe();
        }
        if (this.mSessionGoalSubscription != null) {
            this.mSessionGoalSubscription.unsubscribe();
        }
    };
    MeetingItemRhComponent.prototype.dateToStringShort = function (date) {
        return __WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].dateToStringShort(date);
    };
    MeetingItemRhComponent.prototype.goToCoacheeProfile = function (coacheeId) {
        if (this.isAdmin)
            this.router.navigate(['admin/profile/coachee', coacheeId]);
        else
            this.router.navigate(['dashboard/profile_coachee', coacheeId]);
    };
    MeetingItemRhComponent.prototype.toggleShowDetails = function () {
        this.showDetails = this.showDetails ? false : true;
    };
    MeetingItemRhComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.loading = true;
        this.mGetAllMeetingsSubscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId, this.isAdmin).subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            var bookedMeetings = [];
            for (var _i = 0, meetings_1 = meetings; _i < meetings_1.length; _i++) {
                var meeting = meetings_1[_i];
                if (meeting.agreed_date != null) {
                    bookedMeetings.push(meeting);
                    _this.hasBookedMeeting = true;
                    // get goal
                    _this.getGoal(meeting.id);
                    //get rate
                    _this.getSessionReviewTypeRate(meeting.id);
                }
            }
            _this.meetings = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(bookedMeetings);
            _this.cd.detectChanges();
            _this.loading = false;
        });
    };
    MeetingItemRhComponent.prototype.getGoal = function (meetingId) {
        var _this = this;
        // todo should have an array or list of sub
        this.mSessionGoalSubscription = this.meetingsService.getMeetingGoal(meetingId, this.isAdmin)
            .subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null)
                _this.goals[meetingId] = reviews[0].value;
            else
                _this.goals[meetingId] = 'Non renseigné';
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemRhComponent.prototype.getSessionReviewTypeRate = function (meetingId) {
        var _this = this;
        this.mSessionReviewRateSubscription = this.meetingsService.getSessionReviewRate(meetingId, this.isAdmin)
            .subscribe(function (reviews) {
            console.log("getSessionReviewTypeRate, got rate : ", reviews);
            if (reviews != null)
                _this.sessionRates[meetingId] = reviews[0].value;
            else
                _this.sessionRates[meetingId] = "Inconnu";
        }, function (error) {
            console.log('getSessionReviewTypeRate error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemRhComponent.prototype.onClickAddObjectiveBtn = function () {
        this.onUpdateObjectiveBtnClick.emit(this.coachee.id);
    };
    MeetingItemRhComponent.prototype.dayAndMonthFromTimestamp = function (timestamp) {
        return __WEBPACK_IMPORTED_MODULE_6__utils_Utils__["a" /* Utils */].getDayAndMonthFromTimestamp(timestamp);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Coachee__["a" /* Coachee */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Coachee__["a" /* Coachee */]) === "function" && _a || Object)
    ], MeetingItemRhComponent.prototype, "coachee", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__model_PotentialCoachee__["a" /* PotentialCoachee */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__model_PotentialCoachee__["a" /* PotentialCoachee */]) === "function" && _b || Object)
    ], MeetingItemRhComponent.prototype, "potentialCoachee", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], MeetingItemRhComponent.prototype, "isAdmin", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], MeetingItemRhComponent.prototype, "onUpdateObjectiveBtnClick", void 0);
    MeetingItemRhComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-meeting-item-rh',
            template: __webpack_require__(732),
            styles: [__webpack_require__(662)]
        }),
        __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _e || Object])
    ], MeetingItemRhComponent);
    return MeetingItemRhComponent;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-item-rh.component.js.map

/***/ }),

/***/ 402:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContractPlan; });
/**
 *
 */
var ContractPlan = (function () {
    function ContractPlan(id) {
        this.plan_id = id;
    }
    return ContractPlan;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/ContractPlan.js.map

/***/ }),

/***/ 403:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MEETING_REVIEW_TYPE_SESSION_CONTEXT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MEETING_REVIEW_TYPE_SESSION_GOAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return MEETING_REVIEW_TYPE_SESSION_RESULT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return MEETING_REVIEW_TYPE_SESSION_UTILITY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return MEETING_REVIEW_TYPE_SESSION_RATE; });
var MEETING_REVIEW_TYPE_SESSION_CONTEXT = "SESSION_CONTEXT";
var MEETING_REVIEW_TYPE_SESSION_GOAL = "SESSION_GOAL";
var MEETING_REVIEW_TYPE_SESSION_RESULT = "SESSION_RESULT";
var MEETING_REVIEW_TYPE_SESSION_UTILITY = "SESSION_UTILITY";
var MEETING_REVIEW_TYPE_SESSION_RATE = "SESSION_RATE";
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/MeetingReview.js.map

/***/ }),

/***/ 404:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PossibleCoach; });
/**
 * Created by guillaume on 07/07/2017.
 */
/**
 * Created by guillaume on 01/02/2017.
 * */
var PossibleCoach = (function () {
    function PossibleCoach() {
    }
    return PossibleCoach;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/PossibleCoach.js.map

/***/ }),

/***/ 405:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PotentialRh; });
/**
 * Created by guillaume on 29/05/2017.
 */
var PotentialRh = (function () {
    function PotentialRh(id) {
        this.id = id;
    }
    PotentialRh.parsePotentialRh = function (json) {
        var potentialRh = new PotentialRh(json.id);
        potentialRh.email = json.email;
        potentialRh.firstName = json.first_name;
        potentialRh.lastName = json.last_name;
        potentialRh.start_date = json.create_date;
        return potentialRh;
    };
    return PotentialRh;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/PotentialRh.js.map

/***/ }),

/***/ 406:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__loader_loader_spinner_loader_spinner_component__ = __webpack_require__(138);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IfDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var IfDirective = (function () {
    function IfDirective(templateRef, viewContainer, cfResolver) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.cfResolver = cfResolver;
    }
    Object.defineProperty(IfDirective.prototype, "ifLoader", {
        set: function (loading) {
            console.log('ifLoader, loading : ', loading);
            if (loading) {
                // create and attach a loader to our viewContainer
                var factory = this.cfResolver.resolveComponentFactory(__WEBPACK_IMPORTED_MODULE_1__loader_loader_spinner_loader_spinner_component__["a" /* LoaderSpinnerComponent */]);
                this.loaderComponentRef = this.viewContainer.createComponent(factory);
                // remove any embedded view
                if (this.embeddedViewRef) {
                    this.embeddedViewRef.destroy();
                    this.embeddedViewRef = null;
                }
            }
            else {
                // remove any loader
                if (this.loaderComponentRef) {
                    this.loaderComponentRef.destroy();
                    this.loaderComponentRef = null;
                }
                // create and attach our embeddedView
                this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], IfDirective.prototype, "ifLoader", null);
    IfDirective = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({ selector: '[ifLoader]' }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ComponentFactoryResolver"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ComponentFactoryResolver"]) === "function" && _c || Object])
    ], IfDirective);
    return IfDirective;
    var _a, _b, _c;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/if.directive.js.map

/***/ }),

/***/ 407:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__if_directive__ = __webpack_require__(406);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__loader_loader_spinner_loader_spinner_component__ = __webpack_require__(138);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SharedModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_0__if_directive__["a" /* IfDirective */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_0__if_directive__["a" /* IfDirective */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_2__loader_loader_spinner_loader_spinner_component__["a" /* LoaderSpinnerComponent */]
            ]
        })
    ], SharedModule);
    return SharedModule;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/shared.module.js.map

/***/ }),

/***/ 408:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Coach__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileHeaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ProfileHeaderComponent = (function () {
    function ProfileHeaderComponent(location) {
        this.location = location;
    }
    ProfileHeaderComponent.prototype.ngOnInit = function () {
    };
    ProfileHeaderComponent.prototype.goBack = function () {
        this.location.back();
    };
    ProfileHeaderComponent.prototype.isCoach = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */];
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"]) === "function" && _a || Object)
    ], ProfileHeaderComponent.prototype, "user", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], ProfileHeaderComponent.prototype, "isOwner", void 0);
    ProfileHeaderComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'er-profile-header',
            template: __webpack_require__(739),
            styles: [__webpack_require__(669)]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_common__["Location"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_common__["Location"]) === "function" && _b || Object])
    ], ProfileHeaderComponent);
    return ProfileHeaderComponent;
    var _a, _b;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-header.component.js.map

/***/ }),

/***/ 409:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(448);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(441);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(437);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(443);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(442);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(440);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(439);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(447);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(435);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(445);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(438);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(446);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(444);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(449);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(1000);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
// This file includes polyfills needed by Angular 2 and is loaded before
// the app. You can add your own extra polyfills to this file.
















//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/polyfills.js.map

/***/ }),

/***/ 51:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Coachee; });
var Coachee = (function () {
    function Coachee(id) {
        this.id = id;
    }
    Coachee.parseCoachee = function (json) {
        // TODO : don't really need to manually parse the received Json
        var coachee = new Coachee(json.id);
        coachee.id = json.id;
        coachee.email = json.email;
        coachee.first_name = json.first_name;
        coachee.last_name = json.last_name;
        coachee.avatar_url = json.avatar_url;
        coachee.start_date = json.start_date;
        coachee.selectedCoach = json.selectedCoach;
        coachee.contractPlan = json.plan;
        coachee.availableSessionsCount = json.available_sessions_count;
        coachee.updateAvailableSessionCountDate = json.update_sessions_count_date;
        coachee.sessionsDoneMonthCount = json.sessions_done_month_count;
        coachee.sessionsDoneTotalCount = json.sessions_done_total_count;
        coachee.associatedRh = json.associatedRh;
        coachee.last_objective = json.last_objective;
        coachee.plan = json.plan;
        return coachee;
    };
    return Coachee;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/Coachee.js.map

/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HR; });
/**
 * Created by guillaume on 15/05/2017.
 */
var HR = (function () {
    function HR(id) {
        this.id = id;
    }
    HR.parseRh = function (json) {
        console.log(json);
        var rh = new HR(json.id);
        rh.email = json.email;
        rh.description = json.description;
        rh.first_name = json.first_name;
        rh.last_name = json.last_name;
        rh.start_date = json.start_date;
        rh.avatar_url = json.avatar_url;
        rh.company_name = json.company_name;
        return rh;
    };
    return HR;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/HR.js.map

/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Utils; });
/**
 * Created by guillaume on 02/09/2017.
 */
var Utils = (function () {
    function Utils() {
    }
    /*Dates*/
    /* Return a string displaying date from a string date */
    Utils.dateToString = function (date) {
        var ngbDate = this.stringToNgbDate(date);
        return this.ngbDateToString(ngbDate);
    };
    /* Return a string displaying date from a timestamp */
    Utils.timestampToString = function (timestamp) {
        var ngbDate = this.timestampToNgbDate(timestamp);
        return this.ngbDateToString(ngbDate);
    };
    Utils.dateToStringShort = function (date) {
        var ngbDate = this.stringToNgbDate(date);
        return this.ngbDateToStringShort(ngbDate);
    };
    /* Return a string from a ngbDateStruct */
    Utils.ngbDateToString = function (date) {
        var newDate = new Date(date.year, date.month - 1, date.day);
        return this.printDate(newDate);
    };
    Utils.ngbDateToStringShort = function (date) {
        var newDate = new Date(date.year, date.month - 1, date.day);
        return this.printDateShort(newDate);
    };
    Utils.printDate = function (date) {
        return this.days[date.getDay()] + ' ' + date.getDate() + ' ' + this.months[date.getMonth()];
    };
    Utils.printDateShort = function (date) {
        return date.getDate() + ' ' + this.months[date.getMonth()];
    };
    /* Return a NgbDateStruct from a string date */
    Utils.stringToNgbDate = function (date) {
        var d = new Date(date);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
    };
    /* Return a NgbDateStruct from a timestamp */
    Utils.timestampToNgbDate = function (timestamp) {
        var d = new Date(timestamp);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
    };
    /* Return a string displaying time from date string*/
    Utils.getHoursAndMinutesFromDate = function (date) {
        return this.getHours(date) + 'h' + this.getMinutes(date);
    };
    /* Return a string displaying time from date string*/
    Utils.getHoursAndMinutesFromTimestamp = function (timestamp) {
        return this.getHoursFromTimestamp(timestamp) + 'h' + this.getMinutesFromTimestamp(timestamp);
    };
    /* Return a string displaying time from integer*/
    Utils.timeIntToString = function (hour) {
        if (hour === Math.round(hour))
            return hour + 'h00';
        else
            return Math.round(hour) - 1 + 'h30';
    };
    Utils.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    Utils.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    Utils.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        if (m < 10)
            return '0' + m;
        return m.toString();
    };
    Utils.getDayAndMonthFromTimestamp = function (timestamp) {
        return (new Date(timestamp)).getDate() + ' ' + this.months[(new Date(timestamp)).getMonth()];
    };
    Utils.getHoursFromTimestamp = function (timestamp) {
        return (new Date(timestamp)).getHours();
    };
    Utils.getMinutesFromTimestamp = function (timestamp) {
        var m = (new Date(timestamp)).getMinutes();
        if (m === 0) {
            return '00';
        }
        if (m < 10)
            return '0' + m;
        return m.toString();
    };
    Utils.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    Utils.days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    Utils.EMAIL_REGEX = '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';
    return Utils;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/Utils.js.map

/***/ }),

/***/ 621:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".admin-name {\n  font-size: 20px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 622:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 32px 0;\n  margin: 0; }\n\n.card.collection {\n  overflow: visible; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 623:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".add-meeting-btn {\n  background-color: #46b0ff;\n  margin-left: 16px; }\n\n.collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\nbutton {\n  margin: 0; }\n\np {\n  margin: 0; }\n\n/* ITEMS */\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-coach.has-coach {\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach:hover,\n.meeting-item-coach.has-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 18px;\n  margin-left: 16px;\n  margin-top: 18px;\n  text-align: right; }\n  .meeting-item-date .meeting-item-date-hour {\n    font-size: 20px;\n    font-weight: 500; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 32px; }\n\n.meeting-item.closed .meeting-item-header,\n.meeting-item.closed .meeting-item-body {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start; }\n\n.meeting-item-body-buttons {\n  padding: 12px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0;\n  font-size: 12px; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    /*flex-direction: column;*/\n    /*justify-content: flex-start;*/\n    /*align-content: flex-start;*/\n    /*align-items: left;*/\n    padding-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin: 8px 0;\n  margin-left: 8px; }\n\n@media (max-width: 768px) {\n  .meeting-item-header > div,\n  .meeting-item-coach,\n  .meeting-item-body {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    text-align: center; }\n  .meeting-item-coach-avatar {\n    margin: 0;\n    margin-bottom: 8px; }\n  .meeting-item-date {\n    margin-left: 0;\n    text-align: center; }\n  .meeting-item-body-content {\n    width: 100%;\n    text-align: left; }\n  .meeting-item-body-buttons {\n    width: 100%;\n    text-align: center; } }\n\n.meeting-item-date {\n  margin: 0; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 624:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 32px 0;\n  margin: 0; }\n\n.card.collection {\n  overflow: visible; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 625:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".add-meeting-btn {\n  background-color: #46b0ff;\n  margin-left: 16px; }\n\n.collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\nbutton {\n  margin: 0; }\n\np {\n  margin: 0; }\n\n/* ITEMS */\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-coach.has-coach {\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach:hover,\n.meeting-item-coach.has-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 18px;\n  margin-left: 16px;\n  margin-top: 18px;\n  text-align: right; }\n  .meeting-item-date .meeting-item-date-hour {\n    font-size: 20px;\n    font-weight: 500; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 32px; }\n\n.meeting-item.closed .meeting-item-header,\n.meeting-item.closed .meeting-item-body {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start; }\n\n.meeting-item-body-buttons {\n  padding: 12px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0;\n  font-size: 12px; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    /*flex-direction: column;*/\n    /*justify-content: flex-start;*/\n    /*align-content: flex-start;*/\n    /*align-items: left;*/\n    padding-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin: 8px 0;\n  margin-left: 8px; }\n\n@media (max-width: 768px) {\n  .meeting-item-header > div,\n  .meeting-item-coach,\n  .meeting-item-body {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    text-align: center; }\n  .meeting-item-coach-avatar {\n    margin: 0;\n    margin-bottom: 8px; }\n  .meeting-item-date {\n    margin-left: 0;\n    text-align: center; }\n  .meeting-item-body-content {\n    width: 100%;\n    text-align: left; }\n  .meeting-item-body-buttons {\n    width: 100%;\n    text-align: center; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 626:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".text-center {\n  margin-top: 64px; }\n\na {\n  color: #C7C7C7 !important; }\n\na:hover {\n  color: #46b0ff !important; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 627:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 32px 0;\n  margin: 0; }\n\n.card.collection {\n  overflow: visible; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 628:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".add-meeting-btn {\n  background-color: #46b0ff;\n  margin-left: 16px; }\n\n.collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\nbutton {\n  margin: 0; }\n\np {\n  margin: 0; }\n\n/* ITEMS */\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-coach.has-coach {\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach:hover,\n.meeting-item-coach.has-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 18px;\n  margin-left: 16px;\n  margin-top: 18px;\n  text-align: right; }\n  .meeting-item-date .meeting-item-date-hour {\n    font-size: 20px;\n    font-weight: 500; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 32px; }\n\n.meeting-item.closed .meeting-item-header,\n.meeting-item.closed .meeting-item-body {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start; }\n\n.meeting-item-body-buttons {\n  padding: 12px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0;\n  font-size: 12px; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    /*flex-direction: column;*/\n    /*justify-content: flex-start;*/\n    /*align-content: flex-start;*/\n    /*align-items: left;*/\n    padding-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin: 8px 0;\n  margin-left: 8px; }\n\n@media (max-width: 768px) {\n  .meeting-item-header > div,\n  .meeting-item-coach,\n  .meeting-item-body {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    text-align: center; }\n  .meeting-item-coach-avatar {\n    margin: 0;\n    margin-bottom: 8px; }\n  .meeting-item-date {\n    margin-left: 0;\n    text-align: center; }\n  .meeting-item-body-content {\n    width: 100%;\n    text-align: left; }\n  .meeting-item-body-buttons {\n    width: 100%;\n    text-align: center; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 629:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 32px 0;\n  margin: 0; }\n\n.card.collection {\n  overflow: visible; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 630:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".add-meeting-btn {\n  background-color: #46b0ff;\n  margin-left: 16px; }\n\n.collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\nbutton {\n  margin: 0; }\n\np {\n  margin: 0; }\n\n/* ITEMS */\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-coach.has-coach {\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach:hover,\n.meeting-item-coach.has-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 18px;\n  margin-left: 16px;\n  margin-top: 18px;\n  text-align: right; }\n  .meeting-item-date .meeting-item-date-hour {\n    font-size: 20px;\n    font-weight: 500; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 32px; }\n\n.meeting-item.closed .meeting-item-header,\n.meeting-item.closed .meeting-item-body {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start; }\n\n.meeting-item-body-buttons {\n  padding: 12px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0;\n  font-size: 12px; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    /*flex-direction: column;*/\n    /*justify-content: flex-start;*/\n    /*align-content: flex-start;*/\n    /*align-items: left;*/\n    padding-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin: 8px 0;\n  margin-left: 8px; }\n\n@media (max-width: 768px) {\n  .meeting-item-header > div,\n  .meeting-item-coach,\n  .meeting-item-body {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    text-align: center; }\n  .meeting-item-coach-avatar {\n    margin: 0;\n    margin-bottom: 8px; }\n  .meeting-item-date {\n    margin-left: 0;\n    text-align: center; }\n  .meeting-item-body-content {\n    width: 100%;\n    text-align: left; }\n  .meeting-item-body-buttons {\n    width: 100%;\n    text-align: center; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 631:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".message-container:first-of-type {\n  border-top-width: 0; }\n\n.message-container {\n  display: block;\n  margin-top: 10px;\n  border-top: 1px solid #f3f3f3;\n  padding-top: 10px;\n  /*opacity: 0;*/\n  -webkit-transition: opacity 1s ease-in-out;\n  transition: opacity 1s ease-in-out; }\n\n.message-container.visible {\n  opacity: 1; }\n\n.message-container .pic {\n  /*background-image: url('assets/profile_placeholder.png');*/\n  background-repeat: no-repeat;\n  width: 30px;\n  height: 30px;\n  background-size: 30px;\n  border-radius: 20px; }\n\n.message-container .spacing {\n  display: table-cell;\n  vertical-align: top; }\n\n.message-container .message {\n  display: table-cell;\n  width: calc(100% - 40px);\n  padding: 5px 0 5px 10px; }\n\n.message-container .name {\n  display: inline-block;\n  width: 100%;\n  padding-left: 40px;\n  color: #bbb;\n  font-style: italic;\n  font-size: 12px;\n  box-sizing: border-box; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 632:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nhtml, body {\n  font-family: 'Roboto', 'Helvetica', sans-serif; }\n\nmain, #messages-card {\n  height: 100%;\n  padding-bottom: 0; }\n\n#messages-card-container {\n  height: calc(100% - 150px);\n  padding-bottom: 0; }\n\n#messages-card {\n  margin-top: 15px; }\n\n.mdl-layout__header-row span {\n  margin-left: 15px;\n  margin-top: 17px; }\n\n.mdl-grid {\n  max-width: 1024px;\n  margin: auto; }\n\n.material-icons {\n  font-size: 36px;\n  top: 8px;\n  position: relative; }\n\n.mdl-layout__header-row {\n  padding: 0;\n  margin: 0 auto; }\n\n.mdl-card__supporting-text {\n  width: auto;\n  height: 100%;\n  padding-top: 0;\n  padding-bottom: 0; }\n\n#messages {\n  overflow-y: auto;\n  margin-bottom: 10px;\n  height: calc(100% - 80px); }\n\n#message-filler {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1; }\n\n#message-form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  width: calc(100% - 48px);\n  float: left; }\n\n#image-form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  width: 48px;\n  float: right; }\n\n#message-form .mdl-textfield {\n  width: calc(100% - 100px); }\n\n#message-form button, #image-form button {\n  width: 100px;\n  margin: 15px 0 0 10px; }\n\n.mdl-card {\n  min-height: 0; }\n\n.mdl-card {\n  background: -webkit-linear-gradient(white, #f9f9f9);\n  background: linear-gradient(white, #f9f9f9);\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n#user-container {\n  position: absolute;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  top: 22px;\n  width: 100%;\n  right: 0;\n  padding-left: 10px;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  padding-right: 10px; }\n\n#user-container #user-pic {\n  top: -3px;\n  position: relative;\n  display: inline-block;\n  /*background-image: url('assets/profile_placeholder.png');*/\n  background-repeat: no-repeat;\n  width: 40px;\n  height: 40px;\n  background-size: 40px;\n  border-radius: 20px; }\n\n#user-container #user-name {\n  font-size: 16px;\n  line-height: 36px;\n  padding-right: 10px;\n  padding-left: 20px; }\n\n#image-form #submitImage {\n  width: auto;\n  padding: 0 6px 0 1px;\n  min-width: 0; }\n\n#image-form #submitImage .material-icons {\n  top: -1px; }\n\n.message img {\n  max-width: 300px;\n  max-height: 200px; }\n\n#mediaCapture {\n  display: none; }\n\n@media screen and (max-width: 610px) {\n  header {\n    height: 113px;\n    padding-bottom: 80px !important; }\n  #user-container {\n    top: 72px;\n    background-color: #039be5;\n    height: 38px;\n    padding-top: 3px;\n    padding-right: 2px; }\n  #user-container #user-pic {\n    top: 2px;\n    width: 33px;\n    height: 33px;\n    background-size: 33px; } }\n\n.mdl-textfield__label:after {\n  background-color: #0288D1; }\n\n.mdl-textfield--floating-label.is-focused .mdl-textfield__label {\n  color: #0288D1; }\n\n.mdl-button .material-icons {\n  top: -1px;\n  margin-right: 5px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 633:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 634:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 635:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 636:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "#add_new_objective_modal {\n  height: 220px; }\n\n#add_potential_coachee_modal {\n  height: 400px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 637:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "footer {\n  padding: 32px 0;\n  background-color: #3E3E3E; }\n  footer .container {\n    padding: 0; }\n  footer a {\n    color: #ffffff !important; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 638:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "nav {\n  background-color: transparent;\n  background-attachment: scroll;\n  background-position: top;\n  background-size: cover;\n  min-height: 60px;\n  box-shadow: none; }\n\nnav li {\n  background-color: transparent;\n  position: relative; }\n\nnav li.has-notif:after {\n  content: \"\";\n  display: inline-block;\n  width: 4px;\n  height: 4px;\n  border-radius: 100%;\n  background-color: white;\n  position: relative;\n  bottom: 50px;\n  left: 50%;\n  margin-left: -2px; }\n\nnav li a {\n  cursor: pointer;\n  color: #FFF !important;\n  opacity: .9; }\n\nnav li.active a {\n  font-weight: bold !important;\n  font-size: 110%;\n  padding: 0;\n  margin: 0 16px;\n  opacity: 1; }\n\nnav li a:hover,\nnav li a:focus {\n  color: #FFF !important;\n  opacity: 1; }\n\n.side-nav li a:hover,\n.side-nav li a:focus,\n.side-nav li.active a {\n  color: #46b0ff !important; }\n\n.side-nav li {\n  background-color: transparent !important; }\n\n.navbar-fixed,\n.navbar {\n  min-height: 60px;\n  padding: 0; }\n\n.navbar-color {\n  background-color: rgba(35, 88, 128, 0.6);\n  /*background-color: var(--main-dark-blue);*/\n  height: 100%;\n  padding: 0 16px; }\n\n.brand-logo {\n  padding: 0; }\n  .brand-logo img {\n    width: 130px;\n    vertical-align: text-bottom; }\n\n.brand-logo-phone img {\n  width: 100px; }\n\n.logo-text img {\n  height: 50px; }\n\n.side-nav {\n  padding: 0;\n  background-color: white;\n  color: #3E3E3E;\n  max-width: 80%;\n  z-index: 10000; }\n\n.side-nav-header {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  min-height: 60px;\n  box-shadow: none; }\n\n.side-nav-header-container {\n  padding: 32px;\n  color: #FFF;\n  background-color: rgba(35, 88, 128, 0.6);\n  line-height: 1.5; }\n\n.side-nav-user-img {\n  display: inline-block;\n  width: 70px;\n  height: 70px;\n  margin-bottom: 16px; }\n\n.side-nav-user-info h5 {\n  margin: 0;\n  margin-bottom: 4px; }\n\n.side-nav-user-info span {\n  font-weight: 200;\n  font-size: 10px;\n  color: #e5e5e5; }\n\n.side-nav-items {\n  padding: 16px; }\n\nheader {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: fixed;\n  background-position: top;\n  background-size: cover; }\n\nheader.user-connected {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 10000; }\n\n.header-user {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5); }\n\n.header-user-filter {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  padding: 64px 0; }\n\n.header-user-info {\n  margin-left: 16px; }\n\n.header-user-img {\n  height: 100px;\n  width: 100px; }\n\n@media only screen and (max-width: 992px) {\n  .welcome-header .container {\n    padding: 32px 0; } }\n\n.dropdown-notifs {\n  padding: 0; }\n\n.notif-item,\n.profil-item {\n  padding: 16px; }\n\n.profil-item:hover {\n  color: #46b0ff !important; }\n\n.notif-count {\n  background-color: #46b0ff;\n  height: 24px;\n  width: 24px;\n  padding: 0;\n  margin: 0;\n  font-size: 16px;\n  line-height: 24px;\n  text-align: center;\n  border-radius: 100%;\n  position: relative;\n  top: -55px;\n  right: -28px; }\n\n.notif-date {\n  margin: 0;\n  color: #C7C7C7; }\n\n.notif-messsage {\n  margin: 0;\n  font-weight: bold; }\n\nnav li .notif-delete {\n  padding: 0;\n  text-align: center; }\n  nav li .notif-delete a {\n    color: #C7C7C7 !important; }\n\nnav .notif-delete:hover a {\n  color: #46b0ff !important; }\n\nnav .notif-delete:hover a:hover {\n  color: #46b0ff !important; }\n\n.item-user-img {\n  height: 35px;\n  width: 35px;\n  margin-right: 4px; }\n\na.button-collapse {\n  color: #FFF !important; }\n\n.side-nav-items li a {\n  color: #3E3E3E !important; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 639:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "nav {\n  background-color: transparent;\n  background-attachment: scroll;\n  background-position: top;\n  background-size: cover;\n  min-height: 60px;\n  box-shadow: none; }\n\n.navbar-fixed,\n.navbar {\n  min-height: 60px;\n  padding: 0; }\n\n.navbar-color {\n  background-color: rgba(35, 88, 128, 0.6);\n  /*background-color: var(--main-dark-blue);*/\n  height: 100%;\n  padding: 0 16px; }\n\n.brand-logo {\n  padding: 0; }\n  .brand-logo img {\n    width: 130px;\n    vertical-align: text-bottom; }\n\n.brand-logo-phone img {\n  width: 100px; }\n\n.logo-text img {\n  height: 50px; }\n\nheader {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: fixed;\n  background-position: top;\n  background-size: cover; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 640:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "nav {\n  background-color: transparent;\n  background-attachment: scroll;\n  background-position: top;\n  background-size: cover;\n  min-height: 60px;\n  box-shadow: none; }\n\n.navbar-fixed,\n.navbar {\n  min-height: 60px;\n  padding: 0; }\n\n.navbar-color {\n  background-color: rgba(35, 88, 128, 0.6);\n  /*background-color: var(--main-dark-blue);*/\n  height: 100%;\n  padding: 0 16px; }\n\n.brand-logo {\n  padding: 0; }\n  .brand-logo img {\n    width: 130px;\n    vertical-align: text-bottom; }\n\n.brand-logo-phone img {\n  width: 100px; }\n\n.logo-text img {\n  height: 50px; }\n\nheader {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: fixed;\n  background-position: top;\n  background-size: cover; }\n\n.welcome-header {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  text-align: center;\n  color: #ffffff;\n  background-color: rgba(35, 88, 128, 0.6); }\n\n.header-title {\n  font-size: 66px;\n  font-weight: 500;\n  letter-spacing: 1.1px;\n  margin: 0; }\n\n.header-subtitle {\n  font-size: 36px;\n  font-weight: 300;\n  letter-spacing: 2.3px;\n  margin: 64px 0; }\n\n@media only screen and (max-width: 992px) {\n  .header-title {\n    font-size: 40px; }\n  .header-subtitle {\n    font-size: 20px; }\n  .welcome-header .container {\n    padding: 32px 0; } }\n\n.header-btn {\n  text-align: center; }\n\n.header-btn .btn-basic {\n  min-width: 170px;\n  margin: 8px 0; }\n\n.header-btn .btn-connexion {\n  color: #3E3E3E !important; }\n\n.header-btn .btn-connexion:hover {\n  color: #46b0ff !important; }\n\n.header-arrow-bottom {\n  font-size: 66px;\n  color: #ffffff !important;\n  opacity: 0.6; }\n\n.header-arrow-bottom:hover {\n  opacity: 1; }\n\ner-signin {\n  width: 30%; }\n\n@media (max-width: 960px) {\n  er-signin {\n    width: 80%; } }\n\n#signin {\n  display: none; }\n\n/* modal */\n.modal label,\n.modal input {\n  color: #3E3E3E; }\n\n#forgot_password_modal {\n  height: 230px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 641:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 642:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 643:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 644:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 645:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "#code-deontologie {\n  max-width: 1080px;\n  margin: auto;\n  box-sizing: border-box; }\n  #code-deontologie p {\n    font-size: 18px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 646:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "#registerForm {\n  max-width: 1080px;\n  margin: auto;\n  box-sizing: border-box; }\n  #registerForm p {\n    font-size: 18px; }\n  #registerForm .avatar-container {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row;\n    -ms-flex-line-pack: center;\n        align-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center; }\n  #registerForm .input-file-container {\n    margin: 16px 0;\n    position: relative; }\n  #registerForm .input-file-container:hover .file-upload-button {\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n  #registerForm input[type=\"file\"] {\n    position: absolute;\n    left: 0;\n    top: 0;\n    padding: 8px;\n    opacity: .01;\n    cursor: pointer;\n    max-width: 170px; }\n  #registerForm #avatar-preview {\n    height: 150px;\n    width: 150px;\n    margin-right: 16px; }\n  #registerForm textarea {\n    min-height: 100px; }\n  #registerForm .input-container {\n    margin-top: 16px; }\n\n.form-save-buttons {\n  margin-top: 64px; }\n  .form-save-buttons button {\n    margin: 0 8px; }\n\n.section-form-title {\n  margin-top: 32px;\n  margin-bottom: 32px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 647:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 648:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "#introduction {\n  max-width: 1080px;\n  margin: auto;\n  box-sizing: border-box; }\n\n.introduction-text {\n  font-size: 18px; }\n  .introduction-text ol {\n    list-style-type: disc !important; }\n  .introduction-text a {\n    color: #46b0ff; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 649:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "/*#main_container {\n  padding:32px;\n}\n\n#form_container {\n  padding: 32px;\n  max-width: 50%;\n}*/\n.header-signin label {\n  color: #ffffff;\n  font-size: 13px;\n  font-weight: 300;\n  opacity: .6; }\n\n.header-signin input[type=\"password\"],\n.header-signin input[type=\"password\"]:focus:not([readonly]),\n.header-signin input[type=\"email\"],\n.header-signin input[type=\"email\"]:focus:not([readonly]),\n.header-signin textarea,\n.header-signin textarea:focus:not([readonly]) {\n  background-color: rgba(255, 255, 255, 0.6) !important; }\n\n.header-signin button[type=\"submit\"] {\n  background-color: #46b0ff;\n  border: none;\n  border-radius: 100%;\n  width: 64px;\n  height: 64px;\n  font-size: 24px;\n  font-weight: 300;\n  text-align: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin: auto; }\n\n.header-signin button[type=\"submit\"]:hover {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n\n.header-signin button[type=\"submit\"]:disabled {\n  opacity: .5; }\n\n#signin_container {\n  width: 30%;\n  margin: auto; }\n\n@media (max-width: 960px) {\n  #signin_container {\n    width: 80%; } }\n\n.spinner-white {\n  border-color: #FFF; }\n\n/* modal */\n.modal label,\n.modal input {\n  color: #3E3E3E; }\n\n#forgot_password_modal {\n  height: 230px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminAPIService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AdminAPIService = (function () {
    function AdminAPIService(authService) {
        this.authService = authService;
    }
    AdminAPIService.prototype.createPotentialCoach = function (email) {
        var body = {
            "email": email,
        };
        return this.authService.post(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].POST_POTENTIAL_COACH, null, body, null, true).map(function (res) {
            var potentialCoach = res.json();
            return potentialCoach;
        });
    };
    AdminAPIService.prototype.createPotentialRh = function (body) {
        return this.authService.post(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].POST_POTENTIAL_RH, null, body, null, true).map(function (res) {
            var potentialRh = res.json();
            return potentialRh;
        });
    };
    AdminAPIService.prototype.getAdmin = function () {
        return this.authService.get(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_ADMIN, null, true).map(function (res) {
            var admin = res.json();
            return admin;
        });
    };
    AdminAPIService.prototype.getPossibleCoachs = function () {
        return this.authService.get(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].ADMIN_GET_POSSIBLE_COACHS, null, true).map(function (res) {
            var possibleCoachs = res.json();
            return possibleCoachs;
        });
    };
    AdminAPIService.prototype.getPossibleCoach = function (id) {
        var params = [id];
        return this.authService.get(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].ADMIN_GET_POSSIBLE_COACH, params, true).map(function (res) {
            var possibleCoach = res.json();
            return possibleCoach;
        });
    };
    AdminAPIService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */]) === "function" && _a || Object])
    ], AdminAPIService);
    return AdminAPIService;
    var _a;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/adminAPI.service.js.map

/***/ }),

/***/ 650:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "#signup_btn {\n  margin-top: 2em; }\n\n.card-panel {\n  padding: 16px 32px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 651:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 652:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 653:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 654:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n.container {\n  /*Evite que le texte se sélectionne pendant la sélection sur le slider*/\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.header-date-picker {\n  line-height: 1.5;\n  margin-bottom: 64px; }\n\n.custom-day {\n  display: inline-block;\n  border-radius: 100%;\n  color: #3E3E3E;\n  font-size: 16px;\n  line-height: 40px;\n  height: 40px;\n  width: 40px; }\n\n.custom-day:hover {\n  background-color: #C7C7C7; }\n\n.custom-day.text-muted {\n  color: #e7e7e7 !important;\n  pointer-events: none;\n  cursor: default; }\n\n.bg-primary {\n  background-color: #46b0ff !important;\n  color: #FFF !important; }\n\n.has-potential-date {\n  color: #46b0ff;\n  font-weight: 600; }\n\n.plage-horaire {\n  font-weight: 800; }\n\n#datepicker-container {\n  display: inline-block;\n  width: 361.5px;\n  border-radius: 0.25rem;\n  margin-bottom: 32px; }\n\n#potential-dates {\n  padding: 0 32px 16px; }\n\n.potential-date {\n  margin-bottom: 16px; }\n\n.potential-date-content {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n\n.blue-point {\n  background-color: #46b0ff;\n  width: 20px;\n  height: 20px;\n  border-radius: 100%;\n  margin-right: 8px;\n  display: inline-block;\n  vertical-align: middle; }\n\n.potential-date-line {\n  margin: 16px 0; }\n\n.potential-date-timeslot {\n  font-size: 20px;\n  font-weight: 600;\n  margin: 0; }\n\n.modify-timeslot,\n.delete-timeslot {\n  color: #C7C7C7 !important;\n  margin-left: 8px; }\n\n.modify-timeslot:hover,\n.delete-timeslot:hover {\n  color: #46b0ff !important;\n  cursor: pointer; }\n\n@media (max-width: 1180px) {\n  #datepicker-container {\n    -webkit-transform: scale(0.7);\n    transform: scale(0.7); } }\n\n@media (max-width: 990px) {\n  #datepicker-container {\n    -webkit-transform: scale(0.8);\n    transform: scale(0.8);\n    -webkit-transform-origin: top left;\n            transform-origin: top left; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 655:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "textarea {\n  min-height: 100px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 656:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 32px 0;\n  margin: 0; }\n\n.card.collection {\n  overflow: visible; }\n\n.modal {\n  min-height: 50%; }\n\n.modal textarea {\n  min-height: 100px; }\n\n#coach_cancel_meeting {\n  min-height: auto;\n  height: 200px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 657:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".add-meeting-btn {\n  background-color: #46b0ff;\n  margin-left: 16px; }\n\n.collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\nbutton {\n  margin: 0; }\n\np {\n  margin: 0; }\n\n/* ITEMS */\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-coach.has-coach {\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach:hover,\n.meeting-item-coach.has-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 18px;\n  margin-left: 16px;\n  margin-top: 18px;\n  text-align: right; }\n  .meeting-item-date .meeting-item-date-hour {\n    font-size: 20px;\n    font-weight: 500; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 32px; }\n\n.meeting-item.closed .meeting-item-header,\n.meeting-item.closed .meeting-item-body {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start; }\n\n.meeting-item-body-buttons {\n  padding: 12px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0;\n  font-size: 12px; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    /*flex-direction: column;*/\n    /*justify-content: flex-start;*/\n    /*align-content: flex-start;*/\n    /*align-items: left;*/\n    padding-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin: 8px 0;\n  margin-left: 8px; }\n\n@media (max-width: 768px) {\n  .meeting-item-header > div,\n  .meeting-item-coach,\n  .meeting-item-body {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    text-align: center; }\n  .meeting-item-coach-avatar {\n    margin: 0;\n    margin-bottom: 8px; }\n  .meeting-item-date {\n    margin-left: 0;\n    text-align: center; }\n  .meeting-item-body-content {\n    width: 100%;\n    text-align: left; }\n  .meeting-item-body-buttons {\n    width: 100%;\n    text-align: center; } }\n\na:hover,\na:focus {\n  color: #46b0ff !important; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 658:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 32px 0;\n  margin: 0; }\n\n.card.collection {\n  overflow: visible; }\n\n.modal {\n  min-height: 50%; }\n\n.modal textarea {\n  min-height: 100px; }\n\n#complete_session_modal {\n  height: 500px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 659:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".add-meeting-btn {\n  background-color: #46b0ff;\n  margin-left: 16px; }\n\n.collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\nbutton {\n  margin: 0; }\n\np {\n  margin: 0; }\n\n/* ITEMS */\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-coach.has-coach {\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach:hover,\n.meeting-item-coach.has-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 18px;\n  margin-left: 16px;\n  margin-top: 18px;\n  text-align: right; }\n  .meeting-item-date .meeting-item-date-hour {\n    font-size: 20px;\n    font-weight: 500; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 32px; }\n\n.meeting-item.closed .meeting-item-header,\n.meeting-item.closed .meeting-item-body {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start; }\n\n.meeting-item-body-buttons {\n  padding: 12px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0;\n  font-size: 12px; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    /*flex-direction: column;*/\n    /*justify-content: flex-start;*/\n    /*align-content: flex-start;*/\n    /*align-items: left;*/\n    padding-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin: 8px 0;\n  margin-left: 8px; }\n\n@media (max-width: 768px) {\n  .meeting-item-header > div,\n  .meeting-item-coach,\n  .meeting-item-body {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    text-align: center; }\n  .meeting-item-coach-avatar {\n    margin: 0;\n    margin-bottom: 8px; }\n  .meeting-item-date {\n    margin-left: 0;\n    text-align: center; }\n  .meeting-item-body-content {\n    width: 100%;\n    text-align: left; }\n  .meeting-item-body-buttons {\n    width: 100%;\n    text-align: center; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__(67);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FirebaseService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FirebaseService = (function () {
    function FirebaseService() {
        console.log("FirebaseService ctr");
    }
    FirebaseService.prototype.init = function () {
        console.log("AppComponent init");
        // Initialize Firebase
        var config = {
            apiKey: __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].firebase_apiKey,
            authDomain: __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].firebase_authDomain,
            databaseURL: __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].firebase_databaseURL,
        };
        console.log("AppComponent init config", config);
        firebase.initializeApp(config);
    };
    FirebaseService.prototype.getInstance = function () {
        return firebase;
    };
    FirebaseService.prototype.auth = function () {
        return firebase.auth();
    };
    FirebaseService.prototype.sendPasswordResetEmail = function (email) {
        return firebase.auth().sendPasswordResetEmail(email);
    };
    FirebaseService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], FirebaseService);
    return FirebaseService;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/firebase.service.js.map

/***/ }),

/***/ 660:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 32px 0;\n  margin: 0; }\n\n.card.collection {\n  overflow: visible; }\n\n#coachee_delete_meeting_modal {\n  height: 200px !important; }\n\n#rate_session_modal {\n  height: 250px !important; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 661:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".add-meeting-btn {\n  background-color: #46b0ff;\n  margin-left: 16px; }\n\n.collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\nbutton {\n  margin: 0; }\n\np {\n  margin: 0; }\n\n/* ITEMS */\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-coach.has-coach {\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach:hover,\n.meeting-item-coach.has-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 18px;\n  margin-left: 16px;\n  margin-top: 18px;\n  text-align: right; }\n  .meeting-item-date .meeting-item-date-hour {\n    font-size: 20px;\n    font-weight: 500; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 32px; }\n\n.meeting-item.closed .meeting-item-header,\n.meeting-item.closed .meeting-item-body {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start; }\n\n.meeting-item-body-buttons {\n  padding: 12px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0;\n  font-size: 12px; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    /*flex-direction: column;*/\n    /*justify-content: flex-start;*/\n    /*align-content: flex-start;*/\n    /*align-items: left;*/\n    padding-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin: 8px 0;\n  margin-left: 8px; }\n\n@media (max-width: 768px) {\n  .meeting-item-header > div,\n  .meeting-item-coach,\n  .meeting-item-body {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    text-align: center; }\n  .meeting-item-coach-avatar {\n    margin: 0;\n    margin-bottom: 8px; }\n  .meeting-item-date {\n    margin-left: 0;\n    text-align: center; }\n  .meeting-item-body-content {\n    width: 100%;\n    text-align: left; }\n  .meeting-item-body-buttons {\n    width: 100%;\n    text-align: center; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".add-meeting-btn {\n  background-color: #46b0ff;\n  margin-left: 16px; }\n\n.collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\nbutton {\n  margin: 0; }\n\np {\n  margin: 0; }\n\n/* ITEMS */\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-coach.has-coach {\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach:hover,\n.meeting-item-coach.has-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 18px;\n  margin-left: 16px;\n  margin-top: 18px;\n  text-align: right; }\n  .meeting-item-date .meeting-item-date-hour {\n    font-size: 20px;\n    font-weight: 500; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 32px; }\n\n.meeting-item.closed .meeting-item-header,\n.meeting-item.closed .meeting-item-body {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start; }\n\n.meeting-item-body-buttons {\n  padding: 12px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0;\n  font-size: 12px; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    /*flex-direction: column;*/\n    /*justify-content: flex-start;*/\n    /*align-content: flex-start;*/\n    /*align-items: left;*/\n    padding-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin: 8px 0;\n  margin-left: 8px; }\n\n@media (max-width: 768px) {\n  .meeting-item-header > div,\n  .meeting-item-coach,\n  .meeting-item-body {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    text-align: center; }\n  .meeting-item-coach-avatar {\n    margin: 0;\n    margin-bottom: 8px; }\n  .meeting-item-date {\n    margin-left: 0;\n    text-align: center; }\n  .meeting-item-body-content {\n    width: 100%;\n    text-align: left; }\n  .meeting-item-body-buttons {\n    width: 100%;\n    text-align: center; } }\n\n.meeting-list-date {\n  font-size: 20px;\n  font-weight: 500;\n  margin-right: 8px; }\n\n.meeting-item-date {\n  margin-top: 0; }\n\n.meeting-item-body {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-body-content {\n  padding: 12px 0; }\n\n.ratebar-mini {\n  margin-left: 4px;\n  display: inline-block; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 663:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.has-collaborator {\n  cursor: pointer; }\n\n.no-meeting {\n  padding: 32px 0;\n  margin: 0; }\n\n.card.collection {\n  overflow: visible; }\n\n.welcome-message {\n  line-height: 1.5; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 664:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".header-user {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);\n  margin-top: 60px; }\n\n.header-user-filter {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff; }\n\n.header-user .container {\n  padding: 64px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n.user {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n  .user h5 {\n    margin: 0; }\n  .user p {\n    margin-bottom: 0;\n    margin-top: 4px; }\n\n.user-info {\n  margin-left: 16px; }\n\n.user-img {\n  height: 100px;\n  width: 100px; }\n\n.header-item {\n  text-align: center; }\n\n.header-item-number {\n  margin: 0;\n  font-size: 40px;\n  font-weight: 500; }\n\n.header-item-number .indice {\n  font-size: 18px;\n  font-weight: 400; }\n\n.header-item-title {\n  margin: 0;\n  color: #e5e5e5; }\n\n.gap {\n  height: 64px; }\n\n.message-field {\n  min-height: 200px; }\n\n.description-field {\n  min-height: 100px; }\n\n.avatar-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n  .avatar-container button {\n    margin: 8px; }\n\n.input-file-container {\n  margin: 16px 0;\n  position: relative; }\n\n.input-file-container:hover .file-upload-buton {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n\ninput[type=\"file\"] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 8px;\n  opacity: .01;\n  cursor: pointer;\n  max-width: 170px; }\n\n#avatar-preview {\n  height: 150px;\n  width: 150px;\n  margin-right: 16px; }\n\n@media (max-width: 991px) {\n  .avatar-container {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -ms-flex-line-pack: center;\n        align-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center; }\n  .input-file-container {\n    text-align: center; }\n  #avatar-preview {\n    height: 120px;\n    width: 120px;\n    margin-right: 0; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 665:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".message-field {\n  min-height: 200px; }\n\n.description-field {\n  min-height: 100px; }\n\n.avatar-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.input-file-container {\n  margin: 16px 0;\n  position: relative; }\n\n.input-file-container:hover .file-upload-buton {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n\ninput[type=\"file\"] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 8px;\n  opacity: .01;\n  cursor: pointer;\n  max-width: 170px; }\n\n#avatar-preview {\n  height: 150px;\n  width: 150px;\n  margin-right: 16px; }\n\n@media (max-width: 991px) {\n  .avatar-container {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -ms-flex-line-pack: center;\n        align-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center; }\n  .input-file-container {\n    text-align: center; }\n  #avatar-preview {\n    height: 120px;\n    width: 120px;\n    margin-right: 0; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 666:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".header-user {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);\n  margin-top: 60px; }\n\n.header-user-filter {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff; }\n\n.header-user .container {\n  padding: 64px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n.user {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n  .user h5 {\n    margin: 0; }\n  .user p {\n    margin-bottom: 0;\n    margin-top: 4px; }\n\n.user.rh {\n  cursor: pointer; }\n\n.user.rh:hover,\n.user.rh:hover h5 {\n  color: #46b0ff !important; }\n\n.user-info {\n  margin-left: 16px; }\n\n.user-img {\n  height: 100px;\n  width: 100px; }\n\n.header-item {\n  text-align: center; }\n\n.header-item-number {\n  margin: 0;\n  font-size: 40px;\n  font-weight: 500; }\n\n.header-item-number .indice {\n  font-size: 18px;\n  font-weight: 400; }\n\n.header-item-title {\n  margin: 0;\n  color: #e5e5e5; }\n\n.gap {\n  height: 64px; }\n\n.message-field {\n  min-height: 200px; }\n\n.description-field {\n  min-height: 100px; }\n\n.avatar-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.input-file-container {\n  margin: 16px 0;\n  position: relative; }\n\n.input-file-container:hover .file-upload-buton {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n\ninput[type=\"file\"] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 8px;\n  opacity: .01;\n  cursor: pointer;\n  max-width: 170px; }\n\n#avatar-preview {\n  height: 150px;\n  width: 150px;\n  margin-right: 16px; }\n\n@media (max-width: 991px) {\n  .rh-img {\n    height: 70px;\n    width: 70px; }\n  .avatar-container {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -ms-flex-line-pack: center;\n        align-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center; }\n  .input-file-container {\n    text-align: center; }\n  #avatar-preview {\n    height: 120px;\n    width: 120px;\n    margin-right: 0; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 667:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".header-user {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);\n  margin-top: 60px; }\n\n.header-user-filter {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff; }\n\n.header-user .container {\n  padding: 64px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n.user {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n  .user h5 {\n    margin: 0; }\n  .user p {\n    margin-bottom: 0;\n    margin-top: 4px; }\n\n.user-info {\n  margin-left: 16px; }\n\n.user-img {\n  height: 100px;\n  width: 100px; }\n\n.header-item {\n  text-align: center; }\n\n.header-item-number {\n  margin: 0;\n  font-size: 40px;\n  font-weight: 500; }\n\n.header-item-number .indice {\n  font-size: 18px;\n  font-weight: 400; }\n\n.header-item-title {\n  margin: 0;\n  color: #e5e5e5; }\n\n.gap {\n  height: 64px; }\n\n.message-field {\n  min-height: 200px; }\n\n.description-field {\n  min-height: 100px; }\n\n.avatar-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.input-file-container {\n  margin: 16px 0;\n  position: relative; }\n\n.input-file-container:hover .file-upload-buton {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n\ninput[type=\"file\"] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 8px;\n  opacity: .01;\n  cursor: pointer;\n  max-width: 170px; }\n\n#avatar-preview {\n  height: 150px;\n  width: 150px;\n  margin-right: 16px; }\n\n@media (max-width: 991px) {\n  .avatar-container {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -ms-flex-line-pack: center;\n        align-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center; }\n  .input-file-container {\n    text-align: center; }\n  #avatar-preview {\n    height: 120px;\n    width: 120px;\n    margin-right: 0; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 668:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".header-user {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);\n  margin-top: 60px; }\n\n.header-user-filter {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff; }\n\n.header-user .container {\n  padding: 64px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n.user {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n  .user h5 {\n    margin: 0; }\n  .user p {\n    margin-bottom: 0;\n    margin-top: 4px; }\n\n.user-info {\n  margin-left: 16px; }\n\n.user-img {\n  height: 100px;\n  width: 100px; }\n\n.header-stats .row {\n  margin: 0; }\n\n.header-item {\n  text-align: center; }\n\n.header-item-number {\n  margin: 0;\n  font-size: 40px;\n  font-weight: 500; }\n\n.header-item-number .indice {\n  font-size: 18px;\n  font-weight: 400; }\n\n.header-item-title {\n  margin: 0;\n  color: #e5e5e5; }\n\n.gap {\n  height: 64px; }\n\n.message-field {\n  min-height: 200px; }\n\n.description-field {\n  min-height: 100px; }\n\n.avatar-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.input-file-container {\n  margin: 16px 0;\n  position: relative; }\n\n.input-file-container:hover .file-upload-buton {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n\ninput[type=\"file\"] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 8px;\n  opacity: .01;\n  cursor: pointer;\n  max-width: 170px; }\n\n#avatar-preview {\n  height: 150px;\n  width: 150px;\n  margin-right: 16px; }\n\n.section-form-title {\n  margin-top: 96px;\n  margin-bottom: 32px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 669:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".header-user {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);\n  margin-top: 60px; }\n\n.header-user-filter {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff; }\n\n.header-user .container {\n  padding: 64px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n.user {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n  .user h5 {\n    margin: 0; }\n  .user p {\n    margin-bottom: 0;\n    margin-top: 4px; }\n\n.user-info {\n  margin-left: 16px; }\n\n.user-img {\n  height: 100px;\n  width: 100px; }\n\n.header-item {\n  text-align: center;\n  width: 50% !important; }\n\n.header-item-number {\n  margin: 0;\n  font-size: 40px;\n  font-weight: 500; }\n\n.header-item-number .indice {\n  font-size: 18px;\n  font-weight: 400; }\n\n.header-item-title {\n  margin: 0;\n  color: #e5e5e5; }\n\n.gap {\n  height: 64px; }\n\n.user-mobile {\n  display: inline-block; }\n  .user-mobile .user-info {\n    margin: 0; }\n  .user-mobile .user-img {\n    display: inline-block;\n    height: 90px;\n    width: 90px;\n    margin-bottom: 16px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
/**
 * Created by guillaume on 31/03/2017.
 */
var environment = {
    production: true,
    BACKEND_BASE_URL: "https://eritis-be-glr.appspot.com/api",
    firebase_apiKey: "AIzaSyAAszel5d8YQuuGyZ65lX89zYb3V6oqoyA",
    firebase_authDomain: "eritis-be-glr.firebaseapp.com",
    firebase_databaseURL: "https://eritis-be-glr.firebaseio.com",
};
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/environment.js.map

/***/ }),

/***/ 670:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".header-user {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);\n  margin-top: 60px; }\n\n.header-user-filter {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff; }\n\n.header-user .container {\n  padding: 64px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n.user {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n  .user h5 {\n    margin: 0; }\n  .user p {\n    margin-bottom: 0;\n    margin-top: 4px; }\n\n.user-info {\n  margin-left: 16px; }\n\n.user-img {\n  height: 100px;\n  width: 100px; }\n\n.header-item {\n  text-align: center; }\n\n.header-item-number {\n  margin: 0;\n  font-size: 40px;\n  font-weight: 500; }\n\n.header-item-number .indice {\n  font-size: 18px;\n  font-weight: 400; }\n\n.header-item-title {\n  margin: 0;\n  color: #e5e5e5; }\n\n.gap {\n  height: 64px; }\n\n.message-field {\n  min-height: 200px; }\n\n.description-field {\n  min-height: 100px; }\n\n.avatar-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.input-file-container {\n  margin: 16px 0;\n  position: relative; }\n\n.input-file-container:hover .file-upload-buton {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n\ninput[type=\"file\"] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 8px;\n  opacity: .01;\n  cursor: pointer;\n  max-width: 170px; }\n\n#avatar-preview {\n  height: 150px;\n  width: 150px;\n  margin-right: 16px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 671:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".header-user {\n  background-image: url(" + __webpack_require__(33) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);\n  margin-top: 60px; }\n\n.header-user-filter {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff; }\n\n.header-user .container {\n  padding: 64px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n.user {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n  .user h5 {\n    margin: 0; }\n  .user p {\n    margin-bottom: 0;\n    margin-top: 4px; }\n\n.user-info {\n  margin-left: 16px; }\n\n.user-img {\n  height: 100px;\n  width: 100px; }\n\n.header-item {\n  text-align: center; }\n\n.header-item-number {\n  margin: 0;\n  font-size: 40px;\n  font-weight: 500; }\n\n.header-item-number .indice {\n  font-size: 18px;\n  font-weight: 400; }\n\n.header-item-title {\n  margin: 0;\n  color: #e5e5e5; }\n\n.gap {\n  height: 64px; }\n\n.message-field {\n  min-height: 200px; }\n\n.description-field {\n  min-height: 100px; }\n\n.avatar-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.input-file-container {\n  margin: 16px 0;\n  position: relative; }\n\n.input-file-container:hover .file-upload-buton {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n\ninput[type=\"file\"] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 8px;\n  opacity: .01;\n  cursor: pointer;\n  max-width: 170px; }\n\n#avatar-preview {\n  height: 150px;\n  width: 150px;\n  margin-right: 16px; }\n\n@media (max-width: 991px) {\n  .avatar-container {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -ms-flex-line-pack: center;\n        align-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center; }\n  .input-file-container {\n    text-align: center; }\n  #avatar-preview {\n    height: 120px;\n    width: 120px;\n    margin-right: 0; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 672:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "nav {\n  background-color: transparent;\n  box-shadow: none;\n  padding: 16px; }\n\nnav li {\n  background-color: transparent !important; }\n\nnav li:hover a,\nnav li:focus a {\n  color: #3E3E3E !important;\n  -webkit-transition: .3s;\n  transition: .3s; }\n\n.bg-top-image {\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-size: cover;\n  background: url(" + __webpack_require__(33) + ") no-repeat center;\n  height: 1000px;\n  width: 100%;\n  max-width: 100%;\n  z-index: -10; }\n\n.bg-top-filter {\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-color: rgba(35, 88, 128, 0.6);\n  height: 1000px;\n  width: 100%;\n  max-width: 100%;\n  z-index: -1; }\n\n.section {\n  background-color: #FFF;\n  padding: 0;\n  width: 100%; }\n\ner-signin {\n  width: 30%; }\n\n@media (max-width: 960px) {\n  er-signin {\n    width: 80%; } }\n\n.desc_icon {\n  width: 96px;\n  height: 96px; }\n\n.content {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1; }\n\n.section_title {\n  font-weight: 600;\n  margin-bottom: 32px;\n  margin-top: 0; }\n\n#presentation {\n  background: #ffffff; }\n\n.presentation_item {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0 2%;\n  margin-top: 64px; }\n\n.presentation_item_title {\n  height: 64px;\n  color: #1D1D1D; }\n\n.presentation_item_text {\n  color: #C7C7C7; }\n\n#coach_section {\n  display: inline-block;\n  background-color: #46b0ff;\n  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.5);\n  text-align: center;\n  color: #ffffff;\n  overflow: hidden; }\n  #coach_section .btn-basic {\n    min-width: 170px;\n    margin: 8px 0; }\n\n.coach_section_title {\n  color: #ffffff;\n  margin-bottom: 32px; }\n\n.coach_section_subtitle {\n  margin: 0;\n  color: #e5e5e5; }\n\n.coach_description {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  text-align: center;\n  padding: 0 2%;\n  margin-top: 64px; }\n\n.coach_description h4 {\n  height: 72px; }\n\n.coach_description p {\n  font-weight: 300;\n  color: #e5e5e5; }\n\n.coach_img {\n  height: 173px;\n  width: 173px;\n  background-size: cover; }\n\n.small-line-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin-top: 64px; }\n\n.small-line {\n  height: 1px;\n  width: 180px;\n  background-color: #FFF;\n  border: solid 1px rgba(255, 255, 255, 0.67); }\n\nfooter {\n  background-color: #ffffff; }\n\ntextarea {\n  width: 100%;\n  min-height: 192px; }\n\n.address p {\n  font-weight: 400; }\n\n.btn-submit {\n  border-color: #44AFFE;\n  background-color: #44AFFE;\n  color: #FFF !important; }\n\n.btn-submit:disabled {\n  border-color: #E8E8E8;\n  background-color: #E8E8E8; }\n\n.side-nav {\n  background-color: rgba(255, 255, 255, 0.9); }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 690:
/***/ (function(module, exports) {

module.exports = "<er-auth-header [user]=\"admin\" [isAdmin]=\"true\"></er-auth-header>\n\n<div [class.container]=\"!isOnProfile()\">\n  <div [hidden]=\"isOnProfile()\" [ngsReveal]=\"{distance: '100px', origin: 'right', duration: 1000, delay: 200}\">\n    <h3 class=\"text-right\">Espace admin\n      <span class=\"text-right italic blue-text admin-name\" *ngIf=\"(admin | async)?.email != null\">{{ (admin | async)?.email }}</span>\n      <span class=\"text-right italic blue-text admin-name\" *ngIf=\"(admin | async)?.email == null\">non identifié</span>\n    </h3>\n    <p class=\"text-right\">\n      <span class=\"blue-text\">Cliquez</span> ici pour ajouter un RH\n      <a class=\"btn-floating btn-large waves-effect waves-light add-meeting-btn\"\n         (click)=\"navigateToSignup()\">\n        <i class=\"material-icons\">add</i>\n      </a>\n    </p>\n  </div>\n\n  <router-outlet></router-outlet>\n</div>\n"

/***/ }),

/***/ 691:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <h3 class=\"col-lg-12 black-text\">Nos coachees</h3>\n\n  <div class=\"col-lg-12 card collection\">\n    <div *ifLoader=\"loading\">\n      <div class=\"collection-item\" *ngFor=\"let coachee of coachees | async\">\n        <er-admin-coachee-item [coachee]=\"coachee\"></er-admin-coachee-item>\n      </div>\n\n      <div class=\"text-center\" [hidden]=\"(coachees | async)?.length > 0\">\n        <p class=\"no-meeting\">Les coachees apparaîtront ici</p>\n      </div>\n    </div>\n\n  </div>\n\n</div> <!--end row-->\n"

/***/ }),

/***/ 692:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\">\n\n  <!-- COACHEE -->\n  <div class=\"row\">\n    <div class=\"meeting-item-header col-md-12 col-lg-6\">\n      <div>\n        <div class=\"meeting-item-coach has-coach\" (click)=\"goToCoacheeProfile(coachee.id)\">\n          <div>\n            <div class=\"meeting-item-coach-avatar avatar\"\n                 [style.background-image]=\"'url(' + coachee.avatar_url + ')'\"></div>\n          </div>\n\n          <div>\n            <p class=\"meeting-item-coach-name black-text bold\">{{ coachee.first_name}} {{ coachee.last_name}}</p>\n            <span class=\"italic\">{{ coachee.email }}</span>\n          </div>\n        </div>\n\n        <!-- PLAN -->\n        <div class=\"meeting-item-date\">\n          <span class=\"meeting-item-date-date\" i18n><span class=\"blue-text\">{{ coachee.plan.sessions_count }}</span> { coachee.plan.sessions_count,\n          plural, =0 {séance} =1 {séance} other {séances}}</span>\n        </div>\n\n      </div>\n    </div>\n\n    <!-- GOAL -->\n    <div class=\"meeting-item-body col-md-12 col-lg-6\">\n      <div class=\"meeting-item-body-content\">\n        <span>Inscrit le {{ printDateString(coachee.start_date) }}</span>\n      </div>\n\n    </div><!--end meeting-item-body-->\n\n\n  </div><!--end coachee-->\n\n\n</div><!--end meeting-item-->\n"

/***/ }),

/***/ 693:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <h3 class=\"col-lg-12 black-text\">Nos coachs</h3>\n\n  <div class=\"col-lg-12 card collection\">\n\n    <div *ifLoader=\"loading\">\n      <div class=\"collection-item\" *ngFor=\"let coach of coachs | async\">\n        <er-admin-coach-item [coach]=\"coach\"></er-admin-coach-item>\n      </div>\n\n      <div class=\"text-center\" [hidden]=\"(coachs | async)?.length > 0\">\n        <p class=\"no-meeting\">Les coachs apparaîtront ici</p>\n      </div>\n    </div>\n\n  </div>\n</div> <!--end row-->\n"

/***/ }),

/***/ 694:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\">\n\n  <!-- Coach -->\n  <div class=\"row\">\n    <div class=\"meeting-item-header col-md-12 col-lg-4\">\n      <div>\n        <div class=\"meeting-item-coach has-coach\" (click)=\"goToCoachProfile(coach.id)\">\n          <div>\n            <!-- image coach -->\n            <div class=\"meeting-item-coach-avatar avatar\"\n                 [style.background-image]=\"'url(' + coach.avatar_url + ')'\"></div>\n          </div>\n\n          <div>\n            <p class=\"meeting-item-coach-name black-text bold\">{{ coach.first_name}} {{ coach.last_name}}</p>\n            <span class=\"italic\">{{ coach.email }}</span>\n          </div>\n        </div>\n\n      </div>\n    </div>\n\n    <!-- GOAL -->\n    <div class=\"meeting-item-body col-md-12 col-lg-8\">\n      <div class=\"meeting-item-body-content\">\n        <span>Inscrit le {{ printDateString(coach.start_date) }}</span>\n      </div>\n    </div><!--end meeting-item-body-->\n\n  </div><!--end coach-->\n\n</div><!--end meeting-item-->\n\n"

/***/ }),

/***/ 695:
/***/ (function(module, exports) {

module.exports = "<div class=\"text-center\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <h4><a [routerLink]=\"['/admin/coachs-list']\">Nos Coachs</a></h4>\n  <h4><a [routerLink]=\"['/admin/coachees-list']\">Nos Coachees</a></h4>\n  <h4><a [routerLink]=\"['/admin/rhs-list']\">Nos Rhs</a></h4>\n  <h4><a [routerLink]=\"['/admin/possible_coachs-list']\">Demandes disponibles</a></h4>\n</div>\n\n"

/***/ }),

/***/ 696:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <h3 class=\"col-lg-12 black-text\">Demandes d'inscription</h3>\n\n  <div class=\"col-lg-12 card collection\">\n\n    <div *ifLoader=\"loading\">\n      <div class=\"collection-item\" *ngFor=\"let coach of possibleCoachs | async\">\n        <er-admin-possible-coach-item [coach]=\"coach\" (coachAdded)=\"updateList()\"></er-admin-possible-coach-item>\n      </div>\n\n      <div class=\"text-center\" [hidden]=\"(possibleCoachs | async)?.length > 0\">\n        <p class=\"no-meeting\">Les demandes apparaîtront ici</p>\n      </div>\n    </div>\n\n  </div>\n</div> <!--end row-->\n\n"

/***/ }),

/***/ 697:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\">\n\n  <!-- Coach -->\n  <div class=\"row\">\n    <div class=\"meeting-item-header col-md-12 col-lg-4\">\n      <div>\n        <div class=\"meeting-item-coach has-coach\" (click)=\"goToCoachProfile(coach.id)\">\n          <div>\n            <!-- image coach -->\n            <div class=\"meeting-item-coach-avatar avatar\"\n                 [style.background-image]=\"'url(' + coach.avatar_url + ')'\"></div>\n          </div>\n\n          <div>\n            <p class=\"meeting-item-coach-name black-text bold\">{{ coach.first_name}} {{ coach.last_name}}</p>\n            <span class=\"italic\">{{ coach.email }}</span>\n          </div>\n        </div>\n\n      </div>\n    </div>\n\n    <!-- GOAL -->\n    <div class=\"meeting-item-body col-md-12 col-lg-8\">\n      <div class=\"meeting-item-body-content\">\n        <span>Inscrit le {{ printDateString(coach.inscription_date) }}</span>\n      </div>\n\n      <div class=\"meeting-item-body-buttons\">\n        <button class=\"btn-basic btn-blue btn-plain btn-small\"\n                *ngIf=\"!coach.invite_sent\"\n                (click)=\"sendInvite(coach.email)\">Envoyer une invitation\n        </button>\n        <button class=\"btn-basic btn-small\"\n                *ngIf=\"coach.invite_sent\"\n                disabled>En attente...\n        </button>\n      </div>\n    </div><!--end meeting-item-body-->\n\n  </div><!--end coach-->\n\n</div><!--end meeting-item-->\n"

/***/ }),

/***/ 698:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <h3 class=\"col-lg-12 black-text\">Nos RH</h3>\n\n  <div class=\"col-lg-12 card collection\">\n\n    <div *ifLoader=\"loading\">\n      <div class=\"collection-item\" *ngFor=\"let rh of rhs | async\">\n        <er-admin-rh-item [rh]=\"rh\"></er-admin-rh-item>\n      </div>\n\n      <div class=\"text-center\" [hidden]=\"(rhs | async)?.length > 0\">\n        <p class=\"no-meeting\">Les RH apparaîtront ici</p>\n      </div>\n    </div>\n\n  </div>\n</div> <!--end row-->\n\n"

/***/ }),

/***/ 699:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\">\n\n  <!-- RH -->\n  <div class=\"row\">\n    <div class=\"meeting-item-header col-md-12 col-lg-4\">\n      <div>\n        <div class=\"meeting-item-coach has-coach\" (click)=\"goToRhProfile()\">\n          <div>\n            <!-- image rh -->\n            <div class=\"meeting-item-coach-avatar avatar\"\n                 [style.background-image]=\"'url(' + rh.avatar_url + ')'\"></div>\n          </div>\n\n          <div>\n            <p class=\"meeting-item-coach-name black-text bold\">{{ rh.first_name}} {{ rh.last_name}}</p>\n            <span class=\"italic\">{{ rh.email }}</span>\n          </div>\n        </div>\n\n      </div>\n    </div>\n\n    <!-- GOAL -->\n    <div class=\"meeting-item-body col-md-12 col-lg-8\">\n      <div class=\"meeting-item-body-content\">\n        <span>Inscrit le {{ printDateString(rh.start_date) }}</span>\n      </div>\n    </div><!--end meeting-item-body-->\n\n  </div><!--end coach-->\n\n</div><!--end meeting-item-->\n"

/***/ }),

/***/ 700:
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n\n<div id=\"cookie_headband\" class=\"z-depth-2\" *ngIf=\"showCookiesMessage\">\n  <div>\n    <p>Ce site utilise des cookies <a [routerLink]=\"'cookie-policy'\">En savoir plus</a></p>\n  </div>\n  <div>\n    <button class=\"btn-basic btn-small btn-plain btn-blue\" (click)=\"hideCookieHeadband()\">OK</button>\n  </div>\n</div>\n"

/***/ }),

/***/ 701:
/***/ (function(module, exports) {

module.exports = "<div class=\"message-container\">\n  <div class=\"spacing\">\n    <div class=\"pic\" [ngStyle]=\"changeBackground()\"></div>\n  </div>\n  <div class=\"message\">{{message.text}}</div>\n  <div class=\"name\">{{message.name}}</div>\n</div>\n"

/***/ }),

/***/ 702:
/***/ (function(module, exports) {

module.exports = "<!doctype html>\n<!--\n  Copyright 2015 Google Inc. All rights reserved.\n  Licensed under the Apache License, Version 2.0 (the \"License\");\n  you may not use this file except in compliance with the License.\n  You may obtain a copy of the License at\n      https://www.apache.org/licenses/LICENSE-2.0\n  Unless required by applicable law or agreed to in writing, software\n  distributed under the License is distributed on an \"AS IS\" BASIS,\n  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  See the License for the specific language governing permissions and\n  limitations under the License\n-->\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"description\" content=\"Learn how to use the Firebase platform on the Web\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Friendly Chat</title>\n\n  <!-- Disable tap highlight on IE -->\n  <meta name=\"msapplication-tap-highlight\" content=\"no\">\n\n  <!-- Web Application Manifest -->\n  <link rel=\"manifest\" href=\"manifest.json\">\n\n  <!-- Add to homescreen for Chrome on Android -->\n  <meta name=\"mobile-web-app-capable\" content=\"yes\">\n  <meta name=\"application-name\" content=\"Friendly Chat\">\n  <meta name=\"theme-color\" content=\"#303F9F\">\n\n  <!-- Add to homescreen for Safari on iOS -->\n  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\">\n  <meta name=\"apple-mobile-web-app-title\" content=\"Friendly Chat\">\n  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"#303F9F\">\n\n  <!-- Tile icon for Win8 -->\n  <meta name=\"msapplication-TileColor\" content=\"#3372DF\">\n  <meta name=\"msapplication-navbutton-color\" content=\"#303F9F\">\n\n  <!-- Material Design Lite -->\n  <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\">\n  <link rel=\"stylesheet\" href=\"https://code.getmdl.io/1.1.3/material.orange-indigo.min.css\">\n  <script defer src=\"https://code.getmdl.io/1.1.3/material.min.js\"></script>\n\n  <!-- App Styling -->\n  <link rel=\"stylesheet\"\n        href=\"https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en\">\n  <!--<link rel=\"stylesheet\" href=\"styles/main.css\">-->\n</head>\n<body>\n\n<div class=\"demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n\n  <!-- Header section containing logo -->\n  <header class=\"mdl-layout__header mdl-color-text--white mdl-color--light-blue-700\">\n    <div class=\"mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid\">\n      <div class=\"mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop\">\n        <h3><i class=\"material-icons\">chat_bubble_outline</i> Friendly Chat</h3>\n      </div>\n      <div id=\"user-container\">\n        <div id=\"user-pic\" *ngIf=\"userAuth\" [ngStyle]=\"changeBackground()\">user pic</div>\n        <div id=\"user-name\" *ngIf=\"userAuth\"></div>\n\n        <button id=\"sign-out\" *ngIf=\"userAuth\"\n                class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white\">\n          Sign-out\n        </button>\n        <button id=\"sign-in\" *ngIf=\"!userAuth\"\n                class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white\">\n          <i class=\"material-icons\">account_circle</i>Sign-in with Google\n        </button>\n\n      </div>\n    </div>\n  </header>\n\n  <main class=\"mdl-layout__content mdl-color--grey-100\">\n    <div id=\"messages-card-container\" class=\"mdl-cell mdl-cell--12-col mdl-grid\">\n\n      <!-- Messages container -->\n      <div id=\"messages-card\"\n           class=\"mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--6-col-desktop\">\n        <div class=\"mdl-card__supporting-text mdl-color-text--grey-600\">\n          <div id=\"messages\">\n            <span id=\"message-filler\"></span>\n\n            <h1> ici ici </h1>\n\n            <ul class=\"list-group\">\n              <er-chat-item class=\"list-group-item\" *ngFor=\"let msg of messages\" [message]=\"msg\"></er-chat-item>\n            </ul>\n\n\n          </div>\n          <form id=\"message-form\" action=\"#\">\n            <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n              <input class=\"mdl-textfield__input\" type=\"text\" id=\"message\" #msg_input>\n              <label class=\"mdl-textfield__label\" for=\"message\">Message...</label>\n            </div>\n            <!--<button id=\"submit\" disabled type=\"submit\"-->\n                    <!--class=\"mdl-button mdl-js-button mdl-button&#45;&#45;raised mdl-js-ripple-effect\"  (click)=\"saveMessage()\">-->\n              <!--Send-->\n            <!--</button>-->\n\n            <button id=\"submit\" type=\"submit\"\n                    class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect\"  (click)=\"saveMessage(msg_input.value)\">\n              Send\n            </button>\n          </form>\n          <form id=\"image-form\" action=\"#\">\n            <input id=\"mediaCapture\" type=\"file\" accept=\"image/*,capture=camera\">\n            <button id=\"submitImage\" title=\"Add an image\"\n                    class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--amber-400 mdl-color-text--white\">\n              <i class=\"material-icons\">image</i>\n            </button>\n          </form>\n        </div>\n      </div>\n\n      <div id=\"must-signin-snackbar\" class=\"mdl-js-snackbar mdl-snackbar\">\n        <div class=\"mdl-snackbar__text\"></div>\n        <button class=\"mdl-snackbar__action\" type=\"button\"></button>\n      </div>\n\n    </div>\n  </main>\n</div>\n\n\n</body>\n</html>\n"

/***/ }),

/***/ 703:
/***/ (function(module, exports) {

module.exports = "<div [ngsReveal]=\"{distance: '100px', origin: 'right', duration: 1000, delay: 200}\">\n\n  <h3 class=\"text-right\" i18n>Bonjour {{ (user | async)?.first_name}},\n    vous avez <span class=\"blue-text\">{{meeting_list.meetingsOpenedCount}}</span> {meeting_list.meetingsOpenedCount, plural, =0 {séance} =1\n    {séance} other {séances}} à venir\n  </h3>\n\n  <p class=\"text-right\">\n    Cliquez ici pour votre salon\n    <a class=\"btn-floating btn-large waves-effect waves-light add-meeting-btn\"\n       [href]=\"(user | async)?.chat_room_url\" target=\"_blank\">\n      <i class=\"material-icons\">videocam</i>\n    </a>\n  </p>\n</div>\n\n<er-meeting-list-coach #meeting_list [user]=\"user\"></er-meeting-list-coach>\n"

/***/ }),

/***/ 704:
/***/ (function(module, exports) {

module.exports = "<div [ngsReveal]=\"{distance: '100px', origin: 'right', duration: 1000, delay: 200}\">\n\n  <h3 class=\"text-right\" i18n>Bonjour {{ (user | async)?.first_name}},\n    il vous reste <span class=\"blue-text\">{{(user | async)?.availableSessionsCount || 0}}</span> {(user |\n    async)?.availableSessionsCount || 0, plural, =0 {séance} =1\n    {séance} other {séances}} pour ce mois\n  </h3>\n\n  <h5 class=\"italic text-right\" *ngIf=\"(user | async)?.last_objective != null\">\n    Objectif fixé avec votre RH: \"{{(user | async).last_objective.objective}}\"</h5>\n  <h5 class=\"italic text-right\" *ngIf=\"(user | async)?.last_objective == null\">\n    Vous n'avez pas encore d'objectif fixé avec votre RH</h5>\n  <p class=\"text-right\" *ngIf=\"(user | async)?.availableSessionsCount > 0\">\n    Cliquez ici pour planifier une nouvelle séance\n    <a class=\"btn-floating btn-large waves-effect waves-light add-meeting-btn\" (click)=\"navigateToCreateSession()\">\n      <i class=\"material-icons\">add</i>\n    </a>\n  </p>\n</div>\n\n<er-meeting-list-coachee [user]=\"user \"></er-meeting-list-coachee>\n"

/***/ }),

/***/ 705:
/***/ (function(module, exports) {

module.exports = "<er-auth-header [user]=\"user\"></er-auth-header>\n\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ 706:
/***/ (function(module, exports) {

module.exports = "<div [ngsReveal]=\"{distance: '100px', origin: 'right', duration: 1000, delay: 200}\">\n  <h3 class=\"text-right welcome-message\">Bonjour {{ (user | async)?.first_name}},<br>\n    <span *ngIf=\"(HrUsageRate | async)?.sessions_done_month_count\" i18n>\n     Ce mois-ci, <span class=\"blue-text\">{{(HrUsageRate | async)?.sessions_done_month_count}}</span> { (HrUsageRate | async)?.sessions_done_month_count, plural, =0 {séance réalisée} =1 {séance réalisée} other {séances réalisées}}\n      pour <span class=\"blue-text\">{{(HrUsageRate | async)?.available_sessions_count}}</span> { (HrUsageRate | async)?.available_sessions_count, plural, =0 {possible} =1 {possible} other {possibles}}\n    </span>\n\n  </h3>\n  <p class=\"text-right\">\n    Cliquez ici pour ajouter un manager\n    <a class=\"btn-floating btn-large waves-effect waves-light add-meeting-btn\"\n       (click)=\"addPotentialCoacheeModalVisibility(true)\">\n      <i class=\"material-icons\">add</i>\n    </a>\n  </p>\n</div>\n\n<er-meeting-list-rh [user]=\"user\"\n                    #coacheesList\n                    (onStartAddNewObjectiveFlow)=\"startAddNewObjectiveFlow($event)\"></er-meeting-list-rh>\n\n\n<!-- Modal RH add new objective to Coachee -->\n<div id=\"add_new_objective_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <label>Définissez un objectif</label>\n      <input type=\"text\" placeholder=\"Objectif\" id=\"\" [(ngModel)]=\"coacheeNewObjective\">\n    </div>\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-blue btn-small\" (click)=\"cancelAddNewObjectiveModal()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateAddNewObjectiveModal()\"\n              [disabled]=\"!coacheeNewObjective\">Ajouter\n      </button>\n    </div>\n  </div>\n</div>\n\n\n<!-- Modal RH add Coachee -->\n<form [formGroup]=\"signInForm\" id=\"add_potential_coachee_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <label>Veuillez saisir l'adresse mail du manager. Un mail lui sera envoyé pour finaliser son\n            inscription.</label>\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <input type=\"email\" placeholder=\"Email\" id=\"potential_mail\" formControlName=\"email\">\n        </div>\n      </div>\n\n      <div id=\"add_potential_name_container\" class=\"row\">\n        <div class=\"col-sm-6\">\n          <input type=\"text\" placeholder=\"Prénom\" id=\"first_name\"\n                 formControlName=\"first_name\">\n        </div>\n\n        <div class=\"col-sm-6\">\n          <input type=\"text\" placeholder=\"Nom\" id=\"last_name\" formControlName=\"last_name\">\n\n        </div>\n      </div>\n\n\n      <!--<select [(ngModel)]=\"selectedPlan\"-->\n      <!--[ngModelOptions]=\"{standalone: true}\"-->\n      <!--name=\"plan_selector\"-->\n      <!--class=\"browser-default\">-->\n      <!--<option value=\"{{selectedPlan}}\" disabled selected>Sélectionnez un plan</option>-->\n      <!--<option *ngFor=\"let plan of plans | async\" [ngValue]=\"plan\">-->\n      <!--{{ plan.sessions_count }} séances-->\n      <!--</option>-->\n      <!--</select>-->\n\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <label>Votre manager bénéficiera de 3 séances</label>\n        </div>\n      </div>\n\n    </div>\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-plain btn-small\" (click)=\"cancelAddPotentialCoachee()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateAddPotentialCoachee()\"\n              [disabled]=\"!signInForm.valid\">Ajouter\n      </button>\n    </div>\n  </div>\n</form>\n"

/***/ }),

/***/ 707:
/***/ (function(module, exports) {

module.exports = "<footer>\n  <div class=\"container text-center\">\n    <a [routerLink]=\"'/legal-notice'\">Mentions légales</a>\n    <!--<a [routerLink]=\"'/terms-of-use'\">Conditions d'utilisation</a>-->\n  </div>\n</footer>\n"

/***/ }),

/***/ 708:
/***/ (function(module, exports) {

module.exports = "<header id=\"header\" class=\"page-topbar user-connected\"\n        [ngsReveal]=\"{scale:1, origin: 'top', distance:'200px', duration: 500}\">\n  <div class=\"navbar navbar-fixed z-depth-2\">\n    <nav>\n      <div class=\"navbar-color\">\n        <div class=\"col s12\">\n\n          <a (click)=\"goToHome()\" class=\"brand-logo left hide-on-med-and-down\">\n            <img src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\">\n          </a>\n          <a (click)=\"goToHome()\" class=\"brand-logo brand-logo-phone center hide-on-large-only\">\n            <img src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\">\n          </a>\n\n          <a data-activates=\"side-nav\" class=\"button-collapse left\">\n            <i class=\"mdi-navigation-menu\"></i>\n          </a>\n\n          <ul class=\"right hide-on-med-and-down\">\n            <!--<li *ngIf=\"canDisplayListOfCoach()\"><a (click)=\"goToCoachs()\">Liste Des Coachs</a></li>-->\n\n            <div *ngIf=\"!isAdmin\">\n              <li [class.has-notif]=\"hasAvailableMeetings\"\n                  [class.active]=\"router.url === '/dashboard/available_meetings'\"\n                  *ngIf=\"isUserACoach((user|async))\">\n                <a (click)=\"goToAvailableSessions()\">\n                  Demandes en attente</a>\n              </li>\n\n              <li [class.active]=\"router.url === '/dashboard/meetings'\">\n                <a (click)=\"goToMeetings()\">\n                  Tableau de bord</a>\n              </li>\n\n              <!--<li *ngIf=\"user && isUserACoach()\"><a (click)=\"goToProfile()\">Profil</a></li>-->\n\n              <li>\n                <a class=\"dropdown-button-notifs\" data-activates=\"notifs\"><i\n                  class=\"material-icons\">notifications</i></a>\n                <div class=\"notif-count\" *ngIf=\"(notifications | async) != null || (notifications | async)?.length > 0\">\n                  {{(notifications | async).length}}\n                </div>\n              </li>\n\n              <!--<li *ngIf=\"user\"><a (click)=\"onLogout()\">Déconnexion</a></li>-->\n\n              <li [class.active]=\"isEditingProfile()\">\n                <a class=\"dropdown-button-profile\" data-activates=\"profil\">\n                  <!--<img src=\"{{(user | async)?.avatar_url}}\" alt=\"profile image\"-->\n                  <!--class=\"item-user-img circle responsive-img\">-->\n                  <div class=\"item-user-img avatar\"\n                       *ngIf=\"(user | async)?.avatar_url && (user | async)?.avatar_url !== undefined\"\n                       [style.background-image]=\"'url(' + (user | async)?.avatar_url + ')'\"></div>\n                  {{ (user | async)?.first_name}} {{ (user | async)?.last_name}}\n                </a>\n              </li>\n            </div>\n\n            <div *ngIf=\"isAdmin\">\n              <li [class.active]=\"router.url === '/admin/coachs-list'\">\n                <a (click)=\"navigateToCoachsList()\">Nos Coachs</a></li>\n              <li [class.active]=\"router.url === '/admin/coachees-list'\">\n                <a (click)=\"navigateToCoacheesList()\">Nos Coachees</a></li>\n              <li [class.active]=\"router.url === '/admin/rhs-list'\">\n                <a (click)=\"navigateToRhsList()\">Nos Rhs</a></li>\n              <li [class.active]=\"router.url === '/admin/possible_coachs-list'\">\n                <a (click)=\"navigateToPossibleCoachsList()\">Demandes d'inscription</a></li>\n              <li>\n                <a (click)=\"goToWelcomePage()\" class=\"btn-basic btn-small btn-red btn-plain\">Quitter</a></li>\n            </div>\n          </ul>\n\n\n        </div>\n      </div>\n    </nav>\n\n  </div>\n\n</header>\n\n\n<!-- Side Nav -->\n<ul class=\"side-nav\" id=\"side-nav\">\n\n  <div class=\"side-nav-header\">\n    <div>\n      <div class=\"side-nav-header-container z-depth-1\" *ngIf=\"!isAdmin\">\n        <!--<img src=\"{{(user | async)?.avatar_url}}\" alt=\"profile image\"-->\n        <!--class=\"side-nav-user-img circle responsive-img z-depth-2\">-->\n        <div class=\"text-center\">\n          <div class=\"side-nav-user-img avatar z-depth-2\"\n               *ngIf=\"(user | async)?.avatar_url !== null && (user | async)?.avatar_url !== undefined\"\n               [style.background-image]=\"'url(' + (user | async)?.avatar_url + ')'\"></div>\n        </div>\n\n        <div class=\"side-nav-user-info text-center\">\n          <h6>{{ (user | async)?.first_name}} {{ (user | async)?.last_name}}</h6>\n          <span>{{(user | async)?.email}}</span>\n        </div>\n      </div>\n\n      <div class=\"side-nav-header-container z-depth-1\" *ngIf=\"isAdmin\">\n        <h3>Admin</h3>\n      </div>\n    </div>\n  </div>\n\n  <!--<li *ngIf=\"canDisplayListOfCoach()\"><a (click)=\"goToCoachs()\">Liste Des Coachs</a></li>-->\n\n  <!--<li *ngIf=\"user\"><a (click)=\"goToMeetings()\">Vos meetings</a></li>-->\n  <div class=\"side-nav-items\" *ngIf=\"!isAdmin\">\n    <li *ngIf=\"isUserACoach((user | async))\"\n        [class.active]=\"router.url === '/dashboard/available_meetings'\"><a (click)=\"goToAvailableSessions()\">Demandes\n      en attente</a></li>\n\n    <li [class.active]=\"router.url === '/dashboard/meetings'\"><a\n      (click)=\"goToMeetings()\">Tableau de bord</a></li>\n\n    <!--<li [hidden]=\"!user\">-->\n    <!--<a class=\"dropdown-button\" data-activates=\"notifs\"><i class=\"material-icons\">notifications</i></a>-->\n    <!--<div class=\"notif-count\">0</div>-->\n    <!--</li>-->\n\n    <li [class.active]=\"isEditingProfile()\">\n      <a (click)=\"goToProfile()\">Modifier mon profil</a></li>\n\n    <li><a (click)=\"onLogout()\">Déconnexion</a></li>\n  </div>\n\n  <div class=\"side-nav-items\" *ngIf=\"isAdmin\">\n    <li [class.active]=\"router.url === '/admin/coachs-list'\">\n      <a (click)=\"navigateToCoachsList()\">Nos Coachs</a></li>\n    <li [class.active]=\"router.url === '/admin/coachees-list'\">\n      <a (click)=\"navigateToCoacheesList()\">Nos Coachees</a></li>\n    <li [class.active]=\"router.url === '/admin/rhs-list'\">\n      <a (click)=\"navigateToRhsList()\">Nos Rhs</a></li>\n    <li [class.active]=\"router.url === '/admin/possible_coachs-list'\">\n      <a (click)=\"navigateToPossibleCoachsList()\">Demandes d'inscription</a></li>\n    <li>\n      <a (click)=\"goToWelcomePage()\">Quitter</a></li>\n  </div>\n\n</ul>\n\n\n<ul id=\"notifs\" class=\"dropdown-content dropdown-notifs collection\">\n  <li class=\"notif-item collection-item\" *ngIf=\"(notifications | async) == null\">Vous n'avez pas de notification</li>\n  <div *ngIf=\"(notifications | async) != null\">\n    <li class=\"notif-item collection-item notif-delete\"><a (click)=\"readAllNotifications()\">Marquer comme lues</a></li>\n    <li class=\"notif-item collection-item\" *ngFor=\"let notif of (notifications | async)\">\n      <p class=\"notif-date\">{{printDateString(notif.date)}}</p>\n      <p class=\"notif-messsage\">{{notif.message}}</p>\n    </li>\n  </div>\n</ul>\n\n<ul id=\"profil\" class=\"dropdown-content dropdown-profil collection\">\n  <li class=\"profil-item collection-item text-right\" (click)=\"goToProfile()\">\n    Modifier mon profil\n  </li>\n  <li class=\"profil-item collection-item text-right\" (click)=\"onLogout()\">Déconnexion</li>\n</ul>\n"

/***/ }),

/***/ 709:
/***/ (function(module, exports) {

module.exports = "<header class=\"page-topbar user-connected\"\n        [ngsReveal]=\"{scale:1, origin: 'top', distance:'200px', duration: 500}\">\n  <div class=\"navbar navbar-fixed\">\n    <nav>\n      <div class=\"navbar-color navbar-fixed z-depth-2\">\n        <div class=\"col s12\">\n          <a (click)=\"goToHome()\" class=\"brand-logo center hide-on-med-and-down \"><img\n            src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\"></a>\n\n          <a (click)=\"goToHome()\" class=\"brand-logo brand-logo-phone center hide-on-large-only\"><img\n            src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\"></a>\n        </div>\n      </div>\n    </nav>\n  </div>\n</header>\n"

/***/ }),

/***/ 710:
/***/ (function(module, exports) {

module.exports = "<header class=\"z-depth-2\"\n        [ngsReveal]=\"{scale:1, origin: 'top', distance:'200px', duration: 500}\">\n  <div class=\"navbar\">\n    <nav>\n      <div class=\"navbar-color\">\n        <div class=\"col s12\">\n          <a (click)=\"goToHome()\" class=\"brand-logo center hide-on-med-and-down\"><img\n            src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\"></a>\n\n          <a (click)=\"goToHome()\" class=\"brand-logo brand-logo-phone center hide-on-large-only\"><img\n            src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\"></a>\n\n          <!--<ul class=\"right hide-on-med-and-down\">-->\n            <!--<div>-->\n              <!--<li [class.active]=\"router.url === '/admin/coachs-list'\">-->\n                <!--<a (click)=\"goToRegisterCoach()\">Devenir coach Eritis</a></li>-->\n            <!--</div>-->\n          <!--</ul>-->\n        </div>\n      </div>\n    </nav>\n  </div>\n\n  <div class=\"welcome-header\">\n    <div class=\"container\">\n      <h1 class=\"header-title\"\n          [ngsReveal]=\"{scale:0, duration: 500, delay: 500}\">\n        Atteignez vos objectifs</h1>\n      <h3 class=\"header-subtitle ultra-light-grey-text\"\n          [ngsReveal]=\"{distance: 0, scale: 1, opacity: 0, duration: 2000, delay: 1000}\">\n        Séances de coaching individuel avec un coach certifié</h3>\n\n      <div class=\"row hide-on-small-and-down\">\n        <div class=\"header-btn col-xs-12 col-sm-6\">\n          <a pageScroll class=\"btn-basic btn-small right\" (click)=\"goToRegisterCoach()\">Devenir coach</a>\n        </div>\n        <div class=\"header-btn col-xs-12 col-sm-6\">\n          <button class=\"btn-basic btn-plain btn-connexion btn-small left\" (click)=\"toggleLoginStatus()\"><i class=\"material-icons\">perm_identity</i>\n            Connexion\n          </button>\n        </div>\n      </div>\n\n      <div class=\"row hide-on-med-and-up\">\n        <div class=\"header-btn col-xs-12 col-sm-6\">\n          <a pageScroll class=\"btn-basic btn-small\" (click)=\"goToRegisterCoach()\">Devenir coach</a>\n        </div>\n        <div class=\"header-btn col-xs-12 col-sm-6\">\n          <button class=\"btn-basic btn-plain btn-connexion btn-small\" (click)=\"toggleLoginStatus()\"><i\n            class=\"material-icons\">perm_identity</i>\n            Connexion\n          </button>\n        </div>\n      </div>\n\n      <div id=\"signin\">\n        <er-signin></er-signin>\n        <br>\n        <a (click)=\"onForgotPasswordClicked()\">Mot de passe oublié ?</a>\n      </div>\n\n      <a pageScroll href=\"#presentation\" class=\"header-arrow-bottom\"><i class=\"fa fa-angle-down\"\n                                                                        aria-hidden=\"true\"></i></a>\n    </div>\n  </div>\n</header>\n\n\n<!-- Modal Forgot password -->\n<div id=\"forgot_password_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <label>Veuillez saisir votre adresse email</label>\n      <input type=\"email\" placeholder=\"Email\" [(ngModel)]=\"forgotEmail\">\n    </div>\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-plain btn-small\" (click)=\"cancelForgotPasswordModal()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateForgotPasswordModal()\"\n              [disabled]=\"!forgotEmail\">Confirmer\n      </button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 711:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div id=\"introduction\">\n    <h1 class=\"black-text text-center\">Politique sur les cookies</h1>\n    <p>\n      Ce site utilise des cookies: de petits fichiers texte placés sur votre machine\n      pour aider le site à offrir une meilleure expérience utilisateur. En général,\n      les cookies sont utilisés pour conserver les préférences de l’utilisateur, stocker\n      des informations pour des choses comme des chariots d’achat et fournir des données\n      de suivi anonymes à des applications tierces comme Google Analytics. En règle générale,\n      les cookies amélioreront votre expérience de navigation. Cependant, si vous préférez\n      désactiver les cookies sur ce site et sur d’autres. Le moyen le plus efficace est\n      de désactiver les cookies dans votre navigateur.\n    </p>\n  </div>\n</div>\n"

/***/ }),

/***/ 712:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div id=\"introduction\">\n    <h1 class=\"black-text text-center\">Mentions légales</h1>\n    <br>\n    <h3 class=\"black-text\">Informations éditeurs</h3>\n    <p>\n      Ce site est édité par Eritis, Société par Actions Simplifiées.\n      <br>78 avenue de Saint Mandé\n      <br>75012 Paris\n      <br>FRANCE\n      <br>+33 6 80 94 56 83\n      <br>\n      <br>RCS : 830 433 280 Paris\n      <br>Montant du capital social : 1,000.00€\n      <br>Directeur de la publication : Theo Marcolini\n    </p>\n\n    <h3 class=\"black-text\">Informations hébergeur</h3>\n    <p>\n      Google Ireland Limited,\n      <br>Gordon House,\n      <br>Barrow Street,\n      <br>Dublin 4\n      <br>IRLANDE\n      <br>+353 1 543 1004\n    </p>\n\n  </div>\n</div>\n"

/***/ }),

/***/ 713:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div id=\"introduction\">\n    <h1 class=\"black-text text-center\">Conditions d'utilisation</h1>\n    <p>\n      Voici nos conditions d'utilisation.\n    </p>\n  </div>\n</div>\n"

/***/ }),

/***/ 714:
/***/ (function(module, exports) {

module.exports = "<div class=\"preloader-wrapper active\">\n  <div class=\"spinner-layer spinner-blue-only\">\n    <div class=\"circle-clipper left\">\n      <div class=\"circle\"></div>\n    </div>\n    <div class=\"gap-patch\">\n      <div class=\"circle\"></div>\n    </div>\n    <div class=\"circle-clipper right\">\n      <div class=\"circle\"></div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 715:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div id=\"code-deontologie\">\n    <h1 class=\"black-text text-center\">Code de déontologie Eritis</h1>\n    <div class=\"text-center\"><span class=\"italic\">(Version mise à jour en juin 2017)</span></div>\n\n    <br><br>\n    <p>Ce code est établi par la Société Eritis exclusivement pour la pratique du coaching professionnel sur la plate forme Eritis,\n      et est une adaptation du code de déontologie de la Société Française de Coaching. Il est opposable à tout coach intervenant\n      sur la plateforme Eritis. Il vise à formuler des points de repère déontologiques, compte tenu des spécificités du e-coaching\n      en tant que processus d'accompagnement d'une personne dans sa vie professionnelle.\n      <br>Ce  code  de  déontologie  est  donc l'expression  d'une  réflexion  éthique;  il  s'agit  de  principes généraux. Leur application pratique requiert une capacité de discernement.\n    </p>\n\n    <br><br>\n    <h4 class=\"black-text\">Devoirs du coach</h4>\n    <p><span class=\"black-text bold\">Art. 1-1 - Exercice du Coaching</span>\n      <br>\n      Le coach s'autorise en conscience à exercer cette fonction\n      à partir de sa formation, de son experience, de sa supervision et de son développement personnel.\n    </p>\n    <p><span class=\"black-text bold\">Art. 1-2 - Confidentialité</span>\n      <br>\n      Le coach s'astreint au secret professionnel.\n    </p>\n    <p><span class=\"black-text bold\">Art. 1-3 - Supervision établie</span>\n      <br>\n      L'exercice professionnel du coaching nécessite une supervision.\n      Les coachs accrédités de la Société Eritis sont tenus de disposer d'un lieu de supervision.\n    </p>\n    <p><span class=\"black-text bold\">Art. 1-4 - Respect des personnes</span>\n      <br>\n      Conscient de sa position, le coach s'interdit d'exercer tout abus d'influence.\n    </p>\n    <p><span class=\"black-text bold\">Art. 1-5 - Obligation de moyens</span>\n      <br>\n      Le coach prend tous les moyens propres à permettre, dans le cadre de la demande du client,\n      le développement professionnel et personnel du coaché, y compris en ayant recours, si besoin est, à un confrère.\n    </p>\n    <p><span class=\"black-text bold\">Art. 1-6 - Refus  de prise en charge</span>\n      <br>\n      Le coach accepte librement toute proposition de séances,\n      et peut refuser toute séance pour des raisons propres à l'organisation, au demandeur ou à lui-même.\n    </p>\n\n    <br><br>\n    <h4 class=\"black-text\">Devoirs du coach vis à vis du coaché</h4>\n    <p><span class=\"black-text bold\">Art. 2-1 - Lieu du Coaching</span>\n      <br>\n      Les séances de coaching se passe en visio-conférence, ou en audio si la qualité de la\n      vision ne le permet pas. Le coach se doit d'être attentif à la signification et aux effets du lieu dans lequel il réalise la séance de e-coaching.\n    </p>\n    <p><span class=\"black-text bold\">Art. 2-2 - Responsabilité des décisions</span>\n      <br>\n      Le coaching est une technique de développement professionnel et personnel.\n      Le coach laisse de ce fait toute la responsabilité de ses décisions au coaché.\n    </p>\n    <p><span class=\"black-text bold\">Art. 2-3 - Demande formulée</span>\n      <br>\n      La demande de coaching est formulée par le coaché, et une demande peut etre formulée par l’entreprise sous la forme d’un ou\n      plusieurs objectifs de développement. Le coach valide la demande du coaché, et inscrit le travail dans le cadre de l’objectif formulé par l’entreprise.\n    </p>\n    <p><span class=\"black-text bold\">Art. 2-4 - Protection de la personne</span>\n      <br>\n      Le coach adapte son intervention dans le respect des étapes de développement du coaché.\n    </p>\n\n    <br><br>\n    <h4 class=\"black-text\">Devoirs du coach vis à vis de l'organisation</h4>\n    <p><span class=\"black-text bold\">Art. 3-1 - Protection des organisations</span>\n      <br>\n      Le coach est attentif au métier, aux usages, à la culture,\n      au contexte et aux contraintes de l'organisation pour laquelle il travaille.\n    </p>\n    <p><span class=\"black-text bold\">Art. 3-2 - Restitution au donneur d'ordre</span>\n      <br>\n      Le coach ne peut rendre compte pas de son action au donneur d'ordre.\n      Le coach et le coaché élabore à l’issue de chaque séance un compte rendu de session qui reste la propriété du coaché.\n      Une analyse qualitative anonymée des problématiques émergentes est réalisée par Eritis tous les 3 mois et restituée au donneur d’ordre,\n      à partir où plus de 10 coachés ont réalisés des séances.\n    </p>\n    <p><span class=\"black-text bold\">Art. 3-3 - Equilibre de l'ensemble du système</span>\n      <br>\n      Le coaching s'exerce dans la synthèse des intérêts du coaché et de son organisation.\n    </p>\n\n    <br><br>\n    <h4 class=\"black-text\">Recours</h4>\n    <p><span class=\"black-text bold\">Art. 4-1 - Recours auprès d’Eritis</span>\n      <br>\n      Toute organisation ou personne peut recourir volontairement auprès d’Eritis en cas de manquement\n      aux règles professionnelles élémentaires inscrites dans ce code ou de conflit avec un coach accrédité d’Eritis.\n    </p>\n\n    <br><br>\n    <div class=\"text-center\">\n      <button class=\"btn-basic btn-plain btn-small btn-blue\" (click)=\"goToCoachRegister()\">Retour</button>\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ 716:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div id=\"registerForm\" [ngsRevealSet]=\"{distance:0, opacity:0}\" [ngsSelector]=\"'.input-container, .section-form-title'\">\n\n    <h1 class=\"black-text text-center\">Formulaire d'inscription</h1>\n\n    <div class=\"form-save-buttons\">\n      <p>Les réponses que vous rentrez sont sauvegardées, vous pouvez donc revenir à ce formulaire ultérieurement.</p>\n    </div>\n\n    <form [formGroup]=\"registerForm\" (change)=\"saveFormValues()\">\n\n      <div class=\"row\">\n        <h2 class=\"col-lg-12 section-form-title\">Informations personnelles</h2>\n\n        <div class=\"col-lg-6\">\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label for=\"lastname\">Votre nom</label>\n              <span><i>Apparaîtra sur le site</i></span>\n              <input type=\"text\" id=\"lastname\" name=\"lastname\" formControlName=\"lastname\" placeholder=\"Votre nom\">\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label for=\"firstname\">Votre prénom</label>\n              <span><i>Apparaîtra sur le site</i></span>\n              <input type=\"text\" id=\"firstname\" name=\"firstname\" formControlName=\"firstname\" placeholder=\"Votre prénom\">\n            </div>\n\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Votre adresse email</label>\n              <input type=\"email\" id=\"email\" name=\"email\" formControlName=\"email\" placeholder=\"exemple@mail.com\">\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Votre téléphone portable</label>\n              <input type=\"email\" id=\"phoneNumber\" name=\"phoneNumber\" formControlName=\"phoneNumber\"\n                     placeholder=\"06 ...\">\n            </div>\n          </div>\n\n        </div>\n\n        <div class=\"col-lg-6 input-container\">\n          <label>Photo de profil</label>\n          <span><i>Apparaîtra sur le site</i></span>\n\n          <div class=\"avatar-container input-container\">\n            <div id=\"avatar-preview\"\n                 class=\"avatar z-depth-2\"\n                 [style.background-image]=\"'url(' + registerForm.value.avatar + ')'\"\n                 *ngIf=\"avatarUrl != null\"></div>\n            <div class=\"input-file-container\">\n              <button class=\"btn-basic btn-blue btn-plain btn-small file-upload-button\">Choisir un fichier</button>\n              <input type=\"file\"\n                     id=\"upload-avatar-input\"\n                     accept=\".jpeg,.jpg,.png\"\n                     (change)=\"filePreview($event, 'avatar')\">\n            </div>\n          </div>\n        </div>\n\n        <div class=\"col-lg-12\">\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Décrivez-vous en quelques lignes</label>\n              <span><i>Apparaîtra sur le site</i></span>\n              <textarea id=\"description\" name=\"description\" formControlName=\"description\"\n                        placeholder=\"Description...\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Lien vers votre profil Linkedin</label>\n              <input type=\"url\" id=\"linkedin_url\" name=\"linkedin_url\" formControlName=\"linkedin_url\"\n                     placeholder=\"https://...\">\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Langue(s) pratiquée(s) en coaching ?</label>\n              <div class=\"row\">\n                <div class=\"col-lg-4\">\n                  <input type=\"text\" id=\"lang1\" name=\"lang1\" placeholder=\"Langue 1\" formControlName=\"lang1\">\n                </div>\n                <div class=\"col-lg-4\">\n                  <input type=\"text\" id=\"lang2\" name=\"lang2\" placeholder=\"Langue 2 (facultatif)\"\n                         formControlName=\"lang2\">\n                </div>\n                <div class=\"col-lg-4\">\n                  <input type=\"text\" id=\"lang3\" name=\"lang3\" placeholder=\"Langue 3 (facultatif)\"\n                         formControlName=\"lang3\">\n                </div>\n              </div>\n            </div>\n          </div>\n\n        </div>\n\n        <!-- coach activity -->\n\n        <h2 class=\"col-lg-12 section-form-title\">Votre activité de coach</h2>\n\n        <div class=\"col-lg-12\">\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Quelques éléments de parcours professionnel?</label>\n              <textarea type=\"text\" id=\"career\" name=\"career\" formControlName=\"career\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Quelles activités exercez-vous autres que le coaching individuel ?</label>\n              <textarea type=\"text\" id=\"extraActivities\" name=\"extraActivities\"\n                     formControlName=\"extraActivities\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Vos diplômes, certifications, référencements, accréditations dans le domaine du coaching ?</label>\n              <textarea type=\"text\" id=\"degree\" name=\"degree\"\n                     placeholder=\"Diplômes, certifications, accréditations, ...\"\n                     formControlName=\"degree\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Depuis combien de temps exercez-vous une activité de coaching individuel, et combien d’heures\n                avez-vous déjà réalisées ?</label>\n              <textarea type=\"text\" id=\"coachingExperience\" name=\"coachingExperience\" placeholder=\"3 ans, 8 mois, ...\"\n                     formControlName=\"coachingExperience\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Quelles sont vos expériences en coaching à distance, visio, skype ?</label>\n              <textarea type=\"text\" id=\"remoteCoachingExperience\" name=\"remoteCoachingExperience\"\n                     placeholder=\"3 ans, 8 mois, ...\"\n                     formControlName=\"remoteCoachingExperience\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Quelles sont vos expériences en coaching bref sur 45 minutes ?</label>\n              <textarea id=\"experienceShortSession\" name=\"experienceShortSession\" placeholder=\"Précisez...\"\n                        formControlName=\"experienceShortSession\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Des spécialités, des spécificités dans les situations de coaching que vous réalisez?</label>\n              <textarea id=\"coachingSpecifics\" name=\"coachingSpecifics\" placeholder=\"Précisez...\"\n                        formControlName=\"coachingSpecifics\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Quel est votre dispositif de supervision ?</label>\n              <textarea type=\"text\" id=\"supervision\" name=\"supervision\" placeholder=\"Précisez...\"\n                     formControlName=\"supervision\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Quelques éléments de votre parcours de développement personnel/ thérapie ?</label>\n              <textarea type=\"text\" id=\"therapyElements\" name=\"therapyElements\" placeholder=\"Précisez...\"\n                     formControlName=\"therapyElements\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Quel est votre chiffre d'affaires sur les 3 dernières années ?</label>\n              <div class=\"row\">\n                <div class=\"col-lg-4\">\n                  <input type=\"text\" id=\"ca1\" name=\"ca1\" placeholder=\"2016\" formControlName=\"ca1\">\n                </div>\n                <div class=\"col-lg-4\">\n                  <input type=\"text\" id=\"ca2\" name=\"ca2\" placeholder=\"2015\" formControlName=\"ca2\">\n                </div>\n                <div class=\"col-lg-4\">\n                  <input type=\"text\" id=\"ca3\" name=\"ca3\" placeholder=\"2014\" formControlName=\"ca3\">\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Quelle est la part de votre CA en coaching individuel ?</label>\n              <input type=\"text\" id=\"percentageCoachingInRevenue\" name=\"percentageCoachingInRevenue\" placeholder=\"%s\"\n                     formControlName=\"percentageCoachingInRevenue\">\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Quel est votre statut juridique?</label>\n              <input type=\"text\" id=\"legalStatus\" name=\"legalStatus\" placeholder=\"Statut juridique\"\n                     formControlName=\"legalStatus\">\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Avez-vous une copie de votre assurance RC Pro ?</label><br>\n              Si vous disposez pas d'une copie dans l'immédiat, merci de nous la faire parvenir a l'adresse suivante:\n              diana@eritis.co.uk (nécessaire pour finaliser l'inscription).\n              <div class=\"input-file-container\">\n                <span class=\"bold\" *ngIf=\"insuranceUrl != null\">{{insuranceUrl.name}} </span>\n                <button class=\"btn-basic btn-blue btn-plain btn-small file-upload-button\">Choisir un fichier</button>\n                <input type=\"file\"\n                       accept=\".pdf\"\n                       formControlName=\"insurance_document\"\n                       (change)=\"filePreview($event, 'insurance')\">\n              </div>\n            </div>\n          </div>\n        </div>\n\n\n        <!-- coach activity END -->\n\n        <!-- Invoice -->\n\n        <h2 class=\"col-lg-12 section-form-title\">Coordonnées de facturation pour que nous puissions vous régler par\n          virement\n        </h2>\n\n        <div class=\"col-lg-12\">\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Entité</label>\n              <input type=\"text\" id=\"invoice_entity\" name=\"invoice_entity\" formControlName=\"invoice_entity\"\n                     placeholder=\"Nom civil, nom de l'entreprise, ...\">\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>N° Siret</label>\n              <input type=\"text\" id=\"invoice_siret_number\" name=\"invoice_siret_number\"\n                     formControlName=\"invoice_siret_number\"\n                     placeholder=\"Votre numéro Siret\">\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 input-container\">\n              <label>Adresse</label>\n              <input type=\"text\" id=\"invoice_address\" name=\"invoice_address\" formControlName=\"invoice_address\"\n                     placeholder=\"Adresse\">\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-6 input-container\">\n              <label>Ville</label>\n              <input type=\"text\" id=\"invoice_city\" name=\"invoice_city\"\n                     placeholder=\"Ville\"\n                     formControlName=\"invoice_city\">\n            </div>\n\n            <div class=\"col-lg-6 input-container\">\n              <label>Code postal</label>\n              <input type=\"text\" id=\"invoice_postcode\" name=\"invoice_postcode\"\n                     placeholder=\"Code postal\"\n                     formControlName=\"invoice_postcode\">\n            </div>\n          </div>\n\n        </div><!-- invoice END -->\n\n\n        <div class=\" col-lg-12 text-center input-container\">\n          <button class=\"btn-basic btn-plain btn-small btn-blue\"\n                  *ngIf=\"!onRegisterLoading\"\n                  [disabled]=\"!registerForm.valid\"\n                  (click)=\"onRegister()\">\n            Valider\n          </button>\n\n          <div class=\"preloader-wrapper active\" *ngIf=\"onRegisterLoading\">\n            <div class=\"spinner-layer spinner-blue-only\">\n              <div class=\"circle-clipper left\">\n                <div class=\"circle\"></div>\n              </div>\n              <div class=\"gap-patch\">\n                <div class=\"circle\"></div>\n              </div>\n              <div class=\"circle-clipper right\">\n                <div class=\"circle\"></div>\n              </div>\n            </div>\n          </div>\n        </div>\n\n      </div><!--end row>-->\n\n    </form>\n\n  </div>\n</div>\n"

/***/ }),

/***/ 717:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div id=\"finalMessage\" class=\"text-center\">\n    <h3 class=\"black-text\">Merci pour votre candidature !</h3>\n    <h5>Vous recevrez un mail lorsque votre candidature sera acceptée afin de finaliser votre inscription.</h5>\n    <br><br>\n    <div class=\" col-lg-12 text-center input-container\">\n      <button class=\"btn-basic btn-plain btn-small btn-blue\" (click)=\"goToWelcomePage()\">Terminer</button>\n    </div>\n  </div>\n\n</div>\n"

/***/ }),

/***/ 718:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div id=\"introduction\">\n    <h1 class=\"black-text text-center\">L'équipe Eritis vous souhaite la bienvenue !</h1>\n    <br>\n    <div class=\"introduction-text\">\n      <p>Nous avons été récemment en contact, et sommes heureux de vous transmettre le lien pour continuer le processus\n        de référencement sur notre plateforme Eritis. En continuant le processus de référencement Eritis, vous vous engagez\n        à respecter notre code de déontologie, et les différents conditions d’exercices ci dessous. Pour continuer vers l’étape\n        suivante, nous vous remercions de renseigner les données suivantes. Une fois votre dossier complété, nous reviendrons\n        vers vous pour planifier un entretien de 45’ avec 2 de nos référents métier, et nous vous donnerons alors notre feedback\n        en vue d’un référencement définitif sur notre plateforme.</p>\n\n      <br>\n      <p>Pour continuer, merci de prendre connaissance des pre-requis et engagements ci dessous, et d'accepter la chartre de deontologie Eritis.</p>\n\n      <br>\n      <p>Quelques prérequis:</p>\n      <ol>\n        <li>Vous avez une expérience de 2 ans minimum en tant que coach professionnel en entreprise.</li>\n        <li>Vous disposez d’un espace de supervision, et de développement personnel.</li>\n        <li>Vous disposez du matériel informatique, et de la connexion qui vous permette de réaliser\n          les sessions en visio avec une qualité d’image et de sons adaptée à une séance de travail.</li>\n        <li>Vous suivez une supervision a la fréquence d'un fois tous les 2 mois minimum.</li>\n      </ol>\n\n      <br>\n      <p>Quelques engagements:</p>\n      <ol>\n        <li>Vous vous engagez à respecter le code de déontologie.</li>\n        <li>Vous vous engagez à respecter la ponctualité des séances de travail\n          avec les coachés, et à rédiger un compte rendu avec le coaché pendant les 5\n          dernières minutes de la séance et à le mettre en ligne immédiatement sur la plateforme.</li>\n        <li>Votre activité de coaching auprès d’Eritis représente moins de 50% de votre activité principale.</li>\n        <li>Vous vous engagez à suivre une séance de supervision sur notre plateforme avec un de nos coachs référents tous les 2 mois.</li>\n        <li>Votre tenue vestimentaire et le décor visible autour de vous en visio sont compatibles avec les codes du monde de l’entreprise.</li>\n        <li>Votre tenue vestimentaire et le décor visible autour de vous en visio sont compatibles avec les codes du monde de l’entreprise.</li>\n        <li>Vous nous transmettez votre attestation de Responsabilité Civile Professionnelle à jour.</li>\n      </ol>\n\n      <br><br>\n      <input type=\"checkbox\" id=\"check-deontologie\" (change)=\"toggleAcceptedConditions()\" [checked]=\"hasAcceptedConditions()\"/>\n      <label for=\"check-deontologie\">J'ai lu et j'accepte le <a (click)=\"goToDeontologie()\">code de déontologie</a></label>\n\n      <br><br>\n      <div class=\"text-center\">\n        <button class=\"btn-basic btn-plain btn-small btn-blue\"\n                (click)=\"goToForm()\"\n                [disabled]=\"!hasAcceptedConditions()\">Continuer</button>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 719:
/***/ (function(module, exports) {

module.exports = "<div id=\"signin_container\">\n  <div class=\"section\">\n    <form [formGroup]=\"signInForm\" (ngSubmit)=\"onSignIn()\" class=\"center header-signin\">\n      <div class=\"text-left\">\n        <label for=\"email\">Email</label>\n        <input type=\"email\" id=\"email\" name=\"email\" formControlName=\"email\"/>\n      </div>\n\n      <div class=\"text-left\">\n        <label for=\"password\">Mot de passe</label>\n        <input type=\"password\" id=\"password\" name=\"password\" formControlName=\"password\">\n      </div>\n\n      <div class=\"text-center\">\n        <button type=\"submit\" name=\"action\" [disabled]=\"!signInForm.valid\" *ngIf=\"!loginLoading\">Go</button>\n\n        <div class=\"preloader-wrapper active\" *ngIf=\"loginLoading\">\n          <div class=\"spinner-layer spinner-white\">\n            <div class=\"circle-clipper left\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"gap-patch\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"circle-clipper right\">\n              <div class=\"circle\"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- sign up error div-->\n      <div *ngIf=\"error && errorMessage != ''\">\n        <!-- add extra separator-->\n        <hr>\n        <small class=\"text-danger\">\n          {{errorMessage}}\n        </small>\n      </div>\n\n    </form>\n  </div><!--end section-->\n</div>\n\n"

/***/ }),

/***/ 720:
/***/ (function(module, exports) {

module.exports = "<br>\n<h2>Envoyer une invitation RH</h2>\n<br>\n<div class=\"row\">\n  <form class=\"col s12\" [formGroup]=\"signUpForm\" (ngSubmit)=\"onSignUpSubmitted()\">\n    <div class=\"row\">\n      <div class=\"col-lg-6\">\n        <label for=\"name\">Prénom</label>\n        <input id=\"name\" type=\"text\" formControlName=\"name\" placeholder=\"Prénom\">\n      </div>\n\n      <div class=\"col-lg-6\">\n        <label for=\"lastname\">Nom</label>\n        <input id=\"lastname\" type=\"text\" formControlName=\"lastname\" placeholder=\"Nom\">\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-lg-6\">\n        <label for=\"email\">Email</label>\n        <input id=\"email\" type=\"email\" formControlName=\"email\" placeholder=\"exemple@mail.com\">\n      </div>\n\n      <div class=\"col-lg-6\">\n        <label for=\"company\">Entreprise</label>\n        <input id=\"company\" type=\"text\" formControlName=\"company\" placeholder=\"Entreprise\">\n      </div>\n    </div>\n\n    <!--<div>-->\n      <!--<label for=\"signup_type_selector\">Type</label>-->\n      <!--<select [(ngModel)]=\"signUpSelectedType\"-->\n              <!--[ngModelOptions]=\"{standalone: true}\"-->\n              <!--name=\"signup_type_selector\"-->\n              <!--id=\"signup_type_selector\"-->\n              <!--class=\"browser-default\">-->\n        <!--<option value=\"{{signUpSelectedType}}\" disabled selected>Sélectionnez un Type</option>-->\n        <!--<option *ngFor=\"let type of signUpTypes\" [ngValue]=\"type\">-->\n          <!--{{ getSignUpTypeName(type) }}-->\n        <!--</option>-->\n      <!--</select>-->\n    <!--</div>-->\n\n    <div *ngIf=\"signUpSelectedType == 1\">\n      <h4>Choisir un plan pour ce coaché</h4>\n      <div *ngFor=\"let plan of plans | async\" (click)=\"onSelectPlan(plan)\"\n           [class.contract_selected]=\"plan == mSelectedPlan\">\n        Plan id : {{plan.plan_id}}\n        Plan Name : {{plan.plan_name}}\n        Plan Sessions count : {{plan.sessions_count}}\n      </div>\n    </div>\n\n    <div class=\"text-center\">\n      <div *ngIf=\"!sendLoading\">\n        <button class=\"btn-basic btn-blue btn-plain btn-small right\" type=\"submit\" name=\"action\"\n                [disabled]=\"!signUpForm.valid  || signUpSelectedType==null || (signUpSelectedType == 1 && !mSelectedPlan)\">\n          Valider\n        </button>\n      </div>\n\n      <div *ngIf=\"sendLoading\">\n        <div class=\"preloader-wrapper active\">\n          <div class=\"spinner-layer spinner-blue\">\n            <div class=\"circle-clipper left\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"gap-patch\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"circle-clipper right\">\n              <div class=\"circle\"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <!-- sign up error div-->\n    <div *ngIf=\"error && errorMessage != ''\">\n      <!-- add extra separator-->\n      <hr>\n      <small class=\"text-danger\">\n        {{errorMessage}}\n      </small>\n    </div>\n\n  </form>\n</div>\n\n<div class=\"row\">\n  <div class=\"card-panel col s12\">\n    <h4 class=\"black-text\">Conseils</h4>\n    <p>Un email sera envoyé à l'adresse mail entrée, assurez-vous de posséder cet email</p>\n    <br>\n\n    <h5 class=\"black-text\">Email possibles</h5>\n    <div class=\"row\">\n      <div class=\"col-lg-4\">\n        <p>coach.1.eritis@gmail.com</p>\n        <p>pwd : passwordEritis</p>\n      </div>\n\n      <div class=\"col-lg-4\">\n        <p>coachee.1.eritis@gmail.com</p>\n        <p>pwd : passwordEritis</p>\n      </div>\n\n      <div class=\"col-lg-4\">\n        <p>rh.1.eritis@gmail.com</p>\n        <p>pwd : passwordEritis</p>\n      </div>\n    </div>\n\n  </div><!--end card-panel-->\n</div><!--end row-->\n"

/***/ }),

/***/ 721:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col s12 m12 l6\">\n      <div>\n        <h4 class=\"black-text\">Bienvenue chez Eritis</h4>\n        <div class=\"row\">\n          <form class=\"col s12\" [formGroup]=\"signUpForm\" (ngSubmit)=\"onSignUpSubmitted()\">\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <p>Votre email {{ (potentialCoachObs | async)?.email }}</p>\n              </div>\n            </div>\n\n            <p>Choississez un mot de passe pour finaliser votre inscription.</p>\n\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <label for=\"password\">Password</label>\n                <input id=\"password\" type=\"password\" formControlName=\"password\">\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['password'].pristine && !signUpForm.controls['password'].valid\">\n                  Votre mot de passe doit contenir au moins 6 caractères.\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <label for=\"confirm_password\">Confirm Password</label>\n                <input id=\"confirm_password\" type=\"password\" formControlName=\"confirmPassword\">\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['confirmPassword'].pristine && signUpForm.controls['confirmPassword'].errors && signUpForm.controls['confirmPassword'].errors['passwordNoMatch']\">\n                  Confirmation incorrecte.\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <button class=\"btn-basic btn-blue btn-small btn-plain right\" type=\"submit\" name=\"action\"\n                        [disabled]=\"!signUpForm.valid\">Valider\n                </button>\n              </div>\n            </div>\n\n\n            <!-- sign up error div-->\n\n            <div *ngIf=\"error && errorMessage != ''\">\n\n              <!-- add extra separator-->\n              <hr>\n\n              <small class=\"text-danger\">\n                {{errorMessage}}\n              </small>\n            </div>\n\n          </form>\n        </div>\n      </div><!--end card panel-->\n    </div>\n  </div><!--end row-->\n</div><!--end section-->\n"

/***/ }),

/***/ 722:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col s12 m12 l6\">\n      <div>\n        <h4 class=\"black-text\">Bonjour, vous bénéficiez de <span\n          class=\"blue-text\">{{ (potentialCoacheeObs | async)?.plan.sessions_count }}</span> séances !</h4>\n        <div class=\"row\">\n          <form class=\"col s12\" [formGroup]=\"signUpForm\" (ngSubmit)=\"onSignUpSubmitted()\">\n\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <p>Votre email {{ (potentialCoacheeObs | async)?.email }}</p>\n              </div>\n            </div>\n\n            <p>Choisissez un mot de passe pour finaliser votre inscription.</p>\n\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <label for=\"password\">Password</label>\n                <input id=\"password\" type=\"password\" formControlName=\"password\">\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['password'].pristine && !signUpForm.controls['password'].valid\">\n                  Votre mot de passe doit contenir au moins 6 caractères.\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <label for=\"confirm_password\">Confirm Password</label>\n                <input id=\"confirm_password\" type=\"password\" formControlName=\"confirmPassword\">\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['confirmPassword'].pristine && signUpForm.controls['confirmPassword'].errors && signUpForm.controls['confirmPassword'].errors['passwordNoMatch']\">\n                  Confirmation incorrecte.\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <button class=\"btn-basic btn-blue btn-small btn-plain right\" type=\"submit\" name=\"action\"\n                        [disabled]=\"!signUpForm.valid\">Valider\n                </button>\n              </div>\n            </div>\n\n\n            <!-- sign up error div-->\n\n            <div *ngIf=\"error && errorMessage != ''\">\n\n              <!-- add extra separator-->\n              <hr>\n\n              <small class=\"text-danger\">\n                {{errorMessage}}\n              </small>\n            </div>\n\n          </form>\n        </div>\n      </div><!--end card panel-->\n    </div>\n  </div><!--end row-->\n</div><!--end section-->\n"

/***/ }),

/***/ 723:
/***/ (function(module, exports) {

module.exports = "<er-simple-header></er-simple-header>\n\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col s12 m12 l6\">\n      <div>\n        <h3 class=\"black-text\">Bonjour {{ (potentialRhObs | async)?.firstName }}, bienvenue chez Eritis !</h3>\n        <p><span class=\"black-text\">Votre email:</span> {{ (potentialRhObs | async)?.email }}</p>\n        <br>\n        <h4>Choississez un mot de passe pour finaliser votre inscription</h4>\n\n\n        <div class=\"row\">\n          <form class=\"col s12\" [formGroup]=\"signUpForm\" (ngSubmit)=\"onSignUpSubmitted()\">\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <label for=\"password\">Password</label>\n                <input id=\"password\" type=\"password\" formControlName=\"password\">\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['password'].pristine && !signUpForm.controls['password'].valid\">\n                  Votre mot de passe doit contenir au moins 6 caractères.\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"col s12\">\n                <label for=\"confirm_password\">Confirm Password</label>\n                <input id=\"confirm_password\" type=\"password\" formControlName=\"confirmPassword\">\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['confirmPassword'].pristine && signUpForm.controls['confirmPassword'].errors && signUpForm.controls['confirmPassword'].errors['passwordNoMatch']\">\n                  Confirmation incorrecte.\n                </small>\n              </div>\n            </div>\n\n            <div class=\"text-center\">\n              <div *ngIf=\"!sendLoading\">\n                <button class=\"btn-basic btn-blue btn-small btn-plain right\" type=\"submit\" name=\"action\"\n                        [disabled]=\"!signUpForm.valid\">Valider\n                </button>\n              </div>\n\n              <div *ngIf=\"sendLoading\">\n                <div class=\"preloader-wrapper active\">\n                  <div class=\"spinner-layer spinner-blue\">\n                    <div class=\"circle-clipper left\">\n                      <div class=\"circle\"></div>\n                    </div>\n                    <div class=\"gap-patch\">\n                      <div class=\"circle\"></div>\n                    </div>\n                    <div class=\"circle-clipper right\">\n                      <div class=\"circle\"></div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n\n          </form>\n        </div>\n      </div><!--end card panel-->\n    </div>\n  </div><!--end row-->\n</div><!--end section-->\n"

/***/ }),

/***/ 724:
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n\n  <er-pre-meeting [meetingId]=\"meetingId\" (meetingGoal)=\"onGoalValueUpdated($event)\"\n                  (meetingContext)=\"onContextValueUpdated($event)\"></er-pre-meeting>\n\n  <br><br>\n  <h4 class=\"header-date-picker black-text\">Indiquez vos disponibilités grâce au calendrier ci-dessous.\n    <br>Cliquez sur valider lorsque vous avez rentré toutes vos plages disponibles.</h4>\n\n  <!--<datepicker-fr></datepicker-fr>-->\n\n  <!--Input Date Picker-->\n  <div id=\"input-date-picker\">\n    <div class=\"row text-center\">\n\n      <div class=\"col-sm-12 col-lg-5\">\n        <div id=\"datepicker-container\" class=\"z-depth-2\">\n          <ngb-datepicker #dp [(ngModel)]=\"dateModel\"\n                          (navigate)=\"date = $event.next\"\n                          navigation=\"arrows\"\n                          minDate=\"{{ dateModel }}\"\n                          langugae=\"fr\"\n                          [dayTemplate]=\"customDay\"\n                          [markDisabled]=\"isDisabled\"\n                          [disabled]=\"isEditingPotentialDate\">\n          </ngb-datepicker>\n\n          <ng-template #customDay let-date=\"date\" let-currentMonth=\"currentMonth\" let-selected=\"selected\"\n                       let-disabled=\"disabled\">\n            <span class=\"custom-day\"\n                  [class.has-potential-date]=\"hasPotentialDate(date)\"\n                  [class.bg-primary]=\"selected\"\n                  [class.hidden]=\"disabled\"\n                  [class.text-muted]=\"disabled\">\n              {{ date.day }}\n            </span>\n          </ng-template>\n\n        </div><!--end datepicker-container-->\n      </div>\n\n      <div class=\"col-sm-12 col-lg-7\">\n        <div>\n          <h5 *ngIf=\"dateModel\">{{ ngbDateToString(dateModel) }}</h5>\n          <h2 class=\"plage-horaire\">{{ timeIntToString(timeRange[0]) }} - {{ timeIntToString(timeRange[1]) }}</h2>\n        </div>\n\n        <p-slider [(ngModel)]=\"timeRange\" [style]=\"{'width':'200px'}\" [range]=\"true\" [min]=\"8\" [max]=\"20\"></p-slider>\n\n        <p>Faites glisser pour sélectionner votre plage disponible, puis validez</p>\n\n        <div class=\"row\">\n          <div class=\"col-lg-12\">\n            <button class=\"btn-basic btn-plain btn-blue btn-small\"\n                    (click)=\"bookOrUpdateADate()\" [disabled]=\"dateModel==null\"\n                    *ngIf=\"!isEditingPotentialDate\">Ajouter\n            </button>\n            <button class=\"btn-basic btn-plain btn-blue btn-small\"\n                    (click)=\"bookOrUpdateADate()\"\n                    [disabled]=\"dateModel==null\"\n                    *ngIf=\"isEditingPotentialDate\">Modifier\n            </button>\n          </div>\n          <div class=\"col-lg-12\" *ngIf=\"isEditingPotentialDate\">\n            <br>\n            <button class=\"btn-basic btn-blue btn-small\"\n                    (click)=\"resetValues()\"\n                    [disabled]=\"dateModel==null\">Annuler\n            </button>\n          </div>\n        </div>\n      </div>\n    </div><!--end row-->\n  </div><!--end input-datepicker-->\n\n\n  <div class=\"row\">\n    <div class=\"col-lg-12\">\n      <h4 class=\"black-text\">Vous pouvez modifier les plages validées ci-dessous</h4>\n      <span class=\"red-text\" *ngIf=\"potentialDatesArray.length < 3\">Il faut au moins 3 plages de disponibilité</span>\n\n      <div *ngFor=\"let potentialDate of potentialDatesArray\">\n        <div class=\"potential-date-line\">\n          <div class=\"blue-point\"></div>\n\n          {{ timestampToString(potentialDate.start_date)}}\n          <span class=\"bold black-text\">{{ getHoursAndMinutesFromTimestamp(potentialDate.start_date) }} - {{ getHoursAndMinutesFromTimestamp(potentialDate.end_date) }}</span>\n\n\n          <a class=\"modify-timeslot\"\n             (click)=\"modifyPotentialDate(potentialDate)\"><i\n            class=\"material-icons\">create</i></a>\n          <a class=\"delete-timeslot\"\n             (click)=\"unbookAdate(potentialDate)\"><i\n            class=\"material-icons\">delete_sweep</i></a>\n        </div>\n      </div>\n\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-lg-12 text-center\" *ngIf=\"!isEditingPotentialDate\">\n      <button class=\"btn-basic btn-blue btn-small\" (click)=\"finish()\" [disabled]=\"!canFinish()\"\n              *ifLoader=\"loading\">Valider\n      </button>\n    </div>\n  </div>\n\n</div>\n"

/***/ }),

/***/ 725:
/***/ (function(module, exports) {

module.exports = "<h4 class=\"black-text\">Veuillez renseigner les éléments de votre demande</h4>\n\n<div class=\"row\">\n  <div class=\"col s12\">\n    <label for=\"context\">Quel est le contexte, quel est le problème?</label>\n    <textarea id=\"context\" [ngModel]=\"uiMeetingContext\" (change)=\"onContextValueChanged($event)\" placeholder=\"Votre contexte, votre problème...\"></textarea>\n  </div>\n</div>\n\n<div class=\"row\">\n  <div class=\"col s12\">\n    <label for=\"objectif\">Mon objectif pour cette séance est...</label>\n    <input id=\"objectif\" type=\"text\" [ngModel]=\"uiMeetingGoal\" (change)=\"onGoalValueChanged($event)\" placeholder=\"Objectif...\">\n  </div>\n</div>\n"

/***/ }),

/***/ 726:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"container\" [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div class=\"row\">\n    <div class=\"col s12\">\n\n      <div class=\"row\">\n        <h4 class=\"col-lg-12 black-text\">Demandes en attente</h4>\n        <div class=\"card collection col-lg-12\">\n\n          <div *ifLoader=\"loading\">\n            <div *ngIf=\"hasAvailableMeetings\">\n              <div class=\"collection-item\" *ngFor=\"let meeting of availableMeetings | async\">\n                <er-meeting-item-coach [meeting]=\"meeting\"\n                                       (onValidateDateBtnClickEmitter)=\"openCoachValidateMeetingModal($event)\">\n                </er-meeting-item-coach>\n              </div>\n            </div>\n\n            <div *ngIf=\"!hasAvailableMeetings\" class=\"collection-item text-center\">\n              <h5 class=\"no-meeting\">Les demandes disponibles apparaîtront ici</h5>\n            </div>\n          </div>\n\n          <!--<button (click)=\"onSelectMeetingBtnClicked(meeting)\">Select</button>-->\n\n        </div><!--end card-->\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- Modal Coach Validate Meeting -->\n<div id=\"coach_cancel_meeting\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"daction-modal-message\">\n      <h5 class=\"black-text center\">Vous ne pourrez pas annuler ce meeting, êtes-vous sûr de vouloir valider ce créneau ?</h5>\n    </div>\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-blue btn-small\" (click)=\"cancelCoachValidateMeeting()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"onSubmitValidateMeeting()\">Valider</button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 727:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\" [class.closed]=\"!meeting.isOpen\" [class.unbooked]=\"!meeting.agreed_date\">\n\n  <div class=\"row\" *ifLoader=\"loading\">\n\n    <!-- COACHEE -->\n    <div class=\"meeting-item-header col-md-12 col-lg-5\">\n      <div>\n\n        <div class=\"meeting-item-coach has-coach\" (click)=\"goToCoacheeProfile(meeting.coachee.id)\">\n          <div>\n            <!-- image coachee-->\n            <div class=\"meeting-item-coach-avatar avatar\"\n                 [style.background-image]=\"'url(' + meeting.coachee.avatar_url + ')'\"></div>\n          </div>\n\n          <div>\n            <p class=\"meeting-item-coach-name black-text bold\">{{ meeting.coachee.first_name }} {{\n              meeting.coachee.last_name}}</p>\n            <span class=\"italic\">{{ meeting.coachee.associatedRh.company_name }}</span>\n          </div>\n        </div>\n\n        <!-- DATE -->\n        <div class=\"meeting-item-date\" *ngIf=\"meeting.agreed_date\">\n          <span class=\"meeting-item-date-date\">{{ timestampToString(meeting.agreed_date.start_date) }}</span><br>\n          <span class=\"meeting-item-date-hour blue-text\">{{ hoursAndMinutesFromTimestamp(meeting.agreed_date.start_date) }}</span>\n        </div>\n\n        <!-- Demande disponible -->\n        <div class=\"meeting-item-date\" *ngIf=\"!meeting.agreed_date\">\n          <span class=\"meeting-item-date-date\">{{ timestampToString(meeting.created_date) }}</span><br>\n          <span class=\"meeting-item-date-hour blue-text\">{{ hoursAndMinutesFromTimestamp(meeting.created_date) }}</span>\n        </div>\n      </div>\n    </div>\n\n    <!-- GOAL & REVIEW -->\n    <div class=\"meeting-item-body col-md-12 col-lg-7\">\n      <div class=\"meeting-item-body-content\">\n        <p><span class=\"black-text bold\">Contexte</span><br> {{ (context | async) }}</p>\n        <br>\n        <p class=\"meeting-item-goal\">\n          <span class=\"black-text bold\">Objectif de la séance</span><br>\n          <span *ngIf=\"hasGoal\">{{(goal | async)}}</span>\n          <span *ngIf=\"!hasGoal\" class=\"red-text\">Pas encore défini...</span>\n        </p>\n        <br>\n        <p>\n          <span class=\"black-text bold\">Objectif donné par le RH</span><br>\n          <span *ngIf=\"meeting.coachee.last_objective != null\">{{ meeting.coachee.last_objective.objective }}</span>\n          <span *ngIf=\"meeting.coachee.last_objective == null\">A définir</span>\n        </p>\n\n\n        <!--Complétées-->\n        <div *ngIf=\"!meeting.isOpen\" class=\"meeting-review\">\n          <div *ngIf=\"hasValue && hasNextStep\">\n            <br>\n            <p><span class=\"black-text bold\">Avec quoi êtes-vous repartis ? </span><br>{{ reviewNextStep }}</p>\n            <br>\n            <p><span class=\"black-text bold\">En quoi la séance a-t-elle été utile ? </span><br>{{ reviewValue }}</p>\n          </div>\n          <br>\n          <div *ngIf=\"hasRate\">\n            <p><span class=\"black-text bold\">Vous avez reçu la note de :</span></p>\n\n            <div class=\"ratebar ratebar-mini\">\n              <div class=\"rate-star\" [class.selected]=\"sessionRate > 0\">\n                <i class=\"material-icons star\">star</i>\n              </div>\n              <div class=\"rate-star\" [class.selected]=\"sessionRate > 1\">\n                <i class=\"material-icons star\">star</i>\n              </div>\n              <div class=\"rate-star\" [class.selected]=\"sessionRate > 2\">\n                <i class=\"material-icons star\">star</i>\n              </div>\n              <div class=\"rate-star\" [class.selected]=\"sessionRate > 3\">\n                <i class=\"material-icons star\">star</i>\n              </div>\n              <div class=\"rate-star\" [class.selected]=\"sessionRate > 4\">\n                <i class=\"material-icons star\">star</i>\n              </div>\n            </div>\n          </div> <!--rate end-->\n\n\n        </div><!--end meeting-review-->\n\n        <!--Demandes disponibles-->\n        <div *ngIf=\"!meeting.agreed_date\" class=\"meeting-review\">\n          <div>\n            <br>\n            <p><span class=\"black-text bold\">Disponibilités :</span></p>\n            <div class=\"meeting-potential\" *ngFor=\"let potential of potentialDates | async\">\n              <span class=\"meeting-potential-date\">{{ timestampToString(potential.start_date) }}</span>\n              <span class=\"meeting-potential-hours bold\">{{ hoursAndMinutesFromTimestamp(potential.start_date) }} - {{ hoursAndMinutesFromTimestamp(potential.end_date) }}</span>\n            </div>\n            <br>\n            <form class=\"confirm-meeting-form\">\n              <!--<span class=\"black-text bold\">Réponse :</span>-->\n              <div class=\"input-field\">\n                <select [(ngModel)]=\"selectedDate\" name=\"meeting-date\" class=\"browser-default\"\n                        (change)=\"loadPotentialHours(selectedDate)\">\n                  <option value=\"0\" disabled selected>Date</option>\n                  <option *ngFor=\"let d of potentialDays | async\" [ngValue]=\" d \">\n                    {{ timestampToString(d) }}\n                  </option>\n                </select>\n              </div>\n              <div class=\"input-field\">\n                <select [(ngModel)]=\"selectedHour\" name=\"meeting-hour\" class=\"browser-default\"\n                        materialize=\"material_select\">\n                  <option value=\"0\" disabled selected>Heure</option>\n                  <option *ngFor=\"let h of potentialHours | async\" [ngValue]=\"h\">\n                    {{ timeIntToString(h) }} - {{ timeIntToString(h+1) }}\n                  </option>\n                </select>\n              </div>\n            </form>\n          </div>\n        </div><!--end meeting-review-->\n      </div>\n\n      <div class=\"meeting-item-body-buttons\" *ngIf=\"meeting.isOpen && !isAdmin\">\n        <button type=\"submit\" class=\"btn-basic btn-blue btn-plain btn-small\"\n                *ngIf=\"!meeting.agreed_date\"\n                [disabled]=\"!selectedDate || !selectedHour\"\n                (click)=\"onValidateDateClick()\">Coacher\n        </button>\n\n        <button type=\"submit\" class=\"btn-basic btn-blue btn-plain btn-small\"\n                *ngIf=\"meeting.agreed_date\"\n                (click)=\"onCloseMeetingBtnClick()\">Clore\n        </button>\n      </div>\n    </div><!--end meeting-item-body-->\n\n  </div><!--end row-->\n\n</div><!--end meeting-item-->\n\n"

/***/ }),

/***/ 728:
/***/ (function(module, exports) {

module.exports = "\n<div [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div class=\"row\">\n    <h4 class=\"col-lg-12 black-text\">&Agrave; venir</h4>\n    <div class=\"card collection col-lg-12\">\n\n      <div *ifLoader=\"loading\">\n        <div *ngIf=\"hasOpenedMeeting\">\n          <div class=\"collection-item\" *ngFor=\"let meeting of meetingsOpened | async\">\n            <er-meeting-item-coach [meeting]=\"meeting\"\n                                   [isAdmin]=\"isAdmin\"\n                                   (onValidateDateBtnClickEmitter)=\"onRefreshListRequested($event)\"\n                                   (cancelMeetingBtnClickEmitter)=\"openCoachCancelMeetingModal($event)\"\n                                   (onCloseMeetingBtnClickEmitter)=\"starCloseSessionFlow($event)\">\n            </er-meeting-item-coach>\n          </div>\n        </div>\n\n        <div *ngIf=\"!hasOpenedMeeting\" class=\"collection-item text-center\">\n          <h5 class=\"no-meeting\">Vos séances à venir apparaîtront ici</h5>\n        </div>\n      </div>\n    </div><!--end card-->\n  </div><!--end row-->\n\n  <div class=\"row\">\n    <h4 class=\"col-lg-12 black-text\">Complétées</h4>\n    <div class=\"card collection col-lg-12\">\n\n      <div *ifLoader=\"loading\">\n        <div *ngIf=\"hasClosedMeeting\">\n          <div class=\"collection-item\" *ngFor=\"let meeting of meetingsClosed | async\">\n            <er-meeting-item-coach [meeting]=\"meeting\"\n                                   [isAdmin]=\"isAdmin\"\n                                   (onValidateDateBtnClickEmitter)=\"onRefreshListRequested($event)\"\n                                   (cancelMeetingBtnClickEmitter)=\"openCoachCancelMeetingModal($event)\">\n            </er-meeting-item-coach>\n          </div>\n        </div>\n\n        <div *ngIf=\"!hasClosedMeeting\" class=\"collection-item text-center\">\n          <h5 class=\"no-meeting\">Vos séances complétées apparaîtront ici</h5>\n        </div>\n      </div>\n\n    </div><!--end card-->\n  </div><!--end row-->\n</div>\n\n\n\n\n\n<!-- Modal Coach to complete a session -->\n<div id=\"complete_session_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <label>Avec quoi êtes-vous repartis ?</label>\n      <textarea type=\"text\" placeholder=\"Commentaire...\" [(ngModel)]=\"sessionResult\"></textarea>\n    </div>\n\n    <div class=\"action-modal-message\">\n      <label>En quoi la séance a-t-elle été utile ?</label>\n      <textarea type=\"text\" placeholder=\"Commentaire...\" [(ngModel)]=\"sessionUtility\"></textarea>\n    </div>\n\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-blue btn-small\" (click)=\"cancelCloseSessionModal()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateCloseSessionModal()\"\n              [disabled]=\"!sessionResult && !sessionUtility\">Conclure la séance\n      </button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 729:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\" [class.closed]=\"!meeting.isOpen\">\n  <!--<span class=\"card-title\">Vous avez choisi {{ coach.display_name }} pour être votre coach.</span>-->\n\n  <div class=\"row\" *ifLoader=\"loading\">\n\n    <!-- COACH -->\n    <div class=\"meeting-item-header col-md-12 col-lg-5\">\n      <div>\n        <div class=\"meeting-item-coach has-coach\" *ngIf=\"meeting.coach\"\n             (click)=\"goToCoachProfile(meeting.coach.id)\">\n          <div>\n            <div class=\"meeting-item-coach-avatar avatar\"\n                 [style.background-image]=\"'url(' + meeting.coach.avatar_url + ')'\"></div>\n          </div>\n\n          <div>\n            <p class=\"meeting-item-coach-name black-text bold\">{{ meeting.coach.first_name}} {{\n              meeting.coach.last_name}}</p>\n          </div>\n        </div>\n\n        <div class=\"meeting-item-coach\" *ngIf=\"!meeting.coach\">\n          <div>\n            <!-- image coach-->\n            <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coach\"\n                 src=\"https://s-media-cache-ak0.pinimg.com/originals/af/25/49/af25490494d3338afef00869c59fdd37.png\">\n          </div>\n\n          <div *ngIf=\"(potentialDates | async) != null\">\n            <span class=\"meeting-item-coach-name\">Un coach vous sera bientôt attribué</span>\n          </div>\n\n          <div *ngIf=\"(potentialDates | async) == null\">\n            <span class=\"meeting-item-coach-name red-text\">Veuillez ajouter des disponibilités</span>\n          </div>\n        </div>\n\n        <!-- DATE -->\n        <div class=\"meeting-item-date\">\n          <div *ngIf=\"meeting.agreed_date\">\n            <span class=\"meeting-item-date-date\">{{ timestampToString(meeting.agreed_date.start_date) }}</span><br>\n            <span class=\"meeting-item-date-hour blue-text\">{{ hoursAndMinutesFromTimestamp(meeting.agreed_date.start_date) }}</span>\n          </div>\n\n          <div *ngIf=\"!meeting.agreed_date\">\n            <span>En attente...</span>\n          </div>\n\n        </div>\n      </div>\n    </div>\n\n    <!-- GOAL & REVIEW -->\n    <div class=\"meeting-item-body col-md-12 col-lg-7\">\n      <div class=\"meeting-item-body-content\">\n        <p>\n          <span class=\"black-text bold\">Contexte de la séance</span><br>\n          <span *ngIf=\"hasContext\">{{context | async}}</span>\n          <span *ngIf=\"!hasContext\" class=\"red-text\">Veuillez définir votre contexte.</span>\n        </p>\n\n        <br>\n\n        <p>\n          <span class=\"black-text bold\">Objectif de la séance</span><br>\n          <span *ngIf=\"hasGoal\">{{goal | async}}</span>\n          <span *ngIf=\"!hasGoal\" class=\"red-text\">Veuillez définir votre objectif.</span>\n        </p>\n\n        <p *ngIf=\"!meeting.coach\"><span class=\"black-text bold\"><br>Disponibilités</span><br>\n          <span *ngFor=\"let date of (potentialDates | async)\">\n            {{ timestampToString(date.start_date)}}\n            <span class=\"bold\">{{ hoursAndMinutesFromTimestamp(date.start_date) }} - {{ hoursAndMinutesFromTimestamp(date.end_date) }}</span><br>\n          </span>\n        </p>\n\n\n        <div *ngIf=\"!meeting.isOpen\" class=\"meeting-review\">\n          <div *ngIf=\"hasSessionResult && hasSessionUtility\">\n            <br>\n            <p><span class=\"black-text bold\">Avec quoi êtes-vous repartis ? </span><br>{{ sessionResult }}</p>\n            <br>\n            <p><span class=\"black-text bold\">En quoi la séance a-t-elle été utile ? </span><br>{{ sessionUtility }}</p>\n          </div>\n        </div><!--end meeting-review-->\n\n        <!--rate -->\n        <div *ngIf=\"!meeting.isOpen && hasRate\">\n          <p><span class=\"black-text bold\"><br>Vous avez donné la note de :</span></p>\n\n          <div class=\"ratebar ratebar-mini\">\n            <div class=\"rate-star\" [class.selected]=\"sessionRate > 0\">\n              <i class=\"material-icons star\">star</i>\n            </div>\n            <div class=\"rate-star\" [class.selected]=\"sessionRate > 1\">\n              <i class=\"material-icons star\">star</i>\n            </div>\n            <div class=\"rate-star\" [class.selected]=\"sessionRate > 2\">\n              <i class=\"material-icons star\">star</i>\n            </div>\n            <div class=\"rate-star\" [class.selected]=\"sessionRate > 3\">\n              <i class=\"material-icons star\">star</i>\n            </div>\n            <div class=\"rate-star\" [class.selected]=\"sessionRate > 4\">\n              <i class=\"material-icons star\">star</i>\n            </div>\n          </div>\n\n        </div> <!--rate end-->\n\n      </div>\n\n      <div class=\"meeting-item-body-buttons\" *ngIf=\"meeting.isOpen && !isAdmin\">\n        <button class=\"btn-basic btn-plain btn-blue btn-small\" *ngIf=\"!meeting.agreed_date\"\n                (click)=\"goToModifyDate(meeting.id)\">\n          MODIFIER\n        </button>\n        <button class=\"btn-basic btn-plain btn-blue btn-small\" *ngIf=\"hasGoal && meeting.agreed_date\"\n                (click)=\"goToChatRoom()\">\n          LANCER\n        </button>\n        <button class=\"btn-basic btn-cancel\" (click)=\"openModal()\"><i class=\"material-icons\">clear</i></button>\n      </div>\n\n      <div class=\"meeting-item-body-buttons\" *ngIf=\"!meeting.isOpen && !hasRate && !isAdmin\">\n        <div class=\"meeting-item-body-buttons\">\n          <button class=\"btn-basic btn-plain btn-blue btn-small\" (click)=\"rateSession()\">NOTER</button>\n        </div>\n      </div>\n\n\n    </div><!--end meeting-item-body-->\n\n  </div><!--end row-->\n\n</div><!--end meeting-item-->\n"

/***/ }),

/***/ 730:
/***/ (function(module, exports) {

module.exports = "<div [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div class=\"row\">\n    <h4 class=\"col-lg-12 black-text\">&Agrave; venir</h4>\n\n    <div class=\"card collection col-lg-12\">\n\n      <div *ifLoader=\"loading\">\n        <div *ngIf=\"hasOpenedMeeting\">\n          <div class=\"collection-item\" *ngFor=\"let meeting of meetingsOpened | async\">\n            <er-meeting-item-coachee [meeting]=\"meeting\"\n                                     (cancelMeetingTimeEvent)=\"openCoacheeDeleteMeetingModal($event)\"\n                                     [isAdmin]=\"isAdmin\">\n            </er-meeting-item-coachee>\n          </div>\n        </div>\n\n        <div *ngIf=\"!hasOpenedMeeting\" class=\"collection-item text-center\">\n          <p class=\"no-meeting\">Vos séances à venir apparaîtront ici</p>\n        </div>\n      </div>\n\n    </div><!--end card-->\n  </div><!--end row-->\n\n  <div class=\"row\">\n    <h4 class=\"col-lg-12 black-text\">Complétées</h4>\n    <div class=\"card collection col-lg-12\">\n\n      <div *ifLoader=\"loading\">\n        <div *ngIf=\"hasClosedMeeting\">\n          <div class=\"collection-item\" *ngFor=\"let meeting of meetingsClosed | async\">\n            <er-meeting-item-coachee [meeting]=\"meeting\"\n                                     [isAdmin]=\"isAdmin\"\n                                     (cancelMeetingTimeEvent)=\"openCoacheeDeleteMeetingModal($event)\"\n                                     (onRateSessionBtnClickedEmitter)=\"openRateSessionModal($event)\">\n            </er-meeting-item-coachee>\n          </div>\n        </div>\n\n        <div *ngIf=\"!hasClosedMeeting\" class=\"collection-item text-center\">\n          <p class=\"no-meeting\">Vos séances complétées apparaîtront ici</p>\n        </div>\n      </div>\n\n    </div><!--end card-->\n  </div><!--end row-->\n</div>\n\n\n<!-- Modal Coachee Delete Meeting -->\n<div id=\"coachee_delete_meeting_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <h5 class=\"black-text center\">Ce meeting sera supprimé définitivement.</h5>\n    </div>\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-blue btn-small\" (click)=\"cancelCoacheeDeleteMeeting()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateCoacheeDeleteMeeting()\">Supprimer</button>\n    </div>\n  </div>\n</div>\n\n<!-- Modal Coachee Delete Meeting -->\n<div id=\"rate_session_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <h5 class=\"black-text center\">Notez votre séance</h5>\n    </div>\n\n    <div class=\"action-modal-message\">\n      <div class=\"ratebar center\">\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 0\" [class.pre-selected]=\"sessionPreRate > 0\"\n             (click)=\"setSessionRate(1)\" (mouseenter)=\"setSessionPreRate(1)\"\n             (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 1\" [class.pre-selected]=\"sessionPreRate > 1\"\n             (click)=\"setSessionRate(2)\" (mouseenter)=\"setSessionPreRate(2)\"\n             (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 2\" [class.pre-selected]=\"sessionPreRate > 2\"\n             (click)=\"setSessionRate(3)\" (mouseenter)=\"setSessionPreRate(3)\"\n             (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 3\" [class.pre-selected]=\"sessionPreRate > 3\"\n             (click)=\"setSessionRate(4)\" (mouseenter)=\"setSessionPreRate(4)\"\n             (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 4\" [class.pre-selected]=\"sessionPreRate > 4\"\n             (click)=\"setSessionRate(5)\" (mouseenter)=\"setSessionPreRate(5)\"\n             (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n      </div>\n    </div>\n\n\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-plain btn-small\" (click)=\"cancelRateSessionModal()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateRateSessionModal()\">Noter</button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 731:
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col s12\">\n\n      <!-- Coachee dashboard -->\n      <div *ngIf=\"isUserACoachee((user | async))\">\n        <er-coachee-dashboard [user]=\"user\"></er-coachee-dashboard>\n      </div>\n\n      <!-- Coach dashboard -->\n      <div *ngIf=\"isUserACoach((user | async))\">\n        <er-coach-dashboard [user]=\"user\"></er-coach-dashboard>\n      </div>\n\n      <!-- RH dashboard -->\n      <div *ngIf=\"isUserARh((user | async))\">\n        <er-rh-dashboard [user]=\"user\"></er-rh-dashboard>\n      </div>\n\n    </div><!--end row-->\n  </div><!--end container-->\n</div>\n"

/***/ }),

/***/ 732:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\" (click)=\"toggleShowDetails()\">\n\n  <div *ifLoader=\"loading\">\n\n    <!-- COACHEE -->\n    <div *ngIf=\"coachee != null\" class=\"row\">\n      <div class=\"meeting-item-header col-md-12 col-lg-5\">\n        <div>\n          <div class=\"meeting-item-coach has-coach\" (click)=\"goToCoacheeProfile(coachee.id)\">\n            <div>\n              <div class=\"meeting-item-coach-avatar avatar\"\n                   [style.background-image]=\"'url(' + coachee.avatar_url + ')'\"></div>\n            </div>\n\n            <div>\n              <p class=\"meeting-item-coach-name black-text bold\">{{ coachee.first_name}} {{ coachee.last_name}}</p>\n              <span>{{ coachee.email }}</span><br>\n              <span class=\"italic\">Inscrit le {{ dateToStringShort(coachee.start_date) }}</span>\n            </div>\n          </div>\n\n          <!--USAGE-->\n          <div class=\"meeting-item-date\">\n            <div class=\"meeting-item-date-date\" i18n>\n              <!--<span class=\"usage-title\">Utilisation</span><br>-->\n              <span class=\"blue-text\">{{ coachee.sessionsDoneMonthCount }}</span> { coachee.sessionsDoneMonthCount,\n              plural, =0 {séance} =1 {séance} other {séances}} ce mois-ci\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- GOAL -->\n      <div class=\"meeting-item-body col-md-12 col-lg-7\">\n        <div class=\"meeting-item-body-content\">\n          <p class=\"meeting-item-goal\">\n            <span class=\"black-text bold\">Objectif de développement</span><br>\n            <span *ngIf=\"coachee.last_objective\">{{ coachee.last_objective.objective }}</span>\n            <span *ngIf=\"!coachee.last_objective\">n/a</span>\n          </p>\n        </div>\n\n        <div class=\"meeting-item-body-buttons\" *ngIf=\"!isAdmin\">\n          <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"onClickAddObjectiveBtn()\"\n                  *ngIf=\"!coachee.last_objective\">\n            Ajouter un objectif\n          </button>\n          <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"onClickAddObjectiveBtn()\"\n                  *ngIf=\"coachee.last_objective\">\n            Modifier l'objectif\n          </button>\n        </div>\n      </div><!--end meeting-item-body-->\n\n      <div *ngIf=\"showDetails\" class=\"meeting-review\">\n        <div>\n          <h5 i18n><span class=\"blue-text\">{{ coachee.plan.sessions_count }}</span> { coachee.plan.sessions_count,\n            plural, =0 {séance/mois} =1 {séance/mois} other {séances/mois}} </h5>\n          <br>\n          <div *ngIf=\"!hasBookedMeeting\"><p>Pas encore de séance réalisée</p><br></div>\n          <div *ngIf=\"hasBookedMeeting\">\n            <div *ngFor=\"let meeting of (meetings | async)\">\n              <div class=\"row\">\n                <div class=\" col-md-3\">\n                  <span\n                    class=\"meeting-list-date\">Le {{ dayAndMonthFromTimestamp(meeting.agreed_date.start_date) }}</span>\n                </div>\n                <div class=\"col-md-9\">\n                  <div class=\"row\">\n                    <div class=\"col-md-12\">\n                      <span class=\"black-text bold\">Objectif de la séance : </span>\n                      <span>{{ goals[meeting.id] }}</span>\n                    </div>\n\n                    <div class=\"col-md-12\">\n                      <span class=\"black-text bold\">Note donnée :</span>\n\n                      <div class=\"ratebar ratebar-mini\">\n                        <div class=\"rate-star\" [class.selected]=\"sessionRates[meeting.id] > 0\">\n                          <i class=\"material-icons star\">star</i>\n                        </div>\n                        <div class=\"rate-star\" [class.selected]=\"sessionRates[meeting.id] > 1\">\n                          <i class=\"material-icons star\">star</i>\n                        </div>\n                        <div class=\"rate-star\" [class.selected]=\"sessionRates[meeting.id] > 2\">\n                          <i class=\"material-icons star\">star</i>\n                        </div>\n                        <div class=\"rate-star\" [class.selected]=\"sessionRates[meeting.id] > 3\">\n                          <i class=\"material-icons star\">star</i>\n                        </div>\n                        <div class=\"rate-star\" [class.selected]=\"sessionRates[meeting.id] > 4\">\n                          <i class=\"material-icons star\">star</i>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <br>\n\n            </div><!--enf ngFor-->\n          </div><!--end ngIf-->\n        </div>\n      </div><!--end meeting-review-->\n\n    </div><!--end coachee-->\n\n    <!-- POTENTIAL COACHEE -->\n    <div *ngIf=\"potentialCoachee != null\" class=\"row\">\n      <div class=\"meeting-item-header col-lg-12\">\n        <div>\n          <div class=\"meeting-item-coach\">\n            <div>\n              <!-- image coachee -->\n              <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"potentialCoachee\"\n                   src=\"/../../../../assets/img/avatar_default.png\">\n            </div>\n\n            <div>\n              <p class=\"meeting-item-coach-name black-text bold\">{{ potentialCoachee.first_name}} {{\n                potentialCoachee.last_name}}</p>\n              <span>{{ potentialCoachee.email }}</span>\n            </div>\n          </div>\n\n          <!-- PLAN -->\n          <div class=\"meeting-item-date\" i18n>\n            <span class=\"meeting-item-date-date\"><span\n              class=\"blue-text\">{{ potentialCoachee.plan.sessions_count }}</span> { potentialCoachee.plan.sessions_count, plural, =0 {séance} =1 {séance} other {séances}}</span>\n          </div>\n        </div>\n      </div>\n    </div><!--end potentialCoachee-->\n\n  </div><!--end row-->\n\n</div><!--end meeting-item-->\n"

/***/ }),

/***/ 733:
/***/ (function(module, exports) {

module.exports = "<div [ngsReveal]=\"{origin: 'left', distance: '100px', scale: 1, delay: 200, duration: 1000}\">\n  <div class=\"row\">\n    <h4 class=\"col-lg-12 black-text\">Managers</h4>\n    <div class=\"card collection col-lg-12\">\n\n      <div *ifLoader=\"loading1\">\n        <div *ngIf=\"hasCollaborators\">\n          <div class=\"collection-item has-collaborator\" *ngFor=\"let coachee of coachees | async\">\n            <er-meeting-item-rh [coachee]=\"coachee\"\n                                [isAdmin]=\"isAdmin\"\n                                [potentialCoachee]=\"null\"\n                                (onUpdateObjectiveBtnClick)=\"startAddNewObjectiveFlow($event)\">\n            </er-meeting-item-rh>\n          </div>\n        </div>\n\n        <div *ngIf=\"!hasCollaborators\" class=\"collection-item text-center\">\n          <h5 class=\"no-meeting\">Vos managers apparaîtront ici</h5>\n        </div>\n      </div>\n\n    </div><!--end card-->\n  </div><!--end row-->\n\n  <div class=\"row\">\n    <h4 class=\"col-lg-12 black-text\">Managers invités en attente</h4>\n    <div class=\"card collection col-lg-12\">\n\n      <div *ifLoader=\"loading2\">\n        <div *ngIf=\"hasPotentialCollaborators\">\n          <div class=\"collection-item\" *ngFor=\"let potentialCoachee of potentialCoachees | async\">\n            <er-meeting-item-rh [potentialCoachee]=\"potentialCoachee\"\n                                [coachee]=\"null\">\n            </er-meeting-item-rh>\n          </div>\n        </div>\n\n        <div *ngIf=\"!hasPotentialCollaborators\" class=\"collection-item text-center\">\n          <h5 class=\"no-meeting\">Vos managers en attente de validation apparaîtront ici</h5>\n        </div>\n      </div>\n\n    </div><!--end card-->\n  </div><!--end row-->\n</div>\n"

/***/ }),

/***/ 734:
/***/ (function(module, exports) {

module.exports = "<er-profile-header [user]=\"coach\" [isOwner]=\"true\"></er-profile-header>\n\n<div class=\"container\" *ifLoader=\"loading\"\n     [ngsReveal]=\"{scale:1, opacity:0, distance:0, duration: 1000, viewFactor: 0}\">\n\n  <div class=\"center\">\n    <a target=\"_blank\" class=\"btn-basic btn-blue btn-plain btn-small\" [href]=\"(coach | async)?.linkedin_url\"><i\n      class=\"fa fa-linkedin\" aria-hidden=\"true\"></i></a>\n    <br><br>\n  </div>\n\n  <h4 class=\"text-right italic\">\"{{ (coach | async)?.description }}\"</h4>\n  <br>\n\n  <!--Change picture-->\n  <div class=\"col-lg-6 input-container\">\n    <label>Photo de profil</label>\n    <div class=\"avatar-container input-container\">\n      <div id=\"avatar-preview\"\n           class=\"avatar z-depth-2\"\n           [style.background-image]=\"'url(' + avatarFile + ')'\"\n           *ngIf=\"avatarFile != null\"></div>\n      <div class=\"input-file-container\">\n        <button class=\"btn-basic btn-blue btn-plain btn-small file-upload-button\" *ngIf=\"!avatarLoading\">Choisir une\n          image\n        </button>\n        <input type=\"file\"\n               id=\"upload-avatar-input\"\n               accept=\".jpeg,.jpg,.png\"\n               (change)=\"previewPicture($event)\">\n\n        <button class=\"btn-basic btn-blue btn-plain btn-small\" *ngIf=\"avatarFile != null && !avatarLoading\"\n                (click)=\"uploadAvatarPicture()\">Utiliser cette image\n        </button>\n\n        <div class=\"preloader-wrapper active\" *ngIf=\"avatarFile != null && avatarLoading\">\n          <div class=\"spinner-layer spinner-blue-only\">\n            <div class=\"circle-clipper left\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"gap-patch\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"circle-clipper right\">\n              <div class=\"circle\"></div>\n            </div>\n          </div>\n        </div>\n\n      </div>\n    </div>\n  </div>\n  <!--change picture end >-->\n\n  <div>\n\n    <br>\n\n    <div class=\"row\">\n\n      <h2 class=\"col-lg-12 section-form-title\">Coordonnées de facturation</h2>\n\n      <div class=\"col-lg-12\">\n        <div class=\"row\">\n          <div class=\"col-lg-12 input-container\">\n            <p class=\"black-text\">{{ (coach | async)?.invoice_entity }}</p>\n            <p class=\"black-text\">{{ (coach | async)?.invoice_address }}</p>\n            <p class=\"black-text\">{{ (coach | async)?.invoice_city }}</p>\n            <p class=\"black-text\">{{ (coach | async)?.invoice_postcode }}</p>\n          </div>\n        </div>\n      </div>\n\n\n      <h2 class=\"col-lg-12 section-form-title\">Formation</h2>\n\n      <div class=\"col-lg-12\">\n        <div class=\"row\">\n          <div class=\"col-lg-12 input-container\">\n            <label>Quelle est votre formation initiale ?</label>\n            <p>{{ (coach | async)?.training }}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Quels sont vos diplômes, certifications et accréditations en coaching ?</label>\n            <p>{{ (coach | async)?.degree }}</p>\n            <br>\n          </div>\n        </div>\n      </div>\n\n\n      <h2 class=\"col-lg-12 section-form-title\">Activité de coach</h2>\n\n      <div class=\"col-lg-12\">\n        <div class=\"row\">\n          <div class=\"col-lg-12 input-container\">\n            <label>Quelle(s) langue(s) pratiquez vous en coaching ?</label>\n            <p>{{ (coach | async)?.languages }}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Exercez-vous d'autres activités que le coaching ?</label>\n            <p>{{ (coach | async)?.extraActivities }}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Depuis combien de temps exercez-vous l'activité de coaching ?</label>\n            <p>{{ (coach | async)?.coachForYears }}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Quelles sont vos expériences en coaching individuel et en coaching individuel via\n              visioconférence (Skype par exemple) ?</label>\n            <p>{{ (coach | async)?.coachingExperience }}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Quelles sont vos expériences en coaching bref sur 45 minutes ?</label>\n            <p>{{ (coach | async)?.experienceShortSession }}</p>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Quelles sont les spécialités et/ou spécificités que vous utilisez lors du coaching ?</label>\n            <p>{{ (coach | async)?.coachingSpecifics }}</p>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Donnez quelques éléments de votre parcours de développement personnel / thérapie ?</label>\n            <p>{{ (coach | async)?.therapyElements }}</p>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Combien d'heures de coaching individuel avez-vous déjà réalisé ?</label>\n            <p>{{ (coach | async)?.coachingHours }}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Quel est votre dispositif de supervision ?</label>\n            <p>{{ (coach | async)?.supervisor }}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Quels types ou situations de coaching privilégiez-vous ?</label>\n            <p>{{ (coach | async)?.favoriteCoachingSituation}}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Quel est votre statut ?</label>\n            <p>{{ (coach | async)?.status }}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Quel est votre chiffre d'affaires sur les 3 dernières années ?</label>\n            <p>{{ (coach | async)?.revenues }}</p>\n            <br>\n          </div>\n\n          <div class=\"col-lg-12 input-container\">\n            <label>Avez-vous une copie de votre assurance RC Pro ?</label><br>\n            <p *ngIf=\"(coach | async)?.insurance_url != ''\"><a [href]=\"(coach | async)?.insurance_url\">Contrat\n              d'assurance</a></p>\n            <br>\n          </div>\n        </div>\n      </div>\n\n    </div><!--end row>-->\n\n    <er-meeting-list-coach [user]=\"coach \" [isAdmin]=\"true\"></er-meeting-list-coach>\n\n  </div>\n\n</div>\n"

/***/ }),

/***/ 735:
/***/ (function(module, exports) {

module.exports = "<er-profile-header [user]=\"coach\" [isOwner]=\"isOwner\"></er-profile-header>\n\n<div class=\"container\" *ifLoader=\"loading\" [ngsReveal]=\"{scale:1, opacity:0, distance:0, duration: 1000}\">\n  <h4 class=\"text-right italic\">\"{{ (coach | async)?.description }}\"</h4>\n  <br>\n\n  <div>\n\n  </div>\n\n  <div *ngIf=\"isOwner\">\n    <h4 class=\"black-text\">Mettre à jour votre profil</h4>\n    <br>\n\n    <form [formGroup]=\"formCoach\" (ngSubmit)=\"submitCoachProfilUpdate()\">\n      <div class=\"row\">\n        <div class=\"col-lg-6\">\n          <div class=\"row\">\n            <div class=\"col-lg-12\">\n              <label for=\"edit_name\">Prénom</label>\n              <input id=\"edit_name\" type=\"text\" class=\"validate\"\n                     formControlName=\"firstName\"\n                     placeholder=\"Prénom\">\n            </div>\n\n            <div class=\"col-lg-12\">\n              <label for=\"edit_surname\">Nom</label>\n              <input id=\"edit_surname\" type=\"text\" class=\"validate\"\n                     formControlName=\"lastName\"\n                     placeholder=\"Nom\">\n            </div>\n          </div>\n        </div>\n\n        <div class=\"col-lg-1\"></div>\n\n        <div class=\"col-lg-5\">\n          <label>Photo de profil</label>\n          <div class=\"row avatar-container\">\n            <!--<img [src]=\"formCoach.value.avatar\" alt=\"profile image\"-->\n            <!--id=\"avatar-preview\"-->\n            <!--class=\"circle responsive-img z-depth-2\">-->\n            <div id=\"avatar-preview\"\n                 class=\"avatar z-depth-2\"\n                 [style.background-image]=\"'url(' + (coach | async)?.avatar_url + ')'\"></div>\n            <!--<input id=\"edit_avatar_url\" type=\"text\" class=\"validate\"-->\n            <!--formControlName=\"avatar\"-->\n            <!--placeholder=\"http://...\">-->\n            <div class=\"input-file-container\">\n              <button class=\"btn-basic btn-blue btn-plain btn-small file-upload-buton\">Choisir un fichier</button>\n              <input type=\"file\"\n                     id=\"upload-avatar-input\"\n                     accept=\".jpeg,.jpg,.png\"\n                     (change)=\"filePreview($event)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-lg-12\">\n          <label for=\"edit_description\">Description</label>\n          <textarea id=\"edit_description\" class=\"description-field validate\"\n                    formControlName=\"description\"\n                    placeholder=\"Description...\">\n          </textarea>\n        </div>\n      </div>\n\n      <div class=\"text-center\">\n        <br>\n\n        <button *ngIf=\"!updateUserLoading\"\n                type=\"submit\"\n                class=\"btn-basic btn-plain btn-blue btn-small\"\n                [disabled]=\"!formCoach.valid\">\n          Enregistrer\n        </button>\n\n        <div class=\"preloader-wrapper active\" *ngIf=\"updateUserLoading\">\n          <div class=\"spinner-layer spinner-blue-only\">\n            <div class=\"circle-clipper left\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"gap-patch\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"circle-clipper right\">\n              <div class=\"circle\"></div>\n            </div>\n          </div>\n        </div>\n\n      </div>\n\n    </form>\n  </div>\n\n</div>\n"

/***/ }),

/***/ 736:
/***/ (function(module, exports) {

module.exports = "<er-profile-header [user]=\"coachee\" [isOwner]=\"true\"></er-profile-header>\n\n<div class=\"container\" *ifLoader=\"loading\" [ngsReveal]=\"{scale:1, opacity:0, distance:0, duration: 1000}\">\n  <h4 class=\"text-right\"><span class=\"blue-text\">{{(coachee | async)?.plan.sessions_count}}</span> séances / mois</h4>\n  <h5 class=\"text-right italic\" *ngIf=\"(coachee | async)?.last_objective == null\">Aucun objectif personnel défini</h5>\n  <h5 class=\"text-right italic\" *ngIf=\"(coachee | async)?.last_objective != null\">\n    \"{{ (coachee | async)?.last_objective.objective }}\"\n  </h5>\n  <br>\n\n\n  <div class=\"row\">\n    <h4 class=\"col-lg-12 section-form-title black-text\">RH</h4>\n\n    <div class=\"col-lg-12\">\n      <div class=\"row\" *ngIf=\"(coachee | async)?.associatedRh != null && (coachee | async)?.associatedRh !== undefined\">\n        <div class=\"user rh col-lg-12\" (click)=\"goToRhProfile()\">\n          <div class=\"user-img avatar z-depth-2 rh-img\"\n               *ngIf=\"(coachee | async)?.associatedRh.avatar_url != null\"\n               [style.background-image]=\"'url(' + (coachee | async)?.associatedRh.avatar_url + ')'\"></div>\n\n          <div class=\"user-info\">\n            <h5 class=\"black-text\">{{(coachee | async)?.associatedRh.first_name}} {{(coachee |\n              async)?.associatedRh.last_name}}</h5>\n            <p>{{(coachee | async)?.associatedRh.email}}</p>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n\n  <er-meeting-list-coachee [user]=\"coachee\" [isAdmin]=\"true\"></er-meeting-list-coachee>\n\n\n</div>\n"

/***/ }),

/***/ 737:
/***/ (function(module, exports) {

module.exports = "<er-profile-header [user]=\"coachee\" [isOwner]=\"isOwner\"></er-profile-header>\n\n<div class=\"container\" *ifLoader=\"loading\" [ngsReveal]=\"{scale:1, opacity:0, distance:0, duration: 1000}\">\n  <h4 class=\"text-right\"><span class=\"blue-text\">{{(coachee | async)?.plan.sessions_count}}</span> séances / mois</h4>\n  <h5 class=\"text-right italic\" *ngIf=\"(coachee | async)?.last_objective == null\">Aucun objectif personnel défini</h5>\n  <h5 class=\"text-right italic\" *ngIf=\"(coachee | async)?.last_objective != null\">Objectif fixé avec votre RH:\n    \"{{ (coachee | async)?.last_objective.objective }}\"\n  </h5>\n  <br>\n\n  <div *ngIf=\"isOwner\">\n    <h4 class=\"black-text\">Mettre à jour votre profil</h4>\n    <br>\n\n    <form [formGroup]=\"formCoachee\" (ngSubmit)=\"submitCoacheeProfilUpdate()\">\n      <div class=\"row\">\n        <div class=\"col-lg-6\">\n          <div class=\"row\">\n            <div class=\"col-lg-12\">\n              <label for=\"edit_name\">Prénom</label>\n              <input id=\"edit_name\" type=\"text\" class=\"validate\"\n                     formControlName=\"firstName\"\n                     placeholder=\"Prénom\">\n            </div>\n\n            <div class=\"col-lg-12\">\n              <label for=\"edit_surname\">Nom</label>\n              <input id=\"edit_surname\" type=\"text\" class=\"validate\"\n                     formControlName=\"lastName\"\n                     placeholder=\"Nom\">\n            </div>\n          </div>\n        </div>\n\n        <div class=\"col-lg-1\"></div>\n\n        <div class=\"col-lg-5\">\n          <label>Photo de profil</label>\n          <div class=\"row avatar-container\">\n            <!--<img [src]=\"formCoachee.value.avatar\" alt=\"profile image\"-->\n            <!--id=\"avatar-preview\"-->\n            <!--class=\"circle responsive-img z-depth-2\">-->\n            <div id=\"avatar-preview\"\n                 class=\"avatar z-depth-2\"\n                 [style.background-image]=\"'url(' + (coachee | async)?.avatar_url + ')'\"></div>\n\n            <!--<input id=\"edit_avatar_url\" type=\"text\" class=\"validate\"-->\n            <!--formControlName=\"avatar\"-->\n            <!--placeholder=\"http://...\">-->\n            <div class=\"input-file-container\">\n              <button class=\"btn-basic btn-blue btn-plain btn-small file-upload-buton\">Choisir un fichier</button>\n              <input type=\"file\"\n                     id=\"upload-avatar-input\"\n                     accept=\".jpeg,.jpg,.png\"\n                     (change)=\"filePreview($event)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"text-center\">\n        <br>\n\n        <button *ngIf=\"!updateUserLoading\"\n                type=\"submit\"\n                class=\"btn-basic btn-plain btn-blue btn-small\"\n                [disabled]=\"!formCoachee.valid\">\n          Enregistrer\n        </button>\n\n        <div class=\"preloader-wrapper active\" *ngIf=\"updateUserLoading\">\n          <div class=\"spinner-layer spinner-blue-only\">\n            <div class=\"circle-clipper left\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"gap-patch\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"circle-clipper right\">\n              <div class=\"circle\"></div>\n            </div>\n          </div>\n        </div>\n\n      </div>\n\n    </form>\n  </div>\n\n</div>\n\n\n"

/***/ }),

/***/ 738:
/***/ (function(module, exports) {

module.exports = "<er-profile-header [user]=\"possibleCoach\" [isOwner]=\"true\"></er-profile-header>\n\n<div class=\"container\" *ifLoader=\"loading\" [ngsReveal]=\"{scale:1, opacity:0, distance:0, duration: 1000, viewFactor: 0}\">\n\n  <div class=\"row\">\n\n    <div class=\"center col-lg-12\">\n      <a target=\"_blank\" class=\"btn-basic btn-blue btn-plain btn-small\" [href]=\"(possibleCoach | async)?.linkedin_url\"><i\n        class=\"fa fa-linkedin\" aria-hidden=\"true\"></i></a>\n      <br><br>\n    </div>\n\n    <h2 class=\"col-lg-12 section-form-title\">Coordonnées de facturation</h2>\n\n    <div class=\"col-lg-12\">\n      <div class=\"row\">\n        <div class=\"col-lg-12 input-container\">\n          <p class=\"black-text\">{{ (possibleCoach | async)?.invoice_entity }}</p>\n          <p class=\"black-text\">{{ (possibleCoach | async)?.invoice_address }}</p>\n          <p class=\"black-text\">{{ (possibleCoach | async)?.invoice_city }}</p>\n          <p class=\"black-text\">{{ (possibleCoach | async)?.invoice_postcode }}</p>\n        </div>\n      </div>\n    </div>\n\n\n    <h2 class=\"col-lg-12 section-form-title\">Formation</h2>\n\n    <div class=\"col-lg-12\">\n      <div class=\"row\">\n        <div class=\"col-lg-12 input-container\">\n          <label>Quelle est votre formation initiale ?</label>\n          <p>{{ (possibleCoach | async)?.training }}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Quels sont vos diplômes, certifications et accréditations en coaching ?</label>\n          <p>{{ (possibleCoach | async)?.degree }}</p>\n          <br>\n        </div>\n      </div>\n    </div>\n\n\n    <h2 class=\"col-lg-12 section-form-title\">Activité de coach</h2>\n\n    <div class=\"col-lg-12\">\n      <div class=\"row\">\n        <div class=\"col-lg-12 input-container\">\n          <label>Quelle(s) langue(s) pratiquez vous en coaching ?</label>\n          <p>{{ (possibleCoach | async)?.languages }}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Exercez-vous d'autres activités que le coaching ?</label>\n          <p>{{ (possibleCoach | async)?.extraActivities }}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Depuis combien de temps exercez-vous l'activité de coaching ?</label>\n          <p>{{ (possibleCoach | async)?.coachForYears }}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Quelles sont vos expériences en coaching individuel et en coaching individuel via\n            visioconférence (Skype par exemple) ?</label>\n          <p>{{ (possibleCoach | async)?.coachingExperience }}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Quelles sont vos expériences en coaching bref sur 45 minutes ?</label>\n          <p>{{ (possibleCoach | async)?.experienceShortSession }}</p>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Quelles sont les spécialités et/ou spécificités que vous utilisez lors du coaching ?</label>\n          <p>{{ (possibleCoach | async)?.coachingSpecifics }}</p>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Donnez quelques éléments de votre parcours de développement personnel / thérapie ?</label>\n          <p>{{ (possibleCoach | async)?.therapyElements }}</p>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Combien d'heures de coaching individuel avez-vous déjà réalisé ?</label>\n          <p>{{ (possibleCoach | async)?.coachingHours }}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Quel est votre dispositif de supervision ?</label>\n          <p>{{ (possibleCoach | async)?.supervisor }}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Quels types ou situations de coaching privilégiez-vous ?</label>\n          <p>{{ (possibleCoach | async)?.favoriteCoachingSituation}}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Quel est votre statut ?</label>\n          <p>{{ (possibleCoach | async)?.status }}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Quel est votre chiffre d'affaires sur les 3 dernières années ?</label>\n          <p>{{ (possibleCoach | async)?.revenues }}</p>\n          <br>\n        </div>\n\n        <div class=\"col-lg-12 input-container\">\n          <label>Avez-vous une copie de votre assurance RC Pro ?</label><br>\n          <p><a [href]=\"(possibleCoach | async)?.insurance_url\" target=\"_blank\">Contrat d'assurance</a></p>\n          <br>\n        </div>\n      </div>\n    </div>\n\n    <div class=\" col-lg-12 text-center input-container\">\n      <br>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\"\n              *ngIf=\"!(possibleCoach | async)?.invite_sent\"\n              (click)=\"sendInvite()\">Envoyer une invitation\n      </button>\n      <button class=\"btn-basic btn-small\"\n              *ngIf=\"(possibleCoach | async)?.invite_sent\"\n              disabled>En attente...\n      </button>\n    </div>\n\n  </div><!--end row>-->\n\n</div>\n"

/***/ }),

/***/ 739:
/***/ (function(module, exports) {

module.exports = "<div class=\"header-user\" [ngsReveal]=\"{scale:1, origin: 'top', distance:'200px', duration: 500}\">\n  <div class=\"header-user-filter\">\n    <div class=\"container row\">\n\n      <!--Header large screen-->\n      <div class=\"user col-lg-6 hide-on-med-and-down\" [ngsReveal]=\"{scale:1, distance:'0px', opacity:0, duration: 500}\">\n        <button class=\"btn-back\" (click)=\"goBack()\">\n          <i class=\"material-icons\">keyboard_arrow_left</i>\n        </button>\n\n        <div class=\"user-img avatar z-depth-2\"\n             *ngIf=\"(user | async)?.avatar_url !== null && (user | async)?.avatar_url !== undefined\"\n             [style.background-image]=\"'url(' + (user | async)?.avatar_url + ')'\"></div>\n\n        <div class=\"user-info\">\n          <h5>{{(user | async)?.first_name}} {{(user | async)?.last_name}}</h5>\n          <p *ngIf=\"isOwner\" class=\"light-grey-text\">{{(user | async)?.email}}</p>\n        </div>\n      </div>\n\n      <!--Header small screen-->\n      <div class=\"user user-mobile col-lg-6 hide-on-large-only\">\n        <button class=\"btn-back\" (click)=\"goBack()\">\n          <i class=\"material-icons\">keyboard_arrow_left</i>\n        </button>\n\n        <div class=\"text-center\">\n          <div class=\"user-img avatar z-depth-2\"\n               *ngIf=\"(user | async)?.avatar_url !== null && (user | async)?.avatar_url !== undefined\"\n               [style.background-image]=\"'url(' + (user | async)?.avatar_url + ')'\"></div>\n        </div>\n\n        <div class=\"user-info text-center\">\n          <h5>{{(user | async)?.first_name}} {{(user | async)?.last_name}}</h5>\n          <p *ngIf=\"isOwner\" class=\"light-grey-text\">{{(user | async)?.email}}</p>\n        </div>\n      </div>\n\n      <div class=\"header-stats col-lg-6\" *ngIf=\"isCoach(user | async)\">\n        <div class=\"col-sm-12 hide-on-large-only gap\"></div>\n\n        <div class=\"row\">\n          <div class=\"header-item col-lg-6 col-xs-6\">\n            <div class=\"header-item-number\"><span>{{(user | async)?.score}}</span><span class=\"indice\"> / 5</span>\n            </div>\n            <p class=\"header-item-title\">Moyenne</p>\n          </div>\n\n          <div class=\"header-item col-lg-6 col-xs-6\" i18n>\n            <div class=\"header-item-number\"><span>{{(user | async)?.sessionsCount}}</span></div>\n            <p class=\"header-item-title\"> {(user |\n              async)?.sessionsCount || 0, plural, =0 {séance réalisée} =1\n              {séance réalisée} other {séances réalisées}}\n            </p>\n          </div>\n\n        </div>\n      </div>\n\n\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 740:
/***/ (function(module, exports) {

module.exports = "<er-profile-header [user]=\"rh\" [isOwner]=\"true\"></er-profile-header>\n\n<div class=\"container\" *ifLoader=\"loading\" [ngsReveal]=\"{scale:1, opacity:0, distance:0, duration: 1000}\">\n  <!--<h4 class=\"text-right italic\">\"{{ (rh | async)?.description }}\"</h4>-->\n  <!--<br>-->\n\n  <div>\n    <er-meeting-list-rh [user]=\"rh\" [isAdmin]=\"true\"></er-meeting-list-rh>\n  </div>\n\n</div>\n"

/***/ }),

/***/ 741:
/***/ (function(module, exports) {

module.exports = "<er-profile-header [user]=\"rhObs\" [isOwner]=\"isOwner\"></er-profile-header>\n\n<div class=\"container\" *ifLoader=\"loading\" [ngsReveal]=\"{scale:1, opacity:0, distance:0, duration: 1000}\">\n  <!--<h4 class=\"text-right italic\">{{ (rhObs | async)?.description }}</h4>-->\n  <!--<br>-->\n\n  <div *ngIf=\"isOwner\">\n    <h4 class=\"black-text\">Mettre à jour votre profil</h4>\n    <br>\n\n    <form [formGroup]=\"formRh\" (ngSubmit)=\"submitRhProfilUpdate()\">\n      <div class=\"row\">\n        <div class=\"col-lg-6\">\n          <div class=\"row\">\n            <div class=\"col-lg-12\">\n              <label for=\"edit_name\">Prénom</label>\n              <input id=\"edit_name\" type=\"text\" class=\"validate\"\n                     formControlName=\"firstName\"\n                     placeholder=\"Prénom\">\n            </div>\n\n            <div class=\"col-lg-12\">\n              <label for=\"edit_surname\">Nom</label>\n              <input id=\"edit_surname\" type=\"text\" class=\"validate\"\n                     formControlName=\"lastName\"\n                     placeholder=\"Nom\">\n            </div>\n          </div>\n        </div>\n\n        <div class=\"col-lg-1\"></div>\n\n        <div class=\"col-lg-5\">\n          <label>Photo de profil</label>\n          <div class=\"row avatar-container\">\n            <!--<img [src]=\"formCoach.value.avatar\" alt=\"profile image\"-->\n            <!--id=\"avatar-preview\"-->\n            <!--class=\"circle responsive-img z-depth-2\">-->\n            <div id=\"avatar-preview\"\n                 class=\"avatar z-depth-2\"\n                 *ngIf=\"(rhObs | async)?.avatar_url !== null && (rhObs | async)?.avatar_url !== undefined\"\n                 [style.background-image]=\"'url(' + (rhObs | async)?.avatar_url + ')'\"></div>\n            <!--<input id=\"edit_avatar_url\" type=\"text\" class=\"validate\"-->\n            <!--formControlName=\"avatar\"-->\n            <!--placeholder=\"http://...\">-->\n            <div class=\"input-file-container\">\n              <button class=\"btn-basic btn-blue btn-plain btn-small file-upload-buton\">Choisir un fichier</button>\n              <input type=\"file\"\n                     id=\"upload-avatar-input\"\n                     accept=\".jpeg,.jpg,.png\"\n                     (change)=\"filePreview($event)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!--<div class=\"row\">-->\n        <!--<div class=\"col-lg-12\">-->\n          <!--<label for=\"edit_description\">Description</label>-->\n          <!--<textarea id=\"edit_description\" class=\"description-field validate\"-->\n                    <!--formControlName=\"description\"-->\n                    <!--placeholder=\"Description...\">-->\n          <!--</textarea>-->\n        <!--</div>-->\n      <!--</div>-->\n\n      <div class=\"text-center\">\n        <br>\n\n        <button *ngIf=\"!updateUserLoading\"\n                type=\"submit\"\n                class=\"btn-basic btn-plain btn-blue btn-small\"\n                [disabled]=\"!formRh.valid\">\n          Enregistrer\n        </button>\n\n        <div class=\"preloader-wrapper active\" *ngIf=\"updateUserLoading\">\n          <div class=\"spinner-layer spinner-blue-only\">\n            <div class=\"circle-clipper left\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"gap-patch\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"circle-clipper right\">\n              <div class=\"circle\"></div>\n            </div>\n          </div>\n        </div>\n\n      </div>\n\n    </form>\n\n  </div>\n\n</div>\n"

/***/ }),

/***/ 742:
/***/ (function(module, exports) {

module.exports = "<er-welcome-header></er-welcome-header>\n\n<div class=\"content\">\n\n  <section id=\"presentation\" class=\"section\">\n    <div class=\"container\">\n      <h2 class=\"text-center black-text section_title presentation_title\">Construisez le coaching qui correspond à vos\n        besoins</h2>\n      <div class=\"row\"\n           ngsRevealSet\n           [ngsSelector]=\"'.presentation_item'\">\n        <div class=\"col-sm-12 col-lg-4\">\n          <div class=\"presentation_item text-center\">\n            <img src=\"assets/img/todos.svg\" class=\"desc_icon\"/>\n            <h4 class=\"black-text presentation_item_title\">Définissez votre besoin​</h4>\n            <p class=\"presentation_item_text\">Utilisez l'outil de réservation et organisez votre séance de\n              coaching.</p>\n          </div>\n        </div>\n\n        <div class=\"col-sm-12 col-lg-4\">\n          <div class=\"presentation_item text-center\">\n            <img src=\"assets/img/confirm-user.svg\" class=\"desc_icon\"/>\n            <h4 class=\"black-text presentation_item_title\">Planifiez votre séance de coaching</h4>\n            <p class=\"presentation_item_text\">Connectez-vous sur votre plateforme pour votre séance de 45 min.</p>\n          </div>\n        </div>\n\n        <div class=\"col-sm-12 col-lg-4\">\n          <div class=\"presentation_item text-center\">\n            <img src=\"assets/img/presentation.svg\" class=\"desc_icon\"/>\n            <h4 class=\"black-text presentation_item_title\">Suivez votre progression</h4>\n            <p class=\"presentation_item_text\">Chaque séance se conclut par un compte rendu avec un plan d'action.</p>\n          </div>\n        </div>\n      </div> <!--end row-->\n    </div> <!--end container-->\n  </section> <!--end section-->\n\n\n  <section id=\"coach_section\" class=\"section\">\n    <div class=\"container\">\n      <h2 class=\"text-center section_title coach_section_title\">Conçu par une équipe de coachs certifiés</h2>\n      <h6 class=\"text-center coach_section_subtitle\">\n        Notre équipe de coachs expérimentés constitue un label de qualité\n        sans équivalent sur le marché du coaching professionnel.\n      </h6>\n\n      <div class=\"small-line-container\">\n        <div class=\"small-line\"></div>\n      </div>\n\n      <div class=\"row\"\n           [ngsRevealSet]=\"{duration: 800}\"\n           [ngsSelector]=\"'.coach_description'\">\n        <div class=\"col-sm-12 col-lg-4 coach_description\">\n          <img class=\"coach_img\"\n               src=\"https://static.wixstatic.com/media/04261a_d639816d3928429d8a34a774be2c77c2~mv2.png/v1/fill/w_298,h_298,al_c,usm_0.66_1.00_0.01/04261a_d639816d3928429d8a34a774be2c77c2~mv2.png\">\n          <h4>Etienne Roy</h4>\n          <p>\n            Depuis plus de 25 ans, j’accompagne des équipes dirigeantes, des dirigeants et des organisations dans des phases de changement.\n            Ingénieur de formation, et DEA en sciences de gestion, mon parcours de coach est résolument orienté solutions !\n          </p>\n        </div>\n\n        <div class=\"col-sm-12 col-lg-4 coach_description\">\n          <img class=\"coach_img\"\n               src=\"https://static.wixstatic.com/media/04261a_992204f8b935467e90154abc73a30105~mv2.png/v1/fill/w_298,h_298,al_c,lg_1/04261a_992204f8b935467e90154abc73a30105~mv2.png\">\n          <h4>Elaine Lecoeur</h4>\n          <p>\n            Canadienne, j'ai une vingtaine d'années d'expérience managériale et RH dans des grandes entreprises en transformation.\n            J'interviens aujourd'hui sur les thématiques relationnelles de même que sur celles de l'agilité et du faire autrement dans des mondes contraints.\n          </p>\n        </div>\n\n        <div class=\"col-xs-12 col-lg-4 coach_description\">\n          <img class=\"coach_img\"\n               src=\"https://static.wixstatic.com/media/04261a_c405cc6001b041b997493ad886d4781b~mv2.png/v1/fill/w_298,h_298,al_c,lg_1/04261a_c405cc6001b041b997493ad886d4781b~mv2.png\">\n          <h4>Annette Leclerc Vanel</h4>\n          <p>\n            Coach depuis 18 ans, après 20 années dans les métiers de services, je suis plus un bon supporter qu'un entraineur sportif : ferme dans le fond, souple dans la forme !\n          </p>\n        </div>\n      </div><!--end row-->\n\n      <div class=\"row hide-on-small-and-down\">\n        <div class=\"header-btn col-xs-12 col-sm-6\">\n          <a pageScroll href=\"#contact\" class=\"btn-basic btn-small right\">Contactez-nous</a>\n        </div>\n        <div class=\"header-btn col-xs-12 col-sm-6\">\n          <button class=\"btn-basic btn-plain btn-connexion btn-small left\" (click)=\"goToCoachRegister()\">Devenir coach</button>\n        </div>\n      </div>\n\n      <div class=\"row hide-on-med-and-up\">\n        <div class=\"header-btn col-xs-12 col-sm-6\">\n          <a pageScroll href=\"#contact\" class=\"btn-basic btn-small\">Contactez-nous</a>\n        </div>\n        <div class=\"header-btn col-xs-12 col-sm-6\">\n          <button class=\"btn-basic btn-plain btn-connexion btn-small\" (click)=\"goToCoachRegister()\">Devenir coach</button>\n        </div>\n      </div>\n\n    </div><!--end container-->\n  </section><!--end section-->\n\n</div><!--end content-->\n\n\n<section class=\"footer section\" id=\"contact\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-sm-12 col-lg-5\"\n           [ngsReveal]=\"{scale: 1, distance: 0, opacity: 0, duration: 1000}\">\n        <div class=\"black-text address\">\n          <h3>Eritis</h3>\n          <p>\n            78 Avenue de Saint-Mandé\n            <br>75012 Paris, France\n          </p>\n        </div>\n      </div>\n      <div class=\"col-sm-12 col-lg-7\"\n           [ngsReveal]=\"{origin: 'right', distance: '200px', opacity: 0}\">\n        <form [formGroup]=\"contactForm\" (ngSubmit)=\"onContactSubmit()\">\n          <div class=\"input_field\">\n            <label for=\"name\">Nom</label>\n            <input type=\"text\" name=\"name\" id=\"name\" formControlName=\"name\" placeholder=\"Nom\">\n          </div>\n          <br>\n          <div class=\"input_field\">\n            <label for=\"mail\">Adresse Mail</label>\n            <input type=\"text\" name=\"mail\" id=\"mail\" formControlName=\"mail\" placeholder=\"exemple@mail.com\">\n          </div>\n          <br>\n          <div class=\"input_field\">\n            <label for=\"message\">Message</label>\n            <textarea name=\"message\" class=\"materialize-textarea\" id=\"message\" formControlName=\"message\" placeholder=\"Message...\"></textarea>\n          </div>\n          <div class=\"input_field text-right\">\n            <button type=\"submit\" name=\"submit\" class=\"btn-basic btn-small btn-submit\" [disabled]=\"!contactForm.valid\">Envoyer\n            </button>\n          </div>\n        </form>\n\n      </div>\n    </div><!--end row-->\n  </div><!--end container-->\n</section>\n\n<er-footer></er-footer>\n\n<script type=\"text/javascript\">\n  $('.navbar-fixed').hide();\n</script>\n"

/***/ }),

/***/ 91:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingDate; });
/**
 * Created by guillaume on 14/03/2017.
 */
var MeetingDate = (function () {
    function MeetingDate() {
    }
    MeetingDate.parseFromBE = function (json) {
        var date = new MeetingDate();
        date.id = json.id;
        // convert dates to use milliseconds ....
        date.start_date = json.start_date * 1000;
        date.end_date = json.end_date * 1000;
        return date;
    };
    return MeetingDate;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/MeetingDate.js.map

/***/ }),

/***/ 92:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SessionService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SessionService = (function () {
    function SessionService() {
    }
    SessionService.prototype.saveSessionTTL = function () {
        var TTL = new Date();
        TTL.setHours(TTL.getHours() + 1);
        // TTL.setMinutes(TTL.getMinutes() + 2);
        var toSave = JSON.stringify({ 'expires': TTL });
        localStorage.setItem('ACTIVE_SESSION', toSave);
        console.log('saveSessionTTL save : ', toSave);
    };
    SessionService.prototype.isSessionActive = function () {
        var session = localStorage.getItem("ACTIVE_SESSION");
        if (session == undefined) {
            console.log('isSessionActive undefined');
            return false;
        }
        // calculate if session still valid
        console.log('isSessionActive saved : ', session);
        var TTL = new Date(JSON.parse(session).expires);
        var now = new Date();
        console.log('isSessionActive now : ', now);
        var compare = TTL > now;
        console.log('isSessionActive compare : ', compare);
        return compare;
    };
    SessionService.prototype.clearSession = function () {
        localStorage.removeItem("ACTIVE_SESSION");
    };
    SessionService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], SessionService);
    return SessionService;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/session.service.js.map

/***/ })

},[1002]);
//# sourceMappingURL=main.bundle.js.map