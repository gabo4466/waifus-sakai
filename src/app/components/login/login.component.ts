import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserModel} from "../../model/user.model";
import Swal from 'sweetalert2';
import {Constants} from "../../common/constants";
import { MessageService } from "primeng/api";
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

    :host ::ng-deep .p-message {
        margin-left: .25em;
    }

    :host ::ng-deep .p-toast{
        margin-top: 5.70em;
        z-index:99999;
    }

  `], providers: [MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {

    valCheck: string[] = ['remember'];

    fg: FormGroup;
    config: AppConfig;
    private user: UserModel;
    subscription: Subscription;
    private readonly url:string = Constants.apiURL;
    swal = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });
    constructor( private configService: ConfigService,
                 private fb: FormBuilder,
                 private http: HttpClient,
                 private router: Router,
                 private serviceMessage: MessageService){
        this.createForm();
        this.user = new UserModel();
        this.url += 'login';
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

        if (this.fg.valid){
            this.user.constructorLogIn(this.fg.get('email').value, this.fg.get('password').value);
            this.http.post<Object>(this.url, JSON.stringify(this.user).replace(/[/_/]/g, ''), {observe: 'response'}).subscribe( (resp:any) => {
                if (resp.status === 200){
                    localStorage.setItem("access", resp.body['access']);
                    this.router.navigate(['/']);
                }else if (resp.status === 202){
                    Swal.fire({
                        title: 'Su cuenta no se encuentra activa',
                        text: "¿Desea activar su cuenta? Se le enviará un mail al correo electrónico asociado con la cuenta.",
                        icon: 'info',
                        showCancelButton: true,
                        confirmButtonText: 'Sí',
                        cancelButtonText: 'No',
                        reverseButtons: true
                    }).then((result:any)=>{
                        if (result.isConfirmed){
                            this.router.navigate(['/auth/code'], { queryParams: { id: resp.body['user']['idUser'] } });
                        }else{
                            this.router.navigate(['/']);
                        }
                    })
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



}
