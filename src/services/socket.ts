import io from 'socket.io-client';

export default class Socket {
  private serverAddress: string;
  private socket?: SocketIOClient.Socket;

  constructor() {
    this.serverAddress = process.env.REACT_APP_SERVER_ADDRESS!
    if (this.serverAddress)
      this.socket = io(this.serverAddress);
    else
      console.log('server address not find');
  }

  getSocket() {
    return this.socket!
  }

}