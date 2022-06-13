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
    loading: boolean;
    private readonly url:string = Constants.apiURL;
    urlPhoto:string = Constants.apiURL;

    date : Date;
    photo: boolean;

    constructor( private configService: ConfigService,
                 private fb: FormBuilder,
                 private http: HttpClient,
                 private router: Router,
                 private messageService: MessageService,
                 private dateService: DateService,
                 private userService: UserService){
        this.loading = false;
        this.user = new UserModel();
        this.url += 'profile';
        this.urlPhoto += 'photoProfile';
        this.userService.getProfile().subscribe((resp:any)=>{
            let photo = "";
            if(resp['profile_photo']!=undefined){
                photo = resp['profile_photo'];
            }
            this.user.constructorProfile(photo ,resp.activated, resp.admin, resp.adultContent, resp.banned, resp.birthday, resp.country, resp.description, resp.email, resp.gender, resp.idUser, resp.karma, resp.name, resp.nickname, resp.theme);
            this.createForm();
            this.loading = true;
        },()=>{
            this.goToUnAuthorized();
        });
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
                this.user._nickname,
                [

                    Validators.minLength(4),
                    Validators.maxLength(20),
                    Validators.pattern('[a-zA-Z0-9._-]+')
                ]
            ],
            name: [
                this.user._name,
                [

                ]
            ],
            description: [
                this.user._description,
                [

                ]
            ],
            country: [
                this.user._country,
                [

                ]
            ],
            sex: [
                this.user._gender,
                [

                ]
            ],
            adultContent: [
                ,
            ]
        })
    }



    onBasicUpload(event, box) {
        if (box ===1){
            this.photo = true;
        }
        this.messageService.add({severity: 'success', summary: 'Imagen actualizada', detail: ''});

    }

    showPreview(event, id, idBox){
        document.getElementById(idBox).style.display = 'block';
        let img = document.getElementById(id).querySelector("img");
        let file = event.currentFiles[0];
        img['src'] = URL.createObjectURL(file);
    }

    removePreview(id, idBox){
        document.getElementById(idBox).style.display = 'none';
        document.getElementById(id).querySelector("img")['src'] = "#";
    }

    send(){
        if (this.fg.valid){
            this.http.get<Object>(this.url,{observe:'response'}).subscribe((resp:any)=>{
                this.user._profilePhoto=resp.body['profilePhoto'];
                this.user.constructorProfileUpdate(this.user._profilePhoto, this.fg.get('adultContent').value, this.fg.get('country').value, this.fg.get('description').value, this.fg.get('sex').value, this.fg.get('name').value, this.fg.get('nickname').value);
                console.log(JSON.stringify(this.user).replace(/[/_/]/g, ''))
                this.http.post<Object>(this.url, JSON.stringify(this.user).replace(/[/_/]/g, ''), {observe: 'response'}).subscribe( (resp:any) => {
                    if (resp.status === 200){
                        Swal.fire({
                            title:`Su cuenta ha sido actualizada con éxito`,
                            html: `A continuación será redirigido al perfil`,
                            icon: "success",
                            confirmButtonText: 'Ok'
                        }).then((result:any)=>{
                            this.router.navigate(['/pages/profile']);
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
            })

        }else{
            this.showErrorViaToast();
        }

    }

    showErrorViaToast() {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Hay errores en el formulario', detail: 'Campos inválidos' });
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







    goToUnAuthorized(){
        this.router.navigate(['/pages/access']);
    }


}
