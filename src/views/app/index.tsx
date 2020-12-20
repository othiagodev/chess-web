import { useState } from 'react';
import io from 'socket.io-client';
import './style.css';

export default function App() {
  const [nickname, setNickname] = useState('');
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  function handlePlay() {
    if (nickname.trim() && serverAddress) {
      const socket = io(serverAddress);
      socket.on('connect', () => {
        console.log('connect');
        socket.emit('connected');
        socket.emit('message.name', {nickname});
      })
    } else {
      console.log('server address not find');
    }
  }

  return (
    <div id="app">
      <div className="name">
        <h1>Chess</h1>
      </div>
      <div className="form">
        <div className="input">
          <label htmlFor="nickname">Nickname</label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            placeholder="your nickname"
            onChange={event => setNickname(event.target.value)}
          />
        </div>
        <button type="button" onClick={handlePlay}>PLAY</button>
      </div>
    </div>
  );
}
