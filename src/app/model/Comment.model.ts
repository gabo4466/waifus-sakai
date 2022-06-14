import {UserModel} from "./user.model";
import {combineLatestAll} from "rxjs";
import {fakeAsync} from "@angular/core/testing";

export class CommentModel{
    public _idComment:number;
    public _dateComment:string;
    public _content:string;
    public _comment:number;
    public _thread:number;
    public _user:UserModel;
    public _commentable:boolean;


    constructor() {
        this._idComment = 0;
        this._dateComment = "";
        this._content = "";
        this._comment = 0;
        this._thread = 0;
        this._user = null;
        this._commentable = false;
    }

    constructorCommentCreator(dateComment:string, content:string){
        this._dateComment = dateComment.trim();
        this._content = content.trim();
    }

    constructorComment(idComment:number, dateComment:string, content:string, comment:number, thread:number, user:UserModel){
        this._idComment = idComment;
        this._dateComment = dateComment.trim();
        this._content = content.trim();
        this._comment = comment;
        this._thread = thread;
        this._user = user;
    }
}
