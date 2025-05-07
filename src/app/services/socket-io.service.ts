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
    this.notificationsSubject.next([message, ...current]);
  }

  getSocketId(): string | undefined {
    return this.socket.id;
  }
}
