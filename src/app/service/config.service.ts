import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';


@Service()
export class ConfigService {
    private _apiUrl: string | undefined;

    init(): Observable<any> {
        this._apiUrl = environment.apiUrl;
        return of(true);
    }

    get apiUrl(): string {
        return this._apiUrl || '';
    }
}
