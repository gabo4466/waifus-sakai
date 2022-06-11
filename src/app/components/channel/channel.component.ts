import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelModel} from "../../model/channel.model";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy {

    channel:ChannelModel;
    config: AppConfig;
    subscription: Subscription;
    constructor( private configService: ConfigService,
                 private http: HttpClient) {
      this.channel = new ChannelModel();
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

}
