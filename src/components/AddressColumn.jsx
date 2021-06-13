import React from 'react';

// Gets an array of addresses
function AddressColumn(props){
    const addressLines = props.addresses.map((address)=>{
        return <p>0x{address.toString(16)}</p>
    })

    return (<div className="address-column">{addressLines}</div>);
}

export default AddressColumn;