import { useState } from 'react';
import io from 'socket.io-client';

export default function App() {
  const [nickname, setNickname] = useState('');
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  function handlePlay() {
    if (nickname.trim() && serverAddress) {
      const socket = io(serverAddress);
      socket.on('connect', () => console.log('connect'));
    } else {
      console.log('server address not find'); 
    }
  }

  return (
    <div className="App">
      <h1>Chess</h1>
      <input
        type="text"
        value={nickname}
        placeholder="your nickname"
        onChange={event => setNickname(event.target.value)}
      />
      <button type="button" onClick={handlePlay}>PLAY</button>
    </div>
  );
}
