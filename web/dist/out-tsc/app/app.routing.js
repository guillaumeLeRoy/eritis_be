import { RouterModule } from "@angular/router";
import { SigninComponent } from "./login/signin/signin.component";
import { SignupComponent } from "./login/signup/signup.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { ChatComponent } from "./chat/chat.component";
import { CoachListComponent } from "./user/coach-list/coach-list.component";
import { CoachDetailsComponent } from "./user/coach-details/coach-details.component";
import { MeetingListComponent } from "./meeting/meeting-list/meeting-list.component";
import { ProfileCoachComponent } from "./user/profile/coach/profile-coach.component";
import { ProfileCoacheeComponent } from "./user/profile/coachee/profile-coachee.component";
import { MeetingDateComponent } from "./meeting/meeting-date/meeting-date.component";
import { CoachSelectorComponent } from "./user/coach-selector/coach-selector.component";
import { AdminComponent } from "./admin/admin.component";
var APP_ROUTES = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'profile_coach', component: ProfileCoachComponent },
    { path: 'profile_coachee', component: ProfileCoacheeComponent },
    { path: 'coachs', component: CoachListComponent },
    { path: 'coachs/:id', component: CoachDetailsComponent },
    { path: 'coachees', component: CoachListComponent },
    { path: 'meetings', component: MeetingListComponent },
    { path: 'date/:meetingId', component: MeetingDateComponent },
    {
        path: 'admin', component: AdminComponent,
        children: [
            { path: 'signup', component: SignupComponent },
            { path: 'coach-selector', component: CoachSelectorComponent }
        ]
    },
];
export var routing = RouterModule.forRoot(APP_ROUTES);
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/app.routing.js.map