import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Constants} from "../common/constants";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private url:string = Constants.apiURL;

    constructor(private http: HttpClient) {
    }

    getProfile():Observable<any>{
        return this.http.get(this.url + "profile");
    }


}
