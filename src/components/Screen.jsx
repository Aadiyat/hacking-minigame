import React from 'react';
import SymbolColumn from './SymbolColumn'
import GuessResults from './GuessResults';
import RemainingAttempts from './RemainingAttempts';
import RemainingAttemptsText from './RemainingAttemptsText';
import AddressColumn from './AddressColumn';

import * as gameParameters from './gameParameters.js'


class Screen extends React.Component{
    constructor(props){
        super(props);
        const indices = this.generateIndices();

        this.state = {
            password: gameParameters.words[Math.floor(Math.random()*gameParameters.words.length)],
            wordStartIndices: indices,
            symbolArray: this.fillSymbolArray(indices),
            results: [],
            isGameWon: false,
            tries: 4,
            symbolHighlightState: Array(gameParameters.symbolArrayLength).fill("symbol"),
            addresses: this.generateAddresses(),
        };
    }

    render(){
        const firstHalf = this.state.symbolArray.slice(0,Math.floor(gameParameters.symbolArrayLength/2));
        const secondHalf = this.state.symbolArray.slice(Math.floor(gameParameters.symbolArrayLength/2), gameParameters.symbolArrayLength);

        const highlightedSymbolsFirstHalf = this.state.symbolHighlightState.slice(0,Math.floor(gameParameters.symbolArrayLength/2));
        const highlightedSymbolsSecondHalf = this.state.symbolHighlightState.slice(Math.floor(gameParameters.symbolArrayLength/2), gameParameters.symbolArrayLength);

        const firstColumnAddresses = this.state.addresses.slice(0, gameParameters.numLines);
        const secondColumnAddresses = this.state.addresses.slice(gameParameters.numLines, gameParameters.numLines*2);


        return (<div className="game-board">
                    <RemainingAttemptsText className = "remaining-attempts-text"/>
                    <RemainingAttempts className = "remaining-attempts" numAttempts = {this.state.tries}/>
                    <div className = "column-container first-column-container">
                        <AddressColumn  addresses = {firstColumnAddresses}/>
                        <SymbolColumn
                            symbolSubArray = {firstHalf} 
                            highlightedSymbols = {highlightedSymbolsFirstHalf}
                            onMouseEnter={(lineIdx, symbolIdx)=>this.handleMouseEnter(0, lineIdx, symbolIdx)}
                            onMouseLeave = {()=>this.handleMouseLeave()}
                            onClick = {(lineIdx, symbolIdx)=>this.handleClick(0, lineIdx, symbolIdx)}>
                        </SymbolColumn>
                    </div>
                    <div className = "column-container second-column-container">
                        <AddressColumn addresses={secondColumnAddresses}/>
                        <SymbolColumn
                            symbolSubArray = {secondHalf} 
                            highlightedSymbols = {highlightedSymbolsSecondHalf}
                            onMouseEnter = {(lineIdx, symbolIdx)=>this.handleMouseEnter(1, lineIdx, symbolIdx)}
                            onMouseLeave = {()=>this.handleMouseLeave()}
                            onClick ={(lineIdx, symbolIdx)=>this.handleClick(1, lineIdx, symbolIdx)}>
                        </SymbolColumn>
                    </div>
                    <GuessResults className="feedback-column" results = {this.state.results}/>
                </div>);
    }

    /*---Event Handlers---*/

    handleClick(column, line, symbolIdx){
        if(this.state.tries > 0 && !this.state.isGameWon){
            const symbolArrayIdx = this.getSymbolArrayIdx(column, line, symbolIdx);
            
            const {wordStartIdx, wordIdx} = this.isWord(symbolArrayIdx);
            if(wordIdx !== -1){
                const word = gameParameters.words[wordIdx]
                const numMatches = this.compareWithPassword(word)
                this.pushResult(word, numMatches);
                this.checkGameWon(numMatches)
                this.decreaseTries();
            }
        }
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

    checkGameWon(numMatches){
        if(numMatches === gameParameters.wordLength){
            this.setState({
                isGameWon:true,
            })
        }
    }

    // TODO: Currently pushing an indefinite number of results
    // The actual minigame in FO3/4 shows the 3 most recent results
    pushResult(guess, numMatches){
        const results = this.state.results;
        const result = {
            guess: guess,
            numMatches: numMatches
        }

        results.push(result);

        this.setState({
            results: results,
        })
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
        let addresses = Array(gameParameters.numLines*2);

        const startingAddress = this.generateStartingAddress();

        for(let i=0; i<addresses.length; i++){
            addresses[i] = startingAddress+(i*byteSize);
        }

        return addresses;
    }

    generateStartingAddress(){
        const byteSize = 8;
        const maxAddress = 0xFFFF - (32*byteSize)+byteSize;

        let startingAddress = Math.ceil(Math.random()*maxAddress) + byteSize;

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
        const symbolArrayIdx = Math.floor(gameParameters.symbolArrayLength/2)*column + gameParameters.lineLength*line + symbolIdx;
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

export default Screen;