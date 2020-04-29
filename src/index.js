import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// =========================================================================
// Компонент КВАДРАТ *******************************************************
function Square(props) {
      return (
        <button 
            className="square" 
            onClick={props.onClick}
        >
          {props.value}
        </button>
      );
}
// ==========================================================================
// Компонент ДОСКА **********************************************************
class Board extends React.Component {
  renderSquare(i) {
    return <Square 
              value={this.props.squares[i]} 
              onClick={() => this.props.onClick(i)}
            />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
// ==================================================================================
// Компонент ИГРА *******************************************************************
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastElementRow: null,
        lastElementCol: null,
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let lastElemRow = 1;
    let lastElemCol = 1;
    switch (i) {
      case 0: lastElemRow = 1;
              lastElemCol = 1;
              break;
      case 1: lastElemRow = 1;
              lastElemCol = 2;
              break;
      case 2: lastElemRow = 1;
              lastElemCol = 3;
              break;
      case 3: lastElemRow = 2;
              lastElemCol = 1;
              break;
      case 4: lastElemRow = 2;
              lastElemCol = 2;
              break;
      case 5: lastElemRow = 2;
              lastElemCol = 3;
              break;
      case 6: lastElemRow = 3;
              lastElemCol = 1;
              break;
      case 7: lastElemRow = 3;
              lastElemCol = 2;
              break;
      case 8: lastElemRow = 3;
              lastElemCol = 3;
              break;
      default: break;
    }
    
    this.setState({
        history: history.concat([{
          squares: squares,
          lastElementRow: lastElemRow,
          lastElementCol: lastElemCol,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const row = step.lastElementRow;
      const col = step.lastElementCol;
      let classColor = move===this.state.stepNumber? 'backGreen' : 'backWhite';
      return (
        <li key={move}>
          {move ? <button className={classColor} 
                          onClick={() => this.jumpTo(move)}>{desc} ({row}:{col})
                  </button> 
                : <button className={classColor} 
                          onClick={() => this.jumpTo(move)}>{desc}</button> 
          }
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Победитель: ' + winner;
    } else {
      status = 'Следующий игрок: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// =================================================================================
// Рендерит компонент ИГРА в блок div в index.html *********************************
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// Функция, определяющая победителя 'Х' или 'О' ************************************
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
  
  