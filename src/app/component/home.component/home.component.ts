import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { UserService } from '../../service/user.service';
import { UserPrincipal } from '../../domain/user.principal';


@Component({
    selector: 'app-home.component',
    standalone: false,
    styleUrl: './home.component.scss',
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit {
    userPrincipal: UserPrincipal = null;

    constructor(private homeService: HomeService, private userService: UserService, private cdRef: ChangeDetectorRef) {
    }


    async ngAfterViewInit(): Promise<void> {
        this.userPrincipal = await this.userService.currentUser();
        this.cdRef.markForCheck();
    }


    async login(): Promise<void> {
        return this.userService.login();
    }


    async logout(): Promise<void> {
        return this.userService.logout();
    }


    test(): void {
        this.homeService.getHomeResponse().subscribe((response: string) => {
            console.log(response);
        });
    }
}
