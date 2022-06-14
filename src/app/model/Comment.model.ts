import {UserModel} from "./user.model";

export class CommentModel{
    public _idComment:number;
    public _dateComment:string;
    public _content:string;
    public _fkComment:number;
    public _idThread:number;
    public _user:UserModel;


    constructor() {
        this._idComment = 0;
        this._dateComment = "";
        this._content = "";
        this._fkComment = 0;
        this._idThread = 0;
        this._user = null;
    }

    constructorCommentCreator(dateComment:string, content:string){
        this._dateComment = dateComment.trim();
        this._content = content.trim();
    }

    constructorComment(idComment:number, dateComment:string, content:string, fkComment:number, idThread:number, user:UserModel){
        this._idComment = idComment;
        this._dateComment = dateComment.trim();
        this._content = content.trim();
        this._fkComment = fkComment;
        this._idThread = idThread;
        this._user = user;
    }
}
