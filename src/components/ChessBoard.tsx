import React, { useState } from 'react';
import Socket from '../services/socket';
import { Match } from '../views/app';
import BishopWhite from '../assets/Pieces/bishop_white.svg';
import BishopBlack from '../assets/Pieces/bishop_black.svg';
import KingWhite from '../assets/Pieces/king_white.svg';
import KingBlack from '../assets/Pieces/king_black.svg';
import KnightWhite from '../assets/Pieces/knight_white.svg';
import KnightBlack from '../assets/Pieces/knight_black.svg';
import PawnWhite from '../assets/Pieces/pawn_white.svg';
import PawnBlack from '../assets/Pieces/pawn_black.svg';
import QueenWhite from '../assets/Pieces/queen_white.svg';
import QueenBlack from '../assets/Pieces/queen_black.svg';
import RookWhite from '../assets/Pieces/rook_white.svg';
import RookBlack from '../assets/Pieces/rook_black.svg';
import './ChessBoardStyle.css';

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
  const [cellSelected, setCellSelected] = useState<HTMLButtonElement | any>()
  const listLetterChessPosition = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const listNumberChessPosition = ['1', '2', '3', '4', '5', '6', '7', '8'];

  function whatMyColor(match: Match) {
    if (match.player1.id === socket.getSocket().id)
      return match.player1.playerColor;
    else
      return match.player2.playerColor;
  }

  function positionToChessPosition(i: number, j: number) {
    const position = {
      i: '', j: ''
    }

    listLetterChessPosition.forEach((value, index) => {
      if (i === index) {
        position.i = value;
      }
    });

    listNumberChessPosition.forEach((value, index) => {
      if (j === index) {
        position.j = value;
      }
    });

    return `${position.i}${position.j}`;
  }

  function selectePiece(symbol: string) {
    let options = { white: '', black: '' }
    switch (symbol) {
      case 'K':
        options = { white: KingWhite, black: KingBlack }
        break;
      case 'Q':
        options = { white: QueenWhite, black: QueenBlack }
        break;
      case 'R':
        options = { white: RookWhite, black: RookBlack }
        break;
      case 'B':
        options = { white: BishopWhite, black: BishopBlack }
        break;
      case 'N':
        options = { white: KnightWhite, black: KnightBlack }
        break;
      case 'P':
        options = { white: PawnWhite, black: PawnBlack }
        break;
    }
    return options;
  }

  function onSelectedPiece(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, i: number, j: number) {
    const chessPosition = positionToChessPosition(i, j);

    const cell: HTMLButtonElement | any = event.target
    setCellSelected(cell);

    if (!sourcePosition) {
      if (match.chessBoard.board[i][j] && match.chessBoard.board[i][j].color === playerColor) {
        cell.parentElement.lastChild.firstChild.style.backgroundColor = '#FFAA44';
        setSourcePosition(chessPosition);
      }
    } else if (sourcePosition && sourcePosition === chessPosition) {
      cell.parentElement.lastChild.firstChild.style.backgroundColor = '';
      setSourcePosition('');
    } else {
      if (cellSelected.nextSibling)
        cellSelected.parentElement.lastChild.firstChild.style.backgroundColor = '';
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
                (() => (j % 2) ? 'blackCell' : 'whiteCell')() :
                (() => (j % 2) ? 'whiteCell' : 'blackCell')();
              cells.push((
                <div className={`cell ${cellColor}`} key={`${i}${j}`}>
                  <button className="cellButton" onClick={(event) => onSelectedPiece(event, i, j)} />
                  {(() => {
                    const borderCoordinateColor = (i % 2) ?
                    (() => (j % 2) ? 'bcWhite' : 'bcBlack')() :
                    (() => (j % 2) ? 'bcBlack' : 'bcWhite')();
                    if (playerColor === Color.White) {
                      if (i === 0 && j === 0) {
                        return (
                          <React.Fragment>
                            <div className={`borderCoordinate number ${borderCoordinateColor}`}>
                              <div>{listNumberChessPosition[j]}</div>
                            </div>
                            <div className={`borderCoordinate letter ${borderCoordinateColor}`}>
                              <div>{listLetterChessPosition[i]}</div>
                            </div>
                          </React.Fragment>
                        );
                      }
                      if (i === 0) {
                        return (
                          <div className={`borderCoordinate number ${borderCoordinateColor}`}>
                            <div>{listNumberChessPosition[j]}</div>
                          </div>
                        );
                      }
                      if (j === 0) {
                        return (
                          <div className={`borderCoordinate letter ${borderCoordinateColor}`}>
                            <div>{listLetterChessPosition[i]}</div>
                          </div>
                        );
                      }
                    } else {
                      if (i === 7 && j === 7) {
                        return (
                          <React.Fragment>
                            <div className={`borderCoordinate number ${borderCoordinateColor}`}>
                              <div>{listNumberChessPosition[j]}</div>
                            </div>
                            <div className={`borderCoordinate letter ${borderCoordinateColor}`}>
                              <div>{listLetterChessPosition[i]}</div>
                            </div>
                          </React.Fragment>
                        );
                      }
                      if (i === 7) {
                        return (
                          <div className={`borderCoordinate number ${borderCoordinateColor}`}>
                            <div>{listNumberChessPosition[j]}</div>
                          </div>
                        );
                      }
                      if (j === 7) {
                        return (
                          <div className={`borderCoordinate letter ${borderCoordinateColor}`}>
                            <div>{listLetterChessPosition[i]}</div>
                          </div>
                        );
                      }
                    }
                  })()}
                  <React.Fragment>
                    {(() => {
                      if (cell) {
                        const pieces = selectePiece(cell.symbol)
                        const piece = (cell.color === Color.White) ? pieces.white : pieces.black;
                        return (
                          <div className="pieceContainer">
                            <img className="pieceImg" src={piece} alt="piece" />
                          </div>
                        );
                      }
                    })()}
                  </React.Fragment>
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