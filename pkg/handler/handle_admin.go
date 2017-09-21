package handler

//func HandleAdmin(w http.ResponseWriter, r *http.Request) {
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handle admin")
//
//	switch r.Method {
//	case "GET":
//
//		if strings.Contains(r.URL.Path, "user") {
//			handleGetConnectedAdminUser(w, r) // GET /api/admins/v1/user
//		} else if strings.Contains(r.URL.Path, "possible_coachs") {
//
//			// detect an id
//			params := response.PathParams(ctx, r, "/api/admins/v1/possible_coachs/:id")
//			userId, ok := params[":id"]
//			if ok {
//				getPossibleCoach(w, r, userId) // GET /api/admins/v1/possible_coachs/:id
//				return
//			}
//			// return all possible coachs
//			getAllPossibleCoachs(w, r) // GET /api/admins/v1/possible_coachs
//
//			return
//		} else if strings.Contains(r.URL.Path, "v1/coachs") {
//
//			params := response.PathParams(ctx, r, "/api/admins/v1/coachs/:id")
//			userId, ok := params[":id"]
//			if ok {
//				handleGetCoachForId(w, r, userId) // GET /api/admins/v1/coachs/ID
//				return
//			}
//
//			handleAdminGetCoachs(w, r) // GET /api/admins/v1/coachs
//
//			return
//
//		} else if strings.Contains(r.URL.Path, "v1/coachees") {
//
//			/**
//		 		GET a specific coachee
//		 	*/
//			params := response.PathParams(ctx, r, "/api/admins/v1/coachees/:uid")
//			userId, ok := params[":uid"]
//			if ok {
//				handleGetCoacheeForId(w, r, userId) // GET /api/admins/v1/coachees/:uid
//				return
//			}
//
//			// get ALL coachees
//			handleAdminGetCoachees(w, r) // GET /api/admins/v1/coachees
//
//			return
//
//		} else if strings.Contains(r.URL.Path, "v1/rhs") {
//
//			/**
//			* Get HR for uid
//			 */
//			params := response.PathParams(ctx, r, "/api/admins/v1/rhs/:id")
//			userId, ok := params[":id"]
//			if ok {
//				handleGetHrForId(w, r, userId) // GET /api/admins/v1/rhs/ID
//				return
//			}
//
//			handleAdminGetRhs(w, r) // GET /api/admins/v1/rhs
//
//			return
//
//		} else if strings.Contains(r.URL.Path, "meetings/coachees") {
//
//			/**
//			* Get meetings for specific Coachee
//			 */
//			params := response.PathParams(ctx, r, "/api/admins/v1/meetings/coachees/:uid")
//			//get uid param
//			uid, ok := params[":uid"]
//			if ok {
//				getAllMeetingsForCoachee(w, r, uid) // GET /api/admins/v1/meetings/coachees/:uid
//				return
//			}
//		} else if strings.Contains(r.URL.Path, "meetings/coachs") {
//
//			/**
//			* Get meetings for specific Coachee
//			 */
//			params := response.PathParams(ctx, r, "/api/admins/v1/meetings/coachs/:uid")
//			//get uid param
//			uid, ok := params[":uid"]
//			if ok {
//				getAllMeetingsForCoach(w, r, uid) // GET /api/admins/v1/meetings/coachs/:uid
//				return
//			}
//
//		} else if strings.Contains(r.URL.Path, "v1/meetings") {
//			/**
//	   			GET all potential dates
//			*/
//			contains := strings.Contains(r.URL.Path, "potentials")
//			if contains {
//				params := response.PathParams(ctx, r, "/api/admins/v1/meetings/:meetingId/potentials")
//				//get uid param
//				meetingId, ok := params[":meetingId"]
//				if ok {
//					handleRequestGETPotentialsTimeForAMeeting(w, r, meetingId) // GET /api/admins/v1/meetings/:meetingId/potentials
//					return
//				}
//
//			}
//		}
//
//		http.NotFound(w, r)
//
//
//	case "PUT":
//
//		// upload picture
//		contains := strings.Contains(r.URL.Path, "profile_picture")
//		if contains {
//			params := response.PathParams(ctx, r, "/api/admins/v1/coachs/:uid/profile_picture")
//			uid, ok := params[":uid"]
//			if ok {
//				uploadCoachProfilePicture(w, r, uid)
//				return
//			}
//		}
//
//		http.NotFound(w, r)
//
//	default:
//		http.NotFound(w, r)
//	}
//}

//func handleGetConnectedAdminUser(w http.ResponseWriter, r *http.Request) {
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handleGetConnectedAdminUser")
//
//	u := user.Current(ctx)
//
//	log.Debugf(ctx, "handleGetConnectedAdminUser, %s", u)
//
//	if u != nil && u.Admin {
//
//		var admin struct {
//			Email string `json:"email"`
//		}
//
//		admin.Email = u.Email
//
//		response.Respond(ctx, w, r, &admin, http.StatusOK)
//		return
//	}
//	response.RespondErr(ctx, w, r, errors.New("No user or not an admin"), http.StatusBadRequest)
//}
//
//func handleAdminGetCoachs(w http.ResponseWriter, r *http.Request) {
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handleAdminGetCoachs")
//
//	handleGetAllCoachs(w, r)
//}
//
//func handleAdminGetCoachees(w http.ResponseWriter, r *http.Request) {
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handleAdminGetCoachees")
//
//	handleGetAllCoachees(w, r)
//}
//
//func handleAdminGetRhs(w http.ResponseWriter, r *http.Request) {
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handleAdminGetRhs")
//
//	handleGetAllRHs(w, r)
//}
