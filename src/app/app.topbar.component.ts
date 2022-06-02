import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import {UserService} from "./service/user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{

    items: MenuItem[];

    logged:boolean;
    displayModal:boolean;

    constructor(public appMain: AppMainComponent,
                private userService: UserService,
                private router: Router,) {
        this.displayModal = false;
    }

    ngOnInit(): void {
        this.userService.getProfile().subscribe((resp:any)=>this.logged=true,(error:any)=>this.logged=false);

    }

    goToProfileSettings(){
        this.router.navigate(['']);
    }

    goToProfile(){
        this.router.navigate(['pages/profile']);
    }

    logOut(){
        localStorage.removeItem("access");
        this.displayModal = true;
    }

    goToDashBoard(){
        this.router.onSameUrlNavigation = 'reload';
        this.displayModal = false;
        setTimeout(()=>{                           //<<<---using ()=> syntax
            this.reloadComponent();
        }, 500);
    }

    goToLogIn(){
        this.router.navigate(['/auth/login']);
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/pages']);
    }



}
