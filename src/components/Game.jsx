import React from 'react';
import PlayerFeedback from './PlayerFeedback';
import RemainingAttempts from './RemainingAttempts';
import RemainingAttemptsText from './RemainingAttemptsText';
import ColumnContainer from './ColumnContainer';

import * as gameParameters from './gameParameters.js'


class Game extends React.Component{
    constructor(props){
        super(props);
        let words = this.selectWords();

        this.state = {
            words: words,
            password: words[0]._, // Choose one word as the password. The list is in random order so we can just take the first
            //TODO: Maybe put the symbols and their highlight state into a single object?
            symbolArray: this.fillSymbolArray(words),
            symbolHighlightState: Array(gameParameters.symbolArrayLength).fill(""),
            feedbackMessages: [],
            isGameWon: false,
            tries: gameParameters.initialTries,
            addresses: this.generateAddresses(),
            usedBracketPairs: [],
            currentSelection: "|",
        };
    }

    render(){
        const columns = this.renderColumns();
        //TODO: The components have their own class names, but since those class names are responsible
        // for the positioning the components in the grid, maybe the class names should be set here
        return (<div className="game-board">
                    <RemainingAttemptsText/>
                    <RemainingAttempts numAttempts = {this.state.tries}/>
                    {columns}
                    <PlayerFeedback feedbackMessages = {this.state.feedbackMessages} currentSelection = {this.state.currentSelection}/>
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
            (_, columnIdx) => <ColumnContainer
                        className = {colClassNames[columnIdx]}
                        addresses = {addressSubArrays[columnIdx]}
                        symbols = {symbolSubArrays[columnIdx]} 
                        highlightStates = {highlightStateSubArrays[columnIdx]}
                        onMouseEnter={(lineIdx, symbolIdx)=>this.handleMouseEnter(columnIdx, lineIdx, symbolIdx)}
                        onMouseLeave = {()=>this.handleMouseLeave()}
                        onClick = {(lineIdx, symbolIdx)=>this.handleClick(columnIdx, lineIdx, symbolIdx)}
                        />);

        return columns;
    }

    /*---Event Handlers---*/

    handleClick(columnIdx, lineIdx, symbolIdx){
        if(this.state.tries > 0 && !this.state.isGameWon){
            const symbolArrayIdx = this.getSymbolArrayIdx(columnIdx, lineIdx, symbolIdx);
            const {_, wordIdx} = this.isWord(symbolArrayIdx);
            const {bracketStart, bracketEnd} = this.isBracketPair(symbolArrayIdx);

            if(wordIdx !== -1){
               this.checkGuess(this.state.words[wordIdx]._);
            }
            else if(bracketStart !== -1){
                // Add to list of used bracket pairs, so that the player can't infinitely get rewards
                const usedBrackets = this.state.usedBracketPairs.slice();
                    usedBrackets.push(symbolArrayIdx);
                    this.setState({
                        usedBracketPairs: usedBrackets,
                    });
                this.giveReward(this.state.symbolArray.slice(bracketStart, bracketEnd));
            }
            else{
                this.pushFeedbackMessage(<div>
                                            <p>&gt;{this.state.symbolArray[symbolArrayIdx]}</p>
                                            <p>&gt; Error</p>
                                        </div>);
            }
        }
    }

    handleMouseEnter(columnIdx, lineIdx, symbolIdx){
        if(this.state.tries > 0 && !this.state.isGameWon){
            // Need to first clear highlights and then set specific highlights in a callback to deal with JS asynchrony nonsense
            this.setState({symbolHighlightState:Array(gameParameters.symbolArrayLength).fill("symbol")}, ()=>{
                const symbolArrayIdx = this.getSymbolArrayIdx(columnIdx, lineIdx, symbolIdx);
                let highlightedSymbols = this.state.symbolHighlightState.slice();

                // If the symbol is part of a word all the symbols of the word need to be highlighted
                const {wordStartIdx, wordIdx} = this.isWord(symbolArrayIdx);
                const {bracketStart, bracketEnd} = this.isBracketPair(symbolArrayIdx);
                let currentSelection = [];
                if(wordIdx !== -1){
                    currentSelection = this.state.symbolArray.slice(wordStartIdx, wordStartIdx + gameParameters.wordLength);
                    for(let i = wordStartIdx; i<wordStartIdx + gameParameters.wordLength; i++){
                        highlightedSymbols[i]="highlighted-symbol";
                    }
                }
                else if(bracketStart !== -1){
                    currentSelection = this.state.symbolArray.slice(bracketStart, bracketEnd);
                    for(let i = bracketStart; i<bracketEnd;i++){
                        highlightedSymbols[i]="highlighted-symbol";
                    }
                }
                else{
                    currentSelection = this.state.symbolArray.slice(symbolArrayIdx, symbolArrayIdx+1);
                    highlightedSymbols[symbolArrayIdx] = "highlighted-symbol";
                }
                
                this.setState({
                    symbolHighlightState:highlightedSymbols,
                    currentSelection: currentSelection,
                });
            });
        }
    }

    handleMouseLeave(){
        const highlightedSymbols = Array(gameParameters.symbolArrayLength).fill("");
        this.setState({
            symbolHighlightState: highlightedSymbols,
            currentSelection: "|",
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

    removeDud(){
        // Get indices for all words that are not the password
        let dudIndices = [];
        const words = this.state.words.slice();
        words.forEach((word, i) =>{
            if(word._ !== this.state.password){
                dudIndices.push(i);
            }
        })

        // Select dud at random
        const dudIndex = dudIndices[Math.floor(Math.random()*dudIndices.length)];
        words.splice(dudIndex, 1); // remove dud from the list of words that are to be displayed

        // Need to replace the symbols of the dud word with blanks
        const dudStartIndex = this.state.words[dudIndex].startIndex;
        const symbolArray = this.state.symbolArray.slice()
        for(let i = dudStartIndex; i< dudStartIndex+gameParameters.wordLength; i++){
            symbolArray[i] = '.';
        }

        this.setState({
            symbolArray: symbolArray,
            words: words,
        })
    }

    pushFeedbackMessage(message){
        const messages = this.state.feedbackMessages.slice();
        messages.push(message);
        this.setState({
            feedbackMessages: messages,
        })
    }

    checkGameWon(numMatches){
        const gameWon = (numMatches === gameParameters.wordLength);
        
        this.setState({
            isGameWon:gameWon,
        })

        return gameWon;
    }

    /*---Initialiser functions: sets initial game state---*/
    //Chooses 10 words from the list of 16 in gameParameters
    selectWords(){
        // Take a random subset of 10 words
        let wordSubset = gameParameters.words.slice();
        this.shuffle(wordSubset);
        wordSubset = wordSubset.slice(0,gameParameters.numWords);
        
        // map to an array of objects with word and index properties
        const words =  wordSubset.map(word => 
            ({
                _: word,    // doesn't really make sense to have a property called word in an object also called word
                            // and it doesn't make sense to call the object anything else
                startIndex: null
             }));

        // assign random starting indices for the words
        const indices = this.generateWordStartIndices();
        words.forEach((word, i) => word.startIndex = indices[i]);

        return words;
    };

    // Generates random indices for an array, ensuring there is room between indices for a word to fit
    generateWordStartIndices(){
        let indices = Array(gameParameters.numWords);
        let count = 0;

        let queue = [];
        queue.push({start:0, end:(gameParameters.symbolArrayLength-gameParameters.wordLength)});

        while(count < gameParameters.numWords){
            let range = queue.shift();
            
            if((range.end - range.start) > gameParameters.wordLength){
                let rndIdx = Math.floor(range.start + Math.random()*(range.end-range.start));
                indices[count++] = rndIdx;
                queue.push({start:range.start, end:rndIdx - gameParameters.wordLength});
                queue.push({start: rndIdx + gameParameters.wordLength + 1, end:range.end});
            }
        }

        return indices;
    }

    // Fills the symbol array with words starting at the corresponding starting index 
    // and fills the remaining space with random symbols
    fillSymbolArray(words){
        let symbolArr = Array(gameParameters.symbolArrayLength).fill(null);
        let word, start, characters;
        // Enter the words at the corresponding starting index
        for(let i = 0; i<words.length; i++){
            word = words[i];
            start = word.startIndex;
            characters = word._.split('');
            for(let j =0; j<gameParameters.wordLength; j++){
                symbolArr[start+j] = characters[j];
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

    // Generates a list of memory addresses for the decorative address column
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
    getSymbolArrayIdx(columnIdx, lineIdx, symbolIdx){
        // Calculate index of the symbol in the symbol array
        const symbolArrayIdx = Math.floor(gameParameters.symbolArrayLength/gameParameters.numColumns)*columnIdx + gameParameters.symbolsPerLine*lineIdx + symbolIdx;
        return symbolArrayIdx;
    }

    // Checks if the selected symbol belongs to a word
    // if the symbol belongs to a word, returns the index of the word in gameParameters.words
    // returns -1 otherwise;
    isWord(symbolArrayIdx){
        let wordStartIdx = -1;
        let wordIdx = -1;
        this.state.words.forEach((word, i) =>{
            if(symbolArrayIdx >= word.startIndex && symbolArrayIdx < word.startIndex + gameParameters.wordLength){
                wordStartIdx = word.startIndex;
                wordIdx = i;
            }
        });

        return {wordStartIdx, wordIdx};
    }
    
    // Checks if the selected symbol is the opening bracket of a pair of brackets on the same line.
    isBracketPair(symbolArrayIdx){
        if(this.state.usedBracketPairs.indexOf(symbolArrayIdx) === -1){
            const openBrackets  = ['<', '(', '{', '['];
            const closeBrackets = ['>', ')', '}', ']'];

            const endOfLineIdx = symbolArrayIdx + (gameParameters.symbolsPerLine - (symbolArrayIdx % gameParameters.symbolsPerLine)); // Finds where the current line ends
            const openBracket = openBrackets.indexOf(this.state.symbolArray[symbolArrayIdx]); // Check if the clicked symbol appears in the list of open brackets

            if(openBracket !== -1 && (endOfLineIdx >symbolArrayIdx)){ // user clicked on an open bracket
                // Check if the corresponding closing bracket appears in the remaining symbols in the line
                const correspondingCloseBracket = closeBrackets[openBracket];
                const remainingSymbolsInLine = this.state.symbolArray.slice(symbolArrayIdx, endOfLineIdx);
                const closeBracketIdx = remainingSymbolsInLine.indexOf(correspondingCloseBracket);
                if(closeBracketIdx !== -1){
                    return {bracketStart: symbolArrayIdx, bracketEnd: (symbolArrayIdx + closeBracketIdx + 1)};                
                }
            }
        }
        return {bracketStart:-1, bracketEnd: -1};
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

    checkGuess(guess){
        const numMatches = this.compareWithPassword(guess);
        const gameWon = this.checkGameWon(numMatches);
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
    }
}

export default Game;