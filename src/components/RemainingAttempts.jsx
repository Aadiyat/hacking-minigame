import React from 'react';

function RemainingAttempts(props){
    const attempts =  Array.from({length:props.numAttempts}, 
                                    (_, i) =><span className="attempt-bullet">__</span>);
    
    return (<p className={props.className}>{attempts}</p>)
}

export default RemainingAttempts