import { Role } from "../enums/role";
import { email } from "@angular/forms/signals";


export class UserPrincipal {
    sub: string;
    name: string;
    email: string;
    username: string;
    avatar: string|null;
    roles: Array<Role>;


    constructor(sub: string, name: string, email: string, username: string, avatar: string|null, roles: Array<Role>) {
        this.sub = sub;
        this.name = name;
        this.email = email;
        this.username = username;
        this.avatar = avatar;
        this.roles = roles;
    }
}
