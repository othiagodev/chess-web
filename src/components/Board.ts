import { Match } from '../views/app/index';

export interface CanvasBoard {
  render: Function
}

export default function CanvasBoard(): CanvasBoard {
  return {
    render: (Match: Match) => {
      console.log('render');
      const canvas = document.querySelector("#chessBoard");
      console.log({ canvas });
    }
  }
}