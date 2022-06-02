import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppMainComponent } from './app.main.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import {RegisterComponent} from "./components/register/register.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {OtpAuthComponent} from "./components/otp-auth/otp-auth.component";
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'auth',
                children: [
                    {path: 'login', component: LoginComponent},
                    { path: 'code', component: OtpAuthComponent },
                    {path: 'register', component: RegisterComponent},
                ],
            },
            {
                path: 'pages', component: AppMainComponent,
                children: [
                    {path: 'profile', component: ProfileComponent},
                    {path: '', component: DashboardComponent},
                    {path:'error', component: ErrorComponent},
                    {path:'notfound', component: NotfoundComponent},
                    {path:'access', component: AccessComponent},
                    {path: '**', redirectTo: 'pages'},
                ],
            },
            {path: '', redirectTo: '/pages', pathMatch: 'full'},
            {path: '**', redirectTo: 'pages/notfound'},
        ], {scrollPositionRestoration: 'enabled', anchorScrolling:'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
