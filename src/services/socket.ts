import io from 'socket.io-client';

export default class Socket {
  private serverAddress!: string;
  private socket: SocketIOClient.Socket;

  constructor() {
    if (process.env.REACT_APP_SERVER_ADDRESS)
    this.serverAddress = process.env.REACT_APP_SERVER_ADDRESS
    else console.log('server address not find');
    this.socket = io(this.serverAddress)
  }

  getSocket() {
    return this.socket
  }

}