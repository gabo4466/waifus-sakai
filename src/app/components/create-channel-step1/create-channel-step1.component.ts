import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {DateService} from "../../service/date.service";

@Component({
  selector: 'app-create-channel-step1',
  templateUrl: './create-channel-step1.component.html',
  styleUrls: ['./create-channel-step1.component.scss']
})
export class CreateChannelStep1Component implements OnInit {

    fg: FormGroup;
    today: string;
    constructor( private userService: UserService,
                 private router: Router,
                 private fb: FormBuilder,
                 private dateService: DateService) {
        this.createForm();
        this.today = dateService.formatDateYYYYMMDD(new Date());
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
                    Validators.pattern("[a-zA-Z0-9]+")
                ]
            ],
            description: [
                "",
                Validators.required
            ],
            dateChannel: [
                this.today,
                Validators.required
            ],
            photo: [
                "",
                [],[]
            ],
            photoSource: [
                "",
                [Validators.required]
            ],
            bannerSource: [
                "",
                [Validators.required]
            ],
            banner: [
                "",
                [],[]
            ]
        });
    }

    send(){

        if (this.fg.valid && !this.fg.pending){

        }
    }

}
