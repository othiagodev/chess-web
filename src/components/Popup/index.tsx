import Socket from '../../services/socket';
import BishopWhite from '../../assets/Pieces/bishop_white.svg';
import BishopBlack from '../../assets/Pieces/bishop_black.svg';
import KnightWhite from '../../assets/Pieces/knight_white.svg';
import KnightBlack from '../../assets/Pieces/knight_black.svg';
import QueenWhite from '../../assets/Pieces/queen_white.svg';
import QueenBlack from '../../assets/Pieces/queen_black.svg';
import RookWhite from '../../assets/Pieces/rook_white.svg';
import RookBlack from '../../assets/Pieces/rook_black.svg';
import './style.css'

interface Props {
  socket: Socket
  playerColor: string
  showPopup: Function
}

export default function Popup({ socket, playerColor, showPopup }: Props) {

  function emitProtion(symbol: string) {
    showPopup(false);
    socket.getSocket().emit('promotion', { symbol: symbol });
  }

  return (
    <div id="popup">
      <div className="cell blackCell">
        <button className="cellButton" onClick={() => emitProtion('Q')} />
        <div className="pieceContainer">
          <img className="pieceImg" src={(() => (playerColor === 'WHITE') ? QueenWhite : QueenBlack)()} alt="piece"/>
        </div>
      </div>
      <div className="cell whiteCell">
        <button className="cellButton" onClick={() => emitProtion('N')} />
        <div className="pieceContainer">
          <img className="pieceImg" src={(() => (playerColor === 'WHITE') ? KnightWhite : KnightBlack)()} alt="piece"/>
        </div>
      </div>
      <div className="cell blackCell">
        <button className="cellButton" onClick={() => emitProtion('R')} />
        <div className="pieceContainer">
          <img className="pieceImg" src={(() => (playerColor === 'WHITE') ? RookWhite : RookBlack)()} alt="piece"/>
        </div>
      </div>
      <div className="cell whiteCell">
        <button className="cellButton" onClick={() => emitProtion('B')} />
        <div className="pieceContainer">
          <img className="pieceImg" src={(() => (playerColor === 'WHITE') ? BishopWhite : BishopBlack)()} alt="piece"/>
        </div>
      </div>
    </div>
  );
}