import React from 'react';

function Line(props){
    const chars = props.lineChars.map((char, idx)=>{
        return (<button onClick={()=>props.onClick(idx)}>{char}</button>) // This will call the onClick function from Column with idx as the arg
    })
    return (
        <p>{chars}</p>
    )
}

export default Line;