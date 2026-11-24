import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConfigService } from '../service/config.service';


@Injectable()
export class HttpTargetInterceptor implements HttpInterceptor {
    constructor(private configService: ConfigService) { }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.startsWith('/assets')) {
            req = req.clone({
                url: this.configService.apiUrl + req.url
            });
        }

        return next.handle(req);
    }
}
