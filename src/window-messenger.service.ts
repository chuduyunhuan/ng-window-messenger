import { Injectable, EventEmitter } from '@angular/core';
import { filter } from 'rxjs/operators';

const uuidv1 = require('uuid/v1');

const MESSENGER_MSG_TYPE = 'WindowMessengerMessage';

@Injectable()
export class WindowMessengerService {
  constructor (private readonly winInstance: Window) {
    winInstance.addEventListener('message', this.receiveMessage);
  }

  private messageSend = new EventEmitter<Message>();
  messageSend$ = this.messageSend.asObservable();

  private messageReceive = new EventEmitter<Message>();
  messageReceive$ = this.messageReceive.asObservable();


  private receiveMessage (event: MessageEvent) {
      if (event.data && event.data['type'] === MESSENGER_MSG_TYPE) {
        const message = event.data as Message;
        this.messageReceive.next(message);
      }
  }

  sendMessage (message: Message, id: string | null = null) {

    const internalMessage = {
        type: MESSENGER_MSG_TYPE,
        ...message,
        id: id || uuidv1(),
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
