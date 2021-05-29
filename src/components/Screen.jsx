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
}

export default Screen;