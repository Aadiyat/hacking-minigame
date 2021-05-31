import React from 'react';

function Line(props){
    const line = props.lineChars.join()
    return (
        <p>{line}</p>
    )
}

export default Line;