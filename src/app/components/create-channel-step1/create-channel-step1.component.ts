import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {DateService} from "../../service/date.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ChannelModel} from "../../model/channel.model";
import {Constants} from "../../common/constants";
import Swal from "sweetalert2";

@Component({
  selector: 'app-create-channel-step1',
  templateUrl: './create-channel-step1.component.html',
  styleUrls: ['./create-channel-step1.component.scss']
})
export class CreateChannelStep1Component implements OnInit {

    fg: FormGroup;
    today: string;
    private channel: ChannelModel;
    private readonly url:string = Constants.apiURL;
    constructor( private userService: UserService,
                 private router: Router,
                 private fb: FormBuilder,
                 private dateService: DateService,
                 private http: HttpClient) {
        this.today = dateService.formatDateYYYYMMDD(new Date());
        this.channel = new ChannelModel();
        this.url += "channelCreation";
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
            description: [
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
            this.channel.constructorCreateChannel(this.fg.get("dateChannel").value, this.fg.get("description").value, this.fg.get("name").value);
            this.http.post(this.url, JSON.stringify(this.channel).replace(/[/_/]/g, ''), {observe: 'response'}).subscribe((resp:any)=>{
                if (resp.status === 200){
                    Swal.fire({
                        title:`¡Has creado el canal con éxito!`,
                        html: `A continuación serás redirigido a la página para subir las imágenes del canal.`,
                        icon: "success",
                        confirmButtonText: 'Continuar'
                    }).then(()=>{
                        this.router.navigate(['/pages/createChannel/step2'], { queryParams: { id: resp.body['channel']['idChannel'] } });
                    });
                }
            },(resp:any)=>{
                if (resp.status == 401){
                    this.goToUnAuthorized();
                }
                this.errorPopUp(resp.body['message']);
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
            this.router.navigate(['/pages/createChannel/step1']);
        });
    }

}
