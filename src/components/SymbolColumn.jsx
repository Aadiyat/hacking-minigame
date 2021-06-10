/*Represents one column of symbols on the Screen*/
import React from 'react';
import Line from './Line.jsx'

import * as gameParameters from './gameParameters.js'

class SymbolColumn extends React.Component{

    render(){
        return (
            // TODO: render lines in a more programmatic way. This isn't great.
            <div className = {this.props.className}>
                {this.renderLine(0)}
                {this.renderLine(1)}
                {this.renderLine(2)}
                {this.renderLine(3)}
                {this.renderLine(4)}
                {this.renderLine(5)}
                {this.renderLine(6)}
                {this.renderLine(7)}
                {this.renderLine(8)}
                {this.renderLine(9)}
                {this.renderLine(10)}
                {this.renderLine(11)}
            </div>
        )
    }

    renderLine(lineIdx){
        const symbols = this.props.symbolSubArray.slice(lineIdx*gameParameters.lineLength, lineIdx*gameParameters.lineLength + gameParameters.lineLength)
        const highlightedSymbols = this.props.highlightedSymbols.slice(lineIdx*gameParameters.lineLength, lineIdx*gameParameters.lineLength + gameParameters.lineLength)
        return (<div>
                    <Line  lineSymbols = {symbols}
                            highlightedSymbols = {highlightedSymbols}
                            onMouseEnter ={(symbolIdx) => this.props.onMouseEnter(lineIdx, symbolIdx)}
                            onMouseLeave = {()=>this.props.onMouseLeave()}
                            onClick= {(symbolIdx) => this.props.onClick(lineIdx, symbolIdx)}>
                    </Line>
                </div>)
    }
}

export default SymbolColumn;