import { Component, OnInit } from '@angular/core';
import {MessageService} from "primeng/api";
import {Constants} from "../../common/constants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MultimediaModel} from "../../model/multimedia.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ThreadModel} from "../../model/thread.model";
import {ChannelModel} from "../../model/channel.model";
import {UserModel} from "../../model/user.model";

@Component({
    selector: 'app-thread',
    templateUrl: './thread.component.html',
    styleUrls: ['./thread.component.scss'],
    providers: [MessageService]
})
export class ThreadComponent implements OnInit {
    multimediaUrl:string = Constants.apiURL;
    threadUrl:string = Constants.apiURL;
    imgUrl:string = Constants.imgURL;
    channelUrl:string = Constants.apiURL;
    userUrl:string = Constants.apiURL;
    private idThread:string;
    photo:boolean;
    emptyArray:boolean=false;
    multimedia:MultimediaModel[] = [];
    thread:ThreadModel = new ThreadModel();
    channel:ChannelModel = new ChannelModel();
    user:UserModel = new UserModel();


    constructor( private messageService: MessageService,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 private router: Router) {
        this.multimediaUrl += "multimediaCreation";
        this.threadUrl += "threadCreation";
        this.channelUrl += "channel";
        this.userUrl += "profileSearch";
        this.route.queryParams.subscribe(params => this.idThread = params.id);
        this.photo = false;
    }

  ngOnInit(): void {
      this.threadPetition();
  }

  multimediaPetition(){
      let param = new HttpParams();
      this.multimedia=[];
      this.emptyArray = false;
      param = param.append("idThread", this.idThread);
      this.http.get<Object>(this.multimediaUrl, {observe: 'response', params: param}).subscribe( (resp:any) => {
          resp.body['multimediaArray'].forEach((media:any)=>{
              let mediaAux = new MultimediaModel();
              let photo = "";
              if (media['directory']!==""){
                  photo = this.imgUrl + media['directory'];
              }
              mediaAux.constructorCreateMultimedia(photo);
              this.multimedia.push(mediaAux);
          })
          if(resp.body['multimediaArray'].length===0){
              this.emptyArray = true;
          }
      },()=>{
          this.emptyArray = true;
      });
  }

  threadPetition(){
      this.thread = new ThreadModel();
      let param = new HttpParams();
      param = param.append("idThread", this.idThread);
      this.http.get<Object>(this.threadUrl, {observe: 'response', params: param}).subscribe((resp:any)=>{
          if(!resp.body['deleted']) {
              this.thread.constructorShowThread(resp.body['dateThread'], resp.body['name'], resp.body['content'], resp.body['idThread'], resp.body['channel'], resp.body['user']);
              this.multimediaPetition();
              this.channelPetition();
              this.userPetition();
              document.getElementById("asd").innerHTML = this.thread._content;
          }else if(resp.body.length===0){

          }else{

          }
      }, ()=>{

      });
  }

  channelPetition(){
      this.channel = new ChannelModel();
      let param = new HttpParams();
      param = param.append("idChannel", this.thread._idChannel);
      this.http.get<Object>(this.channelUrl, {observe: 'response', params: param}).subscribe((resp:any)=>{
          if(!resp.body['deleted']) {
              this.channel.constructorNameChannel(resp.body['name']);
          }else if(resp.body.length===0){

          }else{

          }
      },()=>{

      });
  }

  userPetition(){
      this.user = new UserModel();
      let param = new HttpParams();
      param = param.append("idUser", this.thread._idUser);
      this.http.get<Object>(this.userUrl, {observe: 'response', params: param}).subscribe((resp:any)=>{
          if(!resp.body['banned']) {
              this.user.constructorNickname(resp.body['nickname']);
              this.user._idUser = resp.body['idUser'];
              this.user._profile_photo = this.imgUrl + resp.body['profilePhoto'];
          }else if(resp.body.length===0){

          }else{

          }
      }, ()=>{

      });
  }

  goToChannel(id){
      this.router.navigate(['/pages/channel'], { queryParams: { id: id } });
  }

  goToProfile(){
      this.router.navigate(['/pages/profile'], { queryParams: { id: this.user._idUser } });
  }
}
