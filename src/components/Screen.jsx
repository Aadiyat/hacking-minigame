import React from 'react';

//TODO: Currently hard coding parameters.
// wordLength will depend on difficulty
// read specialChars and words from json
const gameParameters = {
    wordLength : 7,
    wordSpacing: 2, // Minimum spacing between words
    words: ["dangers", "sending", "central", "hunters", "resides", "believe", "venture", "pattern", "discard", "mention", "cutters", "canteen", "beliefs", "banning", "minigun", "cistern"],
    specialChars : [',','.','!','@','#','$','%','&','(',')','{','}','[',']','<','>','?','"',"'", '/', '|'],
    charStringLength: 408,
}

class Screen extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        };
    }

    render(){
        return (<div>Placeholder.</div>);
    }
}

export default Screen;