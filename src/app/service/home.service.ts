import { inject, Service } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from 'rxjs';


// TODO: вообще это сервис просто для теста. выпилить его надо будет потом
@Service()
export class HomeService {
    private readonly httpClient: HttpClient = inject(HttpClient);


    getHomeResponse(): Observable<string> {
        return this.httpClient.get(`/home`).pipe(
            map((res: any) => res as string)
        );
    }

}
