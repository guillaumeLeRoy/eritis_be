var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component } from "@angular/core";
import { MeetingsService } from "../../service/meetings.service";
import { Observable } from "rxjs";
import { AuthService } from "../../service/auth.service";
import { Coach } from "../../model/Coach";
import { Coachee } from "../../model/coachee";
import { Router } from "@angular/router";
import { CoachCoacheeService } from "../../service/CoachCoacheeService";
import { Rh } from "../../model/Rh";
var MeetingListComponent = (function () {
    function MeetingListComponent(router, meetingsService, coachCoacheeService, authService, cd) {
        this.router = router;
        this.meetingsService = meetingsService;
        this.coachCoacheeService = coachCoacheeService;
        this.authService = authService;
        this.cd = cd;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
        this.hasUnbookedMeeting = false;
        this.hasCollaborators = false;
        this.hasPotentialCollaborators = false;
    }
    MeetingListComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingListComponent.prototype.isUserACoach = function (user) {
        return user instanceof Coach;
    };
    MeetingListComponent.prototype.isUserACoachee = function (user) {
        return user instanceof Coachee;
    };
    MeetingListComponent.prototype.isUserARh = function (user) {
        return user instanceof Rh;
    };
    MeetingListComponent.prototype.getAllMeetingsForCoach = function (coachId) {
        var _this = this;
        this.subscription = this.meetingsService.getAllMeetingsForCoachId(coachId).subscribe(function (meetings) {
            console.log('got meetings for coach', meetings);
            _this.meetingsArray = meetings;
            _this.meetings = Observable.of(meetings);
            _this.getBookedMeetings();
            _this.getClosedMeetings();
            _this.getUnbookedMeetings();
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            _this.meetingsArray = meetings;
            _this.meetings = Observable.of(meetings);
            _this.getOpenedMeetings();
            _this.getClosedMeetings();
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.getAllCoacheesForRh = function (rhId) {
        var _this = this;
        this.subscription = this.coachCoacheeService.getAllCoacheesForRh(rhId).subscribe(function (coachees) {
            console.log('got coachees for rh', coachees);
            _this.coachees = Observable.of(coachees);
            if (coachees !== null)
                _this.hasCollaborators = true;
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.getAllPotentialCoacheesForRh = function (rhId) {
        var _this = this;
        this.subscription = this.coachCoacheeService.getAllPotentialCoacheesForRh(rhId).subscribe(function (coachees) {
            console.log('got potentialCoachees for rh', coachees);
            _this.potentialCoachees = Observable.of(coachees);
            if (coachees !== null)
                _this.hasPotentialCollaborators = true;
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof Coach) {
                // coach
                console.log('get a coach');
                this.getAllMeetingsForCoach(user.id);
            }
            else if (user instanceof Coachee) {
                // coachee
                console.log('get a coachee');
                this.getAllMeetingsForCoachee(user.id);
            }
            else if (user instanceof Rh) {
                // rh
                console.log('get a rh');
                this.getAllCoacheesForRh(user.id);
                this.getAllPotentialCoacheesForRh(user.id);
                this.getAllContractPlans();
                this.getUsageRate(user.id);
            }
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListComponent.prototype.goToDate = function () {
        var _this = this;
        console.log('goToDate');
        this.user.take(1).subscribe(function (user) {
            if (user == null) {
                console.log('no connected user');
                return;
            }
            // 1) create a new meeting
            // 2) refresh our user to have a correct number of available sessions
            // 3) redirect to our MeetingDateComponent
            _this.meetingsService.createMeeting(user.id).flatMap(function (meeting) {
                console.log('goToDate, meeting created');
                //meeting created, now fetch user
                return _this.authService.refreshConnectedUser().flatMap(function (user) {
                    console.log('goToDate, user refreshed');
                    return Observable.of(meeting);
                });
            }).subscribe(function (meeting) {
                // TODO display a loader
                console.log('goToDate, go to setup dates');
                _this.router.navigate(['/date', meeting.id]);
            });
        });
    };
    MeetingListComponent.prototype.getOpenedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting.isOpen) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = Observable.of(opened);
        }
    };
    MeetingListComponent.prototype.getClosedMeetings = function () {
        console.log('getClosedMeetings');
        if (this.meetingsArray != null) {
            var closed_1 = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (!meeting.isOpen) {
                    closed_1.push(meeting);
                    this.hasClosedMeeting = true;
                }
            }
            this.meetingsClosed = Observable.of(closed_1);
        }
    };
    MeetingListComponent.prototype.getBookedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting.isOpen && meeting.agreed_date) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = Observable.of(opened);
        }
    };
    MeetingListComponent.prototype.getUnbookedMeetings = function () {
        console.log('getAskedMeetings');
        if (this.meetingsArray != null) {
            var unbooked = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting.isOpen && !meeting.agreed_date) {
                    unbooked.push(meeting);
                    this.hasUnbookedMeeting = true;
                }
            }
            this.meetingsUnbooked = Observable.of(unbooked);
        }
    };
    MeetingListComponent.prototype.getAllContractPlans = function () {
        var _this = this;
        this.authService.getNotAuth(AuthService.GET_CONTRACT_PLANS, null).subscribe(function (response) {
            var json = response.json();
            console.log("getListOfContractPlans, response json : ", json);
            _this.plans = Observable.of(json);
            // this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.rhUsageRate = Observable.of(rate);
        });
    };
    MeetingListComponent.prototype.refreshDashboard = function () {
        location.reload();
    };
    MeetingListComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    /* ************************************
     ----Modal to cancel Meeting ----------
     *************************************/
    MeetingListComponent.prototype.coachCancelModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coach_cancel_meeting').openModal();
        }
        else {
            $('#coach_cancel_meeting').closeModal();
        }
    };
    MeetingListComponent.prototype.openCoachCancelMeetingModal = function (meeting) {
        this.meetingToCancel = meeting;
        this.coachCancelModalVisibility(true);
    };
    MeetingListComponent.prototype.cancelCoachCancelMeeting = function () {
        this.coachCancelModalVisibility(false);
        this.meetingToCancel = null;
    };
    // remove MeetingTime
    MeetingListComponent.prototype.validateCoachCancelMeeting = function () {
        var _this = this;
        console.log('validateCancelMeeting, agreed date : ', this.meetingToCancel.agreed_date);
        var meetingTimeId = this.meetingToCancel.agreed_date.id;
        console.log('validateCancelMeeting, id : ', meetingTimeId);
        // hide modal
        this.coachCancelModalVisibility(false);
        this.meetingToCancel = null;
        // perform request
        this.meetingsService.removePotentialTime(meetingTimeId).subscribe(function (response) {
            console.log('validateCancelMeeting, res ', response);
            console.log('emit');
            // this.dateRemoved.emit(null);
            _this.onRefreshRequested();
            Materialize.toast('Meeting annulé !', 3000, 'rounded');
        }, function (error) {
            console.log('unbookAdate, error', error);
            Materialize.toast('Impossible d\'annuler le meeting', 3000, 'rounded');
        });
    };
    MeetingListComponent.prototype.coacheeDeleteModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coachee_delete_meeting_modal').openModal();
        }
        else {
            $('#coachee_delete_meeting_modal').closeModal();
        }
    };
    MeetingListComponent.prototype.addPotentialCoacheeModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#add_potential_coachee_modal').openModal();
        }
        else {
            $('#add_potential_coachee_modal').closeModal();
        }
    };
    MeetingListComponent.prototype.openCoacheeDeleteMeetingModal = function (meeting) {
        this.meetingToCancel = meeting;
        this.coacheeDeleteModalVisibility(true);
    };
    MeetingListComponent.prototype.cancelCoacheeDeleteMeeting = function () {
        this.coacheeDeleteModalVisibility(false);
        this.meetingToCancel = null;
    };
    MeetingListComponent.prototype.validateCoacheeDeleteMeeting = function () {
        var _this = this;
        console.log('validateCoacheeDeleteMeeting');
        var meetingId = this.meetingToCancel.id;
        this.coacheeDeleteModalVisibility(false);
        this.meetingToCancel = null;
        this.meetingsService.deleteMeeting(meetingId).subscribe(function (response) {
            console.log('confirmCancelMeeting, res', response);
            // this.onMeetingCancelled.emit();
            _this.onRefreshRequested();
            Materialize.toast('Meeting supprimé !', 3000, 'rounded');
        }, function (error) {
            console.log('confirmCancelMeeting, error', error);
            Materialize.toast('Impossible de supprimer le meeting', 3000, 'rounded');
        });
    };
    MeetingListComponent.prototype.cancelAddPotentialCoachee = function () {
        this.potentialCoacheeEmail = null;
        this.addPotentialCoacheeModalVisibility(false);
    };
    MeetingListComponent.prototype.validateAddPotentialCoachee = function () {
        var _this = this;
        console.log('validateAddPotentialCoachee, potentialCoacheeEmail : ', this.potentialCoacheeEmail);
        this.addPotentialCoacheeModalVisibility(false);
        this.user.take(1).subscribe(function (user) {
            var body = {
                "email": _this.potentialCoacheeEmail,
                "plan_id": _this.selectedPlan.plan_id
            };
            _this.coachCoacheeService.postPotentialCoachee(user.id, body).subscribe(function (res) {
                console.log('postPotentialCoachee, res', res);
                _this.onRefreshRequested();
                Materialize.toast('Collaborateur ajouté !', 3000, 'rounded');
            }, function (error) {
                console.log('postPotentialCoachee, error', error);
                Materialize.toast("Impossible d'ajouter le collaborateur", 3000, 'rounded');
            });
        });
    };
    MeetingListComponent.prototype.onCoachStartRoomClicked = function () {
        console.log('onCoachStartRoomClicked');
        this.user.take(1).subscribe(function (usr) {
            console.log('onCoachStartRoomClicked, get user');
            var coach = usr;
            var win = window.open(coach.chat_room_url, "_blank");
        });
    };
    return MeetingListComponent;
}());
MeetingListComponent = __decorate([
    Component({
        selector: 'rb-meeting-list',
        templateUrl: './meeting-list.component.html',
        styleUrls: ['./meeting-list.component.css']
    }),
    __metadata("design:paramtypes", [Router, MeetingsService, CoachCoacheeService, AuthService, ChangeDetectorRef])
], MeetingListComponent);
export { MeetingListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/meeting-list.component.js.map