import { useState } from 'react';
import io from 'socket.io-client';
import './style.css';

interface Game {
  waitingOpponent: boolean
  match: Match | null
}

interface Match {
  player1: player
  player2: player
  turn: number
  currentPlayer: null
  board: Board
  check: boolean
  checkMate: boolean
  capturedPieces: Array<Piace>
}

interface player {
  id: number,
  name: string,
  playerColor: null
}

interface Piace {
}

interface Board {
}

export default function App() {
  const [name, setName] = useState('');
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  function handlePlay() {
    if (name.trim() && serverAddress) {
      const socket = io(serverAddress);
      socket.on('connect', () => {
        console.log('connect');
        socket.emit('begin.game', { name });
      })
      socket.on('begin.game', (data: Game) => {
        console.log(data);
    
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
            value={name}
            placeholder="your nickname"
            onChange={event => setName(event.target.value)}
          />
        </div>
        <button type="button" onClick={handlePlay}>PLAY</button>
      </div>
    </div>
  );
}
