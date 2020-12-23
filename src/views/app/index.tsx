import { useEffect, useState } from 'react';
import Socket from '../../services/socket';
import Board, { CanvasBoard } from '../../components/Board'
import './style.css';

interface Game {
  waitingOpponent: boolean
  match: Match
}

export interface Color {
  BLACK: string
  WHITE: string
}

export interface Match {
  player1: Player
  player2: Player
  turn: number
  currentPlayer: string
  board: Board
  check: boolean
  checkMate: boolean
  capturedPieces: Array<Piace>
}

export interface Player {
  id: number,
  name: string,
  playerColor: Color
}

export interface Board {
  board: [[Piace]]
}

export interface Piace {
  symbol: string
  color: Color
  moveCount: number
  chessPosition: string
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
      socket.getSocket().on('next.turn', (data: Game) => {
        console.log(data);
        setMatch(data.match);
      })
    }
  }

  function handleChessMove() {
    if (match?.currentPlayer === 'WHITE') {
      socket.getSocket().emit('move.game', { sourcePosition: 'd2', targetPosition: 'd3' });
    } else {
      socket.getSocket().emit('move.game', { sourcePosition: 'e7', targetPosition: 'e6' });
    }
  }

  useEffect(() => {
    Board().render(match);
  }, [match]);

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
              <canvas id="chessBoard">
                <span>Your browser does not support HTML5, check the supported browser versions <a href="https://caniuse.com/?search=html%205">here</a>.</span>
              </canvas>
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
