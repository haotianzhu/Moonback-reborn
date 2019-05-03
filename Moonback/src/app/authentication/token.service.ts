import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor} from "@angular/common/http";
import {HttpRequest} from "@angular/common/http";
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

// https://segmentfault.com/a/1190000010259536
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
    
    constructor(private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', `${'bearer ' + this.authService.getToken()}`)
        });
        return next.handle(clonedRequest);
    }
}