import { Component, OnInit } from '@angular/core';
import {MessageService} from "primeng/api";
import {Constants} from "../../common/constants";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {MultimediaModel} from "../../model/multimedia.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ThreadModel} from "../../model/thread.model";

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
    private idThread:string;
    header:HttpHeaders;
    photo:boolean;
    emptyArray:boolean=false;
    multimedia:MultimediaModel[] = [];
    thread:ThreadModel;


    constructor( private messageService: MessageService,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 private router: Router) {
        this.multimediaUrl += "multimediaCreation";
        this.threadUrl += "threadCreation";
        this.route.queryParams.subscribe(params => this.idThread = params.id);
        this.header = new HttpHeaders();
        this.header = this.header.append('idThread', this.idThread);
        this.photo = false;
    }

  ngOnInit(): void {
      let param = new HttpParams();
      this.multimediaPetition(param);
      this.threadPetition(param);
  }

  multimediaPetition(param){
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

  threadPetition(param){
      param = param.append("idThread", this.idThread);
      this.http.get<Object>(this.threadUrl, {observe: 'response', params: param}).subscribe((resp:any)=>{
          
      }, ()=>{

      });
  }

}
