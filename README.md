Installation

    npm i ng-window-messenger -S

How to use

    import { WindowMessengerService } from 'ng-window-messenger';
    
    msgService: WindowMessengerService;
    
    constructor () {
        this.msgService = new WindowMessengerService(window);
        this.msgService.sendMessage({ messageType: 'open', content: 'just a test'});
    }

