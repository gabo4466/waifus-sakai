import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import {UserService} from "./service/user.service";
import {MenuItem} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {Constants} from "./common/constants";
import {Router} from "@angular/router";

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

    model: MenuItem[];
    logged:boolean;
    admin:boolean;
    urlFChannels:string = Constants.apiURL;
    constructor(public appMain: AppMainComponent,
                private userService: UserService,
                private http: HttpClient,
                private router: Router) {
        this.urlFChannels += "followChannelSearch";
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Ohana',
                items:[
                    {label: 'Inicio',icon: 'pi pi-fw pi-home', routerLink: ['/']}
                ]
            },
            {
                label: 'Canales',
                items: [
                    {label: 'Buscar', icon: 'pi pi-fw pi-search', routerLink: ['/pages/searchChannel']},
                    {label: 'Seguidos', icon: 'pi pi-fw pi-heart-fill',
                    items: [

                    ]},
                ]
            },
        ];
        this.userService.getProfile().subscribe((resp:any)=> {
            this.logged = true;
            if (resp['admin'] == true || resp['karma'] >= 1000){
                this.admin = true;
                this.model[1].items.push({label: 'Crear canal',icon: 'pi pi-fw pi-plus', routerLink: ['/pages/createChannel/step1']});
            }
            this.http.get(this.urlFChannels).subscribe((resp:any)=>{

                if (resp.length > 0){
                    resp.forEach((channel:any)=>{
                        this.model[1].items[1].items.push({ label: channel['name'],command: (event) => {
                                this.router.navigate(['/pages/channel'], {queryParams:{id:channel['idChannel']}})
                            } });
                    });
                }else{
                    this.model[1].items[1].items.push({ label: 'No sigues canales' });

                }

            }, ()=>{
                this.model[1].items[1].items.push({ label: 'No sigues canales' });
            });


        },(error:any)=>this.logged=false);



    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement> event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
