import React from 'react';

// Gets an array of addresses
function AddressColumn(props){
    const addressLines = props.addresses.map((address)=>{
        return <p>0x{address.toString(16).padStart(4, '0')}</p>
    })

    return (<div className="address-column">{addressLines}</div>);
}

export default AddressColumn;