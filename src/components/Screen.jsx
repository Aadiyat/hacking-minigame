import React from 'react';

//TODO: Currently hard coding parameters.
// wordLength will depend on difficulty
// read specialChars and words from json
const gameParameters = {
    wordLength : 7,
    wordSpacing: 2, // Minimum spacing between words
    words: ["dangers", "sending", "central", "hunters", "resides", "believe", "venture", "pattern", "discard", "mention", "cutters", "canteen", "beliefs", "banning", "minigun", "cistern"],
    specialChars : [',','.','!','@','#','$','%','&','(',')','{','}','[',']','<','>','?','"',"'", '/', '|'],
    charArrayLength: 408,
}

class Screen extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            secretWord: null,
            wordIndices: this.generateIndices(),
        };
    }

    render(){
        console.log(this.state.wordIndices);
        console.log(this.fillCharArray());
        return (<div>Placeholder.</div>);
    }
    
    generateIndices(){
        let wordIndices = {
            indices: Array(gameParameters.words.length).fill(null),
            count: 0,
        }
        this.generateWordIndices(wordIndices, 0, gameParameters.charArrayLength-gameParameters.wordLength)
        return wordIndices.indices;
    }

    /* Assumes there is an object wordIdx that contains an array of indices and keeps count of the number indices assigned so far*/
    generateWordIndices(wordIdx, start, end){
        if((end - start) >= (gameParameters.wordLength) // If there is room to put in a word
            && wordIdx.count < gameParameters.words.length) // if we need to assign another index
            {
                let rndIdx = Math.floor(start+Math.random()*(end-start)); // index between start and end (inclusive of start, but not end)
                wordIdx.indices[wordIdx.count++] = rndIdx;
                this.generateWordIndices(wordIdx, start, rndIdx - gameParameters.wordLength);
                this.generateWordIndices(wordIdx, rndIdx + gameParameters.wordLength + 1, end);
            }
    }

    fillCharArray(){
        let charArr = Array(gameParameters.charArrayLength).fill(null);
        // Use indices to fill characters for words ...
        for(let i = 0; i<gameParameters.words.length; i++){
            // The index for the ith word is the ith index in this.state.wordIndices
            let word = gameParameters.words[i];
            let start = this.state.wordIndices[i];
            let wordArr = word.split('');
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