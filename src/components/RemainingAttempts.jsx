import React from 'react';

function RemainingAttempts(props){
    let attempts =  [];
    for(let i = 0; i < props.numAttempts; i++){
        attempts.push(<span className="attempt-bullet">""</span>)
    }
    return (<p className={props.className}>{attempts}</p>)
}

export default RemainingAttempts