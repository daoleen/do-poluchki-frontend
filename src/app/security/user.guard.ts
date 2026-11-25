import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot, } from '@angular/router';
import { Injectable } from '@angular/core';
import { Role } from "../enums/role";
import { UserService } from "../service/user.service";


@Injectable({
    providedIn: 'root',
})
export class UserGuard implements CanActivate {

    constructor(private userService: UserService) {
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if (!this.userService.hasRole(Role.ROLE_USER)) {
            this.userService.login().then();
            return false;
        }

        return true;
    }
}
