import { useState } from 'react';
import Socket from "../services/socket";
import { Match } from "../views/app";

interface Props {
  socket: Socket
  match: Match | null
}

export default function ChessBoard({ socket, match }: Props) {

  const [sourcePosition, setSourcePosition] = useState('');

  function positionToChessPosition(i: number, j: number) {

    //const listLetterChessPosition = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
    //const listNumberChessPosition = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const listLetterChessPosition = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const listNumberChessPosition = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const position = {
      i: '', j: ''
    }

    listLetterChessPosition.forEach((value, index) => {
      if (i === index) {
        position.i = value
      }
    })

    listNumberChessPosition.forEach((value, index) => {
      if (j === index) {
        position.j = value
      }
    })

    return `${position.i}${position.j}`;

  }

  function onSelectedPiece(i: number, j: number) {

    const chessPosition = positionToChessPosition(i, j);
    console.log(chessPosition);
    

    if (!sourcePosition) {
      setSourcePosition(chessPosition);
    } else if (sourcePosition && sourcePosition === chessPosition) {
      setSourcePosition('');
    } else {
      //socket.getSocket().emit('move.game', { sourcePosition: sourcePosition, targetPosition: chessPosition });
      //console.log(sourcePosition, chessPosition)
      setSourcePosition('');
    }
  }

  return (
    <div id="chessBoard">
      {
        (() => {
          const board = match?.chessBoard.board;
          if (board) {
            let value: JSX.Element[] = [];
            board.forEach((line, i) => {
              line.forEach((cell, j) => {
                const cellColor = (i % 2) ? (() => (j % 2) ? 'whiteCell' : 'blackCell')() : (() => (j % 2) ? 'blackCell' : 'whiteCell')()
                value.push((
                  <div className={`cell ${cellColor}`} key={`${i}${j}`}>
                    <button className="cellButton" onClick={() => onSelectedPiece(j, i)} />
                  </div>
                ))
              })
            })
            return value
          }
          return (
            <div>board is undefined</div>
          )

        })()
      }
    </div>
  );
}