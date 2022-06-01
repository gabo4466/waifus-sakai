import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    menuMode = 'static';

    constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        let cacheTheme:string = localStorage.getItem('theme');
        let themeElement = document.getElementById('theme-css');
        themeElement.setAttribute('href', 'assets/theme/' + cacheTheme + '/theme.css');
    }
}
