import { Injector, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ServiceLocator } from './service/service.locator.service';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { HomeComponent } from './component/home.component/home.component';
import {
    AutoRefreshTokenService,
    createInterceptorCondition,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    IncludeBearerTokenCondition,
    includeBearerTokenInterceptor,
    provideKeycloak,
    UserActivityService,
    withAutoRefreshToken,
} from 'keycloak-angular';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SecuredHomeTestComponent } from './component/secured-home-test.component/secured-home-test.component';

const escapedApiUrl = environment.apiUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const apiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: new RegExp(`^${escapedApiUrl}(\\/.*?)?$`, 'i'),
    bearerPrefix: 'Bearer',
});

export const httpTargetInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith('/') && !req.url.startsWith('/assets')) {
        req = req.clone({ url: environment.apiUrl + req.url });
    }

    return next(req);
};

@NgModule({
    declarations: [App, HomeComponent, SecuredHomeTestComponent],
    imports: [BrowserModule, AppRoutingModule, MatDrawerContainer, MatDrawer],
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideKeycloak({
            config: {
                url: environment.keycloakUrl,
                realm: 'do-poluchki-app',
                clientId: 'do-poluchki-angular',
            },
            initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            },
            features: [
                withAutoRefreshToken({
                    onInactivityTimeout: 'logout',
                    sessionTimeout: 600_000,
                }),
            ],
            providers: [AutoRefreshTokenService, UserActivityService],
        }),
        { provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: [apiCondition] },
        provideHttpClient(withInterceptors([httpTargetInterceptor, includeBearerTokenInterceptor])),
    ],
    bootstrap: [App],
})
export class AppModule {
    constructor(private injector: Injector) {
        ServiceLocator.injector = injector;
    }
}
