import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import {Observable, Subscription} from 'rxjs';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserModel} from "../../model/user.model";
import Swal from 'sweetalert2';
import {Constants} from "../../common/constants";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
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

    :host ::ng-deep .p-message {
        margin-left: .25em;
    }

    :host ::ng-deep .p-toast{
        margin-top: 5.70em;
        z-index:99999;
    }

  `], providers: [MessageService]
})
export class RegisterComponent implements OnInit {

    fg: FormGroup;
    config: AppConfig;
    private user: UserModel;
    subscription: Subscription;
    private readonly url:string = Constants.apiURL;

    constructor( private configService: ConfigService,
                 private fb: FormBuilder,
                 private http: HttpClient,
                 private router: Router,
                 private serviceMessage: MessageService){
        this.createForm();
        this.user = new UserModel();
        this.url += 'register';
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

    ageValidator(control: AbstractControl){
        let birthday: Date = control.get('birthday').value;
        let birthdayD = birthday.getDate();
        let birthdayM = birthday.getMonth() + 1;
        let birthdayY = birthday.getFullYear();
        let date: Date = new Date();
        let dateD = date.getDate();
        let dateM = date.getMonth() + 1;
        let dateY = date.getFullYear();

        if (dateY-birthdayY<18){

        }else if (dateY-birthdayY==18){
            if(dateM>birthdayM){

            }else if(dateM==birthdayM){
                if(dateD<birthdayD){

                }else {

                }
            }else {

            }
        }else {

        }
    }

    passwordCheck(password:string, repPass:string){
        return(formGroup:FormGroup)=>{
            let passwordControl = formGroup.controls[password];
            let repPassControl = formGroup.controls[repPass];

            if (passwordControl.value === repPassControl.value){
                repPassControl.setErrors(null);
            }else {
                repPassControl.setErrors({notEqual : true});
            }
        }
    }

    formatDateYYYYMMDD(date:Date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('');
    }

    emailCheck(control:FormControl): Promise<Error>|Observable<Error>{
        if(!control.value){
            return Promise.resolve(null);
        }
        return new Promise((resolve, reject)=>{
            let param: HttpParams = new HttpParams();
            param = param.append('email', control.value);
            param = param.append('nickname', '');
            this.http.get<Object>(this.url, {params: param, observe: 'response'}).subscribe( (resp:any) => {
                if(resp.body['email']!=true){
                    control.setErrors({used : true});
                }
            });
        });
    }

    nicknameCheck(control:FormControl): Promise<Error>|Observable<Error>{
        if(!control.value){
            return Promise.resolve(null);
        }
        return new Promise((resolve, reject)=>{
            let param: HttpParams = new HttpParams();
            param = param.append('nickname', control.value);
            param = param.append('email', '');
            this.http.get<Object>(this.url, {params: param, observe: 'response'}).subscribe( (resp:any) => {
                if(resp.body['nickname']!=true){
                    control.setErrors({used : true});
                }
            });
        });
    }

    createForm(){
        this.fg = this.fb.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')
                ],
                this.emailCheck
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.pattern('[A-Za-z0-9=)(/&%$·"!;:_,.-]+')
                ]
            ],
            repPass: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6)
                ]
            ],
            nickname: [
                '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(20),
                    Validators.pattern('[a-zA-Z0-9._-]+')
                ],
                this.nicknameCheck
            ],
            name: [
              '',
              [
                  Validators.required
              ]
            ],
            birthday: [
                '',
                [
                    Validators.required
                ]
            ],
            terms: [
                false,
                [
                    Validators.required
                ]
            ],
            adultContent: [
                false,
            ]
        },
            {
                validators: this.passwordCheck('password', 'repPass')
            });
    }

    send(){
        console.log(this.formatDateYYYYMMDD(this.fg.get('birthday').value),);
        if (this.fg.valid){
            this.user.constructorRegister(this.fg.get('email').value, this.fg.get('password').value, this.fg.get('nickname').value, this.fg.get('name').value, this.fg.get('repPass').value, this.formatDateYYYYMMDD(this.fg.get('birthday').value), this.fg.get('adultContent').value, this.fg.get('terms').value);
            this.http.post<Object>(this.url, JSON.stringify(this.user).replace(/[/_/]/g, ''), {observe: 'response'}).subscribe( (resp:any) => {
                if (resp.status === 200){
                    localStorage.setItem("access", resp.body['access']);
                    this.router.navigate(['/']);
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
        }else{
            this.showErrorViaToast();
        }

    }

    showErrorViaToast() {
        this.serviceMessage.add({ key: 'tst', severity: 'error', summary: 'Hay errores en el formulario', detail: 'Campos inválidos' });
    }

    get emailInvalid(){
        return this.fg.get('email').invalid && this.fg.get('email').touched
    }

    get passwordInvalid(){
        return this.fg.get('password').invalid && this.fg.get('password').touched
    }

    get nicknameInvalid(){
        return this.fg.get('nickname').invalid && this.fg.get('nickname').touched
    }

    get repPassInvalid(){
        let password = this.fg.get('password').value;
        let repPass = this.fg.get('repPass').value;
        return (this.fg.get('repPass').invalid && this.fg.get('repPass').touched) || password !== repPass
    }

    get nameInvalid(){
        return this.fg.get('name').invalid && this.fg.get('name').touched
    }

    get birthdayInvalid(){
        return this.fg.get('birthday').invalid && this.fg.get('birthday').touched
    }

    get termsInvalid(){
        return !this.fg.get('terms').value && this.fg.get('terms').touched
    }

}
