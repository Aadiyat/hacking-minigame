import React from 'react';
import Column from './Column.jsx'

import * as gameParameters from './gameParameters.js'

class Screen extends React.Component{
    constructor(props){
        super(props);
        const indices = this.generateIndices();

        this.state = {
            secretWord: gameParameters.words[Math.floor(Math.random()*gameParameters.words.length)],
            wordIndices: indices,
            charArray: this.fillCharArray(indices),
        };
    }

    render(){
        const firstHalf = this.state.charArray.slice(0,Math.floor(gameParameters.charArrayLength/2));
        const secondHalf = this.state.charArray.slice(Math.floor(gameParameters.charArrayLength/2), gameParameters.charArrayLength);
        return (<div>
                    <p>Col1</p>
                    <Column charsSubArray = {firstHalf} onClick = {(lineIdx, charIdx)=>this.handleClick(0, lineIdx, charIdx)}></Column>
                    <p>Col2</p>
                    <Column charsSubArray = {secondHalf} onClick ={(lineIdx, charIdx)=>this.handleClick(1, lineIdx, charIdx)}></Column>
                </div>);
    }
    
    handleClick(col, line, i){
        const idx = Math.floor(gameParameters.charArrayLength/2)*col + gameParameters.lineLength*line + i;
        let isWord = false;
        this.state.wordIndices.forEach((wordIdx, i) =>{
            if(idx >= wordIdx && idx < wordIdx + gameParameters.wordLength){
                const word = gameParameters.words[i]
                const numMatches = this.checkWord(word)
                console.log("Clicked: " + word + ". Num Matches: " + numMatches);
                isWord=true;
            }
        })
        if(!isWord) console.log("Clicked:" + this.state.charArray[idx]);
    }

    checkWord(word){
        const wordArr = word.split('');
        const secretWordArr = this.state.secretWord.split('');
        
        let numMatches = 0;
        secretWordArr.forEach((char, i)=>{
            if(char === wordArr[i]) numMatches++;
        });

        return numMatches;
    }

    generateIndices(){
        let wordIdx = {
            indices: Array(gameParameters.words.length).fill(null),
            count: 0,
        }
        this.generateWordIndices(wordIdx, 0, gameParameters.charArrayLength-gameParameters.wordLength)
        return this.shuffle(wordIdx.indices);
    }

    /* Assumes there is an object wordIdx that contains an array of indices and keeps count of the number indices assigned so far*/
    generateWordIndices(wordIdx, start, end){
        if((end - start) >= (gameParameters.wordLength) // If there is room to put in a word
            && wordIdx.count < gameParameters.words.length) // and if we need to assign another index
            {
                let rndIdx = Math.floor(start+Math.random()*(end-start)); // index between start and end (inclusive of start, but not end)
                wordIdx.indices[wordIdx.count++] = rndIdx;
                this.generateWordIndices(wordIdx, start, rndIdx - gameParameters.wordLength);
                this.generateWordIndices(wordIdx, rndIdx + gameParameters.wordLength + 1, end);
            }
    }

    /* Problem with the generateWordIndices is that the second indice will always be before the first, and
    the third will be after the first (assuming there is room). Shuffling the indices will make it more randomised */
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

    fillCharArray(indices){
        let charArr = Array(gameParameters.charArrayLength).fill(null);
        let word, start, wordArr;
        // Use indices to fill characters for words ...
        for(let i = 0; i<gameParameters.words.length; i++){
            // The index for the ith word is the ith index in indices
            word = gameParameters.words[i];
            start = indices[i];
            wordArr = word.split('');
            for(let j =0; j<gameParameters.wordLength; j++){
                charArr[start+j] = wordArr[j];
            }
        }

        // Fill remaining spaces with random special chars ...
        for(let i = 0; i<gameParameters.charArrayLength; i++){
            if(charArr[i] == null){
                charArr[i] = gameParameters.specialChars[Math.floor(Math.random()*gameParameters.specialChars.length)];
            }
        }

        return charArr;
    }
}

export default Screen;