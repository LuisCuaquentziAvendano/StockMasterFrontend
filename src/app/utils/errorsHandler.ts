import { HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { HTTP_STATUS_CODES } from "./httpStatusCodes";
import { inject } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";

export function errorsHandler(response: HttpResponse<any>, router: Router) {
    const authService = inject(AuthenticationService);
    if (response.status == HTTP_STATUS_CODES.UNAUTHORIZED) {
        authService.logout();
        router.navigateByUrl('/login');
        return;
    }
    if (response.status == HTTP_STATUS_CODES.FORBIDDEN) {
        router.navigateByUrl('/forbidden');
        return;
    }
    if (response.status == HTTP_STATUS_CODES.NOT_FOUND) {
        router.navigateByUrl('not-found');
        return;
    }
    if (response.status == HTTP_STATUS_CODES.SERVER_ERROR) {
        router.navigateByUrl('/server-error');
        return;
    }
    alert(response.body.error);
}
