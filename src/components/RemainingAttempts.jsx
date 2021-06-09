import React from 'react';

function RemainingAttempts(props){
    let attempts =  [];
    for(let i = 0; i < props.numAttempts; i++){
        attempts.push(<span className="attempt-bullet">o</span>)
    }
    return (<div>{attempts}</div>)
}

export default RemainingAttempts