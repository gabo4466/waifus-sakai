import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import {catchError, debounceTime, Observable, of, Subscription, switchMap, tap} from 'rxjs';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from "@angular/forms";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserModel} from "../../model/user.model";
import Swal from 'sweetalert2';
import {Constants} from "../../common/constants";
import { MessageService } from "primeng/api";
import {map} from "rxjs/operators";
import {DateService} from "../../service/date.service";


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
                 private serviceMessage: MessageService,
                 private dateService: DateService){
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

    ageValidator():boolean{
        let result :boolean;
        let age = 18;
        let birthday: Date = this.fg.get('birthday').value;

        console.log("date "+birthday);

        let birthdayD = birthday.getDate();
        let birthdayM = birthday.getMonth() + 1;
        let birthdayY = birthday.getFullYear();
        let date: Date = new Date();
        let dateD = date.getDate();
        let dateM = date.getMonth() + 1;
        let dateY = date.getFullYear();

        if (dateY - birthdayY < age) {
            result = false;
        } else if (dateY - birthdayY == age) {
            if (dateM > birthdayM) {
                result = false;
            } else if (dateM == birthdayM) {
                result = dateD >= birthdayD;
            } else {
                result = true;
            }
        } else {
            result = true;
        }

        console.log("res "+result);

        return result;
    }

    adultContentVal(adultContent:string){
        return(formGroup:FormGroup)=>{
            let adultContentControl = formGroup.controls[adultContent];
            if(!this.ageValidator){
                adultContentControl.setValue(false);
            }
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

    emailCheck(control: FormControl): Observable<{ emailForbidden: boolean } | null> {
        const emailToCheck = control.value;
        if(!emailToCheck) {
            return of(null);
        }
        let queryParams = new HttpParams().set('email', emailToCheck);
        queryParams = queryParams.set('nickname', '');
        // @ts-ignore
        return of(emailToCheck).pipe(
            debounceTime(400),
            switchMap(emailToCheck => {
                return this.http.get<{ email: boolean, nickname: boolean }>(this.url, {params: queryParams})
                    .pipe(
                        map(resp => {
                            if (!resp.email) {
                                return {emailForbidden: true};
                            }
                            return null;
                        }), catchError(() => of(null)));
            })
        );
    }

    nicknameCheck(control: FormControl): Observable<{ nicknameForbidden: boolean } | null> {
        const nicknameToCheck = control.value;
        if(!nicknameToCheck) {
            return of(null);
        }
        let queryParams = new HttpParams().set('nickname', nicknameToCheck);
        queryParams = queryParams.set('email', '');
        // @ts-ignore
        return of(nicknameToCheck).pipe(
            debounceTime(400),
            switchMap(nicknameToCheck => {
                return this.http.get<{ nickname: boolean, email: boolean }>(this.url, {params: queryParams})
                    .pipe(
                        map(resp => {
                            if (!resp.nickname) {
                                return {nicknameForbidden: true};
                            }
                            return null;
                        }), catchError(() => of(null)));
            })
        );
    }

    createForm(){
        this.fg = this.fb.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')
                ],
                this.emailCheck.bind(this)
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
                this.nicknameCheck.bind(this)
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
                validators: [
                    this.passwordCheck('password', 'repPass'),
                    this.adultContentVal('adultContent')
                ]
            });
    }

    send(){
        if (this.fg.valid && !this.fg.pending){
            this.user.constructorRegister(this.fg.get('email').value, this.fg.get('password').value, this.fg.get('nickname').value, this.fg.get('name').value, this.fg.get('repPass').value, this.dateService.formatDateYYYYMMDD(this.fg.get('birthday').value), this.fg.get('adultContent').value, this.fg.get('terms').value);
            this.http.post<Object>(this.url, JSON.stringify(this.user).replace(/[/_/]/g, ''), {observe: 'response'}).subscribe( (resp:any) => {
                if (resp.status === 200){
                    Swal.fire({
                        title:`Su cuenta ha sido creada con éxito`,
                        html: `A continuación será redirigido a la página de inicio de sesión<br>
                                La primera vez que inicie sesión se le enviará un código de activación al correo electrónico asociado`,
                        icon: "success",
                        confirmButtonText: 'Ok'
                    }).then((result:any)=>{
                        this.router.navigate(['/auth/login']);
                    });
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
