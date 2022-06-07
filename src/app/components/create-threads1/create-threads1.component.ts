import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";

import {Constants} from "../../common/constants";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {DateService} from "../../service/date.service";
import {HttpClient} from "@angular/common/http";
import {ThreadModel} from "../../model/thread.model";

@Component({
    selector: 'app-create-threads1',
    templateUrl: './create-threads1.component.html',
    styleUrls: ['./create-threads1.component.scss']
})
export class CreateThreads1Component implements OnInit {

    
    fg: FormGroup;
    today: string;
    private thread : ThreadModel;
    private readonly url:string = Constants.apiURL;
    constructor( private userService: UserService,
                 private router: Router,
                 private fb: FormBuilder,
                 private dateService: DateService,
                 private http: HttpClient) {
        this.today = dateService.formatDateYYYYMMDD(new Date());
        this.thread = new ThreadModel();
        this.url += "threadCreation";
        this.createForm();
    }


    ngOnInit(): void {
    }

    createForm(){
        this.fg = this.fb.group({
            name: [
                "",
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(254),
                    Validators.pattern("[a-zA-Z0-9 ]+")
                ]
            ],
            content: [
                "",
                Validators.required
            ],
            dateChannel: [
                this.today,
                Validators.required
            ]
        });
    }

    send(){
        if (this.fg.valid && !this.fg.pending){
            this.thread.constructorCreateThread(this.fg.get("dateThread").value, this.fg.get("name").value, this.fg.get("content").value);
            this.http.post(this.url, JSON.stringify(this.thread).replace(/[/_/]/g, ''), {observe: 'response'}).subscribe((resp:any)=>{
                if (resp.status === 200){
                    Swal.fire({
                        title:`¡Has creado el texto del hilo con éxito!`,
                        html: `A continuación serás redirigido a la página para subir las imágenes del hilo.`,
                        icon: "success",
                        confirmButtonText: 'Continuar'
                    }).then(()=>{
                        this.router.navigate(['/pages/createThread/threads2'], { queryParams: { id: resp.body['thread']['idThread'] } });
                    });
                }
            },(resp:any)=>{
                if (resp.status == 401){
                    this.goToUnAuthorized();
                }else{
                    this.errorPopUp(resp.error['message']);
                }
            });
        }
    }

    goToUnAuthorized(){
        this.router.navigate(['/pages/access']);
    }

    errorPopUp(message:string){
        Swal.fire({
            title:`Error`,
            html: `${message}`,
            icon: "error",
            confirmButtonText: 'Ok'
        }).then(()=>{
            this.router.navigate(['/pages/createThread/threads1']);
        });
    }
}
