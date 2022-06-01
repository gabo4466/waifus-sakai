import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import {UserService} from "./service/user.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{

    items: MenuItem[];

    logged:boolean;

    constructor(public appMain: AppMainComponent,
                private userService: UserService) {

    }

    ngOnInit(): void {
        this.userService.getProfile().subscribe((resp:any)=>this.logged=true,(error:any)=>this.logged=false);

    }





}
