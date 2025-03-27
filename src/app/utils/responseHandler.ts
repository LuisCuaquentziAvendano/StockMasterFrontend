import { HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { HTTP_STATUS_CODES } from "./httpStatusCodes";
import { AuthenticationService } from "../services/authentication.service";
import { ALERT_ICONS, showMessageAlert } from "./alerts";

export function responseHandler(response: HttpResponse<any>, router: Router, authService: AuthenticationService) {
    if (response.status == HTTP_STATUS_CODES.UNAUTHORIZED) {
        authService.logout();
        authService.setRedirectUrl(router.url);
        router.navigateByUrl('/login');
    } else if (response.status == HTTP_STATUS_CODES.FORBIDDEN) {
        router.navigateByUrl('/forbidden');
    } else if (response.status == HTTP_STATUS_CODES.NOT_FOUND) {
        router.navigateByUrl('/not-found');
    } else if (response.status == HTTP_STATUS_CODES.SERVER_ERROR) {
        router.navigateByUrl('/server-error');
    } else if (response.status == HTTP_STATUS_CODES.BAD_REQUEST) {
        showMessageAlert(
            'Error',
            response.body.error,
            ALERT_ICONS.ERROR
        );
    }
}
