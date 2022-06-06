import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";

@Component({
    selector: 'app-search-channel',
    templateUrl: './search-channel.component.html',
    styleUrls: ['./search-channel.component.scss'],
    providers: [MessageService]
})
export class SearchChannelComponent implements OnInit, OnDestroy {

    config: AppConfig;
    subscription: Subscription;
    constructor( private configService: ConfigService,
                 private serviceMessage: MessageService ) {

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

    search(event){
        if (event !== ""){
            console.log(event)
        }
    }

}
