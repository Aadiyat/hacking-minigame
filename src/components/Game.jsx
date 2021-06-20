import React from 'react';
import PlayerFeedback from './PlayerFeedback';
import RemainingAttempts from './RemainingAttempts';
import RemainingAttemptsText from './RemainingAttemptsText';
import ColumnContainer from './ColumnContainer';

import * as gameParameters from './gameParameters.js'


class Game extends React.Component{
    constructor(props){
        super(props);
        const indices = this.generateIndices();

        this.state = {
            password: gameParameters.words[Math.floor(Math.random()*gameParameters.words.length)],
            wordStartIndices: indices,
            //TODO: Maybe put the symbols and their highlight state into a single object?
            symbolArray: this.fillSymbolArray(indices),
            symbolHighlightState: Array(gameParameters.symbolArrayLength).fill("symbol"),
            feedbackMessages: [],
            isGameWon: false,
            tries: gameParameters.initialTries,
            addresses: this.generateAddresses(),
            openBracketsClickedSoFar: []
        };
    }

    render(){
        const columns = this.renderColumns();
        return (<div className="game-board">
                    <RemainingAttemptsText/>
                    <RemainingAttempts numAttempts = {this.state.tries}/>
                    {columns}
                    <PlayerFeedback feedbackMessages = {this.state.feedbackMessages}/>
                </div>);
    }

    /*---Render Functions---*/

    //TODO: Possibly make another component that wraps around the two column containers?
    renderColumns(){
        // Distributes the symbols among the columns
        const symbolsPerColumn = Math.floor(gameParameters.symbolArrayLength/gameParameters.numColumns);

        const symbolSubArrays = Array.from({length:gameParameters.numColumns},
            (_, i) => this.state.symbolArray.slice(i*symbolsPerColumn, (i+1)*symbolsPerColumn));

        // Distributes the corresponding symbol highlight state
        const highlightStateSubArrays = Array.from({length:gameParameters.numColumns},
            (_,i) => this.state.symbolHighlightState.slice(i*symbolsPerColumn, (i+1)*symbolsPerColumn));

        // Distribute memoory address for lines
        const addressSubArrays = Array.from({length: gameParameters.numColumns},
            (_, i) => this.state.addresses.slice(i*gameParameters.linesPerColumn, (i+1)*gameParameters.linesPerColumn));

        // Class names for cols
        const colClassNames = ["first-column-container", "second-column-container"];

        const columns = Array.from({length:gameParameters.numColumns},
            (_, i) => <ColumnContainer
                        className = {colClassNames[i]}
                        addresses = {addressSubArrays[i]}
                        symbols = {symbolSubArrays[i]} 
                        highlightStates = {highlightStateSubArrays[i]}
                        onMouseEnter={(lineIdx, symbolIdx)=>this.handleMouseEnter(i, lineIdx, symbolIdx)}
                        onMouseLeave = {()=>this.handleMouseLeave()}
                        onClick = {(lineIdx, symbolIdx)=>this.handleClick(i, lineIdx, symbolIdx)}
                        />);

        return columns;
    }

    /*---Event Handlers---*/

    handleClick(column, line, symbolIdx){
        if(this.state.tries > 0 && !this.state.isGameWon){
            const symbolArrayIdx = this.getSymbolArrayIdx(column, line, symbolIdx);
            
            // user clicks on a symbol
            // Need to check if the symbol is part of a word
            const {_, wordIdx} = this.isWord(symbolArrayIdx);
            let message;
            if(wordIdx !== -1){
               message = this.checkGuess(wordIdx);
            }

            const {openBracket, closeBracket} = this.isBracketPair(column, line, symbolIdx);
            if(openBracket !== -1){
                this.giveReward(this.state.symbolArray.slice(openBracket, closeBracket));
            }

           

            // Else if need to check if it is a pair of open and close parentheses on the same line
                // Handle that case
                // Push reward (tries reset/dud removed)
            // Otherwise
                // Push 'error' message

        }
    }

    checkGuess(wordIdx){
        const guess = gameParameters.words[wordIdx]
        const numMatches = this.compareWithPassword(guess)
        const gameWon = this.checkGameWon(numMatches)
        this.decreaseTries();

        let accessMessage;
        if(gameWon){
           accessMessage = "Entry Granted"
        }
        else{
            accessMessage = "Entry Denied"
        }    
        this.pushFeedbackMessage(<div>
                                    <p>&gt;{guess}</p>
                                    <p>&gt;{accessMessage}</p>
                                    <p>&gt;Likeness = {numMatches}</p>
                                </div>);
    }

    pushFeedbackMessage(message){
        const messages = this.state.feedbackMessages.slice();
        messages.push(message);
        this.setState({
            feedbackMessages: messages,
        })
    }

    handleMouseEnter(column, line, symbolIdx){
        if(this.state.tries > 0 && !this.state.isGameWon){
            // Need to first clear highlights and then set specific highlights in a callback to deal with JS asynchrony nonsense
            this.setState({symbolHighlightState:Array(gameParameters.symbolArrayLength).fill("symbol")}, ()=>{
                const symbolArrayIdx = this.getSymbolArrayIdx(column, line, symbolIdx);
                let highlightedSymbols = this.state.symbolHighlightState.slice();

                // If the symbol is part of a word all the symbols of the word need to be highlighted
                const {wordStartIdx, wordIdx} = this.isWord(symbolArrayIdx);
                if(wordIdx !== -1){    
                    for(let i = wordStartIdx; i<wordStartIdx + gameParameters.wordLength; i++){
                        highlightedSymbols[i]="highlighted-symbol";
                    }
                }else{
                    highlightedSymbols[symbolArrayIdx] = "highlighted-symbol";
                }
                
                this.setState({
                    symbolHighlightState:highlightedSymbols,
                });
            });
        }
    }

    handleMouseLeave(){
        const highlightedSymbols = Array(gameParameters.symbolArrayLength).fill("symbol");
        this.setState({
            symbolHighlightState: highlightedSymbols,
        })
    }
    
    /*---Game state functions---*/
    decreaseTries(){
        const tries = this.state.tries -1;
        this.setState({
            tries : tries,
        })
    }

    resetTries(){
        this.setState({
            tries:gameParameters.initialTries,
        });

    }

    checkGameWon(numMatches){
        const gameWon = numMatches === gameParameters.wordLength
        
        this.setState({
            isGameWon:gameWon,
        })

        return gameWon;
    }

    /*---Initialiser functions: sets initial game state---*/

    // Generates random indices for an array, ensuring there is room between indices for a word to fit
    generateIndices(){
        let wordStartIdx = {
            indices: Array(gameParameters.words.length).fill(null),
            count: 0,
        }
        this.generateWordIndices(wordStartIdx, 0, gameParameters.symbolArrayLength-gameParameters.wordLength)
        return this.shuffle(wordStartIdx.indices);
    }

    // Assumes there is an object wordIdx that contains an array of indices and keeps count of the number indices assigned so far
    generateWordIndices(wordStartIdx, start, end){
        if((end - start) >= (gameParameters.wordLength) // If there is room to put in a word
            && wordStartIdx.count < gameParameters.words.length) // and if we need to assign another index
            {
                let rndIdx = Math.floor(start+Math.random()*(end-start)); // index between start and end (inclusive of start, but not end)
                wordStartIdx.indices[wordStartIdx.count++] = rndIdx;
                this.generateWordIndices(wordStartIdx, start, rndIdx - gameParameters.wordLength);
                this.generateWordIndices(wordStartIdx, rndIdx + gameParameters.wordLength + 1, end);
            }
    }

    fillSymbolArray(wordStarts){
        let symbolArr = Array(gameParameters.symbolArrayLength).fill(null);
        let word, start, wordArr;
        // Use wordStarts to fill characters for words ...
        for(let i = 0; i<gameParameters.words.length; i++){
            // The index for the ith word is the ith index in wordStarts
            word = gameParameters.words[i];
            start = wordStarts[i];
            wordArr = word.split('');
            for(let j =0; j<gameParameters.wordLength; j++){
                symbolArr[start+j] = wordArr[j];
            }
        }

        // Fill remaining spaces with random misc symbols ...
        for(let i = 0; i<gameParameters.symbolArrayLength; i++){
            if(symbolArr[i] == null){
                symbolArr[i] = gameParameters.miscSymbols[Math.floor(Math.random()*gameParameters.miscSymbols.length)];
            }
        }

        return symbolArr;
    }

    generateAddresses(){
        const byteSize = 8; //TODO: define bytesize elsewhere?
        let addresses = Array(gameParameters.linesPerColumn*gameParameters.numColumns);

        const startingAddress = this.generateStartingAddress();

        for(let i=0; i<addresses.length; i++){
            addresses[i] = startingAddress+(i*byteSize);
        }

        return addresses;
    }

    // Generates a random memory address
    // The address space goes from 0x0000 through to 0xFFFF
    // Memory is byte addressable
    generateStartingAddress(){
        const byteSize = 8;
        const maxAddress = 0xFFFF - (gameParameters.linesPerColumn*gameParameters.numColumns*byteSize)+byteSize;

        let startingAddress = Math.ceil(Math.random()*maxAddress);

        const remainder = startingAddress%byteSize;
        startingAddress = startingAddress - remainder; //Removing the remainder ensures the address is a multiple of 8

        return startingAddress;
    }

    /*---Helper functions---*/

    // this.state.symbolArray is distributed among the columns and lines, 
    // this uses the indices of the column, line and symbol within the line to calculate
    // the index of the symbol in this.state.symbolArray
    getSymbolArrayIdx(column, line, symbolIdx){
        // Calculate index of the symbol in the symbol array
        const symbolArrayIdx = Math.floor(gameParameters.symbolArrayLength/gameParameters.numColumns)*column + gameParameters.symbolsPerLine*line + symbolIdx;
        return symbolArrayIdx;
    }

    // Checks if the selected symbol belongs to a word
    // if the symbol belongs to a word, returns the index of the word in gameParameters.words
    // returns -1 otherwise;
    isWord(symbolArrayIdx){
        let wordStartIdx = -1;
        let wordIdx = -1;
        this.state.wordStartIndices.forEach((wordStart, i) =>{
            if(symbolArrayIdx >= wordStart && symbolArrayIdx < wordStart + gameParameters.wordLength){
                wordStartIdx = wordStart;
                wordIdx = i;
            }
        });

        return {wordStartIdx, wordIdx};
    }
    
    // Checks if the selected symbol is the opening bracket of a pair of brackets on the same line.
    isBracketPair(symbolArrayIdx){
        const openBrackets  = ['<', '(', '{', '['];
        const closeBrackets = ['>', ')', '}', ']'];

        const endOfLine = symbolArrayIdx + (gameParameters.symbolsPerLine - (this.getSymbolArrayIdx % gameParameters.symbolsPerLine));
        const openBracketIdx = openBrackets.indexOf(this.state.symbolArray[symbolArrayIdx]); // Check if the clicked symbol appears in the list of open brackets

        if(openBracketIdx !== -1){ // user clicked on an open bracket
            const correspondingCloseBracket = closeBrackets[openBracketIdx];
            const remainingSymbolsInLine = this.state.symbolArray.slice(symbolArrayIdx+1, endOfLine);
            const closeBracketIdx = remainingSymbolsInLine.indexOf(correspondingCloseBracket);
            if(closeBracketIdx !== -1){
                return {openBracket: openBracketIdx, closeBracket: closeBracketIdx};                
            }
        }
        return {openBracket:-1, closeBracket: -1};
    }

    // Randomly chooses between resetting the number of remaining tries and removing a dud
    // When the player clicks on a pair of brackets on the same line
    giveReward(symbols){
        const rnd = Math.random();
        let rewardType;
        if(rnd < gameParameters.rewardSplit){
            rewardType = "Tries Reset."
            this.resetTries();
        }
        else{
            rewardType = "Dud Removed."
            this.removeDud();
        }

        const message =(<div>
                            <p>&gt;{symbols}</p>
                            <p>&gt;{rewardType}</p>
                        </div>)
        this.pushFeedbackMessage(message);
    }

    compareWithPassword(guess){
        const guessArr = guess.split('');
        const passwordArr = this.state.password.split('');
        
        let numMatches = 0;
        passwordArr.forEach((symbol, i)=>{
            if(symbol === guessArr[i]) numMatches++;
        });

        return numMatches;
    }

    // Recursive nature of generateWordIndices means that the the i+1 index will be before the i th index 
    // and the i+2 index will be after the first (assuming there is room). 
    // Shuffling the indices will make it more randomised 
    shuffle(array){
        let current = array.length;
        let temp, randIdx;

        while(current !== 0){
            // Choose a random element
            randIdx = Math.floor(Math.random()*current);
            current -=1;

            // swap with current element
            temp = array[current];
            array[current] = array[randIdx];
            array[randIdx] = temp;
        }
        return array;
    }
}

export default Game;