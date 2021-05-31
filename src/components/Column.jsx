/*Represents one column of characters on the Screen*/
import React from 'react';
import Line from './Line.jsx'

class Column extends React.Component{

    render(){
        return (
            <div>
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

    renderLine(i){
        const lineLength = 17;
        const chars = this.props.charsSubArray.slice(i*lineLength, i*lineLength + lineLength)
        return (<div><p>Line {i}</p><Line lineChars = {chars}></Line></div>)
    }
}

export default Column;