import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppConfig} from "../../api/appconfig";
import {ConfigService} from "../../service/app.config.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";

import {Subscription} from "rxjs";
import {Constants} from "../../common/constants";
import {UserService} from "../../service/user.service";
import {UserModel} from "../../model/user.model";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    providers: [MessageService]
})
export class ProfileComponent implements OnInit, OnDestroy {

    selectedState:any;
    fg: FormGroup;
    config: AppConfig;
    user: UserModel;
    subscription: Subscription;
    private readonly url:string = Constants.apiURL;

    constructor( private configService: ConfigService,
                 private fb: FormBuilder,
                 private http: HttpClient,
                 private router: Router,
                 private serviceMessage: MessageService,
                 private userService: UserService){
        this.createForm();
        this.user = new UserModel();
        this.url += 'profile';
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

    createForm(){
        this.fg = this.fb.group( {
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')
                ]
            ],
            nickname: [
                '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(20),
                    Validators.pattern('[a-zA-Z0-9._-]+')
                ]
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
        })
    }

    send(){
        if (this.fg.valid){

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


  }
    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }
    goToUnAuthorized(){
        this.router.navigate(['/pages/access']);
    }


}
