import { useState } from 'react';
import Socket from '../services/socket';
import { Match } from '../views/app';
import PawnWhite from '../assets/Pieces/ic_pawn_white.png';
import PawnBlack from '../assets/Pieces/ic_pawn_black.png';

interface Props {
  socket: Socket
  match: Match
}

enum Color {
  White = 'WHITE',
  Black = 'BLACK'
}

export default function ChessBoard({ socket, match }: Props) {

  const [playerColor] = useState(whatMyColor(match));
  const [sourcePosition, setSourcePosition] = useState('');

  function whatMyColor(match: Match) {
    if (match.player1.id === socket.getSocket().id)
      return match.player1.playerColor;
    else
      return match.player2.playerColor;
  }

  function positionToChessPosition(i: number, j: number) {
    const listLetterChessPosition = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const listNumberChessPosition = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const position = {
      i: '', j: ''
    }

    listLetterChessPosition.forEach((value, index) => {
      if (i === index) {
        position.i = value;
      }
    })

    listNumberChessPosition.forEach((value, index) => {
      if (j === index) {
        position.j = value;
      }
    })

    return `${position.i}${position.j}`;
  }

  function onSelectedPiece(i: number, j: number) {
    const chessPosition = positionToChessPosition(i, j);

    if (!sourcePosition) {
      if (match.chessBoard.board[i][j] && match.chessBoard.board[i][j].color === playerColor)
        setSourcePosition(chessPosition);
    } else if (sourcePosition && sourcePosition === chessPosition) {
      setSourcePosition('');
    } else {
      socket.getSocket().emit('move.game', { sourcePosition: sourcePosition, targetPosition: chessPosition });
      setSourcePosition('');
    }
  }

  return (
    <div id="chessBoard" className={playerColor}>
      {(() => {
        const board = match.chessBoard.board;
        if (board) {
          const cells: JSX.Element[] = [];
          board.forEach((line, i) => {
            line.forEach((cell, j) => {
              const cellColor = (i % 2) ?
                (() => (j % 2) ? 'whiteCell' : 'blackCell')() :
                (() => (j % 2) ? 'blackCell' : 'whiteCell')();
              cells.push((
                <div className={`cell ${cellColor}`} key={`${i}${j}`}>
                  <button className="cellButton" onClick={() => onSelectedPiece(i, j)} />
                  <div>
                    {(() => {
                      if (cell) {
                        const piece = (cell.color === Color.White) ? PawnWhite : PawnBlack;
                        return (
                          <div>
                            <img className="pieceImg" src={piece} alt="piece" />
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              ));
            });
          });
          return cells;
        }
      })()}
    </div>
  );
}