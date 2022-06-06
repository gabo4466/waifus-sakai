import { Component, OnInit } from '@angular/core';
import {Constants} from "../../common/constants";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
    selector: 'app-create-channel-step2',
    templateUrl: './create-channel-step2.component.html',
    styleUrls: ['./create-channel-step2.component.scss'],
    providers: [MessageService]
})
export class CreateChannelStep2Component implements OnInit {

    mainPhotoChannel: string = Constants.apiURL;
    bannerChannel: string = Constants.apiURL;
    private channel:string;
    header: HttpHeaders;
    banner:boolean;
    photo:boolean;

    constructor( private messageService: MessageService,
                 private route: ActivatedRoute,
                 private router: Router) {
        this.mainPhotoChannel += "mainPhotoChannel";
        this.bannerChannel += "bannerChannel";
        this.route.queryParams.subscribe(params => this.channel = params.id);
        this.header = new HttpHeaders();
        this.header = this.header.append('idChannel', this.channel);
        this.banner = false;
        this.photo = false;
    }

    onBasicUpload(event, box) {
        if (box ===1){
            this.photo = true;
        }else if(box === 2){
            this.banner = true;
        }
        this.messageService.add({severity: 'success', summary: 'Imagen actualizada', detail: ''});
    }

    ngOnInit(): void {
    }

    showPreview(event, id, idBox){
        document.getElementById(idBox).style.display = 'block';
        let img = document.getElementById(id).querySelector("img");
        let file = event.currentFiles[0];
        img['src'] = URL.createObjectURL(file);
    }

    removePreview(id, idBox){
        document.getElementById(idBox).style.display = 'none';
        document.getElementById(id).querySelector("img")['src'] = "#";
    }

    finish(){
        if (this.photo && this.banner){
            Swal.fire({
                title:`¡Has terminado el proceso!`,
                html: ``,
                icon: "success",
                confirmButtonText: 'Continuar'
            }).then(()=>{
                this.navigateToDashboard();
            });
        }else {
            Swal.fire({
                title: '¡Aún no ha terminado de subir todas las imágenes!',
                text: "¿Desea salir de todas maneras? Las imágenes podrán ser modificadas luego.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'No',
                cancelButtonText: 'Sí',
                reverseButtons: true
            }).then((result:any)=>{
                if (result.isConfirmed){
                    Swal.close();
                }else{
                    this.navigateToDashboard();
                }
            })
        }

    }

    navigateToDashboard(){
        this.router.navigate(['/']);
    }

}
