var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { Message } from "./message";
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
        Input(),
        __metadata("design:type", Message)
    ], ChatItemComponent.prototype, "message", void 0);
    ChatItemComponent = __decorate([
        Component({
            selector: 'rb-chat-item',
            templateUrl: './chat-item.component.html',
            styleUrls: ['./chat-item.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], ChatItemComponent);
    return ChatItemComponent;
}());
export { ChatItemComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/chat/chat-item.component.js.map