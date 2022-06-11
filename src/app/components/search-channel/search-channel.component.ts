import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {Constants} from "../../common/constants";
import {ChannelModel} from "../../model/channel.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";

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
    term:string;
    notFounEntries: boolean = false;
    totalRecords:number;
    channels: ChannelModel[] = [];
    constructor( private configService: ConfigService,
                 private serviceMessage: MessageService,
                 private http: HttpClient,
                 private router: Router) {
        this.url += "channelSearch";
        this.idx = 1;
        this.totalRecords = 0;
        this.term = "";

    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        this.requestChannels();
    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    search(event) {
        this.term = event;
        this.requestChannels();
    }

    requestChannels(){
        let param = new HttpParams();
        param = param.append("idx", this.idx);
        param = param.append("pag", this.pag);
        param = param.append("term", this.term);
        this.channels = [];
        this.http.get(this.url, { observe: "response", params: param }).subscribe((resp:any)=>{
            this.notFounEntries = false;
            this.totalRecords = resp.body['count'];
            resp.body['channels'].forEach((channel:any)=>{
                let photo = "";
                let banner = "";
                if (channel['photo'] !==""){
                    photo = this.imgUrl + channel['photo'];
                }
                if (channel['banner'] !== ""){
                    banner = this.imgUrl + channel['banner'];

                }
                let channelAux = new ChannelModel();
                channelAux.constructorShowChannel(channel['dateChannel'], channel['description'], channel['name'], photo, banner, channel['idChannel']);
                this.channels.push(channelAux);
            });
            if (resp.body['channels'].length === 0){
                this.notFounEntries = true;
            }
        }, ()=>{
            this.notFounEntries = true;
        });
    }

    paginate(event){
        this.idx = event.first+1;
        this.requestChannels();
    }

    goToChannel(id:number){
        this.router.navigate(['/pages/channel'], { queryParams: { id: id } });
    }

}
