import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {Constants} from "../../common/constants";
import {ChannelModel} from "../../model/channel.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {any} from "codelyzer/util/function";

@Component({
    selector: 'app-search-channel',
    templateUrl: './search-channel.component.html',
    styleUrls: ['./search-channel.component.scss'],
    providers: [MessageService]
})
export class SearchChannelComponent implements OnInit, OnDestroy {

    config: AppConfig;
    subscription: Subscription;
    url: string = Constants.apiURL;
    imgUrl: string = Constants.imgURL;
    pag:number = 10;
    idx:number;
    notFounEntries: boolean = false;
    channels: ChannelModel[] = [];
    constructor( private configService: ConfigService,
                 private serviceMessage: MessageService,
                 private http: HttpClient) {
        this.url += "channelSearch";
        this.idx = 1;

    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        let param = new HttpParams();
        param = param.append("idx", this.idx);
        param = param.append("pag", this.pag);
        param = param.append("term", "");
        this.http.get(this.url, { observe: "response", params: param }).subscribe((resp:any)=>{
            this.notFounEntries = false;

            resp.body['channels'].forEach((channel:any)=>{
                let photo = "";
                if (channel['photo']){
                    photo = this.imgUrl + channel['photo'];
                }
                let channelAux = new ChannelModel();
                channelAux.constructorShowChannel(channel['dateChannel'], channel['description'], channel['name'], photo)
                this.channels.push(channelAux);
            })
        }, ()=>{
            this.notFounEntries = true;
        });


    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    search(event) {

    }


    paginate(event){

    }

}
