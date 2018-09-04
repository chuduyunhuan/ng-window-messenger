import { Injectable, EventEmitter } from '@angular/core';
import { filter } from 'rxjs/operators';

const MESSENGER_MSG_TYPE = 'WindowMessengerMessage';

@Injectable()
export class WindowMessengerService {
  constructor (private readonly winInstance: Window) {
    winInstance.addEventListener('message', (event: MessageEvent) => {
      if (event.data && event.data['type'] === MESSENGER_MSG_TYPE) {
        const message = event.data as Message;
        this.messageReceive.next(message);
      }
    }, false);
  }

  private messageSend = new EventEmitter<Message>();
  messageSend$ = this.messageSend.asObservable();

  private messageReceive = new EventEmitter<Message>();
  messageReceive$ = this.messageReceive.asObservable();

  sendMessage (message: Message, id: string | null = null) {

    const internalMessage = {
        type: MESSENGER_MSG_TYPE,
        ...message,
        id: id || generateUuid(),
    };

    this.messageSend.next(internalMessage);

    this.winInstance.postMessage(internalMessage, window.location.href);

    return id ? this.messageReceive$.pipe(filter(obj => obj.id === id)) : null;
  }
}


export interface Message {
  messageType: string;
  content: any;
  id?: string;
}

export function generateUuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === 'x' ? random : (random % 4 + 8);
      return value.toString(16);
  });
}