import React from 'react';

function Line(props){
    const symbols = props.lineSymbols.map((symbol, idx)=>{
        return (<span 
                        className = {props.highlightedSymbols[idx]}
                        onMouseEnter= {()=>props.onMouseEnter(idx)}
                        onMouseLeave={()=>props.onMouseLeave()}
                        onClick={()=>props.onClick(idx)}>{symbol}
                </span>) 
    })
    return (
        <p>{symbols}</p>
    )
}

export default Line;