import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelModel} from "../../model/channel.model";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../common/constants";
import {ThreadModel} from "../../model/thread.model";
import {UserService} from "../../service/user.service";
import {DateService} from "../../service/date.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy {

    channel:ChannelModel;
    config: AppConfig;
    subscription: Subscription;
    idChannel:number;
    urlChannel: string = Constants.apiURL;
    urlFollow: string = Constants.apiURL;
    imgUrl: string = Constants.imgURL;
    pag:number = 10;
    idx:number;
    term:string;
    notFounEntries: boolean = false;
    totalRecords:number;
    threads: ThreadModel[] = [];
    urlThreads:string = Constants.apiURL;
    canCreate:boolean;
    labelFollow:string = "Follow";
    constructor( private configService: ConfigService,
                 private http: HttpClient,
                 private route: ActivatedRoute,
                 private router: Router,
                 private userService: UserService,
                 private dateService: DateService) {
        this.canCreate = false;
        this.channel = new ChannelModel();
        this.route.queryParams.subscribe(params => this.idChannel = params.id);
        this.urlChannel += "channel";
        this.urlThreads += "threadSearch";
        this.urlFollow += "followChannel";
        this.idx = 1;
        this.totalRecords = 0;
        this.term = "";
        userService.getProfile().subscribe((resp:any)=>{
            if (resp['admin'] == true || resp['karma'] > 20){
                this.canCreate = true;
            }
        });
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        this.loadChannel();
        this.requestThread();
        this.follows();
    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    search(event) {
        this.term = event;
        this.requestThread();
    }

    paginate(event){
        this.idx = event.first+1;
        this.requestThread();
    }

    goToThread(id:number){
        this.router.navigate(['/pages/thread'], { queryParams: { id: id } });
    }

    goToCreateThread(id){
        this.router.navigate(['/pages/createThread/threads1'], { queryParams: { idChannel: id } });

    }


    loadChannel(){
        let param = new HttpParams();
        param = param.append("idChannel", this.idChannel);
        this.http.get(this.urlChannel, { observe : 'response', params : param }).subscribe((resp:any)=>{
            let photo = "";
            let banner = "";
            if (resp.body['photo'] !==""){
                photo = this.imgUrl + resp.body['photo'];
            }
            if (resp.body['banner'] !== ""){
                banner = this.imgUrl + resp.body['banner'];

            }
            this.channel.constructorShowChannel(resp.body['dateChannel'], resp.body['description'], resp.body['name'], photo, banner, resp.body['idChannel']);
            document.getElementById("description").innerHTML = this.channel._description;
        });
    }

    requestThread(){
        let param = new HttpParams();
        param = param.append("idx", this.idx);
        param = param.append("pag", this.pag);
        param = param.append("term", this.term);
        this.threads = [];
        this.http.get(this.urlThreads, { observe: "response", params: param }).subscribe((resp:any)=>{
            this.notFounEntries = false;
            this.totalRecords = resp.body['count'];
            resp.body['threads'].forEach((thread:any)=>{
                let threadAux = new ThreadModel();
                threadAux.constructorShowThread(thread['dateThread'], thread['name'], thread['content'], thread['idThread'], thread['channel'], thread['user']);
                this.threads.push(threadAux);
            });
            if (resp.body['threads'].length === 0){
                this.notFounEntries = true;
            }
        }, ()=>{
            this.notFounEntries = true;
        });
    }

    followChannel(){
        let param = new HttpParams();
        param = param.append("idChannel", this.idChannel);
        param = param.append("dateFollow", this.dateService.formatDateYYYYMMDD(new Date()));
        this.http.post(this.urlFollow, "",{ observe: 'response', params: param }).subscribe((resp:any)=>{
            if (resp.body['follow']){
                this.labelFollow = "Unfollow";
            }else {
                this.labelFollow = "Follow";
            }
        }, ()=>{
            Swal.fire({
                title: "Ha ocurido un error",
                icon: "error",
                confirmButtonText: 'ok'
            })
        });
    }

    follows(){
        let param = new HttpParams();
        param = param.append("idChannel", this.idChannel);
        this.http.get(this.urlFollow,{ observe: 'response', params: param }).subscribe((resp:any)=>{
            if (resp.body['follow']){
                this.labelFollow = "Unfollow";
            }else {
                this.labelFollow = "Follow";
            }
        },()=>{
            this.canCreate = false;
        });
    }


}
