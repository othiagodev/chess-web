import { useState } from 'react';
import Socket from '../../services/socket';
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

const socket: Socket = new Socket();

export default function App() {
  const [name, setName] = useState('');
  const [waitingOpponent, setWaitingOpponent] = useState<boolean | null>(null);
  const [match, setMatch] = useState<Match | null>(null);

  
  function handlePlay() {
    if (name) {
      socket.getSocket().emit('begin.game', { name });
      
      socket.getSocket().on('begin.game', (data: Game) => {
        console.log(data);
        setWaitingOpponent(data.waitingOpponent);
        setMatch(data.match);
      })
      socket.getSocket().on('invalid.move', () => console.log('invalid.move'))
      socket.getSocket().on('next.turn', (data: Game) => console.log(data))
      
    }
  }

  function handleChessMove() {
    socket.getSocket().emit('move.game', {sourcePosition: 'b5', targetPosition: 'b6'})
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
              <button onClick={handleChessMove}>Move</button>
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
