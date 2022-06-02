import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import {UserService} from "./service/user.service";
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label}}</div>
                    <ul role="menu">
                        <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                    </ul>
                </li>
            </ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];
    channels:MenuItem = {};
    logged:boolean;
    admin:boolean;
    constructor(public appMain: AppMainComponent,
                private userService: UserService) { }

    ngOnInit() {
        this.userService.getProfile().subscribe((resp:any)=> {
            this.logged = true;
            this.channels = {
                label: 'Canales',
                items: []
            }
            if (resp['admin'] == true){
                this.admin = true;
                this.channels.items.push({label: 'Crear canal',icon: 'pi pi-fw pi-plus', routerLink: ['/pages/createChannel']});
            }
            this.model.push(this.channels)
        },(error:any)=>this.logged=false);

        this.model = [
            {
                label: 'Ohana',
                items:[
                    {label: 'Inicio',icon: 'pi pi-fw pi-home', routerLink: ['/']}
                ]
            },
            {
                label: 'Pages',
                items: [
                    {label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login']},
                    {label: 'Error', icon: 'pi pi-fw pi-times-circle', routerLink: ['/pages/error']},
                    {label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/pages/notfound']},
                    {label: 'Access Denied', icon: 'pi pi-fw pi-lock', routerLink: ['/pages/access']},
                    {label: 'Empty', icon: 'pi pi-fw pi-circle', routerLink: ['/pages/empty']}
                ]
            },
        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement> event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
