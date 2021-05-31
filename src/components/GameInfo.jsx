import React from 'react'

function GameInfo(props){
    return (<div>
                <p>Tries left: {props.tries}</p>
            </div>)
}

export default GameInfo;