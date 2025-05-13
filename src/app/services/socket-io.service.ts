import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<string[]>([]);
  notifications = this.notificationsSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('authorization')?.replace('Bearer ', '');
    const socketUrl = environment.BASE_URL.replace('/api', '');
    this.socket = io(socketUrl, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id);
      if (token) {
        this.socket.emit('joinRoom', token);
      }
    });

    this.socket.on('roomJoined', (data: any) => {
      console.log(`Successfully joined room: ${data.room}`);
    });

    this.socket.on('largeSaleNotification', (data: { message: string }) => {
      console.log('Notification received:', data.message);
      this.addNotification(data.message);
    });
  }

  private addNotification(message: string) {
    const current = this.notificationsSubject.value;
    const date = new Date();
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    this.notificationsSubject.next([`${message} (${formatted})`, ...current]);
  }

  getSocketId(): string | undefined {
    return this.socket.id;
  }
}
