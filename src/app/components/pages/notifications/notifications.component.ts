import { Component } from '@angular/core';
import { SocketIoService } from '../../../services/socket-io.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})

export class NotificationsComponent {
  notifications: string[] = [];
  now: Date = new Date();

  constructor (private socketService: SocketIoService) {
    this.socketService.notifications.subscribe((notes) => {
      this.notifications = notes;
    });
  }
}



