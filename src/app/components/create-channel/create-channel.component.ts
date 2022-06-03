import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from "../../service/app.config.service";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateService} from "../../service/date.service";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent implements OnInit, OnDestroy {

    config: AppConfig;
    subscription: Subscription;
    items: MenuItem[];

    constructor( private configService: ConfigService,
                 private userService: UserService,
                 private router: Router,
                 private fb: FormBuilder,
                 private dateService: DateService) {

    }

    ngOnInit(): void {
        this.items = [
            {
                label: 'Creación de canal',
                routerLink: 'paso1'
            },
            {
                label: 'Imágenes',
                routerLink: 'paso2'
            }
        ];
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

}
