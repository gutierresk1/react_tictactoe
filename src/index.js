import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/**
 * What is React?
 * Declaritive: Results without explicit commands/steps, flexible and efficient. 
 * Composing complex UIs from smaller pieces of code called Components. 
 * 
 * The Square class is a subclass of a React component. 
 */

//The original class is the bottom, we are now looking at the function 
//component version of it. 

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}


/**
 * Inside of this index.js file we have 3 components: 
 * Square, Board, and Game. 
 */

class Board extends React.Component {
    renderSquare(i) {
        return (
            //Originally we had value set to this.state.squares[i];
            //because squares array is now inside of another array(history), 
            //we shall call the properties because it is now external..
            //squares used to belong internally inside of the Board component, 
            //but moved to the Game component class. 
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        //we originally determined status of winner in this Component's
        //render function
        return (
            <div>
                {/*<div className="status">{status}</div>*/}
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

class Game extends React.Component {
    //props are properties/parameters as mentioned before. 
    //Because we are lifting state, we need to set a constructor to the Game class.
    //Originally we lifted State in Board, but we need full control over the Board Component, 
    //and tells Board to render previous turns from the history array.
    constructor(props) {
        super(props);
        this.state = {
            //We will implement time travel, as the squares array are immutable 
            history: [{
                //squares will be an array of 9 nulls at first. 
                //then each marked with a value for every onclick
                squares: Array(9).fill(null),
            }],
            //initiliaze step to 0
            stepNumber: 0,
            //set x as the default move (boolean)
            xIsNext: true,
        };
    }

    //handleClick() is called in the renderSquare method, created here. 
    //parameter is the current square. 
    handleClick(i) {

        //we have two new variables, history and current..
        //const history = this.state.history;
        //because we now give the option of traveling back
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        //current grabs the last index of the history array
        const current = history[history.length - 1];
        //we store the copy of state's array into our local array. 
        //The purpose of this is due to immutability: Unchangeable. 
        //With immutability, we can go back to previous versions of the game.
        //reusability.
        const squares = current.squares.slice(); //const squares = this.state.squares.slice(); was the old way
        //check if there is a value in a square or if the game is already won.
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        //We write a ternary expression, checking if the boolean expression is set to true or false.
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            //handle click also changes the state of the history array..
            history: history.concat([{
                squares: squares,
            }]),
            //indicate which step we are currently viewing. 
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    /**
     * jumpTo Methods
     * @param step: the step in which player wants to travel back in time for. 
     * @returns void updated State
     * 
     */
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            //modular is used when to check if the x is next. 
            //x turn is default so every other even move is x's turn.
            xIsNext: (step % 2) === 0,
        });
    }


    render() {
        //now we update game status inside of Game's render function. 
        //const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        //calculateWinner is a function called at the end of file. 
        const history = this.state.history; //more readable version of the history array
        //grabs the last index of the history array.
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        //to display past moves 
        const moves = history.map((step, move) => {
            //ternary expression for variable (description)
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    {/*jumpTo is a function that will display in the <ol></ol>*/}
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });


        let status;
        //if a winner has been declared.
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            //if winner is still null
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
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

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

/**
 * function calculate winner
 * @param squares takes the array of squares for each instance of the board class. 
 * @returns the winning elements if they are present in the game.
 */
function calculateWinner(squares) {
    //the lines array tells how many ways we can win the game via the indices of the squares class. 
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    //iterate through the loop: 
    for (let i = 0; i < lines.length; i++) {
        console.log(lines.length);
        //store the winning line in an array (line constitutes for three places that are valid inside 
        // of the lines array.)
        const [a, b, c] = lines[i];
        //the conditional makes sure that the value in the array (X or O) are adjacent. 
        //the condition first checks if the value has something in there. 
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


/**class Square extends React.Component {
    //So this is a class component?
    //Components are used to tell the React library what we want to see on the screen.
    //when data changes, our App powered by React will re-render the component.
    //components take in parameters called props. Props are short for properties.

    //Because we want Square component class to remember that it was clicked,
    //and mark up the current square with x or o,
    //State is used.
    //States are used via the Constructors inside of a class.
    //TODO: Initialize the constructor via State.

    constructor(props) {
        //Reminder: super() refers to the parent class of constructors.
        //always do this with a subclass in javascript.
        super(props);
        this.state = {
            //state object, intialize the value to null.
            value: null,
        };
    }

    render() {
        return (
            //JSX is called inside of HTML tags.
            //We are not limited to only HTML components,
            //But also custom made components that we need to create ourselves.
            //If we were to call Square in another class we write it as <Square />

            //ALERT: the className is the syntax used to import css design.
            //To Do: have button be clickable!
            //for functions, better to use ES6 syntax.
            //The result here is a hierarchy of views to display.
            //The result is written in JSX code.
            <button className="square" onClick={() => this.setState({ value: 'X' })}>
                {
                  JSX is still javascript.
                  you can still write any javascript expression you want
                 /}

                {/*Because Board is the parent class, we are inheriting the value prop that was passed./}
                {this.state.value}
            </button >
        );
    }
}**/

