import React, { useState } from 'react';
import Socket from '../../services/socket';
import ChessBoard from '../../components/ChessBoard';
import './style.css';

enum color {
  White = 'WHITE',
  Black = 'BLACK'
}

interface Game {
  waitingOpponent: boolean
  match: Match
}

export interface Color {
  BLACK: color.Black
  WHITE: color.White
}

export interface Match {
  player1: Player
  player2: Player
  turn: number
  currentPlayer: string
  chessBoard: Board
  check: boolean
  checkMate: boolean
  capturedPieces: Array<Piace>
}

export interface Player {
  id: string,
  name: string,
  playerColor: string
}

export interface Board {
  board: [[Piace]]
}

export interface Piace {
  symbol: string
  color: string
  moveCount: number
  chessPosition: string
}

const socket: Socket = new Socket();

export default function App() {
  const [name, setName] = useState('');
  const [waitingOpponent, setWaitingOpponent] = useState<boolean | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [opponent, setOpponent] = useState<Player>()

  function handlePlay() {
    if (name) {
      socket.getSocket().emit('begin.game', { name });

      socket.getSocket().on('begin.game', (data: Game) => {
        console.log(data);
        setWaitingOpponent(data.waitingOpponent);
        setMatch(data.match);
        if (data.match) {
          setOpponent((data.match.player2.id === socket.getSocket().id) ? data.match.player1 : data.match.player2)
        }
      })

      socket.getSocket().on('invalid.move', () => console.log('invalid.move'))

      socket.getSocket().on('next.turn', (data: Game) => {
        console.log(data);
        setMatch(data.match);
      })

      socket.getSocket().on('opponent.disconnect', () => {
        console.log('opponent.disconnect');
        setWaitingOpponent(null);
        setMatch(null);
        alert('Opponent disconnected');
      });

    }
  }

  return (
    <div id="app">
      {(() => {
        if (waitingOpponent) {
          return (
            <div className="waitingOpponent">
              <h1>Waiting Opponent</h1>
            </div>
          );
        } else if (waitingOpponent !== null && !waitingOpponent && match) {
          return (
            <div className="boarderContainer">
              <div className="playerInfo">
                <div className={`circler ${(opponent?.playerColor === match.currentPlayer) ? 'currentPlayer' : ''}`} />
                <span className={'player'}>{opponent?.name}</span>
              </div>
              <div className="board">
                <ChessBoard socket={socket} match={match} />
              </div>
              <div className="playerInfo">
                <div className={`circler ${(opponent?.playerColor !== match.currentPlayer) ? 'currentPlayer' : ''}`} />
                <span className="player">you</span>
              </div>
            </div>
          );
        } else {
          return (
            <React.Fragment>
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
            </React.Fragment>
          );
        }
      })()}
    </div>
  );
}
