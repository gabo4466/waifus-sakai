import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  intercept(http_request:HttpRequest<any>,next: HttpHandler):Observable<HttpEvent<any>> {
    const access = `${localStorage.getItem('access')}`;
    let header = {
      'Authorization':access
    }
    return next.handle(http_request.clone({setHeaders:header}));
  }
}
