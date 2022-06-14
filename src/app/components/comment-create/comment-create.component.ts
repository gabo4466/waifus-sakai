import { Component, OnInit } from '@angular/core';
import {Constants} from "../../common/constants";
import {ThreadModel} from "../../model/thread.model";
import {UserModel} from "../../model/user.model";
import {CommentModel} from "../../model/Comment.model";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateService} from "../../service/date.service";

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.scss']
})
export class CommentCreateComponent implements OnInit {
    commentUrl:string = Constants.apiURL;
    comment:CommentModel;
    private idThread:string;
    fg: FormGroup;
    today: string;

    constructor(private messageService: MessageService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private dateService: DateService,
                private http: HttpClient,
                private router: Router) {
        this.today = dateService.formatDateYYYYMMDD(new Date());
        this.comment = new CommentModel();
        this.commentUrl += "commentCreation";
        this.createForm();
        this.route.queryParams.subscribe(params => this.idThread = params.id);
    }

    ngOnInit(): void {
    }

    createForm(){
        this.fg = this.fb.group({
            content: [
                "",
                Validators.required
            ],
            dateComment: [
                this.today,
                Validators.required
            ]
        });
    }

    send(){
        if (this.fg.valid && !this.fg.pending){
            let param = new HttpParams();
            param = param.append("idThread", this.idThread);
            this.comment.constructorCommentCreator(this.fg.get('dateComment').value, this.fg.get("content").value);
            this.http.post<Object>(this.commentUrl, JSON.stringify(this.comment).replace(/[/_/]/g, ''), {observe: 'response', params: param}).subscribe( (resp:any) => {
                this.router.navigate(['/pages/thread'], { queryParams: { id: this.idThread } });
            });

        }
    }

}
