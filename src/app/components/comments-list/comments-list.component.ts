import { Component, OnInit } from '@angular/core';
import {Constants} from "../../common/constants";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ThreadModel} from "../../model/thread.model";
import {UserModel} from "../../model/user.model";
import {CommentModel} from "../../model/Comment.model";
import {computeMsgId} from "@angular/compiler";

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
    embedded:CommentModel = new CommentModel();
    embeddedComments:CommentModel[] = [];
    private idThread:string;
    pag:number = 10;
    idxComments:number;
    idxEmbedded:number;
    totalComments:number;
    totalEmbedded:number;

    commentVisible:boolean=false;
    emptyComments:boolean=false;
    emptyEmbedded:boolean=false;
    moreComments:boolean=false;
    moreEmbedded:boolean=false;
    loading:boolean=true;

    constructor(private messageService: MessageService,
                private route: ActivatedRoute,
                private http: HttpClient,
                private router: Router) {
        this.userUrl += "profileSearch";
        this.commentUrl += "commentCreation";
        this.embeddedUrl += "commentSearch";
        this.idxComments = 1;
        this.totalComments = 0;
        this.idxEmbedded = 1;
        this.totalEmbedded = 0;
        this.route.queryParams.subscribe(params => this.idThread = params.id);
    }

    ngOnInit(): void {
        this.commentPetition();
    }


    toggleComment(idx){
        this.comments[idx]._comentable = !this.comments[idx]._comentable;
    }

    paginateComments(){
        this.idxComments = this.idxComments+this.pag;
        this.commentPetition();
    }

    paginateEmbedded(){
        this.idxEmbedded = this.idxEmbedded+this.pag;
        this.embeddedPetition();
    }

    commentPetition(){
        this.emptyComments = false;
        let param = new HttpParams();
        param = param.append("idThread", this.idThread);
        param = param.append("idx", this.idxComments);
        param = param.append("pag", this.pag);
        this.http.get<Object>(this.commentUrl, {observe: 'response', params: param}).subscribe( (resp:any) => {
            this.totalComments = resp.body['count'];
            resp.body['comments'].forEach((comment:any, idx:number, array:any)=>{
                let commentAux = new CommentModel();
                let userAux = new UserModel();
                userAux._idUser = comment['user'];
                commentAux.constructorComment(comment['idComment'], comment['dateComment'], comment['content'], comment['comment'], comment['thread'], userAux);
                this.userPetition(commentAux, idx === array.length - 1);
                console.log(comment)
                this.comments.push(commentAux);
            });
            if (resp.body['comments'].length===0){
                this.emptyComments = true;
            }
            if (this.totalComments>this.idxComments+this.pag-1){
                this.moreComments=true;
            }else {
                this.moreComments=false;
            }
        }, ()=>{
            this.emptyComments = true;
        });
    }

    userPetition(comment:CommentModel, last:boolean){
        let user = new UserModel();
        let param = new HttpParams();
        param = param.append("idUser", comment._user._idUser);
        this.http.get<Object>(this.userUrl, {observe: 'response', params: param}).subscribe((resp:any)=>{
            if(!resp.body['banned']) {
                user.constructorNickname(resp.body['nickname']);
                user._idUser = resp.body['idUser'];
                user._profilePhoto = this.imgUrl + resp.body['profilePhoto'];
                comment._user = user;
                if (last===true){
                    this.loading = false;
                }
            }else if(resp.body.length===0){

            }else{

            }
        }, ()=>{

        });
    }

    embeddedPetition(){

    }

    goToProfile(id){
        this.router.navigate(['/pages/profile'], { queryParams: { id: id } });
    }

}
