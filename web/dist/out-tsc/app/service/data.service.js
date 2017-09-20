var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, EventEmitter } from '@angular/core';
import { LogService } from './log.service';
var DataService = (function () {
    function DataService(logService) {
        this.logService = logService;
        this.data = [];
        this.pushedData = new EventEmitter();
    }
    DataService.prototype.addData = function (input) {
        this.data.push(input);
        this.logService.writeToLog("add new data");
        this.pushedData.emit(input);
    };
    DataService.prototype.getData = function () {
        return this.data;
    };
    DataService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LogService])
    ], DataService);
    return DataService;
}());
export { DataService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/data.service.js.map