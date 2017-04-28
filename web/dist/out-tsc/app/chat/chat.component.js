var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef, ElementRef } from '@angular/core';
import { AuthService } from "../service/auth.service";
import { Message } from "./message";
import { FirebaseService } from "../service/firebase.service";
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
        this.messages.push(new Message(name, text, picUrl, imageUri));
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
    return ChatComponent;
}());
ChatComponent = __decorate([
    Component({
        selector: 'rb-chat',
        templateUrl: './chat.component.html',
        styleUrls: ['./chat.component.css']
    }),
    __metadata("design:paramtypes", [FirebaseService, AuthService, ChangeDetectorRef, ElementRef])
], ChatComponent);
export { ChatComponent };
//# sourceMappingURL=/Users/guillaume/git/eritis_fe/src/app/chat/chat.component.js.map