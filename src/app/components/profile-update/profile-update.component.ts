import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppConfig} from "../../api/appconfig";
import {UserModel} from "../../model/user.model";
import {catchError, debounceTime, Observable, of, Subscription, switchMap} from "rxjs";
import {Constants} from "../../common/constants";
import {ConfigService} from "../../service/app.config.service";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {UserService} from "../../service/user.service";
import {DateService} from "../../service/date.service";
import {map} from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
    selector: 'app-profile-update',
    templateUrl: './profile-update.component.html',
    styleUrls: ['./profile-update.component.scss'],
    providers: [MessageService]
})
export class ProfileUpdateComponent implements OnInit {

    selectedState:any;
    fg: FormGroup;
    config: AppConfig;
    user: UserModel;
    subscription: Subscription;
    private readonly url:string = Constants.apiURL;

    date : Date;

    constructor( private configService: ConfigService,
                 private fb: FormBuilder,
                 private http: HttpClient,
                 private router: Router,
                 private serviceMessage: MessageService,
                 private dateService: DateService,
                 private userService: UserService){
        this.createForm();
        this.user = new UserModel();
        this.url += 'profileUpdate';
    }
    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

        this.userService.getProfile().subscribe((resp:any)=>{
            let photo = "assets/layout/images/noprofilepic.png";
            if(resp['profile_photo']!=undefined){
                photo = resp['profile_photo'];
            }
            this.user.constructorProfile(photo ,resp.activated, resp.admin, resp.adultContent, resp.banned, resp.birthday, resp.country, resp.description, resp.email, resp.gender, resp.idUser, resp.karma, resp.name, resp.nickname, resp.theme);

        },()=>{
            this.goToUnAuthorized();
        });

        let today = new Date();
        this.date= new Date();
        this.date.setDate(today.getDate());
        this.date.setMonth(today.getMonth());
        this.date.setFullYear(today.getFullYear() - 18);

    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
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
        this.fg = this.fb.group( {

            nickname: [
                '{{user._nickname}}',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(20),
                    Validators.pattern('[a-zA-Z0-9._-]+')
                ]
            ],
            name: [
                '{{user._name}}',
                [
                    Validators.required
                ]
            ],
            description: [
                '{{user._description}}',
                [
                    Validators.required
                ]
            ],
            country: [
                false,
                [
                    Validators.required
                ]
            ],
            sex: [
                '',
                [
                    Validators.required
                ]
            ],
            adultContent: [
                false,
            ]
        })
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


    get passwordInvalid(){
        return this.fg.get('password').invalid && this.fg.get('password').touched
    }

    get nicknameInvalid(){
        return this.fg.get('nickname').invalid && this.fg.get('nickname').touched
    }

    get repPassInvalid(){
        return this.fg.get('repPass').invalid && this.fg.get('repPass').touched
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




    goToUnAuthorized(){
        this.router.navigate(['/pages/access']);
    }


}
