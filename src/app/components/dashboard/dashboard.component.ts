import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/productservice';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import {ChannelModel} from "../../model/channel.model";
import {Router} from "@angular/router";
import {Constants} from "../../common/constants";
import {UserModel} from "../../model/user.model";
import {HttpClient} from "@angular/common/http";
import * as http from "http";

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {

    items: MenuItem[];

    products: Product[];

    chartData: any;

    chartOptions: any;

    subscription: Subscription;

    config: AppConfig;

    channels: ChannelModel[] = [];

    channel: ChannelModel = new ChannelModel();

    emptyChannels:boolean = false;

    users: UserModel[] = [];

    usersKarma:UserModel[] = [];

    user: UserModel = new UserModel();

    emptyUsers: boolean = false;

    urlBanner:string = Constants.imgURL + "mainBanner.png";

    urlChannelRank:string = Constants.apiURL + "mostThreads";

    urlUserRank:string = Constants.apiURL + "karmaRank";

    urlPhoto:string = Constants.imgURL ;

    constructor(
        private productService: ProductService,
        public configService: ConfigService,
        private router: Router,
        private http: HttpClient) {}

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
            this.updateChartOptions();
        });
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            {label: 'Add New', icon: 'pi pi-fw pi-plus'},
            {label: 'Remove', icon: 'pi pi-fw pi-minus'}
        ];

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: '#2f4860',
                    borderColor: '#2f4860',
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: '#00bb7e',
                    borderColor: '#00bb7e',
                    tension: .4
                }
            ]
        };

        this.channelRank();

        this.userRank();
    }

    updateChartOptions() {
        if (this.config.dark)
            this.applyDarkTheme();
        else
            this.applyLightTheme();

    }

    applyDarkTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color:  'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color:  'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };
    }

    goToChannel(id:number){
        this.router.navigate(['/pages/channel'], { queryParams: { id: id } });
    }

    goToUser(id:number){
        this.router.navigate(['/pages/profile'], { queryParams: { id: id } });
    }

    applyLightTheme() {
            this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color:  '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color:  '#ebedef',
                    }
                },
            }
        };
    }

    channelRank(){
        this.emptyChannels = false;
        this.channels = [];
        this.http.get<Object>(this.urlChannelRank, {observe: "response"}).subscribe((resp:any)=>{
           resp.body['channels'].forEach((channel:any)=>{
               let channelAux = new ChannelModel();
               channelAux.constructorRankChannel(channel['idChannel'], channel['name'], this.urlPhoto + channel['photo'], this.urlPhoto + channel['banner'], channel['threads']);
               this.channels.push(channelAux);
           });
            if(resp.body['channels'].length === 0){
                this.emptyChannels = true;
            }
        }, ()=>{
            this.emptyChannels = true;
        });
    }

    userRank(){
        this.emptyUsers = false;
        this.users = [];
        this.http.get<Object>(this.urlUserRank, {observe:"response"}).subscribe((resp:any)=>{
           resp.body['users'].forEach((user:any)=>{
               console.log(resp.body)
               let userAux = new UserModel();
               userAux.constructorRankUser(user['idUser'], user['name'], user['nickname'], this.urlPhoto + user['profilePhoto' ], user['karma']);
               this.users.push(userAux);
               this.orderUsersByKarma();
           });
           if(resp.body['users'].length === 0){
               this.emptyUsers = true;
           }
        }, ()=>{
            this.emptyUsers = true;
        });
    }

    orderUsersByKarma() {
        for (let i = 0; i < this.users.length; i++) {
            // Last i elements are already in place
            for (let j = 0; j < (this.users.length - i - 1); j++) {
                // Checking if the item at present iteration
                // is greater than the next iteration
                if (this.users[j]._karma < this.users[j + 1]._karma) {
                    // If the condition is true then swap them
                    let temp = this.users[j];
                    this.users[j] = this.users[j + 1];
                    this.users[j + 1] = temp;
                }
            }


        }
    }
}
