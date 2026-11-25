import { inject, Service } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStatus } from '../domain/error.status';


@Service()
export class ErrorProcessorService {
    private readonly snackbar: MatSnackBar = inject(MatSnackBar);
    private readonly userService: UserService = inject(UserService);

  processError(error: HttpErrorResponse, callback: any = null): void {
    console.error(error);
    const errorStatus = ErrorStatus.fromHttpErrorResponse(error);
    const snackbarRef = this.displayErrorMessage(this.getErrorMessage(errorStatus));

    if (callback) {
      snackbarRef.onAction().subscribe(() => {
        if (errorStatus.statusCode === 401) {
          this.handleUnauthorizedError();
        }

        callback();
      });
    }
  }


  displayErrorMessage(errorMessage: string) {
    return this.snackbar.open(errorMessage, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'snackbar-panel-error'
    });
  }


  displayInfoMessage(infoMessage: string, duration: number|undefined) {
    return this.snackbar.open(infoMessage, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'snackbar-panel-error',
      duration: duration
    });
  }


  getErrorMessage(errorStatus: ErrorStatus): string {
    if (errorStatus.statusCode === 400) {
      return 'Неверно заполнены поля формы.';
    }

    if (errorStatus.statusCode === 403) {
      return 'У вас недостаточно прав для выполнения операции';
    }

    switch (errorStatus.code) {
      case 'error.unavaliable':
        return 'Сервис недоступен. Попробуйте повторить запрос позже';

      case 'error.unknown':
        return 'Внутренняя ошибка сервера';

      case 'error.server':
        return errorStatus.description;

      case 'error.notfound':
        return 'Запрошенная Вами информация не найдена.';

      case 'error.user.notfound':
        return 'Incorrect username or password';
    }

    return 'Возникла ошибка';
  }


  handleUnauthorizedError(): void {
    this.userService.logout();
  }


  static isNotFoundError(error: any): boolean {
    return ((error instanceof HttpErrorResponse) && error.status == 404);
  }


  isForbiddenError(error: any): boolean {
    return ((error instanceof HttpErrorResponse) && error.status == 403);
  }


  static isRequestTimeoutError(error: any): boolean {
    return ((error instanceof HttpErrorResponse) && error.status == 408);
  }

  static isGatewayTimeoutError(error: any): boolean {
    return ((error instanceof HttpErrorResponse) && error.status == 504);
  }

  /**
   * @AliasFor isGatewayTimeoutError
   * Обрабатывает серверное исключение AsyncRequestTimeoutException
   */
  static isAsyncRequestTimeoutError(error: any): boolean {
    return this.isGatewayTimeoutError(error);
  }
}
