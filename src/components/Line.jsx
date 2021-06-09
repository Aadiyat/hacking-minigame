import React from 'react';

function Line(props){
    const chars = props.lineChars.map((char, idx)=>{
        return (<span 
                        className = {props.highlightedSymbols[idx]}
                        onMouseEnter= {()=>props.onMouseEnter(idx)}
                        onMouseLeave={()=>props.onMouseLeave()}
                        onClick={()=>props.onClick(idx)}>{char}
                </span>) 
    })
    return (
        <p>{chars}</p>
    )
}

export default Line;