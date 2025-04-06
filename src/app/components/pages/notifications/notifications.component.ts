import { Component } from '@angular/core';
import { SocketIoService } from '../../../services/socket-io.service';
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})

export class NotificationsComponent {
  notifications: string[] = [];

  constructor (private socketService: SocketIoService) {
    this.socketService.notifications.subscribe((notes) => {
      this.notifications = notes;
    });
  }
}
