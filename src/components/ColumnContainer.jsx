import React from 'react';
import AddressColumn from './AddressColumn';
import SymbolColumn from './SymbolColumn'

// Wrapper for Address and Symbol columns

function ColumnContainer(props){
    return(
        <div className = {["column-container", props.className].join(' ')}>
            <AddressColumn  addresses = {props.addresses}/>
            <SymbolColumn
                symbolSubArray = {props.symbols} 
                highlightedSymbols = {props.highlightStates}
                onMouseEnter={(lineIdx, symbolIdx)=>props.onMouseEnter(lineIdx, symbolIdx)}
                onMouseLeave = {()=>props.onMouseLeave()}
                onClick = {(lineIdx, symbolIdx)=>props.onClick(lineIdx, symbolIdx)}>
            </SymbolColumn>
        </div>);
}

export default ColumnContainer;