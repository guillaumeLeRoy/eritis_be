var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DataService } from './service/data.service';
import { LogService } from './service/log.service';
import { routing } from "./app.routing";
import { SignupComponent } from './login/signup/signup.component';
import { SigninComponent } from './login/signin/signin.component';
import { AuthService } from "./service/auth.service";
import { AuthGuard } from "./login/auth.guard";
import { WelcomeComponent } from './welcome/welcome.component';
import { ChatComponent } from './chat/chat.component';
import { ChatItemComponent } from './chat/chat-item.component';
import { CoachListComponent } from './user/coach-list/coach-list.component';
import { CoachItemComponent } from './user/coach-list/coach-item.component';
import { CoachCoacheeService } from "./service/CoachCoacheeService";
import { CoachDetailsComponent } from './user/coach-details/coach-details.component';
import { MaterialModule } from "@angular/material"; //lib
import { CalendarModule } from 'angular-calendar'; //lib
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MeetingsService } from "./service/meetings.service";
import { MeetingListComponent } from "./meeting/meeting-list/meeting-list.component";
import { MeetingItemCoacheeComponent } from "./meeting/meeting-list/coachee/meeting-item-coachee.component";
import { PreMeetingComponent } from "./meeting/pre-meeting.component";
import { ProfileCoachComponent } from "./user/profile/coach/profile-coach.component";
import { ProfileCoacheeComponent } from "./user/profile/coachee/profile-coachee.component";
import { ProfileCoachSummaryComponent } from "./user/profile/coach/profile-coach-summary.component";
import { MeetingItemCoachComponent } from "./meeting/meeting-list/coach/meeting-item-coach.component";
import { FirebaseService } from "./service/firebase.service";
import { MeetingDateComponent } from "./meeting/meeting-date/meeting-date.component";
import { SliderModule } from "primeng/components/slider/slider";
import { Ng2PageScrollModule } from "ng2-page-scroll";
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
            HeaderComponent,
            SignupComponent,
            SigninComponent,
            ProfileCoachComponent,
            ProfileCoacheeComponent,
            ProfileCoachSummaryComponent,
            WelcomeComponent,
            ChatComponent,
            ChatItemComponent,
            CoachListComponent,
            CoachItemComponent,
            CoachDetailsComponent,
            MeetingListComponent,
            MeetingItemCoacheeComponent,
            MeetingItemCoachComponent,
            MeetingDateComponent,
            PreMeetingComponent
        ],
        imports: [
            BrowserModule,
            FormsModule,
            HttpModule,
            routing,
            ReactiveFormsModule,
            MaterialModule.forRoot(),
            CalendarModule.forRoot(),
            NgbModule.forRoot(),
            SliderModule,
            Ng2PageScrollModule.forRoot()
        ],
        providers: [DataService, LogService, AuthService, AuthGuard, CoachCoacheeService, MeetingsService, FirebaseService],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/app.module.js.map