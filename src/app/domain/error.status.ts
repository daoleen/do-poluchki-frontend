import { HttpErrorResponse } from '@angular/common/http';


export class ErrorStatus {
    statusCode: number;
    code: string;
    description: string;


    constructor(statusCode: number, code: string, description: string) {
        this.statusCode = statusCode;
        this.code = code;
        this.description = description;
    }


    static fromHttpErrorResponse(error: HttpErrorResponse): ErrorStatus {
        if (!error || error.status === 504) {
            return new ErrorStatus(503, 'error.unavaliable', 'Service is unavaliable');
        }

        return new ErrorStatus(error.status, error.error.code, error.error.description);
    }


    isExpiredToken(): boolean {
        return 401 === this.statusCode && 'error.token.expired' === this.code;
    }


    isExpiredAccount(): boolean {
        return 401 === this.statusCode && 'error.account.expired' === this.code;
    }

    isUniqueViolation(): boolean {
        return 422 === this.statusCode && 'error.unique' === this.code;
    }
}
