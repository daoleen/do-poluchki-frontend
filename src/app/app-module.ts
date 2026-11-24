import { Injector, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ConfigService } from "./service/config.service";
import { ServiceLocator } from "./service/service.locator.service";


@NgModule({
    declarations: [
        App
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [
        provideBrowserGlobalErrorListeners()
    ],
    bootstrap: [App],
})
export class AppModule {
    constructor(private injector: Injector, private configService: ConfigService) {
        this.configService.init().subscribe(() => {
            console.log('Service is ready');
        });
        ServiceLocator.injector = injector;
    }
}
