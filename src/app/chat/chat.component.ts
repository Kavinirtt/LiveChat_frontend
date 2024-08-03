import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';

interface ChatMessage {
  sender: string;
  text?: string;
  image?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private socket: any;
  public message: string = '';
  public messages: ChatMessage[] = [];
  public selectedImage: File | null = null;
  @Input() username: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
    });

    this.socket = io('http://localhost:3000');

    this.socket.on('initialMessages', (data: ChatMessage[]) => {
      this.messages = data;
    });

    this.socket.on('message', (data: ChatMessage) => {
      this.messages.push(data);
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedImage = input.files[0];
    }
  }

  sendMessage() {
    const chatMessage: ChatMessage = { sender: this.username, text: this.message };

    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        chatMessage.image = imageDataUrl;
        this.socket.emit('message', chatMessage);
        this.clearInput();
      };
      reader.readAsDataURL(this.selectedImage);
    } else {
      this.socket.emit('message', chatMessage);
      this.clearInput();
    }
  }

  clearInput() {
    this.selectedImage = null;
    this.message = '';
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Disconnected from server');
    }
  }
}
