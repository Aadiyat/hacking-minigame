import React from 'react';

import * as gameParameters from './gameParameters';

function Output(props){
    const results = props.results.map((result, i)=>{
        return (<li key = {i}><Result guess ={result.guess} numMatches = {result.numMatches}></Result></li>)
    })
    return (<div>
                <ol>{results}</ol>
            </div>);
}

function Result(props){
    return (<div>
                <div>{props.guess}</div>
                <div>{props.numMatches}/{gameParameters.wordLength} correct.</div>
            </div>)
}

export default Output;
