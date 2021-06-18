//TODO Currently hard coding parameters.
// wordLength will depend on difficulty
// read miscSymbols and words from json
export const wordLength = 7;
export const wordSpacing= 2; // Minimum spacing between words
export const words= ["dangers", "sending", "central", "hunters", "resides", "believe", "venture", "pattern", "discard", "mention", "cutters", "canteen", "beliefs", "banning", "minigun", "cistern"];
export const miscSymbols = [',','.','!','@','#','$','%','&','(',')','{','}','[',']','<','>','?','"',"'", '/', '|'];
export const symbolsPerLine= 12;
export const linesPerColumn = 16;
export const numColumns = 2;
export const symbolArrayLength= symbolsPerLine*linesPerColumn*numColumns;
export const initialTries = 4;
