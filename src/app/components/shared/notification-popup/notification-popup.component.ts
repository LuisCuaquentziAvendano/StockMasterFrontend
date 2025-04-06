import { Component } from '@angular/core';
import { SocketIoService } from '../../../services/socket-io.service';
@Component({
  selector: 'app-notification-popup',
  standalone: true,
  imports: [],
  templateUrl: './notification-popup.component.html',
  styleUrl: './notification-popup.component.scss'
})
export class NotificationPopupComponent {
  notifications: string[] = [];

  constructor(private socketService: SocketIoService) {
    this.socketService.notifications.subscribe((notes) => {
      if (notes.length > 0) {
        this.notifications = [notes[0]];
      }
    });
  }

  close(note: string) {
    this.notifications = this.notifications.filter(n => n !== note);
  }
}
