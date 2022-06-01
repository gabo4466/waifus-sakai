import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Constants} from "../common/constants";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private url:string = Constants.apiURL;

    constructor(private http: HttpClient) {
    }

    isLogged():boolean{
        let logged = false;
        this.http.get(this.url+"profile").subscribe((resp:any)=>{
            logged = true;
        },(errorResp:any)=>{
            logged = false;
        });
        return logged;
    }


}
