import React from 'react';

function GuessResults(props){
    const results = props.results.map((result, i)=>{
        return (<li key = {i}><Result guess ={result.guess} numMatches = {result.numMatches}></Result></li>)
    })
    return (<div className = {props.className}>
                <ol>{results}</ol>
            </div>);
}

function Result(props){
    return (<div className="feedback">
                <p>&gt;{props.guess}</p>
                <p>&gt;Likeness = {props.numMatches}</p>
            </div>)
}

export default GuessResults;
