import { Component, OnInit } from '@angular/core';
import {MessageService} from "primeng/api";
import {Constants} from "../../common/constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MultimediaModel} from "../../model/multimedia.model";
import {ActivatedRoute, Router} from "@angular/router";

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
  }

}
