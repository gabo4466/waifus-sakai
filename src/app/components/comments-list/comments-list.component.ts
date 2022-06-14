import { Component, OnInit } from '@angular/core';
import {Constants} from "../../common/constants";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ThreadModel} from "../../model/thread.model";
import {UserModel} from "../../model/user.model";
import {CommentModel} from "../../model/Comment.model";

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent implements OnInit {
    commentUrl:string = Constants.apiURL;
    embeddedUrl:string = Constants.apiURL;
    imgUrl:string = Constants.imgURL;
    userUrl:string = Constants.apiURL;
    thread:ThreadModel = new ThreadModel();
    user:UserModel = new UserModel();
    comment:CommentModel = new CommentModel();
    comments:CommentModel[] = [];
    private idThread:string;
    pag:number = 10;
    idx:number;
    totalComments:number;

    commentVisible:boolean=false;
    emptyComments:boolean=false;
    emptyEmbedded:boolean=false;


    constructor(private messageService: MessageService,
                private route: ActivatedRoute,
                private http: HttpClient,
                private router: Router) {
        this.userUrl += "profileSearch";
        this.commentUrl += "commentCreation";
        this.embeddedUrl += "commentSearch";
        this.idx = 1;
        this.totalComments = 0;
        this.route.queryParams.subscribe(params => this.idThread = params.id);
    }

    ngOnInit(): void {
        this.commentPetition();
    }


    toggleComment(){
        if (this.commentVisible){
            this.commentVisible=false;
        }else {
            this.commentVisible=true;
        }
    }

    paginate(event){
        this.idx = event.first+1;
        this.commentPetition();
    }

    commentPetition(){
        this.comments = [];
        this.emptyComments = false;
        let param = new HttpParams();
        param = param.append("idThread", this.idThread);
        param = param.append("idx", this.idx);
        param = param.append("pag", this.pag);
        this.http.get<Object>(this.commentUrl, {observe: 'response', params: param}).subscribe( (resp:any) => {
            resp.body['comments'].forEach((comment:any)=>{
                let commentAux = new CommentModel();
                commentAux.constructorComment(comment['idComment'], comment['dateComment'], comment['content'], comment['comment'], comment['thread'], this.userPetition(comment['user']));
                this.comments.push(commentAux);
            });
            if (resp.body['comments'].length===0){
                this.emptyComments = true;
            }
        }, ()=>{
            this.emptyComments = true;
        });
    }

    userPetition(id:number):UserModel{
        this.user = new UserModel();
        let param = new HttpParams();
        param = param.append("idUser", id);
        this.http.get<Object>(this.userUrl, {observe: 'response', params: param}).subscribe((resp:any)=>{
            if(!resp.body['banned']) {
                this.user.constructorNickname(resp.body['nickname']);
                this.user._idUser = resp.body['idUser'];
                this.user._profilePhoto = this.imgUrl + resp.body['profilePhoto'];
            }else if(resp.body.length===0){

            }else{

            }
        }, ()=>{

        });
        return this.user;
    }

    goToProfile(){
        this.router.navigate(['/pages/profile'], { queryParams: { id: this.user._idUser } });
    }

}
