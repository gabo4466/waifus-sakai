import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from "../../service/app.config.service";
import { AppConfig } from "../../api/appconfig";
import { Subscription } from "rxjs";
import { Constants } from "../../common/constants";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-otp-auth',
    templateUrl: './otp-auth.component.html',
    styles:[`
    :host ::ng-deep .p-toast{
        margin-top: 5.70em;
        z-index:99999;
    }

  `], providers: [MessageService]
})
export class OtpAuthComponent implements OnInit, OnDestroy {

    config: AppConfig;
    subscription: Subscription;
    private readonly url:string = Constants.apiURL;
    private jwtOtp:string;
    private idUser:string;
    loading:boolean = true;
    fg: FormGroup;
    constructor( private configService: ConfigService,
                 private http: HttpClient,
                 private route: ActivatedRoute,
                 private fb: FormBuilder,
                 private serviceMessage: MessageService,
                 private router: Router) {
        this.createForm();
        this.url += "activationOTP";
        this.jwtOtp = '';
        this.route.queryParams.subscribe(params => this.idUser = params.id);


    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

        let param:HttpParams = new HttpParams();
        param = param.append('idUser', this.idUser);
        this.http.get(this.url, { params : param, observe: 'response' }).subscribe((resp:any)=>{
            this.jwtOtp = resp.body['activationOTP'];
            this.loading = false;
        });
    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    send(){
        if (this.fg.valid){
            let param: HttpParams = new HttpParams();
            localStorage.setItem('access', this.jwtOtp);
            param = param.append('codeRec', this.fg.get('otp').value);

            this.http.post(this.url, "", { params: param, observe: 'response' }).subscribe((resp:any) =>{
                if (resp.status === 200){
                    Swal.fire({
                        title:`Su cuenta ha sido activada con éxito`,
                        html: `A continuación será redirigido a la página para iniciar sesión`,
                        icon: "success",
                        confirmButtonText: 'Ok'
                    }).then((result:any)=>{
                        this.router.navigate(['/auth/login']);
                    });
                }else if (resp.status === 202){
                    this.showErrorViaToast("El código es incorrecto");
                }
            },(resp:any) =>{
                Swal.fire({
                    title:`${resp.error['message']}`,
                    html: ``,
                    icon: "error",
                    confirmButtonText: 'Ok'
                });
            });
        }else{
            this.showErrorViaToast("El código no es válido");
        }

    }

    createForm(){
        this.fg = this.fb.group({
            otp: [
                '',
                [
                    Validators.minLength(6),
                    Validators.maxLength(6),
                    Validators.required,
                    Validators.pattern('[0-9]+')
                ]
            ]
        })
    }

    get otpInvalid(){
        return this.fg.get('otp').invalid && this.fg.get('otp').touched
    }

    showErrorViaToast(msg:string) {
        this.serviceMessage.add({ key: 'tst', severity: 'error', summary: 'Ha ocurrido un error', detail: msg });
    }

}
