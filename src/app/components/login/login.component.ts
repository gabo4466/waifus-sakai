import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Subscription } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserModel} from "../../model/user.model";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles:[`
    :host ::ng-deep .p-password input {
    width: 100%;
    padding:1rem;
    }

    :host ::ng-deep .pi-eye{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .pi-eye-slash{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {

    valCheck: string[] = ['remember'];

    fg: FormGroup;
    password: string;

    config: AppConfig;

    private user: UserModel;

    subscription: Subscription;

    constructor( public configService: ConfigService,
                 private fb: FormBuilder,
                 private http: HttpClient,
                 private router: Router){
        this.createForm();
        this.user = new UserModel();
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
          this.config = config;
        });
    }

    ngOnDestroy(): void {
        if(this.subscription){
          this.subscription.unsubscribe();
        }
    }

    createForm(){
        this.fg = this.fb.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')
                ]
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(5)
                ]
            ],
        });
    }

    send(){
        console.log(this.fg);

        if (this.fg.valid){
            this.user.constructorLogIn(this.fg.get('email').value, this.fg.get('password').value);
            this.http.post<Object>(this.url, JSON.stringify(this.user).replace(/[/_/]/g, ''), {observe: 'response'}).subscribe( (resp:any) => {
                if (resp.status === 200){
                    localStorage.setItem("access", resp.body['access']);
                    this.router.navigate(['/forum']);
                }else if (resp.status === 202){
                    console.log(resp.body['user']);
                    this.router.navigate(['/auth/code', resp.body['user']['idUser']]);
                }

            }, (resp:HttpErrorResponse) => {
                Swal.fire({
                    title:`${resp.error['message']}`,
                    html: ``,
                    icon: "error",
                    confirmButtonText: 'Ok'
                });
            });
        }

    }

    get emailInvalid(){
        return this.fg.get('email').invalid && this.fg.get('email').touched
    }

    get passwordInvalid(){
        return this.fg.get('password').invalid && this.fg.get('password').touched
    }



}
