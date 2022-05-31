import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from "../../service/app.config.service";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-otp-auth',
    templateUrl: './otp-auth.component.html',
    styleUrls: ['./otp-auth.component.scss']
})
export class OtpAuthComponent implements OnInit, OnDestroy {

    config: AppConfig;
    subscription: Subscription;
    constructor( private configService: ConfigService ) { }

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

}
