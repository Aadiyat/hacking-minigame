import React from 'react';
import CurrentSelection from "./CurrentSelection";

// We want to give feedback that informs the player about the result of clicking 
// on a symbol
    // That symbol could be just a symbol
    // It could be part of a word
    // It could be part of a set of brackets
        // This has two possible outcomes
// Each outcome generates a message to the player (stored in this.state.feedback) 
// This component is responsible for showing the most recent feedback
// So essentially the only responsibility of this component is to take an array of React components 
// and show the 3 most recent components in an ordered list

function PlayerFeedback(props){
    const results = props.feedbackMessages.map((message, i)=>{
        return (<li key = {i}>{message}</li>)
    })
    
    return (<div className="feedback-column">
                <div className = "feedback-grid">
                    <ol className = "previous-selection">{results.slice(Math.max(results.length - 3, 0))}</ol>
                    <CurrentSelection className = "current-selection" currentSelection = {props.currentSelection}/>
                </div>
            </div>);
}

export default PlayerFeedback;
