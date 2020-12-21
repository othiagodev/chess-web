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

interface Board {
  board: [[Piace]]
}

interface Piace {
}

export default function App() {
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
  const [name, setName] = useState('');
  const [waitingOpponent, setWaitingOpponent] = useState<boolean | null>(null)
  const [match, setMatch] = useState<Match | null>(null)

  function handlePlay() {
    if (name.trim() && serverAddress) {
      const socket = io(serverAddress);
      socket.on('connect', () => {
        console.log('connect');
        socket.emit('begin.game', { name });
      })
      socket.on('begin.game', (data: Game) => {
        console.log(data);
        setWaitingOpponent(data.waitingOpponent);
        setMatch(data.match);
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
      {(() => {
        if (waitingOpponent) {
          return (
            <div className="waitingOpponent">
              <h1>Waiting Opponent</h1>
            </div>
          )
        } else if (waitingOpponent !== null && !waitingOpponent) {
          return (
            <div className="board">
              <h1>Game</h1>
            </div>
          )
        } else {
          return (
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
          )
        }
      })()}
    </div>
  );
}
