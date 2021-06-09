import React from 'react';
import Column from './Column.jsx'
import Output from './Output.jsx';
import RemainingAttempts from './RemainingAttempts.jsx';
import RemainingAttemptsText from './RemainingAttemptsText.jsx';

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
            tries: 3,
        };
    }

    render(){
        const firstHalf = this.state.symbolArray.slice(0,Math.floor(gameParameters.symbolArrayLength/2));
        const secondHalf = this.state.symbolArray.slice(Math.floor(gameParameters.symbolArrayLength/2), gameParameters.symbolArrayLength);
        return (<div>
                    <RemainingAttemptsText/>
                    <RemainingAttempts numAttempts = {this.state.tries}/>
                    <p>Col1</p>
                    <Column symbolSubArray = {firstHalf} onClick = {(lineIdx, charIdx)=>this.handleClick(0, lineIdx, charIdx)}></Column>
                    <p>Col2</p>
                    <Column symbolSubArray = {secondHalf} onClick ={(lineIdx, charIdx)=>this.handleClick(1, lineIdx, charIdx)}></Column>
                    <Output results = {this.state.results}/>
                </div>);
    }
    
    handleClick(col, line, i){
        if(this.state.tries > 0 && !this.state.isGameWon){
            const idx = Math.floor(gameParameters.symbolArrayLength/2)*col + gameParameters.lineLength*line + i;
            let isWord = false;

            // Check if the selected symbol belongs to a word
            this.state.wordStartIndices.forEach((wordStart, i) =>{
                if(idx >= wordStart && idx < wordStart + gameParameters.wordLength){
                    const word = gameParameters.words[i]
                    const numMatches = this.checkWord(word)
                    this.pushResult(word, numMatches);
                    this.checkGameWon(numMatches)
                    this.decreaseTries();
                    isWord=true;
                }
            })
            if(!isWord) console.log("Clicked:" + this.state.symbolArray[idx]);
        }
    }

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

    checkWord(guess){
        const guessArr = guess.split('');
        const passwordArr = this.state.password.split('');
        
        let numMatches = 0;
        passwordArr.forEach((char, i)=>{
            if(char === guessArr[i]) numMatches++;
        });

        return numMatches;
    }

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

    fillSymbolArray(wordStarts){
        let charArr = Array(gameParameters.symbolArrayLength).fill(null);
        let word, start, wordArr;
        // Use wordStarts to fill characters for words ...
        for(let i = 0; i<gameParameters.words.length; i++){
            // The index for the ith word is the ith index in wordStarts
            word = gameParameters.words[i];
            start = wordStarts[i];
            wordArr = word.split('');
            for(let j =0; j<gameParameters.wordLength; j++){
                charArr[start+j] = wordArr[j];
            }
        }

        // Fill remaining spaces with random special chars ...
        for(let i = 0; i<gameParameters.symbolArrayLength; i++){
            if(charArr[i] == null){
                charArr[i] = gameParameters.miscSymbols[Math.floor(Math.random()*gameParameters.miscSymbols.length)];
            }
        }

        return charArr;
    }
}

export default Screen;