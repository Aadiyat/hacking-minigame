/*Represents one column of symbols on the Screen*/
import React from 'react';
import Line from './Line.jsx'

import * as gameParameters from './gameParameters.js'

class SymbolColumn extends React.Component{
    render(){
        // See this in case you forget how the below line works
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#using_arrow_functions_and_array.from
        const lines = Array.from({length:gameParameters.numLines},
                                     (_, i) => this.renderLine(i));
        return (
            <div className="symbol-column" >{lines}</div>
        )
    }

    renderLine(lineIdx){
        const symbols = this.props.symbolSubArray.slice(lineIdx*gameParameters.lineLength, lineIdx*gameParameters.lineLength + gameParameters.lineLength)
        const highlightedSymbols = this.props.highlightedSymbols.slice(lineIdx*gameParameters.lineLength, lineIdx*gameParameters.lineLength + gameParameters.lineLength)
        return (<Line  lineSymbols = {symbols}
                        highlightedSymbols = {highlightedSymbols}
                        onMouseEnter ={(symbolIdx) => this.props.onMouseEnter(lineIdx, symbolIdx)}
                        onMouseLeave = {()=>this.props.onMouseLeave()}
                        onClick= {(symbolIdx) => this.props.onClick(lineIdx, symbolIdx)}>
                </Line>)
    }
}

export default SymbolColumn;