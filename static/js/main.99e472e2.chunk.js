(this["webpackJsonphacking-minigame"]=this["webpackJsonphacking-minigame"]||[]).push([[0],{13:function(e,t,r){},14:function(e,t,r){},15:function(e,t,r){"use strict";r.r(t);var a=r(0),n=r.n(a),s=r(7),i=r.n(s),l=(r(13),r(14),r(1)),o=r(2),c=r(4),u=r(3),h=r(5);var m=function(e){return n.a.createElement("p",null,">",e.currentSelection)};var d=function(e){var t=e.feedbackMessages.map((function(e,t){return n.a.createElement("li",{key:t},e)}));return n.a.createElement("div",{className:"feedback-column"},n.a.createElement("div",{className:"feedback-grid"},n.a.createElement("ol",{className:"previous-selection"},t.slice(Math.max(t.length-3,0))),n.a.createElement(m,{className:"current-selection",currentSelection:e.currentSelection})))};var f=function(e){var t=Array.from({length:e.numAttempts},(function(e,t){return n.a.createElement("span",{className:"attempt-bullet"},"__")}));return n.a.createElement("p",{className:"remaining-attempts"},t)};var v=function(e){return n.a.createElement("p",{className:"remaining-attempts-text"},"Attempts remaining:")};var y=function(e){var t=e.addresses.map((function(e){return n.a.createElement("p",null,"0x",e.toString(16).padStart(4,"0"))}));return n.a.createElement("div",{className:"address-column"},t)};var g=function(e){var t=e.lineSymbols.map((function(t,r){return n.a.createElement("span",{className:e.highlightedSymbols[r],onMouseEnter:function(){return e.onMouseEnter(r)},onMouseLeave:function(){return e.onMouseLeave()},onClick:function(){return e.onClick(r)}},t)}));return n.a.createElement("p",null,t)},b=["dangers","sending","central","hunters","resides","believe","venture","pattern","discard","mention","cutters","canteen","beliefs","banning","minigun","cistern"],k=[",",".","!","@","#","$","%","&","(",")","{","}","[","]","<",">","?",'"',"'","/","|"],p=function(e){function t(){return Object(l.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this,t=Array.from({length:16},(function(t,r){return e.renderLine(r)}));return n.a.createElement("div",{className:"symbol-column"},t)}},{key:"renderLine",value:function(e){var t=this,r=this.props.symbolSubArray.slice(12*e,12*e+12),a=this.props.highlightedSymbols.slice(12*e,12*e+12);return n.a.createElement(g,{lineSymbols:r,highlightedSymbols:a,onMouseEnter:function(r){return t.props.onMouseEnter(e,r)},onMouseLeave:function(){return t.props.onMouseLeave()},onClick:function(r){return t.props.onClick(e,r)}})}}]),t}(n.a.Component);var E=function(e){return n.a.createElement("div",{className:["column-container",e.className].join(" ")},n.a.createElement(y,{addresses:e.addresses}),n.a.createElement(p,{symbolSubArray:e.symbols,highlightedSymbols:e.highlightStates,onMouseEnter:function(t,r){return e.onMouseEnter(t,r)},onMouseLeave:function(){return e.onMouseLeave()},onClick:function(t,r){return e.onClick(t,r)}}))},S=function(e){function t(e){var r;Object(l.a)(this,t);var a=(r=Object(c.a)(this,Object(u.a)(t).call(this,e))).selectWords();return r.state={words:a,password:a[0]._,symbolArray:r.fillSymbolArray(a),symbolHighlightState:Array(384).fill(""),feedbackMessages:[],isGameWon:!1,tries:4,addresses:r.generateAddresses(),usedBracketPairs:[],currentSelection:"|"},r}return Object(h.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this.renderColumns();return n.a.createElement("div",{className:"game-board"},n.a.createElement(v,null),n.a.createElement(f,{numAttempts:this.state.tries}),e,n.a.createElement(d,{feedbackMessages:this.state.feedbackMessages,currentSelection:this.state.currentSelection}))}},{key:"renderColumns",value:function(){var e=this,t=Math.floor(192),r=Array.from({length:2},(function(r,a){return e.state.symbolArray.slice(a*t,(a+1)*t)})),a=Array.from({length:2},(function(r,a){return e.state.symbolHighlightState.slice(a*t,(a+1)*t)})),s=Array.from({length:2},(function(t,r){return e.state.addresses.slice(16*r,16*(r+1))})),i=["first-column-container","second-column-container"];return Array.from({length:2},(function(t,l){return n.a.createElement(E,{className:i[l],addresses:s[l],symbols:r[l],highlightStates:a[l],onMouseEnter:function(t,r){return e.handleMouseEnter(l,t,r)},onMouseLeave:function(){return e.handleMouseLeave()},onClick:function(t,r){return e.handleClick(l,t,r)}})}))}},{key:"handleClick",value:function(e,t,r){if(this.state.tries>0&&!this.state.isGameWon){var a=this.getSymbolArrayIdx(e,t,r),s=this.isWord(a),i=(s._,s.wordIdx),l=this.isBracketPair(a),o=l.bracketStart,c=l.bracketEnd;if(-1!==i)this.checkGuess(this.state.words[i]._);else if(-1!==o){var u=this.state.usedBracketPairs.slice();u.push(a),this.setState({usedBracketPairs:u}),this.giveReward(this.state.symbolArray.slice(o,c))}else this.pushFeedbackMessage(n.a.createElement("div",null,n.a.createElement("p",null,">",this.state.symbolArray[a]),n.a.createElement("p",null,"> Error")))}}},{key:"handleMouseEnter",value:function(e,t,r){var a=this;this.state.tries>0&&!this.state.isGameWon&&this.setState({symbolHighlightState:Array(384).fill("symbol")},(function(){var n=a.getSymbolArrayIdx(e,t,r),s=a.state.symbolHighlightState.slice(),i=a.isWord(n),l=i.wordStartIdx,o=i.wordIdx,c=a.isBracketPair(n),u=c.bracketStart,h=c.bracketEnd,m=[];if(-1!==o){m=a.state.symbolArray.slice(l,l+7);for(var d=l;d<l+7;d++)s[d]="highlighted-symbol"}else if(-1!==u){m=a.state.symbolArray.slice(u,h);for(var f=u;f<h;f++)s[f]="highlighted-symbol"}else m=a.state.symbolArray.slice(n,n+1),s[n]="highlighted-symbol";a.setState({symbolHighlightState:s,currentSelection:m})}))}},{key:"handleMouseLeave",value:function(){var e=Array(384).fill("");this.setState({symbolHighlightState:e,currentSelection:"|"})}},{key:"decreaseTries",value:function(){var e=this.state.tries-1;this.setState({tries:e})}},{key:"resetTries",value:function(){this.setState({tries:4})}},{key:"removeDud",value:function(){var e=this,t=[],r=this.state.words.slice();r.forEach((function(r,a){r._!==e.state.password&&t.push(a)}));var a=t[Math.floor(Math.random()*t.length)];r.splice(a,1);for(var n=this.state.words[a].startIndex,s=this.state.symbolArray.slice(),i=n;i<n+7;i++)s[i]=".";this.setState({symbolArray:s,words:r})}},{key:"pushFeedbackMessage",value:function(e){var t=this.state.feedbackMessages.slice();t.push(e),this.setState({feedbackMessages:t})}},{key:"checkGameWon",value:function(e){var t=7===e;return this.setState({isGameWon:t}),t}},{key:"selectWords",value:function(){var e=b.slice();this.shuffle(e);var t=(e=e.slice(0,10)).map((function(e){return{_:e,startIndex:null}})),r=this.generateWordStartIndices();return t.forEach((function(e,t){return e.startIndex=r[t]})),t}},{key:"generateWordStartIndices",value:function(){var e=Array(10),t=0,r=[];for(r.push({start:0,end:377});t<10;){var a=r.shift();if(a.end-a.start>7){var n=Math.floor(a.start+Math.random()*(a.end-a.start));e[t++]=n,r.push({start:a.start,end:n-7}),r.push({start:n+7+1,end:a.end})}}return e}},{key:"fillSymbolArray",value:function(e){for(var t,r,a,n=Array(384).fill(null),s=0;s<e.length;s++){r=(t=e[s]).startIndex,a=t._.split("");for(var i=0;i<7;i++)n[r+i]=a[i]}for(var l=0;l<384;l++)null==n[l]&&(n[l]=k[Math.floor(Math.random()*k.length)]);return n}},{key:"generateAddresses",value:function(){for(var e=Array(32),t=this.generateStartingAddress(),r=0;r<e.length;r++)e[r]=t+8*r;return e}},{key:"generateStartingAddress",value:function(){var e=Math.ceil(65287*Math.random());return e-=e%8}},{key:"getSymbolArrayIdx",value:function(e,t,r){return Math.floor(192)*e+12*t+r}},{key:"isWord",value:function(e){var t=-1,r=-1;return this.state.words.forEach((function(a,n){e>=a.startIndex&&e<a.startIndex+7&&(t=a.startIndex,r=n)})),{wordStartIdx:t,wordIdx:r}}},{key:"isBracketPair",value:function(e){if(-1===this.state.usedBracketPairs.indexOf(e)){var t=e+(12-e%12),r=["<","(","{","["].indexOf(this.state.symbolArray[e]);if(-1!==r&&t>e){var a=[">",")","}","]"][r],n=this.state.symbolArray.slice(e,t).indexOf(a);if(-1!==n)return{bracketStart:e,bracketEnd:e+n+1}}}return{bracketStart:-1,bracketEnd:-1}}},{key:"giveReward",value:function(e){var t;Math.random()<.25?(t="Tries Reset.",this.resetTries()):(t="Dud Removed.",this.removeDud());var r=n.a.createElement("div",null,n.a.createElement("p",null,">",e),n.a.createElement("p",null,">",t));this.pushFeedbackMessage(r)}},{key:"checkGuess",value:function(e){var t,r=this.compareWithPassword(e),a=this.checkGameWon(r);this.decreaseTries(),t=a?"Entry Granted":"Entry Denied",this.pushFeedbackMessage(n.a.createElement("div",null,n.a.createElement("p",null,">",e),n.a.createElement("p",null,">",t),n.a.createElement("p",null,">Likeness = ",r)))}},{key:"compareWithPassword",value:function(e){var t=e.split(""),r=this.state.password.split(""),a=0;return r.forEach((function(e,r){e===t[r]&&a++})),a}},{key:"shuffle",value:function(e){for(var t,r,a=e.length;0!==a;)r=Math.floor(Math.random()*a),t=e[a-=1],e[a]=e[r],e[r]=t}}]),t}(n.a.Component);var M=function(){return n.a.createElement("div",{className:"welcome-message"},n.a.createElement("p",null,"Welcome to ROBCO Industries (TM) TermLink"),n.a.createElement("p",null,"Password Required"))};var A=function(){return n.a.createElement("div",{className:"App"},n.a.createElement(M,null),n.a.createElement(S,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(n.a.createElement(A,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},8:function(e,t,r){e.exports=r(15)}},[[8,1,2]]]);
//# sourceMappingURL=main.99e472e2.chunk.js.map