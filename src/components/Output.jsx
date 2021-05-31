import React from 'react';

import * as gameParameters from './gameParameters';

function Output(props){
    const results = props.results.map((result, i)=>{
        return (<li key = {i}><Result word ={result.word} numMatches = {result.numMatches}></Result></li>)
    })
    return(<div>
                <ol>{results}</ol>
            </div>);
}

// What would one result look like?
function Result(props){
    return (<div>
                <div>{props.word}</div>
                <div>{props.numMatches}/{gameParameters.wordLength} correct.</div>
            </div>)
}

export default Output;
