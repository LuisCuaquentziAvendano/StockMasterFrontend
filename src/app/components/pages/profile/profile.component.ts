import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../types/user';
import { responseHandler } from '../../../utils/responseHandler';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ALERT_COLORS, ALERT_ICONS, getInputAlert, showMessageAlert } from '../../../utils/alerts';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user = null as unknown as User;
  token = '';

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
  ) {
    this.getData();
  }

  getData() {
    this.userService.getData()
    .subscribe(response => {
      if (response.ok) {
        this.user = response.body!;
        this.token = this.authService.getToken();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  async editName() {
    const [confirmed, name] = await getInputAlert(
      'Edit your name',
      undefined,
    );
    if (!confirmed) {
      return;
    }
    this.userService.updateData(name)
    .subscribe(response => {
      if (response.ok) {
        this.getData();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  async generateNewToken() {
    this.userService.generateNewToken()
    .subscribe(response => {
      if (response.ok) {
        this.router.navigateByUrl('/login');
        this.authService.logout();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  async updatePassword(input1: HTMLInputElement, input2: HTMLInputElement) {
    const password = input1.value;
    const confirmPassword = input2.value;
    if (!password
      || password.length < 8
      || password.length > 100
      || password != confirmPassword) {
      await showMessageAlert(
        'Invalid password',
        undefined,
        ALERT_ICONS.ERROR,
      );
      return;
    }
    this.userService.updatePassword(password)
    .subscribe(response => {
      if (response.ok) {
        this.router.navigateByUrl('/login');
        this.authService.logout();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  async deleteAccount() {
    const [confirmed, text] = await getInputAlert(
      'Delete account?',
      'If you delete your account, all your data and inventories will be deleted permanently and you won\'t be able to recover them. Type \'delete account\' to delete all permanently.',
      ALERT_ICONS.WARNING,
      ALERT_COLORS.DANGER_DARK,
      'Delete all',
    );
    if (!confirmed || text != 'delete account') {
      return;
    }
    this.userService.deleteUser()
    .subscribe(response => {
      if (response.ok) {
        this.router.navigateByUrl('/login');
        this.authService.logout();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  copyToClipboard() {
    const token = this.authService.getToken();
    navigator.clipboard.writeText(token)
    .then(() => {
      showMessageAlert(
        'API token copied to clipboard',
        undefined,
        ALERT_ICONS.SUCCESS,
      );
    })
    .catch(() => {});
  }
}
