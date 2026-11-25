import { inject, Service } from '@angular/core';
import Keycloak from "keycloak-js";
import { Role } from "../enums/role";
import { UserPrincipal } from "../domain/user.principal";


@Service()
export class UserService {
    private readonly keycloak: Keycloak = inject(Keycloak);


    login(): Promise<void> {
        return this.keycloak.login();
    }


    logout(): Promise<void> {
        return this.keycloak.logout();
    }


    hasRole(role: Role): boolean {
        if (!this.keycloak.authenticated) {
            return false;
        }

        switch (role) {
            case Role.ROLE_ADMIN:
                return this.keycloak.hasRealmRole('ROLE_ADMIN');

            case Role.ROLE_USER:
                return this.keycloak.hasRealmRole('ROLE_ADMIN')
                    || this.keycloak.hasRealmRole('ROLE_USER');
        }

        console.warn('Unknown user role ', role);
        return false;
    }


    async currentUser(): Promise<UserPrincipal | null> {
        if (!this.isAuthenticated) {
            return null;
        }

        // на случай, если после refresh токен ещё не подгружен
        await this.keycloak.updateToken(70).catch(() => {});

        const p = this.keycloak.tokenParsed as Record<string, any> | undefined;

        if (!p) {
            return null;
        }

        const sub: string = p['sub'];
        const name: string = p['given_name'];
        const avatar: string|null = this.getAvatarUrl(p['avatar_id'], p['avatar_empty'], p['identity_provider']);
        const email: string = p['email'];
        const username: string = p['preferred_username'];
        const kcRoles: Array<string> = p['realm_access']['roles'] || [];
        const roles: Array<Role> = kcRoles.filter((strRole: string) => strRole?.startsWith('ROLE_'))
            .map((strRole: string) => Role[strRole as keyof typeof Role]);

        return new UserPrincipal(sub, name, email, username, avatar, roles);
    }


    private getAvatarUrl(id?: string, empty?: boolean, identityProvider?: string): string | null {
        if (empty || !id) {
            return '/assets/avatar_newbie.png';
        }

        if ('yandex' === identityProvider) {
            return `https://avatars.yandex.net/get-yapic/${id}/islands-200`;
        }

        console.error('Unknown identity provider for avatar: ' + identityProvider);
        return id;
    }


    get isAuthenticated(): boolean {
        return this.keycloak.authenticated;
    }

}
