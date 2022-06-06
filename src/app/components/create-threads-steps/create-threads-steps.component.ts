import { Component, OnInit } from '@angular/core';
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {MenuItem} from "primeng/api";
import {ConfigService} from "../../service/app.config.service";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {DateService} from "../../service/date.service";

@Component({
  selector: 'app-create-threads-steps',
  templateUrl: './create-threads-steps.component.html',
  styleUrls: ['./create-threads-steps.component.scss']
})
export class CreateThreadsStepsComponent implements OnInit {

    config: AppConfig;
    subscription: Subscription;
    items: MenuItem[];
    activeIndex: number = 1;
    constructor( private configService: ConfigService,
                 private userService: UserService,
                 private router: Router,
                 private fb: FormBuilder,
                 private dateService: DateService) {

    }

    ngOnInit(): void {
        this.items = [
            {
                label: 'Creación de hilo',
                routerLink: 'threads1'

            },
            {
                label: 'Imágenes',
                routerLink: 'threads2'
            }
        ];
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        /*this.userService.getProfile().subscribe((resp:any)=>{
            if (resp['karma']<??){
                this.goToUnAuthorized();
            }
        },()=>{
            this.goToUnAuthorized();
        });*/

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
