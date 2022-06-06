import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";

import {Constants} from "../../common/constants";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {DateService} from "../../service/date.service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-create-threads1',
    templateUrl: './create-threads1.component.html',
    styleUrls: ['./create-threads1.component.scss']
})
export class CreateThreads1Component implements OnInit {

    fg: FormGroup;
    today: string;

    private readonly url:string = Constants.apiURL;
    constructor( private userService: UserService,
                 private router: Router,
                 private fb: FormBuilder,
                 private dateService: DateService,
                 private http: HttpClient) {
        this.today = dateService.formatDateYYYYMMDD(new Date());

        this.url += "threadCreation";
        this.createForm();
    }


    ngOnInit(): void {
    }

    createForm(){
        this.fg = this.fb.group({
            name: [
                "",
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(254),
                    Validators.pattern("[a-zA-Z0-9 ]+")
                ]
            ],
            content: [
                "",
                Validators.required
            ],
            dateChannel: [
                this.today,
                Validators.required
            ]
        });
    }

    send(){
        if (this.fg.valid && !this.fg.pending){

        }
    }
}
