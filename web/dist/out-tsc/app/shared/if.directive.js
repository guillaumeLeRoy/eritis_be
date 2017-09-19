var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ComponentFactoryResolver, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LoaderSpinnerComponent } from '../loader/loader-spinner/loader-spinner.component';
var IfDirective = (function () {
    function IfDirective(templateRef, viewContainer, cfResolver) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.cfResolver = cfResolver;
    }
    Object.defineProperty(IfDirective.prototype, "ifLoader", {
        set: function (loading) {
            if (loading) {
                // create and attach a loader to our viewContainer
                var factory = this.cfResolver.resolveComponentFactory(LoaderSpinnerComponent);
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
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], IfDirective.prototype, "ifLoader", null);
    IfDirective = __decorate([
        Directive({ selector: '[ifLoader]' }),
        __metadata("design:paramtypes", [TemplateRef,
            ViewContainerRef,
            ComponentFactoryResolver])
    ], IfDirective);
    return IfDirective;
}());
export { IfDirective };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/shared/if.directive.js.map