import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from "../../service/app.config.service";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateService} from "../../service/date.service";

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent implements OnInit, OnDestroy {

    config: AppConfig;
    subscription: Subscription;
    fg: FormGroup;
    today: string;
    constructor( private configService: ConfigService,
                 private userService: UserService,
                 private router: Router,
                 private fb: FormBuilder,
                 private dateService: DateService) {
        this.createForm();
        this.today = dateService.formatDateYYYYMMDD(new Date());
        console.log(this.today.toString())
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        this.userService.getProfile().subscribe((resp:any)=>{
            if (resp['admin']!=true){
                this.goToUnAuthorized();
            }
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

    createForm(){
        this.fg = this.fb.group({
            name: [
                "",
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(254),
                    Validators.pattern("[a-zA-Z0-9]+")
                ]
            ],
            description: [
                "",
                Validators.required
            ],
            dateChannel: [
                this.today,
                Validators.required
            ],
            photo: [
                "",
                [],[]
            ],
            banner: [
                "",
                [],[]
            ]
        });
    }

    send(){
        if (this.fg.valid && !this.fg.pending){

        }
    }

    mainPhotoHandler(event){
        let files = event.currentFiles[0];
        console.log(files);
    }

}
