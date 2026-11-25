import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./component/home.component/home.component";
import { SecuredHomeTestComponent } from "./component/secured-home-test.component/secured-home-test.component";
import { UserGuard } from "./security/user.guard";


const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'test-secured',
        component: SecuredHomeTestComponent,
        canActivate: [UserGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
