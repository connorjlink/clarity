var Ts=Object.defineProperty;var en=e=>{throw TypeError(e)};var Rs=(e,n,t)=>n in e?Ts(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var h=(e,n,t)=>Rs(e,typeof n!="symbol"?n+"":n,t),xt=(e,n,t)=>n.has(e)||en("Cannot "+t);var v=(e,n,t)=>(xt(e,n,"read from private field"),t?t.call(e):n.get(e)),A=(e,n,t)=>n.has(e)?en("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(e):n.set(e,t),D=(e,n,t,s)=>(xt(e,n,"write to private field"),s?s.call(e,t):n.set(e,t),t),Be=(e,n,t)=>(xt(e,n,"access private method"),t);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const Ls=`
    .console {
        background: var(--dark-background-e);;
        color: #e0e0e0;
        max-height: 150px;
        overflow-y: auto;
        z-index: 1000;
        padding: 0.5rem 1rem;
        box-shadow: 0 -2px 8px rgba(0,0,0,0.3);
        pointer-events: auto;
        display: block;
        transition: opacity 0.3s ease-in-out;
        opacity: 1;
    }
        .console.fade-out {
            opacity: 0;
            display: none;
            pointer-events: none;
        }

    .console-line {
        white-space: pre-wrap;
        word-break: break-all;
    }
`,$n=new CSSStyleSheet;$n.replaceSync(Ls);class Ms extends HTMLElement{constructor(){super();h(this,"_messages",[]);h(this,"_visible",!0);h(this,"_endRef",null);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[$n]}static get observedAttributes(){return["visible"]}get messages(){return this._messages}set messages(t){this._messages=t,this.render(),this.scrollToEnd()}get visible(){return this._visible}set visible(t){this._visible=t,this.render()}scrollToEnd(){this._endRef&&this._endRef.scrollIntoView({behavior:"smooth"})}connectedCallback(){this.render()}attributeChangedCallback(t,s,r){t==="visible"&&(this.visible=r!=="false")}render(){this.shadowRoot.innerHTML=`
            <div class="console ${this.visible?"":"fade-out"}">
                ${this._messages.map(t=>`<div class="console-line">${t.text}</div>`).join("")}
                <div id="end"></div>
            </div>
        `,this._endRef=this.shadowRoot.querySelector("#end"),this.scrollToEnd()}}customElements.define("output-window",Ms);class Is{constructor(n){h(this,"original");h(this,"addBuffer");h(this,"pieces");this.original=n,this.addBuffer="",this.pieces=[{buffer:"original",start:0,length:n.length}]}insert(n,t){if(t.length===0)return;const s=this.addBuffer.length;this.addBuffer+=t;let r=0,i=0;for(;i<this.pieces.length;i++){const c=this.pieces[i];if(r+c.length>=n)break;r+=c.length}if(i===this.pieces.length){this.pieces.push({buffer:"add",start:s,length:t.length});return}const o=this.pieces[i],a=n-r,l=[];a>0&&l.push({buffer:o.buffer,start:o.start,length:a}),l.push({buffer:"add",start:s,length:t.length}),a<o.length&&l.push({buffer:o.buffer,start:o.start+a,length:o.length-a}),this.pieces.splice(i,1,...l)}delete(n,t){let s=0,r=0;for(;r<this.pieces.length&&s+this.pieces[r].length<=n;)s+=this.pieces[r].length,r++;const i=r,o=n-s;let a=t;const l=[];for(;a>0&&r<this.pieces.length;){const c=this.pieces[r],d=r===i?o:0,u=c.length-d;Math.max(0,c.length-u),d>0&&l.push({buffer:c.buffer,start:c.start,length:d}),u<c.length&&l.push({buffer:c.buffer,start:c.start+d+a,length:c.length-(d+a)}),a-=u,r++}this.pieces.splice(i,r-i,...l)}getText(){let n="";for(const t of this.pieces){const s=t.buffer==="original"?this.original:this.addBuffer;n+=s.substr(t.start,t.length)}return n}}var tn;(e=>{e.Error=1,e.Warning=2,e.Info=3,e.Log=4,e.Debug=5})(tn||(tn={}));var nn;(e=>{e.File=1,e.Module=2,e.Namespace=3,e.Package=4,e.Class=5,e.Method=6,e.Property=7,e.Field=8,e.Constructor=9,e.Enum=10,e.Interface=11,e.Function=12,e.Variable=13,e.Constant=14,e.String=15,e.Number=16,e.Boolean=17,e.Array=18,e.Object=19,e.Key=20,e.Null=21,e.EnumMember=22,e.Struct=23,e.Event=24,e.Operator=25,e.TypeParameter=26})(nn||(nn={}));var sn;(e=>{e.None=0,e.Full=1,e.Incremental=2})(sn||(sn={}));var rn;(e=>{e.Text=1,e.Read=2,e.Write=3})(rn||(rn={}));var on;(e=>{e.Error=1,e.Warning=2,e.Information=3,e.Hint=4})(on||(on={}));var an;(e=>{e.Text=1,e.Method=2,e.Function=3,e.Constructor=4,e.Field=5,e.Variable=6,e.Class=7,e.Interface=8,e.Module=9,e.Property=10,e.Unit=11,e.Value=12,e.Enum=13,e.Keyword=14,e.Snippet=15,e.Color=16,e.File=17,e.Reference=18,e.Folder=19,e.EnumMember=20,e.Constant=21,e.Struct=22,e.Event=23,e.Operator=24,e.TypeParameter=25})(an||(an={}));const As=`
    source-editor {
        width: 100%;
        background: var(--dark-background-d);
        padding: 1rem;
        padding-left: 1rem;
        outline: none;
        display: flex;
        flex-direction: column;
        transition: border-color 100ms ease-in-out;
        overflow:auto;    
    }
        source-editor:focus {
            border-top-color: var(--accent);
        }
        source-editor pre {
            counter-reset: line;
        }
        source-editor code {
            display: flex;
            flex-direction: row; 
            counter-increment: line;
        }
        source-editor code:before {
            content: counter(line);
            padding-right: 1.5rem;
            color: var(--plain-text);
            width: 2rem;
            text-align: right;
        }

    .editor-shell {
        position: relative;
        font-family: Consolas;
        height: 300px;
        * {
            font-size: 14pt;
        }
    }
    .highlight-layer, .input-layer {
        white-space: pre-wrap;
        word-break: break-word;
        padding: 8px;
        line-height: 1.5;
        height: 100%;
        min-height: 100%;
        box-sizing: border-box;
    }
    .highlight-layer {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        pointer-events: none;
        z-index: 1;
        color: #ccc;
        margin: 0;
        padding: 0;
    }
    .input-layer {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        margin: 0 0 0 2rem;
        padding: 0;
        background: transparent;
        caret-color: var(--accent);
        z-index: 2;
        outline: none;
        user-select: none;
    }
`,Tn=new CSSStyleSheet;Tn.replaceSync(As);function St(e){let n="";return e.childNodes.forEach((t,s,r)=>{t.nodeType===Node.TEXT_NODE?n+=t.data:t.tagName==="BR"?n+=`
`:t.tagName==="DIV"?(n+=St(t),s<r.length-1&&(n+=`
`)):t.nodeType===Node.ELEMENT_NODE&&(n+=St(t))}),n}function Ns(e){let n=0;const t=window.getSelection();if(t&&t.rangeCount>0){const s=t.getRangeAt(0),r=s.cloneRange();r.selectNodeContents(e),r.setEnd(s.endContainer,s.endOffset),n=r.toString().length}return n}function Os(e,n){const t=window.getSelection();if(!t)return;let s=0,r=[e],i,o=!1;for(;r.length&&!o&&(i=r.pop(),!!i);)if(i.nodeType===Node.TEXT_NODE){const a=i.length;if(s+a>=n){const l=document.createRange();l.setStart(i,n-s),l.collapse(!0),t.removeAllRanges(),t.addRange(l),o=!0}else s+=a}else{let a=Array.from(i.childNodes);for(let l=a.length-1;l>=0;l--)r.push(a[l])}}class Ps extends HTMLElement{constructor(){super();h(this,"_pieceTable");h(this,"_consoleListener",null);h(this,"_inputRef",null);h(this,"_highlightRef",null);h(this,"_sourceUri","");h(this,"_lastText","");h(this,"_client",null);h(this,"_hasInitialized",!1);h(this,"_boundInputCallback",this.inputCallback.bind(this));h(this,"_boundScrollCallback",this.scrollCallback.bind(this));h(this,"_boundKeydownCallback",this.keydownCallback.bind(this));this._pieceTable=new Is("function nvr main = () {}"),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Tn]}connectedCallback(){}disconnectedCallback(){var t;(t=this._client)==null||t.postMessage({type:"execute",method:"closeDocument",params:{uri:this._sourceUri}})}initialize(t,s,r){var i;this._hasInitialized=!0,this._consoleListener||(this._consoleListener=s),r&&(this._client=r,this._client.addEventListener("message",o=>{var a,l,c;o.data.type==="log"?(a=this._consoleListener)==null||a.notify(o.data.message):o.data.type==="error"?(l=this._consoleListener)==null||l.notify(o.data.message):o.data.type==="compileResult"&&((c=this._consoleListener)==null||c.notify(JSON.stringify(o.data.result)))}),this._client.addEventListener("messageerror",o=>{var a;(a=this._consoleListener)==null||a.notify(o.data)}),this._sourceUri=t),(i=this._client)==null||i.postMessage({type:"execute",method:"openDocument",params:{uri:this._sourceUri,sourceCode:this._pieceTable.getText()}}),this.render()}inputCallback(t){this.handleInputChange(t)}scrollCallback(t){this.syncScroll()}keydownCallback(t){this.handleKeyDown(t)}attachEventListeners(){var t,s,r;(t=this._inputRef)==null||t.addEventListener("input",this._boundInputCallback),(s=this._inputRef)==null||s.addEventListener("scroll",this._boundScrollCallback),(r=this._inputRef)==null||r.addEventListener("keydown",this._boundKeydownCallback)}detachEventListeners(){var t,s,r;(t=this._inputRef)==null||t.removeEventListener("input",this._boundInputCallback),(s=this._inputRef)==null||s.removeEventListener("scroll",this._boundScrollCallback),(r=this._inputRef)==null||r.removeEventListener("keydown",this._boundKeydownCallback)}handleInputChange(t){if(!this._inputRef)return;const s=St(this._inputRef),r=Ns(this._inputRef);let i=0;for(;i<this._lastText.length&&i<s.length&&this._lastText[i]===s[i];)i++;let o=this._lastText.length-1,a=s.length-1;for(;o>=i&&a>=i&&this._lastText[o]===s[a];)o--,a--;o>=i&&this._pieceTable.delete(i,o-i+1),a>=i&&this._pieceTable.insert(i,s.slice(i,a+1)),this._lastText=s,this.renderHighlight([]),Os(this._inputRef,r)}handleKeyDown(t){t.key==="Tab"&&(t.preventDefault(),document.execCommand("insertText",!1,"    ")),t.key==="Enter"&&(t.preventDefault(),document.execCommand("insertLineBreak"))}renderHighlight(t){var s;this._highlightRef&&(this._pieceTable.getText(),(s=this._client)==null||s.postMessage({type:"execute",method:"recycle",params:{uri:this._sourceUri,deltas:t}}))}syncScroll(){this._inputRef&&this._highlightRef&&(this._highlightRef.scrollTop=this._inputRef.scrollTop,this._highlightRef.scrollLeft=this._inputRef.scrollLeft)}render(){if(!this._hasInitialized)throw new Error("call initialize() on SourceEditorElement before rendering.");const t=this._pieceTable.getText();this.shadowRoot.innerHTML=`
            <div class="editor-shell">
                <pre class="highlight-layer"></pre>
                <div class="input-layer" contenteditable="true" spellcheck="false"></div>
            </div>
        `,this._highlightRef=this.shadowRoot.querySelector(".highlight-layer"),this._inputRef=this.shadowRoot.querySelector(".input-layer"),this._inputRef&&(this._inputRef.textContent=t,this._lastText=t),this.attachEventListeners(),this.renderHighlight([])}}customElements.define("source-editor",Ps);const Ds=`
    :host *, :host *::after, :host *::before {
        box-sizing: border-box;
    }

    .hex-shell {
        color: var(--light-foreground);
        padding: 1rem;
        overflow: auto;
        height: 100%;
        width: 100%;
    }

    .hex-table {
        font-family: var(--global-font);
        border-collapse: collapse;
        width: 100%;
    }
        .hex-table th,
        .hex-table td {
            text-align: center;
            vertical-align: middle;
        }
        .hex-table th {
            color: var(--dark-foreground-l);
        }

    .header-spacer-row {
        height: 0.5rem;
    }

    .hex-offset {
        font-weight: normal;
    }
        th.hex-offset {
            color: var(--accent);
        }

    .hex-address {
        font-weight: bold;
        color: var(--light-foreground-l);
        padding-right: 1rem;
    }

    .hex-byte {
        width: fit-content;
    }
    
    .hex-ascii {
        color: var(--secondary);
        padding-left: 1rem;
    }

    .hex-highlight-layer {
        margin: 0;
    }
`,Rn=new CSSStyleSheet;Rn.replaceSync(Ds);class qs extends HTMLElement{constructor(){super();h(this,"_data",new Uint8Array);h(this,"_columns",16);h(this,"_highlightRef",null);h(this,"_client",null);h(this,"_symbols",[]);h(this,"_sourceUri","");h(this,"_hasInitialized",!1);h(this,"_resizeObserver",null);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Rn]}connectedCallback(){const t=this.parentElement??this;this._resizeObserver=new ResizeObserver(()=>this._onResize()),this._resizeObserver.observe(t)}disconnectedCallback(){var t,s;(t=this._resizeObserver)==null||t.disconnect(),(s=this._client)==null||s.postMessage({type:"execute",method:"closeDocument",params:{uri:this._sourceUri}})}initialize(t,s,r=16,i=null){var o,a;this._hasInitialized=!0,this._client=i,this._sourceUri=t,this._data=s,this._columns=r,(o=this._client)==null||o.addEventListener("message",l=>{l.data.type==="symbolInfo"&&l.data.uri===this._sourceUri&&(this._symbols=l.data.symbols,this.render())}),(a=this._client)==null||a.postMessage({type:"execute",method:"openDocument",params:{uri:this._sourceUri,sourceCode:Array.from(this._data).map(l=>l.toString(16).padStart(2,"0")).join(" ")}}),this.render()}setColumns(t){t!==this._columns&&(this._columns=t,this.render())}_onResize(){const t=parseInt(getComputedStyle(this.shadowRoot.host).fontSize.replace("px","")),s=t*8,r=this._columns*8,i=t*2,o=this.getBoundingClientRect().width-s-r-i,a=Math.max(1,o/24);Math.abs(a-this._columns)>.5&&this.setColumns(Math.floor(a))}getSymbolAt(t){for(const s of this._symbols)if(t>=s.address&&t<s.address+s.length)return s;return null}render(){if(!this._hasInitialized)throw new Error("call initialize() on HexViewerElement before rendering.");this.shadowRoot.innerHTML=`
            <div class="hex-shell">
                <pre class="hex-highlight-layer"></pre>
            </div>
        `,this._highlightRef=this.shadowRoot.querySelector(".hex-highlight-layer"),this._highlightRef&&(this._highlightRef.innerHTML=this.renderHex())}renderHex(){let t='<table class="hex-table"><thead>';t+="<tr>",t+='<th class="hex-address">Address</th>',t+='<th colspan="'+this._columns+'">Offset</th>',t+='<th class="hex-ascii">ASCII</th>',t+="</tr>",t+='<tr class="header-spacer-row"></tr>',t+='<tr class="hex-offset-row">',t+="<th></th>";for(let s=0;s<this._columns;s++)t+=`<th class="hex-offset">+${s.toString(16).toUpperCase()}</th>`;t+="<th></th>",t+="</tr>",t+='<tr class="header-spacer-row"></tr>',t+="</thead><tbody>";for(let s=0;s<Math.ceil(this._data.length/this._columns);s++){const r=s*this._columns;t+="<tr>",t+=`<td class="hex-address">${r.toString(16).padStart(8,"0")}</td>`;for(let i=0;i<this._columns;i++){const o=r+i;if(o<this._data.length){const a=this.getSymbolAt(o),l=a?a.color:"#ccc",c=this._data[o].toString(16).padStart(2,"0");t+=`<td class="hex-byte" style="color:${l}">${c}</td>`}else t+="<td></td>"}t+='<td class="hex-ascii">';for(let i=0;i<this._columns;i++){const o=r+i;if(o<this._data.length){const a=this._data[o];t+=a>=32&&a<=126?String.fromCharCode(a):"."}else t+=" "}t+="</td>",t+="</tr>"}return t+="</tbody></table>",t}}customElements.define("hex-viewer",qs);class zs{constructor(n=[],t=[]){h(this,"nodes",new Map);h(this,"connections",new Map);n.forEach(s=>this.nodes.set(s.id,s)),t.forEach(s=>this.connect(s.from,s.to))}static connectionKey(n,t){return[n.nodeId,n.clickspotId,t.nodeId,t.clickspotId].sort().join("|")}getNodes(){return Array.from(this.nodes.values())}getAllConnections(){return Array.from(this.connections.values()).flatMap(n=>Array.from(n))}getConnections(n){const t=new Set;for(const s of this.connections.values())for(const r of s)(r.from.nodeId===n||r.to.nodeId===n)&&t.add(r);return t}addNode(n){this.nodes.set(n.id,n)}removeNode(n){this.nodes.delete(n);for(const[t,s]of Array.from(this.connections.entries()))for(const r of s)(r.from.nodeId===t||r.to.nodeId===t)&&s.delete(r),s.size===0&&this.connections.delete(t)}updateNodePosition(n,t){const s=this.nodes.get(n);s&&(s.position=t)}setParent(n,t){const s=this.nodes.get(n);s&&(s.parentId=t)}connect(n,t){var a,l;if(n.nodeId===t.nodeId)return;let s=this.connections.get(n.nodeId);s||(s=new Set,this.connections.set(n.nodeId,s)),s.add({from:n,to:t});const r=document.querySelector("program-tree");r&&(r.setNodeConnected(n.nodeId,n.clickspotId,!0),r.setNodeConnected(t.nodeId,t.clickspotId,!0));var i=(a=this.nodes.get(n.nodeId))==null?void 0:a.clickspots.find(c=>c.id===n.clickspotId);i&&(i.isConnected=!0);var o=(l=this.nodes.get(t.nodeId))==null?void 0:l.clickspots.find(c=>c.id===t.clickspotId);o&&(o.isConnected=!0)}disconnect(n){var r,i;for(const[o,a]of this.connections.entries())for(const l of a)if(l.from.nodeId===n.nodeId&&l.from.clickspotId===n.clickspotId||l.to.nodeId===n.nodeId&&l.to.clickspotId===n.clickspotId){const c=document.querySelector("program-tree");c&&(c.setNodeConnected(l.from.nodeId,l.from.clickspotId,!1),c.setNodeConnected(l.to.nodeId,l.to.clickspotId,!1));var t=(r=this.nodes.get(l.from.nodeId))==null?void 0:r.clickspots.find(d=>d.id===l.from.clickspotId);t&&(t.isConnected=!1);var s=(i=this.nodes.get(l.to.nodeId))==null?void 0:i.clickspots.find(d=>d.id===l.to.clickspotId);s&&(s.isConnected=!1),a.delete(l),a.size===0&&this.connections.delete(o);break}}load(n,t){this.nodes.clear(),this.connections.clear(),n.forEach(s=>this.nodes.set(s.id,s)),t.forEach(s=>this.connect(s.from,s.to))}}const Hs=`
    .node {
        margin: 1rem;
        height: 100px;
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        -webkit-user-select: none;
        user-select: none;
        background: none;
        border-radius: var(--corner-radius);
        will-change: transform;
    }

    .node-header {
        font-size: 8pt;
        width: 100%;
        border-radius: var(--corner-radius) var(--corner-radius) 0 0;
        border: 1px solid var(--node-border);
        background: var(--keyword);
        display: flex;
        flex-direction: row;
        align-items: center;
    }
        .node-header .node-icon {
            height: 15px;
            padding: 0 1px;
        }

    .node-body {
        border-radius: 0 0 var(--corner-radius) var(--corner-radius);
        border: 1px solid var(--node-border);
        border-top: none;
        background: var(--dark-background-e);
        flex: 1;
        width: 100%;
    }

    .node-clickspot-container {
        position: absolute;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
        .node-clickspot-container.left {
            left: 0;
            top: 0;
            transform: translateX(-50%);
        }
        .node-clickspot-container.right {
            right: 0;
            top: 0;
            transform: translateX(50%);
        }
        .node-clickspot-container.bottom {
            height: initial;
            width: 100%;
            flex-direction: row;
            bottom: 0;
            left: 0;
            transform: translateY(50%);
        }

    .node-clickspot {
        aspect-ratio: 1 / 1;
        width: var(--clickspot-width);
        background: var(--light-background-d);
        border: dashed 1px var(--light-background-ll);
        border-radius: 50%;
    }
        .node-clickspot.connected {
            background: var(--accent);
            border-color: var(--accent-hovered);
        }
        .node-clickspot:hover {
            background: var(--light-background);
        }
        .node-clickspot.connected:hover {
            background: var(--accent-hovered);
        }
`,Ln=new CSSStyleSheet;Ln.replaceSync(Hs);class Ws extends HTMLElement{constructor(){super();h(this,"onMove");h(this,"onConnectStart");h(this,"onConnectEnd");h(this,"onDisconnect");h(this,"onTempLine");h(this,"isClickspotConnected");h(this,"screenToWorld");h(this,"worldToScreen");h(this,"_areCallbacksSet",!1);h(this,"_contentRef");h(this,"_nodeId","");h(this,"_position",{x:0,y:0});h(this,"_clickspots",[]);h(this,"_isDragging",!1);h(this,"_dragOffset",{x:0,y:0});this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Ln]}static get observedAttributes(){return["id","x","y"]}setCallbacks(t){Object.assign(this,t),this._areCallbacksSet=!0}connectedCallback(){this.render()}attributeChangedCallback(t,s,r){t==="node-id"&&r&&(this._nodeId=r),this.render()}set data(t){this._nodeId=t.nodeId,this._position=t.position,this._clickspots=t.clickspots,this._isDragging=!1,this._dragOffset={x:0,y:0},this.render()}elementFromPoint(t,s){const r=this.shadowRoot.elementFromPoint(t,s);return r||null}clickspotFromId(t){return this.shadowRoot.querySelector(`#${t}`)}getBoundingClientRect(){const t=this.shadowRoot.querySelector(`#${this._nodeId}`);return t?t.getBoundingClientRect():new DOMRect(0,0,0,0)}getRealNode(){return this.shadowRoot.querySelector(`#${this._nodeId}`)}updateTransform(t){this._position=t,this._contentRef&&(this._contentRef.style.transform=`translate3d(${this._position.x}px, ${this._position.y}px, 0)`)}setConnected(t,s){const r=this.clickspotFromId(t);r&&r.classList.toggle("connected",s)}attachEventListeners(){var t,s;(t=this.shadowRoot.querySelector(".node-header"))==null||t.addEventListener("mousedown",r=>{this.startNodeDrag(r)}),(s=this.shadowRoot.querySelectorAll(".node-clickspot"))==null||s.forEach(r=>{r.addEventListener("mousedown",i=>{this.handleClickspotMouseDown(r.getAttribute("id"),i)})})}getLocationByClassList(t){return t.contains("left")?"left":t.contains("right")?"right":t.contains("bottom")?"bottom":null}startNodeDrag(t){if(t.button!==0)return;this._isDragging=!0;const s=this.screenToWorld({x:t.clientX,y:t.clientY});this._dragOffset={x:s.x-this._position.x,y:s.y-this._position.y};const r=o=>{var l;if(!this._isDragging)return;const a=this.screenToWorld({x:o.clientX,y:o.clientY});(l=this.onMove)==null||l.call(this,{x:a.x-this._dragOffset.x,y:a.y-this._dragOffset.y})},i=()=>{this._isDragging=!1,document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",i)};document.addEventListener("mousemove",r),document.addEventListener("mouseup",i)}handleClickspotMouseDown(t,s){if(s.button===0)if(this.isClickspotConnected({nodeId:this._nodeId,clickspotId:t,location:null}))this.onDisconnect({nodeId:this._nodeId,clickspotId:t,location:null});else{const r=s.target.closest(".node-clickspot");if(!r){this.onTempLine(null);return}this._isDragging=!0;const i=r.getBoundingClientRect(),o={x:i.left+i.width/2,y:i.top+i.height/2},a=this.screenToWorld(o),l=s.target.closest(".node");if(!l){this.onTempLine(null);return}const c=l.getAttribute("id");if(!c){this.onTempLine(null);return}const d=r.closest(".node-clickspot-container");if(!d){this.onTempLine(null);return}const u=this.getLocationByClassList(d.classList);this.onConnectStart({nodeId:c,clickspotId:t,location:u});const f=g=>{if(!this._isDragging){this.onTempLine(null);return}const _={x:g.clientX,y:g.clientY},m=this.screenToWorld(_);this.onTempLine([{start:{x:a.x,y:a.y},end:{x:m.x,y:m.y}},u])},p=g=>{this._isDragging=!1,document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",p);const _={x:g.clientX,y:g.clientY},m=Array.from(this.parentElement.querySelectorAll("tree-node"));let E=null,x=null;for(const Se of m){const $e=Se.getBoundingClientRect();if(_.x>=$e.left&&_.x<=$e.right&&_.y>=$e.top&&_.y<=$e.bottom){const re=Se.elementFromPoint(_.x,_.y);if(re&&re.classList.contains("node-clickspot")&&!re.classList.contains("connected")){E=Se.getRealNode(),x=re;break}}}if(!E){this.onTempLine(null);return}if(!x||!x.classList.contains("node-clickspot")||x.classList.contains("connected")){this.onTempLine(null);return}const b=x.getAttribute("id"),S=E.getAttribute("id");if(!b||!S){this.onTempLine(null);return}const se=x.closest(".node-clickspot-container");if(!se){this.onTempLine(null);return}const bt=this.getLocationByClassList(se.classList);S&&S!==c&&this.onConnectEnd({nodeId:c,clickspotId:t,location:u},{nodeId:S,clickspotId:b,location:bt}),this.onTempLine(null)};document.addEventListener("mousemove",f),document.addEventListener("mouseup",p)}}render(){this.shadowRoot.innerHTML=`
            <div
                id="${this._nodeId}"
                class="node shadowed"
            >
                <div class="node-header">
                    <img src="/clarity/res/expression.svg" class="node-icon" />
                    <span>Exponentiation Expression</span>
                </div>
                <div class="node-body">
                    ${["left","bottom","right"].map(t=>`
                        <div class="node-clickspot-container ${t}">
                            ${this._clickspots.filter(s=>s.location===t).map(s=>`
                                <button
                                    class="node-clickspot"
                                    id="${s.id}"
                                    class="${s.isConnected?"connected":""}"
                                ></button>
                            `).join("")}
                        </div>
                    `).join("")}
                    <div class="node-content">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `,this._contentRef=this.shadowRoot.querySelector(`#${this._nodeId}`),this.updateTransform(this._position),this._areCallbacksSet&&this.attachEventListeners()}}customElements.define("tree-node",Ws);const Bs=`
    .wrapper {
        transform: translate(calc(-1 * var(--transform-size) / 2), calc(-1 * var(--transform-size) / 2));
    }
    .container {
        position: absolute;
        width: var(--transform-size);
        height: var(--transform-size);
        user-select: none;
        overflow: hidden;
        will-change: transform, scale, zoom;
        transform-origin: 50% 50%;
    }
`,Mn=new CSSStyleSheet;Mn.replaceSync(Bs);const Me=class Me extends HTMLElement{constructor(){super();h(this,"_container");h(this,"_scale",1);h(this,"_scaler");h(this,"_isPanning",!1);h(this,"_position",{x:0,y:0});h(this,"_lastPosition",{x:0,y:0});this.onMouseDown=this.onMouseDown.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onWheel=this.onWheel.bind(this),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Mn],this._scaler=document.querySelector(".scaler.grow")}connectedCallback(){this.render(),this.updateTransform(),this._container.addEventListener("mousedown",this.onMouseDown),this._container.addEventListener("wheel",this.onWheel,{passive:!1})}disconnectedCallback(){this._container.removeEventListener("mousedown",this.onMouseDown),this._container.removeEventListener("wheel",this.onWheel),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("mouseup",this.onMouseUp)}screenToWorld(t){return{x:(t.x-this._position.x)/this._scale,y:(t.y-this._position.y)/this._scale}}worldToScreen(t){return{x:t.x*this._scale+this._position.x,y:t.y*this._scale+this._position.y}}onMouseDown(t){let s=t.target;for(;s;){if(s.nodeName.toLowerCase()==="tree-node")return;s=s.parentElement}this._isPanning=!0,this._lastPosition={x:t.clientX-this._position.x,y:t.clientY-this._position.y},window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("mouseup",this.onMouseUp),this._container.style.cursor="grabbing"}onMouseMove(t){this._isPanning&&(this._position.x=t.clientX-this._lastPosition.x,this._position.y=t.clientY-this._lastPosition.y,this.updateTransform())}onMouseUp(){this._isPanning=!1,window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("mouseup",this.onMouseUp),this._container.style.cursor="grab",setTimeout(()=>{this._isPanning||(this._container.style.cursor="default")},1e3)}onWheel(t){t.preventDefault();const s=-t.deltaY*.001,r=Math.min(Me.maxScale,Math.max(Me.minScale,this._scale+s)),i=this.getBoundingClientRect(),o=t.clientX-i.left,a=t.clientY-i.top,l=o-this._position.x,c=a-this._position.y,d=r/this._scale;this._position.x=o-l*d,this._position.y=a-c*d,this._scale=r,this.updateTransform()}updateTransform(){this._container.style.transform=`translate(${this._position.x}px, ${this._position.y}px) scale(${this._scale})`,this._scaler.innerHTML=`${Math.floor(parseFloat(this._scale.toFixed(2))*100)}%`}render(){this.shadowRoot.innerHTML=`
            <div class="wrapper">
                <div class="container">
                    <slot name="transformed-view-slot"></slot>
                </div>
            </div>
        `,this._container=this.shadowRoot.querySelector(".container")}};h(Me,"minScale",.2),h(Me,"maxScale",3);let $t=Me;customElements.define("transformed-view",$t);const Us=`
    transformed-view {
        display: block;
        width: 100%;
        height: 100%;
    }
    #connections-canvas {
        position:absolute;
        top:0;
        left:0;
        width: var(--transform-size);
        height: var(--transform-size);
        pointer-events:none;
    }
    #transform-content {
        position: absolute;
        top: 0;
        left: 0;
        width: var(--transform-size);
        height: var(--transform-size);
        transform: translate(50%, 50%);
    }
`,In=new CSSStyleSheet;In.replaceSync(Us);class An extends HTMLElement{constructor(){super();h(this,"_nodeManager");h(this,"_transformedViewRef");h(this,"_contentRef");h(this,"_connectionsCanvas");h(this,"_canvasRef");this._nodeManager=new zs([{id:"node1",label:"Hello, 123123",position:{x:100,y:100},clickspots:[{id:"clickspot-a",location:"left"},{id:"clickspot-b",location:"right"},{id:"clickspot-e",location:"bottom"}]},{id:"node2",label:"This is a new test node",position:{x:400,y:200},clickspots:[{id:"clickspot-c",location:"left"},{id:"clickspot-d",location:"bottom"}]},{id:"node3",label:"Testing testing testing",position:{x:550,y:400},clickspots:[{id:"clickspot-f",location:"left"},{id:"clickspot-g",location:"left"}]}]),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[In]}connectedCallback(){this.render()}attributeChangedCallback(t,s,r){}setNodeConnected(t,s,r){const i=this.shadowRoot.querySelector(`tree-node[data-node-id="${t}"]`);i&&i.setConnected(s,r)}getClickspotCenter(t,s){const r=this.shadowRoot.querySelector(`tree-node[data-node-id="${t}"]`);if(!r||!this._transformedViewRef||!this._connectionsCanvas)return null;const i=r.clickspotFromId(s);if(!i)return null;const o=i.getBoundingClientRect(),a=this._connectionsCanvas.getBoundingClientRect(),l={x:o.left+o.width/2-a.left,y:o.top+o.height/2-a.top};return this._transformedViewRef.screenToWorld(l)}isClickspotConnected(t){const s=this._nodeManager.getConnections(t.nodeId);for(const r of s)if(r.from.clickspotId===t.clickspotId||r.to.clickspotId===t.clickspotId)return!0;return!1}handleConnectStart(t){}handleConnectEnd(t,s){t&&(t.nodeId!==s.nodeId||t.clickspotId!==s.clickspotId)&&(this._nodeManager.connect(t,s),this.handleTempLine(null)),this.renderLines()}handleRemoveLines(t){this._nodeManager.disconnect(t),!(!this._connectionsCanvas||!this._canvasRef)&&this.renderLines()}handleNodeMove(t,s){this._nodeManager.updateNodePosition(t,s);const r=this.shadowRoot.querySelector(`tree-node[data-node-id="${t}"]`);r&&r.updateTransform(s),this.renderLines()}clearLines(){!this._connectionsCanvas||!this._canvasRef||this._canvasRef.clearRect(0,0,this._connectionsCanvas.width,this._connectionsCanvas.height)}renderLines(){if(!this._connectionsCanvas||!this._canvasRef)return;this.clearLines();const t=this._nodeManager.getAllConnections();for(const s of t){const r=this.getClickspotCenter(s.from.nodeId,s.from.clickspotId),i=this.getClickspotCenter(s.to.nodeId,s.to.clickspotId);if(!r||!i){console.warn(`Skipping connection from ${s.from.nodeId} to ${s.to.nodeId} due to missing clickspot centers.`);continue}if(!s.from.location||!s.to.location){console.warn(`Skipping connection from ${s.from.nodeId} to ${s.to.nodeId} due to missing locations.`);continue}this.drawBezierPath(r,i,s.from.location,s.to.location,"rgb(143, 132, 213)",2,!1)}}handleTempLine(t){if(this.renderLines(),!t||!this._canvasRef)return;const{start:s,end:r}=t[0],i=t[1];this.drawBezierPath(s,r,i,null,"rgb(171, 167, 200)",2,!0)}getBezierPath(t,s,r){var p;const{start:i,end:o}=t,a=100;if(this._transformedViewRef){const g=(p=this._transformedViewRef)==null?void 0:p.getBoundingClientRect();i.x-=(g==null?void 0:g.left)||0,i.y-=(g==null?void 0:g.top)||0,o.x-=(g==null?void 0:g.left)||0,o.y-=(g==null?void 0:g.top)||0}let l=r;if(!r&&s){const g=o.x-i.x,_=o.y-i.y,m=Math.atan2(_,g)*180/Math.PI;s==="left"?m>-45&&m<45?l="left":m>=45&&m<=135?l="bottom":l=null:s==="right"?m>135||m<-135?l="right":m>=-135&&m<=-45?l="bottom":l=null:s==="bottom"&&(m>135||m<-135?l="right":m>-45&&m<45?l="left":m>=45&&m<=135&&(l="bottom"))}let c=i.x,d=i.y;s==="left"?c-=a:s==="right"?c+=a:s==="bottom"&&(d+=a);let u=o.x,f=o.y;return l==="left"?u-=a:l==="right"?u+=a:l==="bottom"&&(f+=a),[i.x,i.y,c,d,u,f,o.x,o.y]}drawBezierPath(t,s,r,i,o,a,l){if(!this._canvasRef||!this._transformedViewRef)return;const c=this._transformedViewRef.worldToScreen(t),d=this._transformedViewRef.worldToScreen(s),[u,f,p,g,_,m,E,x]=this.getBezierPath({start:t,end:s},r,i),b=this._transformedViewRef.worldToScreen({x:p,y:g}),S=this._transformedViewRef.worldToScreen({x:_,y:m});this._canvasRef.save(),this._canvasRef.beginPath(),l?this._canvasRef.setLineDash([4,4]):this._canvasRef.setLineDash([]),this._canvasRef.moveTo(c.x,c.y),this._canvasRef.bezierCurveTo(b.x,b.y,S.x,S.y,d.x,d.y),this._canvasRef.strokeStyle=o,this._canvasRef.lineWidth=a,this._canvasRef.stroke(),this._canvasRef.restore()}resizeCanvas(){if(!this._connectionsCanvas)return;const t=this._connectionsCanvas.parentElement;if(t){const s=t.getBoundingClientRect();this._connectionsCanvas.width=s.width,this._connectionsCanvas.height=s.height}}renderNodes(){if(!this._contentRef)return;const t=new Map;this._contentRef.querySelectorAll("tree-node").forEach(r=>{const i=r.getAttribute("id");i&&t.set(i,r)});const s=new Set;for(const r of this._nodeManager.getNodes()){s.add(r.id);let i=t.get(r.id);i||(i=document.createElement("tree-node"),i.data={nodeId:r.id,position:r.position,clickspots:r.clickspots},i.setCallbacks({onMove:a=>this.handleNodeMove(r.id,a),onConnectStart:a=>this.handleConnectStart(a),onConnectEnd:(a,l)=>this.handleConnectEnd(a,l),onDisconnect:a=>this.handleRemoveLines(a),onTempLine:a=>this.handleTempLine(a),isClickspotConnected:a=>this.isClickspotConnected(a),screenToWorld:a=>{var l;return((l=this._transformedViewRef)==null?void 0:l.screenToWorld(a))??a},worldToScreen:a=>{var l;return((l=this._transformedViewRef)==null?void 0:l.worldToScreen(a))??a}}),i.setAttribute("data-node-id",r.id),this._contentRef.appendChild(i));const o=i.querySelector(".node-content");o&&(o.textContent=r.label)}t.forEach((r,i)=>{s.has(i)||r.remove()})}render(){this.shadowRoot.innerHTML=`
            <transformed-view id="program-tree-transformed-view">
                <div id="transform-content" slot="transformed-view-slot">
                    <canvas id="connections-canvas"></canvas>
                </div>
            </transformed-view>
        `,this._transformedViewRef=this.shadowRoot.querySelector("#program-tree-transformed-view"),this._contentRef=this._transformedViewRef.querySelector("#transform-content"),this._connectionsCanvas=this._contentRef.querySelector("#connections-canvas"),this._canvasRef=this._connectionsCanvas.getContext("2d"),window.addEventListener("resize",()=>{this.resizeCanvas(),this.renderLines()}),this.resizeCanvas(),this.renderLines(),this.renderNodes()}}h(An,"observedAttributes",[]);customElements.define("program-tree",An);class Fs extends HTMLElement{constructor(){super(...arguments);h(this,"tabsContent");h(this,"pages",[])}connectedCallback(){this.render(),window.addEventListener("popstate",s=>{var i;const r=((i=s.state)==null?void 0:i.tab)??this.getTabIndexFromUrl();typeof r=="number"&&r>=0&&r<this.pages.length&&this.activatePage(r,!1)});const t=this.getTabIndexFromUrl();typeof t=="number"&&t>=0&&t<this.pages.length&&this.activatePage(t,!1)}getTabIndexFromUrl(){let t=window.location.pathname.replace(/^\//,"");t.startsWith("clarity/")&&(t=t.substring(8));const s=Array.from(this.querySelectorAll("my-tab"));for(let r=0;r<s.length;r++)if(s[r].getAttribute("route")===t)return r;return 0}activatePage(t,s=!0){if(this.pages.forEach((r,i)=>{const o=this.tabsContent.querySelectorAll("input"),a=i===t;r.classList.toggle("active",a),o[i]&&(o[i].checked=a)}),s){const i=Array.from(this.querySelectorAll("my-tab"))[t].getAttribute("route")||"",a=`${window.location.origin}/clarity/${i}`;history.pushState({tab:t},"",a)}}render(){const t=this.querySelector("my-header");if(t){const i=t.children[0];if(i){let o=document.createElement("div");o.className="tabs-bar",i.classList.add("tabs-header"),o.appendChild(i),this.prepend(o)}t.remove()}this.tabsContent=document.createElement("div"),this.tabsContent.className="tabs-content";const s=this.querySelector(".tabs-bar");s?s.append(this.tabsContent):this.prepend(this.tabsContent),Array.from(this.querySelectorAll("my-tab")).forEach((i,o)=>{const a=i.getAttribute("label")||`Tab ${o+1}`,l=`tab-${o}`,c=`tabpanel-${o}`,d=document.createElement("input");d.type="radio",d.id=l,d.checked=o===0,d.addEventListener("change",()=>this.activatePage(o,!0));const u=document.createElement("label");u.htmlFor=l,u.textContent=a;const f=document.createElement("span");f.className="tab-radio-wrapper",f.appendChild(d),f.appendChild(u),this.tabsContent.appendChild(f),i.classList.add("page"),i.setAttribute("id",c),o===0&&i.classList.add("active"),this.pages.push(i)})}}customElements.define("my-tabview",Fs);class Vs extends HTMLElement{}customElements.define("my-tab",Vs);class js extends HTMLElement{}customElements.define("my-header",js);class Ys extends HTMLElement{constructor(){super()}connectedCallback(){this.render()}render(){const n=document.createElement("div");n.className="article-list";const t=this.querySelectorAll("my-article");for(let r=0;r<t.length;r++){const i=t[r],o=i.querySelector("my-article-header");if(!o){console.warn(`Article ${r} does not have a header.`);continue}const a=document.createElement("div");a.className="article-item shadowed hoverable",a.innerHTML=o.outerHTML,a.addEventListener("click",()=>{const l=this.querySelector(".article-content-container");l&&(n.style.display="none",l.style.display="flex",l.innerHTML=i.innerHTML)}),n.appendChild(a)}this.innerHTML="";let s=document.createElement("div");s.className="article-content-container",s.style.display="none",this.appendChild(n),this.appendChild(s)}}class Xs extends HTMLElement{constructor(){super(...arguments);h(this,"_rendered",!1)}connectedCallback(){this.render()}render(){if(this._rendered)return;this._rendered=!0;const t=this.getAttribute("article-title")||"Untitled Article",s=this.getAttribute("article-description")||"",r=document.createElement("header"),i=document.createElement("div"),o=document.createElement("h1");o.textContent=t;const a=document.createElement("p");a.className="article-desc",a.textContent=s,i.appendChild(o),i.appendChild(a),r.appendChild(i);const l=this.querySelector("symbol-icon");l&&r.prepend(l);const c=document.createElement("section"),d=document.createElement("main"),u=document.createElement("article"),f=this.querySelector("my-article-content");f&&u.appendChild(f),d.appendChild(u);const p=document.createElement("aside"),g=document.createElement("span");g.textContent="More Articles";const _=document.createElement("nav");_.className="article-nav",p.appendChild(g),p.appendChild(_),c.appendChild(d),c.appendChild(p);const m=document.createElement("footer"),E=document.createElement("div");E.innerHTML=`
            <span>Source code available at <a href="https://github.com/connorjlink/clarity">https://github.com/connorjlink/clarity</a>.</span>
            <br>
            <span>&copy; 2025 Connor J. Link. All Rights Reserved.</span>
        `,m.appendChild(E),this.textContent="",this.appendChild(r),this.appendChild(c),this.appendChild(m),Array.from(document.querySelectorAll("my-article-header symbol-icon"))}}class Gs extends HTMLElement{connectedCallback(){this.render()}render(){const n=this.getAttribute("article-title")||"Untitled Article",t=this.getAttribute("article-description")||"No description provided.",s=this.querySelector("symbol-icon");this.innerHTML=`
            <div class="article-header">
                ${s?s.outerHTML:""}
                <div>
                    <h2 class="article-title">${n}</h2>
                    <p class="article-desc">${t}</p>
                </div>
            </div>
        `}}customElements.define("my-articleselector",Ys);customElements.define("my-article-header",Gs);customElements.define("my-article",Xs);const Nn=`
    :host {
        display: block;
        width: 100%;
        height: 100%;
    }
    
    :host *, :host *::before, :host *::after {
        box-sizing: border-box;
    }

    pane-view {
        overflow-x: hidden;
    }

    .pane-row {
        display: grid;
        grid-template-rows: 1fr;
        will-change: grid-template-columns;
        height: 100%;
        width: 100%;
    }

    .pane-column {
        width: 100%;
        position: relative;
        background: var(--dark-background-d);
        z-index: 1;
    }
        .pane-column.hidden {
            display: none;
        }
    
    .handle {
        width: 1px;
        cursor: col-resize;
        background: var(--node-border);
        z-index: 3;
        height: 100%;
        transition: background-color 100ms ease-in-out;
    }
        .handle:hover {
            background: var(--accent-hovered);
            width: 2px;
        }
        .handle.dragging {
            background: var(--accent-selected);
        }

    .pane-descriptor {
        padding: 0.5rem;
        background: var(--dark-background-e);
        border-top: 1px solid var(--node-border);
        border-bottom: 1px solid var(--node-border);
        width: 100%;
        position: relative;
        z-index: 2;
    }
`,Js=new CSSStyleSheet;Js.replaceSync(Nn);const ln="resizable-pane-widths";class Zs extends HTMLElement{constructor(){super();h(this,"columns",[]);h(this,"handles",[]);h(this,"widths",[]);h(this,"draggingIndex",null);h(this,"startX",0);h(this,"startWidths",[]);h(this,"visible",[]);h(this,"originalPanes",[]);h(this,"onHandleMouseDown",t=>{const s=t.target;this.draggingIndex=parseInt(s.dataset.index),this.startX=t.clientX,this.startWidths=this.getCurrentWidths(),s.classList.add("dragging"),t.preventDefault()});h(this,"onMouseMove",t=>{if(this.draggingIndex===null)return;const s=t.clientX-this.startX,r=this.draggingIndex;let i=[...this.startWidths];const o=50;i[r]+=s,i[r+1]-=s;for(let l=r+1;l<i.length;l++)if(i[l]<o){const c=o-i[l];i[l]=o,l+1<i.length&&(i[l+1]-=c)}for(let l=r;l>=0;l--)if(i[l]<o){const c=o-i[l];i[l]=o,l-1>=0&&(i[l-1]-=c)}for(let l=i.length-1;l>=0;l--)i[l]<o&&(i[l]=o);for(let l=0;l<i.length;l++)i[l]<o&&(i[l]=o);const a=i.reduce((l,c)=>l+c,0);this.widths=i.map(l=>l/a),this.applyWidths(),this.startWidths=i,this.startX=t.clientX});h(this,"onMouseUp",t=>{this.draggingIndex!==null&&(this.handles[this.draggingIndex].classList.remove("dragging"),this.saveWidths(),this.draggingIndex=null)})}connectedCallback(){this.originalPanes.length===0&&(this.originalPanes=Array.from(this.querySelectorAll(".pane-column"))),this.loadWidths(),this.render(),this.applyWidths(),this.addHandleEvents()}disconnectedCallback(){this.removeHandleEvents()}setVisiblePanes(t){this.visible=t,this.render(),this.applyWidths(),this.addHandleEvents()}render(){this.innerHTML=`<style>${Nn}</style>`;const t=document.createElement("div");t.className="pane-row",this.columns=[],this.handles=[],this.originalPanes.forEach((s,r)=>{if(Array.from(s.querySelectorAll(".handle")).forEach(i=>i.remove()),this.visible[r]&&(t.appendChild(s),this.columns.push(s),this.columns.length-1<this.visible.filter(Boolean).length-1)){const i=document.createElement("div");i.className="handle",i.dataset.index=(this.columns.length-1).toString(),t.appendChild(i),this.handles.push(i)}}),this.appendChild(t)}addHandleEvents(){this.handles.forEach(t=>{t.addEventListener("mousedown",this.onHandleMouseDown)}),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("mouseup",this.onMouseUp)}removeHandleEvents(){this.handles.forEach(t=>{t.removeEventListener("mousedown",this.onHandleMouseDown)}),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("mouseup",this.onMouseUp)}getCurrentWidths(){return this.columns.map(t=>t.getBoundingClientRect().width)}applyWidths(){this.widths.length!==this.columns.length&&(this.widths=Array(this.columns.length).fill(1/this.columns.length));const t=this.querySelector(".pane-row");if(!t)return;let s="";for(let i=0;i<this.columns.length;i++)s+=`${this.widths[i]*100}% `,i<this.columns.length-1&&(s+="1px ");t.style.gridTemplateColumns=s.trim();let r=1;this.columns.forEach(i=>{i.classList.contains("hidden")||(i.style.gridColumn=`${r}`,r+=2)}),this.handles.forEach((i,o)=>{i.style.gridColumn=`${2*(o+1)}`})}saveWidths(){localStorage.setItem(ln,JSON.stringify(this.widths))}loadWidths(){const t=localStorage.getItem(ln);if(t)try{const s=JSON.parse(t);Array.isArray(s)&&s.length===this.columns.length&&(this.widths=s)}catch{}}}customElements.define("pane-view",Zs);const Qs=`
    .container {
        cursor: pointer;
        user-select: none;
        width: fit-content;
    }

    input {
        position: absolute;
        height: 1rem;
        width: 1rem;
        opacity: 0;
        margin: 0;
        z-index: 100;
        cursor: pointer;
    }
        input:checked ~ on-icon {
            display: flex;
        }
        input:not(:checked) ~ off-icon {
            display: flex;
        }

    on-icon, off-icon {
        display: none;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1rem;
    }

    svg {
        width: 0.75rem;
        height: 0.75rem;
        color: white;
    }
`,On=new CSSStyleSheet;On.replaceSync(Qs);class Ks extends HTMLElement{constructor(){super();h(this,"_checked",!0);h(this,"_onIcon",null);h(this,"_offIcon",null);h(this,"_titleText",null);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[On]}get checked(){return this._checked}set checked(t){this._checked=t,this.render()}connectedCallback(){this._onIcon=this.querySelector("on-icon"),this._offIcon=this.querySelector("off-icon"),this._titleText=this.getAttribute("title")||null,this.render()}render(){this.shadowRoot.innerHTML=`
            <div class="container" title="${this._titleText||""}">
                <input type="checkbox" ${this._checked?"checked":""}>
            </div>
        `;const t=this.shadowRoot.querySelector("input");t.addEventListener("change",()=>{this._checked=t.checked,this.dispatchEvent(new CustomEvent("toggle-change",{detail:{checked:this._checked}}))});const s=this.shadowRoot.querySelector(".container");this._onIcon&&s.appendChild(this._onIcon),this._offIcon&&s.appendChild(this._offIcon)}}customElements.define("symbol-toggle",Ks);const er="5";var Sn;typeof window<"u"&&((Sn=window.__svelte??(window.__svelte={})).v??(Sn.v=new Set)).add(er);let Qe=!1,tr=!1;function nr(){Qe=!0}nr();const sr=2,rr=8,ir=2,or="[",ar="]",Fe={},T=Symbol(),lr="http://www.w3.org/1999/xhtml",Pn=!1;var Dn=Array.isArray,cr=Array.prototype.indexOf,dr=Array.from,lt=Object.keys,De=Object.defineProperty,ge=Object.getOwnPropertyDescriptor,qn=Object.getOwnPropertyDescriptors,hr=Object.prototype,ur=Array.prototype,zt=Object.getPrototypeOf,cn=Object.isExtensible;function fr(e){return e()}function ct(e){for(var n=0;n<e.length;n++)e[n]()}function pr(){var e,n,t=new Promise((s,r)=>{e=s,n=r});return{promise:t,resolve:e,reject:n}}const H=2,zn=4,_t=8,mt=16,ue=32,xe=64,Hn=128,F=256,dt=512,R=1024,z=2048,Ee=4096,qe=8192,ke=16384,Ht=32768,gr=65536,dn=1<<17,vr=1<<18,Wt=1<<19,Bt=1<<20,Tt=1<<21,Ut=1<<22,ve=1<<23,Ie=Symbol("$state"),Wn=Symbol("legacy props"),_r=Symbol(""),Ft=new class extends Error{constructor(){super(...arguments);h(this,"name","StaleReactionError");h(this,"message","The reaction that called `getAbortSignal()` was re-run or destroyed")}},Bn=3,hn=8;function mr(){throw new Error("https://svelte.dev/e/await_outside_boundary")}function yr(){throw new Error("https://svelte.dev/e/async_derived_orphan")}function wr(e){throw new Error("https://svelte.dev/e/effect_in_teardown")}function br(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function xr(e){throw new Error("https://svelte.dev/e/effect_orphan")}function Er(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function kr(){throw new Error("https://svelte.dev/e/hydration_failed")}function Cr(e){throw new Error("https://svelte.dev/e/props_invalid_value")}function Sr(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function $r(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Tr(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Vt(e){console.warn("https://svelte.dev/e/hydration_mismatch")}let C=!1;function nt(e){C=e}let k;function we(e){if(e===null)throw Vt(),Fe;return k=e}function jt(){return we(We(k))}function Y(e){if(C){if(We(k)!==null)throw Vt(),Fe;k=e}}function Un(e){return e===this.v}function Rr(e,n){return e!=e?n==n:e!==n||e!==null&&typeof e=="object"||typeof e=="function"}function Fn(e){return!Rr(e,this.v)}let $=null;function ht(e){$=e}function Yt(e,n=!1,t){$={p:$,c:null,e:null,s:e,x:null,l:Qe&&!n?{s:null,u:null,$:[]}:null}}function Xt(e){var n=$,t=n.e;if(t!==null){n.e=null;for(var s of t)as(s)}return e!==void 0&&(n.x=e),$=n.p,e??{}}function Ke(){return!Qe||$!==null&&$.l===null}const Lr=new WeakMap;function Mr(e){var n=w;if(n===null)return y.f|=ve,e;if((n.f&Ht)===0){if((n.f&Hn)===0)throw!n.parent&&e instanceof Error&&Vn(e),e;n.b.error(e)}else Gt(e,n)}function Gt(e,n){for(;n!==null;){if((n.f&Hn)!==0)try{n.b.error(e);return}catch(t){e=t}n=n.parent}throw e instanceof Error&&Vn(e),e}function Vn(e){const n=Lr.get(e);n&&(De(e,"message",{value:n.message}),De(e,"stack",{value:n.stack}))}let je=[],Rt=[];function jn(){var e=je;je=[],ct(e)}function Ir(){var e=Rt;Rt=[],ct(e)}function Yn(e){je.length===0&&queueMicrotask(jn),je.push(e)}function Ar(){je.length>0&&jn(),Rt.length>0&&Ir()}function Nr(){for(var e=w.b;e!==null&&!e.has_pending_snippet();)e=e.parent;return e===null&&mr(),e}function Jt(e){var n=H|z,t=y!==null&&(y.f&H)!==0?y:null;return w===null||t!==null&&(t.f&F)!==0?n|=F:w.f|=Wt,{ctx:$,deps:null,effects:null,equals:Un,f:n,fn:e,reactions:null,rv:0,v:T,wv:0,parent:t??w,ac:null}}function Or(e,n){let t=w;t===null&&yr();var s=t.b,r=void 0,i=Qt(T),o=null,a=!y;return Yr(()=>{try{var l=e()}catch(p){l=Promise.reject(p)}var c=()=>l;r=(o==null?void 0:o.then(c,c))??Promise.resolve(l),o=r;var d=W,u=s.pending;a&&(s.update_pending_count(1),u||d.increment());const f=(p,g=void 0)=>{o=null,u||d.activate(),g?g!==Ft&&(i.f|=ve,It(i,g)):((i.f&ve)!==0&&(i.f^=ve),It(i,p)),a&&(s.update_pending_count(-1),u||d.decrement()),Zn()};if(r.then(f,p=>f(null,p||"unknown")),d)return()=>{queueMicrotask(()=>d.neuter())}}),new Promise(l=>{function c(d){function u(){d===r?l(i):c(r)}d.then(u,u)}c(r)})}function Xn(e){const n=Jt(e);return n.equals=Fn,n}function Gn(e){var n=e.effects;if(n!==null){e.effects=null;for(var t=0;t<n.length;t+=1)de(n[t])}}function Pr(e){for(var n=e.parent;n!==null;){if((n.f&H)===0)return n;n=n.parent}return null}function Zt(e){var n,t=w;he(Pr(e));try{Gn(e),n=gs(e)}finally{he(t)}return n}function Jn(e){var n=Zt(e);if(e.equals(n)||(e.v=n,e.wv=fs()),!Ce)if(le!==null)le.set(e,e.v);else{var t=(ce||(e.f&F)!==0)&&e.deps!==null?Ee:R;L(e,t)}}function Dr(e,n,t){const s=Ke()?Jt:Xn;if(n.length===0){t(e.map(s));return}var r=W,i=w,o=qr(),a=Nr();Promise.all(n.map(l=>Or(l))).then(l=>{r==null||r.activate(),o();try{t([...e.map(s),...l])}catch(c){(i.f&ke)===0&&Gt(c,i)}r==null||r.deactivate(),Zn()}).catch(l=>{a.error(l)})}function qr(){var e=w,n=y,t=$;return function(){he(e),Z(n),ht(t)}}function Zn(){he(null),Z(null),ht(null)}const st=new Set;let W=null,le=null,un=new Set,ut=[];function Qn(){const e=ut.shift();ut.length>0&&queueMicrotask(Qn),e()}let Re=[],yt=null,Lt=!1;var Ge,Ne,Oe,oe,Je,Ze,fe,Pe,ae,K,pe,te,Kn,es,Mt;const vt=class vt{constructor(){A(this,te);A(this,Ge,new Map);A(this,Ne,new Map);A(this,Oe,new Set);A(this,oe,0);A(this,Je,null);A(this,Ze,!1);A(this,fe,[]);A(this,Pe,[]);A(this,ae,[]);A(this,K,[]);A(this,pe,[]);h(this,"skipped_effects",new Set)}capture(n,t){v(this,Ne).has(n)||v(this,Ne).set(n,t),v(this,Ge).set(n,n.v)}activate(){W=this}deactivate(){W=null;for(const n of un)if(un.delete(n),n(),W!==null)break}neuter(){D(this,Ze,!0)}flush(){Re.length>0?this.flush_effects():Be(this,te,Mt).call(this),W===this&&(v(this,oe)===0&&st.delete(this),this.deactivate())}flush_effects(){var n=Ae;Lt=!0;try{var t=0;for(vn(!0);Re.length>0;){if(t++>1e3){var s,r;zr()}Be(this,te,Kn).call(this,Re),me.clear()}}finally{Lt=!1,vn(n),yt=null}}increment(){D(this,oe,v(this,oe)+1)}decrement(){if(D(this,oe,v(this,oe)-1),v(this,oe)===0){for(const n of v(this,ae))L(n,z),_e(n);for(const n of v(this,K))L(n,z),_e(n);for(const n of v(this,pe))L(n,z),_e(n);D(this,ae,[]),D(this,K,[]),this.flush()}else this.deactivate()}add_callback(n){v(this,Oe).add(n)}settled(){return(v(this,Je)??D(this,Je,pr())).promise}static ensure(n=!0){if(W===null){const t=W=new vt;st.add(W),n&&vt.enqueue(()=>{W===t&&t.flush()})}return W}static enqueue(n){ut.length===0&&queueMicrotask(Qn),ut.unshift(n)}};Ge=new WeakMap,Ne=new WeakMap,Oe=new WeakMap,oe=new WeakMap,Je=new WeakMap,Ze=new WeakMap,fe=new WeakMap,Pe=new WeakMap,ae=new WeakMap,K=new WeakMap,pe=new WeakMap,te=new WeakSet,Kn=function(n){var i;Re=[];var t=null;if(st.size>1){t=new Map,le=new Map;for(const[o,a]of v(this,Ge))t.set(o,{v:o.v,wv:o.wv}),o.v=a;for(const o of st)if(o!==this)for(const[a,l]of v(o,Ne))t.has(a)||(t.set(a,{v:a.v,wv:a.wv}),a.v=l)}for(const o of n)Be(this,te,es).call(this,o);if(v(this,fe).length===0&&v(this,oe)===0){var s=v(this,ae),r=v(this,K);D(this,ae,[]),D(this,K,[]),D(this,pe,[]),Be(this,te,Mt).call(this),fn(s),fn(r),(i=v(this,Je))==null||i.resolve()}else{for(const o of v(this,ae))L(o,R);for(const o of v(this,K))L(o,R);for(const o of v(this,pe))L(o,R)}if(t){for(const[o,{v:a,wv:l}]of t)o.wv<=l&&(o.v=a);le=null}for(const o of v(this,fe))Ve(o);for(const o of v(this,Pe))Ve(o);D(this,fe,[]),D(this,Pe,[])},es=function(n){var d;n.f^=R;for(var t=n.first;t!==null;){var s=t.f,r=(s&(ue|xe))!==0,i=r&&(s&R)!==0,o=i||(s&qe)!==0||this.skipped_effects.has(t);if(!o&&t.fn!==null){if(r)t.f^=R;else if((s&zn)!==0)v(this,K).push(t);else if(wt(t))if((s&Ut)!==0){var a=(d=t.b)!=null&&d.pending?v(this,Pe):v(this,fe);a.push(t)}else(t.f&mt)!==0&&v(this,pe).push(t),Ve(t);var l=t.first;if(l!==null){t=l;continue}}var c=t.parent;for(t=t.next;t===null&&c!==null;)t=c.next,c=c.parent}},Mt=function(){if(!v(this,Ze))for(const n of v(this,Oe))n();v(this,Oe).clear()};let ze=vt;function V(e){var n;const t=ze.ensure(!1);for(;;){if(Ar(),Re.length===0)return t===W&&t.flush(),yt=null,n;t.flush_effects()}}function zr(){try{Er()}catch(e){Gt(e,yt)}}function fn(e){var n=e.length;if(n!==0){for(var t=0;t<n;t++){var s=e[t];if((s.f&(ke|qe))===0&&wt(s)){var r=pt;if(Ve(s),s.deps===null&&s.first===null&&s.nodes_start===null&&(s.teardown===null&&s.ac===null?hs(s):s.fn=null),pt>r&&(s.f&Bt)!==0)break}}for(;t<n;t+=1)_e(e[t])}}function _e(e){for(var n=yt=e;n.parent!==null;){n=n.parent;var t=n.f;if(Lt&&n===w&&(t&mt)!==0)return;if((t&(xe|ue))!==0){if((t&R)===0)return;n.f^=R}}Re.push(n)}const me=new Map;function Qt(e,n){var t={f:0,v:e,reactions:null,equals:Un,rv:0,wv:0};return t}function ie(e,n){const t=Qt(e);return ei(t),t}function ts(e,n=!1,t=!0){var r;const s=Qt(e);return n||(s.equals=Fn),Qe&&t&&$!==null&&$.l!==null&&((r=$.l).s??(r.s=[])).push(s),s}function G(e,n,t=!1){y!==null&&(!J||(y.f&dn)!==0)&&Ke()&&(y.f&(H|mt|Ut|dn))!==0&&!(P!=null&&P.includes(e))&&Tr();let s=t?Le(n):n;return It(e,s)}function It(e,n){if(!e.equals(n)){var t=e.v;Ce?me.set(e,n):me.set(e,t),e.v=n,ze.ensure().capture(e,t),(e.f&H)!==0&&((e.f&z)!==0&&Zt(e),L(e,(e.f&F)===0?R:Ee)),e.wv=fs(),ns(e,z),Ke()&&w!==null&&(w.f&R)!==0&&(w.f&(ue|xe))===0&&(B===null?ti([e]):B.push(e))}return n}function Et(e){G(e,e.v+1)}function ns(e,n){var t=e.reactions;if(t!==null)for(var s=Ke(),r=t.length,i=0;i<r;i++){var o=t[i],a=o.f;!s&&o===w||((a&z)===0&&L(o,n),(a&H)!==0?ns(o,Ee):(a&z)===0&&_e(o))}}function Le(e){if(typeof e!="object"||e===null||Ie in e)return e;const n=zt(e);if(n!==hr&&n!==ur)return e;var t=new Map,s=Dn(e),r=ie(0),i=ye,o=a=>{if(ye===i)return a();var l=y,c=ye;Z(null),mn(i);var d=a();return Z(l),mn(c),d};return s&&t.set("length",ie(e.length)),new Proxy(e,{defineProperty(a,l,c){(!("value"in c)||c.configurable===!1||c.enumerable===!1||c.writable===!1)&&Sr();var d=t.get(l);return d===void 0?d=o(()=>{var u=ie(c.value);return t.set(l,u),u}):G(d,c.value,!0),!0},deleteProperty(a,l){var c=t.get(l);if(c===void 0){if(l in a){const d=o(()=>ie(T));t.set(l,d),Et(r)}}else G(c,T),Et(r);return!0},get(a,l,c){var p;if(l===Ie)return e;var d=t.get(l),u=l in a;if(d===void 0&&(!u||(p=ge(a,l))!=null&&p.writable)&&(d=o(()=>{var g=Le(u?a[l]:T),_=ie(g);return _}),t.set(l,d)),d!==void 0){var f=M(d);return f===T?void 0:f}return Reflect.get(a,l,c)},getOwnPropertyDescriptor(a,l){var c=Reflect.getOwnPropertyDescriptor(a,l);if(c&&"value"in c){var d=t.get(l);d&&(c.value=M(d))}else if(c===void 0){var u=t.get(l),f=u==null?void 0:u.v;if(u!==void 0&&f!==T)return{enumerable:!0,configurable:!0,value:f,writable:!0}}return c},has(a,l){var f;if(l===Ie)return!0;var c=t.get(l),d=c!==void 0&&c.v!==T||Reflect.has(a,l);if(c!==void 0||w!==null&&(!d||(f=ge(a,l))!=null&&f.writable)){c===void 0&&(c=o(()=>{var p=d?Le(a[l]):T,g=ie(p);return g}),t.set(l,c));var u=M(c);if(u===T)return!1}return d},set(a,l,c,d){var b;var u=t.get(l),f=l in a;if(s&&l==="length")for(var p=c;p<u.v;p+=1){var g=t.get(p+"");g!==void 0?G(g,T):p in a&&(g=o(()=>ie(T)),t.set(p+"",g))}if(u===void 0)(!f||(b=ge(a,l))!=null&&b.writable)&&(u=o(()=>ie(void 0)),G(u,Le(c)),t.set(l,u));else{f=u.v!==T;var _=o(()=>Le(c));G(u,_)}var m=Reflect.getOwnPropertyDescriptor(a,l);if(m!=null&&m.set&&m.set.call(d,c),!f){if(s&&typeof l=="string"){var E=t.get("length"),x=Number(l);Number.isInteger(x)&&x>=E.v&&G(E,x+1)}Et(r)}return!0},ownKeys(a){M(r);var l=Reflect.ownKeys(a).filter(u=>{var f=t.get(u);return f===void 0||f.v!==T});for(var[c,d]of t)d.v!==T&&!(c in a)&&l.push(c);return l},setPrototypeOf(){$r()}})}var pn,ss,rs,is;function At(){if(pn===void 0){pn=window,ss=/Firefox/.test(navigator.userAgent);var e=Element.prototype,n=Node.prototype,t=Text.prototype;rs=ge(n,"firstChild").get,is=ge(n,"nextSibling").get,cn(e)&&(e.__click=void 0,e.__className=void 0,e.__attributes=null,e.__style=void 0,e.__e=void 0),cn(t)&&(t.__t=void 0)}}function ft(e=""){return document.createTextNode(e)}function be(e){return rs.call(e)}function We(e){return is.call(e)}function X(e,n){if(!C)return be(e);var t=be(k);if(t===null)t=k.appendChild(ft());else if(n&&t.nodeType!==Bn){var s=ft();return t==null||t.before(s),we(s),s}return we(t),t}function Hr(e,n){if(!C){var t=be(e);return t instanceof Comment&&t.data===""?We(t):t}return k}function j(e,n=1,t=!1){let s=C?k:e;for(var r;n--;)r=s,s=We(s);if(!C)return s;if(t&&(s==null?void 0:s.nodeType)!==Bn){var i=ft();return s===null?r==null||r.after(i):s.before(i),we(i),i}return we(s),s}function Wr(e){e.textContent=""}function os(e){w===null&&y===null&&xr(),y!==null&&(y.f&F)!==0&&w===null&&br(),Ce&&wr()}function Br(e,n){var t=n.last;t===null?n.last=n.first=e:(t.next=e,e.prev=t,n.last=e)}function ne(e,n,t,s=!0){var r=w;r!==null&&(r.f&qe)!==0&&(e|=qe);var i={ctx:$,deps:null,nodes_start:null,nodes_end:null,f:e|z,first:null,fn:n,last:null,next:null,parent:r,b:r&&r.b,prev:null,teardown:null,transitions:null,wv:0,ac:null};if(t)try{Ve(i),i.f|=Ht}catch(l){throw de(i),l}else n!==null&&_e(i);var o=t&&i.deps===null&&i.first===null&&i.nodes_start===null&&i.teardown===null&&(i.f&Wt)===0;if(!o&&s&&(r!==null&&Br(i,r),y!==null&&(y.f&H)!==0)){var a=y;(a.effects??(a.effects=[])).push(i)}return i}function Ur(e){const n=ne(_t,null,!1);return L(n,R),n.teardown=e,n}function gn(e){os();var n=w.f,t=!y&&(n&ue)!==0&&(n&Ht)===0;if(t){var s=$;(s.e??(s.e=[])).push(e)}else return as(e)}function as(e){return ne(zn|Bt,e,!1)}function Fr(e){return os(),ne(_t|Bt,e,!0)}function Vr(e){ze.ensure();const n=ne(xe,e,!0);return()=>{de(n)}}function jr(e){ze.ensure();const n=ne(xe,e,!0);return(t={})=>new Promise(s=>{t.outro?Qr(n,()=>{de(n),s(void 0)}):(de(n),s(void 0))})}function Yr(e){return ne(Ut|Wt,e,!0)}function Xr(e,n=0){return ne(_t|n,e,!0)}function ls(e,n=[],t=[]){Dr(n,t,s=>{ne(_t,()=>e(...s.map(M)),!0)})}function Gr(e,n=!0){return ne(ue,e,!0,n)}function cs(e){var n=e.teardown;if(n!==null){const t=Ce,s=y;_n(!0),Z(null);try{n.call(null)}finally{_n(t),Z(s)}}}function ds(e,n=!1){var r;var t=e.first;for(e.first=e.last=null;t!==null;){(r=t.ac)==null||r.abort(Ft);var s=t.next;(t.f&xe)!==0?t.parent=null:de(t,n),t=s}}function Jr(e){for(var n=e.first;n!==null;){var t=n.next;(n.f&ue)===0&&de(n),n=t}}function de(e,n=!0){var t=!1;(n||(e.f&vr)!==0)&&e.nodes_start!==null&&e.nodes_end!==null&&(Zr(e.nodes_start,e.nodes_end),t=!0),ds(e,n&&!t),gt(e,0),L(e,ke);var s=e.transitions;if(s!==null)for(const i of s)i.stop();cs(e);var r=e.parent;r!==null&&r.first!==null&&hs(e),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes_start=e.nodes_end=e.ac=null}function Zr(e,n){for(;e!==null;){var t=e===n?null:We(e);e.remove(),e=t}}function hs(e){var n=e.parent,t=e.prev,s=e.next;t!==null&&(t.next=s),s!==null&&(s.prev=t),n!==null&&(n.first===e&&(n.first=s),n.last===e&&(n.last=t))}function Qr(e,n){var t=[];us(e,t,!0),Kr(t,()=>{de(e),n&&n()})}function Kr(e,n){var t=e.length;if(t>0){var s=()=>--t||n();for(var r of e)r.out(s)}else n()}function us(e,n,t){if((e.f&qe)===0){if(e.f^=qe,e.transitions!==null)for(const o of e.transitions)(o.is_global||t)&&n.push(o);for(var s=e.first;s!==null;){var r=s.next,i=(s.f&gr)!==0||(s.f&ue)!==0;us(s,n,i?t:!1),s=r}}}let Ae=!1;function vn(e){Ae=e}let Ce=!1;function _n(e){Ce=e}let y=null,J=!1;function Z(e){y=e}let w=null;function he(e){w=e}let P=null;function ei(e){y!==null&&(P===null?P=[e]:P.push(e))}let O=null,q=0,B=null;function ti(e){B=e}let pt=1,Ye=0,ye=Ye;function mn(e){ye=e}let ce=!1;function fs(){return++pt}function wt(e){var u;var n=e.f;if((n&z)!==0)return!0;if((n&Ee)!==0){var t=e.deps,s=(n&F)!==0;if(t!==null){var r,i,o=(n&dt)!==0,a=s&&w!==null&&!ce,l=t.length;if((o||a)&&(w===null||(w.f&ke)===0)){var c=e,d=c.parent;for(r=0;r<l;r++)i=t[r],(o||!((u=i==null?void 0:i.reactions)!=null&&u.includes(c)))&&(i.reactions??(i.reactions=[])).push(c);o&&(c.f^=dt),a&&d!==null&&(d.f&F)===0&&(c.f^=F)}for(r=0;r<l;r++)if(i=t[r],wt(i)&&Jn(i),i.wv>e.wv)return!0}(!s||w!==null&&!ce)&&L(e,R)}return!1}function ps(e,n,t=!0){var s=e.reactions;if(s!==null&&!(P!=null&&P.includes(e)))for(var r=0;r<s.length;r++){var i=s[r];(i.f&H)!==0?ps(i,n,!1):n===i&&(t?L(i,z):(i.f&R)!==0&&L(i,Ee),_e(i))}}function gs(e){var g;var n=O,t=q,s=B,r=y,i=ce,o=P,a=$,l=J,c=ye,d=e.f;O=null,q=0,B=null,ce=(d&F)!==0&&(J||!Ae||y===null),y=(d&(ue|xe))===0?e:null,P=null,ht(e.ctx),J=!1,ye=++Ye,e.ac!==null&&(e.ac.abort(Ft),e.ac=null);try{e.f|=Tt;var u=(0,e.fn)(),f=e.deps;if(O!==null){var p;if(gt(e,q),f!==null&&q>0)for(f.length=q+O.length,p=0;p<O.length;p++)f[q+p]=O[p];else e.deps=f=O;if(!ce||(d&H)!==0&&e.reactions!==null)for(p=q;p<f.length;p++)((g=f[p]).reactions??(g.reactions=[])).push(e)}else f!==null&&q<f.length&&(gt(e,q),f.length=q);if(Ke()&&B!==null&&!J&&f!==null&&(e.f&(H|Ee|z))===0)for(p=0;p<B.length;p++)ps(B[p],e);return r!==null&&r!==e&&(Ye++,B!==null&&(s===null?s=B:s.push(...B))),(e.f&ve)!==0&&(e.f^=ve),u}catch(_){return Mr(_)}finally{e.f^=Tt,O=n,q=t,B=s,y=r,ce=i,P=o,ht(a),J=l,ye=c}}function ni(e,n){let t=n.reactions;if(t!==null){var s=cr.call(t,e);if(s!==-1){var r=t.length-1;r===0?t=n.reactions=null:(t[s]=t[r],t.pop())}}t===null&&(n.f&H)!==0&&(O===null||!O.includes(n))&&(L(n,Ee),(n.f&(F|dt))===0&&(n.f^=dt),Gn(n),gt(n,0))}function gt(e,n){var t=e.deps;if(t!==null)for(var s=n;s<t.length;s++)ni(e,t[s])}function Ve(e){var n=e.f;if((n&ke)===0){L(e,R);var t=w,s=Ae;w=e,Ae=!0;try{(n&mt)!==0?Jr(e):ds(e),cs(e);var r=gs(e);e.teardown=typeof r=="function"?r:null,e.wv=pt;var i;Pn&&tr&&(e.f&z)!==0&&e.deps}finally{Ae=s,w=t}}}function M(e){var n=e.f,t=(n&H)!==0;if(y!==null&&!J){var s=w!==null&&(w.f&ke)!==0;if(!s&&!(P!=null&&P.includes(e))){var r=y.deps;if((y.f&Tt)!==0)e.rv<Ye&&(e.rv=Ye,O===null&&r!==null&&r[q]===e?q++:O===null?O=[e]:(!ce||!O.includes(e))&&O.push(e));else{(y.deps??(y.deps=[])).push(e);var i=e.reactions;i===null?e.reactions=[y]:i.includes(y)||i.push(y)}}}else if(t&&e.deps===null&&e.effects===null){var o=e,a=o.parent;a!==null&&(a.f&F)===0&&(o.f^=F)}if(Ce){if(me.has(e))return me.get(e);if(t){o=e;var l=o.v;return((o.f&R)===0&&o.reactions!==null||vs(o))&&(l=Zt(o)),me.set(o,l),l}}else if(t){if(o=e,le!=null&&le.has(o))return le.get(o);wt(o)&&Jn(o)}if((e.f&ve)!==0)throw e.v;return e.v}function vs(e){if(e.v===T)return!0;if(e.deps===null)return!1;for(const n of e.deps)if(me.has(n)||(n.f&H)!==0&&vs(n))return!0;return!1}function si(e){var n=J;try{return J=!0,e()}finally{J=n}}const ri=-7169;function L(e,n){e.f=e.f&ri|n}function ii(e){if(!(typeof e!="object"||!e||e instanceof EventTarget)){if(Ie in e)Nt(e);else if(!Array.isArray(e))for(let n in e){const t=e[n];typeof t=="object"&&t&&Ie in t&&Nt(t)}}}function Nt(e,n=new Set){if(typeof e=="object"&&e!==null&&!(e instanceof EventTarget)&&!n.has(e)){n.add(e),e instanceof Date&&e.getTime();for(let s in e)try{Nt(e[s],n)}catch{}const t=zt(e);if(t!==Object.prototype&&t!==Array.prototype&&t!==Map.prototype&&t!==Set.prototype&&t!==Date.prototype){const s=qn(t);for(let r in s){const i=s[r].get;if(i)try{i.call(e)}catch{}}}}}function oi(e){var n=y,t=w;Z(null),he(null);try{return e()}finally{Z(n),he(t)}}const ai=new Set,yn=new Set;function li(e,n,t,s={}){function r(i){if(s.capture||Ue.call(n,i),!i.cancelBubble)return oi(()=>t==null?void 0:t.call(this,i))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?Yn(()=>{n.addEventListener(e,r,s)}):n.addEventListener(e,r,s),r}function wn(e,n,t,s,r){var i={capture:s,passive:r},o=li(e,n,t,i);(n===document.body||n===window||n===document||n instanceof HTMLMediaElement)&&Ur(()=>{n.removeEventListener(e,o,i)})}function Ue(e){var x;var n=this,t=n.ownerDocument,s=e.type,r=((x=e.composedPath)==null?void 0:x.call(e))||[],i=r[0]||e.target,o=0,a=e.__root;if(a){var l=r.indexOf(a);if(l!==-1&&(n===document||n===window)){e.__root=n;return}var c=r.indexOf(n);if(c===-1)return;l<=c&&(o=l)}if(i=r[o]||e.target,i!==n){De(e,"currentTarget",{configurable:!0,get(){return i||t}});var d=y,u=w;Z(null),he(null);try{for(var f,p=[];i!==null;){var g=i.assignedSlot||i.parentNode||i.host||null;try{var _=i["__"+s];if(_!=null&&(!i.disabled||e.target===i))if(Dn(_)){var[m,...E]=_;m.apply(i,[e,...E])}else _.call(i,e)}catch(b){f?p.push(b):f=b}if(e.cancelBubble||g===n||g===null)break;i=g}if(f){for(let b of p)queueMicrotask(()=>{throw b});throw f}}finally{e.__root=n,delete e.currentTarget,Z(d),he(u)}}}function _s(e){var n=document.createElement("template");return n.innerHTML=e.replaceAll("<!>","<!---->"),n.content}function Xe(e,n){var t=w;t.nodes_start===null&&(t.nodes_start=e,t.nodes_end=n)}function ci(e,n){var t=(n&ir)!==0,s,r=!e.startsWith("<!>");return()=>{if(C)return Xe(k,null),k;s===void 0&&(s=_s(r?e:"<!>"+e));var i=t||ss?document.importNode(s,!0):s.cloneNode(!0);{var o=be(i),a=i.lastChild;Xe(o,a)}return i}}function di(e,n,t="svg"){var s=!e.startsWith("<!>"),r=`<${t}>${s?e:"<!>"+e}</${t}>`,i;return()=>{if(C)return Xe(k,null),k;if(!i){var o=_s(r),a=be(o);i=be(a)}var l=i.cloneNode(!0);return Xe(l,l),l}}function hi(e,n){return di(e,n,"svg")}function Kt(e,n){if(C){w.nodes_end=k,jt();return}e!==null&&e.before(n)}const ui=["touchstart","touchmove"];function fi(e){return ui.includes(e)}function Ot(e,n){var t=n==null?"":typeof n=="object"?n+"":n;t!==(e.__t??(e.__t=e.nodeValue))&&(e.__t=t,e.nodeValue=t+"")}function ms(e,n){return ys(e,n)}function pi(e,n){At(),n.intro=n.intro??!1;const t=n.target,s=C,r=k;try{for(var i=be(t);i&&(i.nodeType!==hn||i.data!==or);)i=We(i);if(!i)throw Fe;nt(!0),we(i),jt();const o=ys(e,{...n,anchor:i});if(k===null||k.nodeType!==hn||k.data!==ar)throw Vt(),Fe;return nt(!1),o}catch(o){if(o===Fe)return n.recover===!1&&kr(),At(),Wr(t),nt(!1),ms(e,n);throw o}finally{nt(s),we(r)}}const Te=new Map;function ys(e,{target:n,anchor:t,props:s={},events:r,context:i,intro:o=!0}){At();var a=new Set,l=u=>{for(var f=0;f<u.length;f++){var p=u[f];if(!a.has(p)){a.add(p);var g=fi(p);n.addEventListener(p,Ue,{passive:g});var _=Te.get(p);_===void 0?(document.addEventListener(p,Ue,{passive:g}),Te.set(p,1)):Te.set(p,_+1)}}};l(dr(ai)),yn.add(l);var c=void 0,d=jr(()=>{var u=t??n.appendChild(ft());return Gr(()=>{if(i){Yt({});var f=$;f.c=i}r&&(s.$$events=r),C&&Xe(u,null),c=e(u,s)||{},C&&(w.nodes_end=k),i&&Xt()}),()=>{var g;for(var f of a){n.removeEventListener(f,Ue);var p=Te.get(f);--p===0?(document.removeEventListener(f,Ue),Te.delete(f)):Te.set(f,p)}yn.delete(l),u!==t&&((g=u.parentNode)==null||g.removeChild(u))}});return Pt.set(c,d),c}let Pt=new WeakMap;function gi(e,n){const t=Pt.get(e);return t?(Pt.delete(e),t(n)):Promise.resolve()}function vi(e,n,t,s,r){var a;C&&jt();var i=(a=n.$$slots)==null?void 0:a[t],o=!1;i===!0&&(i=n.children,o=!0),i===void 0||i(e,o?()=>s:s)}function ws(e,n){Yn(()=>{var t=e.getRootNode(),s=t.host?t:t.head??t.ownerDocument.head;if(!s.querySelector("#"+n.hash)){const r=document.createElement("style");r.id=n.hash,r.textContent=n.code,s.appendChild(r)}})}const bn=[...` 	
\r\f \v\uFEFF`];function _i(e,n,t){var s=e==null?"":""+e;if(t){for(var r in t)if(t[r])s=s?s+" "+r:r;else if(s.length)for(var i=r.length,o=0;(o=s.indexOf(r,o))>=0;){var a=o+i;(o===0||bn.includes(s[o-1]))&&(a===s.length||bn.includes(s[a]))?s=(o===0?"":s.substring(0,o))+s.substring(a+1):o=a}}return s===""?null:s}function mi(e,n){return e==null?null:String(e)}function xn(e,n,t,s,r,i){var o=e.__className;if(C||o!==t||o===void 0){var a=_i(t,s,i);(!C||a!==e.getAttribute("class"))&&(a==null?e.removeAttribute("class"):e.className=a),e.__className=t}else if(i&&r!==i)for(var l in i){var c=!!i[l];(r==null||c!==!!r[l])&&e.classList.toggle(l,c)}return i}function yi(e,n,t,s){var r=e.__style;if(C||r!==n){var i=mi(n);(!C||i!==e.getAttribute("style"))&&(i==null?e.removeAttribute("style"):e.style.cssText=i),e.__style=n}return s}const wi=Symbol("is custom element"),bi=Symbol("is html");function N(e,n,t,s){var r=xi(e);C&&(r[n]=e.getAttribute(n),n==="src"||n==="srcset"||n==="href"&&e.nodeName==="LINK")||r[n]!==(r[n]=t)&&(n==="loading"&&(e[_r]=t),t==null?e.removeAttribute(n):typeof t!="string"&&Ei(e).includes(n)?e[n]=t:e.setAttribute(n,t))}function xi(e){return e.__attributes??(e.__attributes={[wi]:e.nodeName.includes("-"),[bi]:e.namespaceURI===lr})}var En=new Map;function Ei(e){var n=En.get(e.nodeName);if(n)return n;En.set(e.nodeName,n=[]);for(var t,s=e,r=Element.prototype;r!==s;){t=qn(s);for(var i in t)t[i].set&&n.push(i);s=zt(s)}return n}function ki(e=!1){const n=$,t=n.l.u;if(!t)return;let s=()=>ii(n.s);if(e){let r=0,i={};const o=Jt(()=>{let a=!1;const l=n.s;for(const c in l)l[c]!==i[c]&&(i[c]=l[c],a=!0);return a&&r++,r});s=()=>M(o)}t.b.length&&Fr(()=>{kn(n,s),ct(t.b)}),gn(()=>{const r=si(()=>t.m.map(fr));return()=>{for(const i of r)typeof i=="function"&&i()}}),t.a.length&&gn(()=>{kn(n,s),ct(t.a)})}function kn(e,n){if(e.l.s)for(const t of e.l.s)M(t);n()}let rt=!1;function Ci(e){var n=rt;try{return rt=!1,[e(),rt]}finally{rt=n}}function Q(e,n,t,s){var x;var r=!Qe||(t&sr)!==0,i=(t&rr)!==0,o=s,a=!0,l=()=>(a&&(a=!1,o=s),o),c;{var d=Ie in e||Wn in e;c=((x=ge(e,n))==null?void 0:x.set)??(d&&n in e?b=>e[n]=b:void 0)}var u,f=!1;[u,f]=Ci(()=>e[n]),u===void 0&&s!==void 0&&(u=l(),c&&(r&&Cr(),c(u)));var p;if(r?p=()=>{var b=e[n];return b===void 0?l():(a=!0,b)}:p=()=>{var b=e[n];return b!==void 0&&(o=void 0),b===void 0?o:b},c){var g=e.$$legacy;return function(b,S){return arguments.length>0?((!r||!S||g||f)&&c(S?p():b),b):p()}}var _=!1,m=Xn(()=>(_=!1,p()));M(m);var E=w;return function(b,S){if(arguments.length>0){const se=S?M(m):r&&i?Le(b):b;return G(m,se),_=!0,o!==void 0&&(o=se),b}return Ce&&_||(E.f&ke)!==0?m.v:M(m)}}function Si(e){return new $i(e)}var ee,U;class $i{constructor(n){A(this,ee);A(this,U);var i;var t=new Map,s=(o,a)=>{var l=ts(a,!1,!1);return t.set(o,l),l};const r=new Proxy({...n.props||{},$$events:{}},{get(o,a){return M(t.get(a)??s(a,Reflect.get(o,a)))},has(o,a){return a===Wn?!0:(M(t.get(a)??s(a,Reflect.get(o,a))),Reflect.has(o,a))},set(o,a,l){return G(t.get(a)??s(a,l),l),Reflect.set(o,a,l)}});D(this,U,(n.hydrate?pi:ms)(n.component,{target:n.target,anchor:n.anchor,props:r,context:n.context,intro:n.intro??!1,recover:n.recover})),(!((i=n==null?void 0:n.props)!=null&&i.$$host)||n.sync===!1)&&V(),D(this,ee,r.$$events);for(const o of Object.keys(v(this,U)))o==="$set"||o==="$destroy"||o==="$on"||De(this,o,{get(){return v(this,U)[o]},set(a){v(this,U)[o]=a},enumerable:!0});v(this,U).$set=o=>{Object.assign(r,o)},v(this,U).$destroy=()=>{gi(v(this,U))}}$set(n){v(this,U).$set(n)}$on(n,t){v(this,ee)[n]=v(this,ee)[n]||[];const s=(...r)=>t.call(this,...r);return v(this,ee)[n].push(s),()=>{v(this,ee)[n]=v(this,ee)[n].filter(r=>r!==s)}}$destroy(){v(this,U).$destroy()}}ee=new WeakMap,U=new WeakMap;let bs;typeof HTMLElement=="function"&&(bs=class extends HTMLElement{constructor(n,t,s){super();h(this,"$$ctor");h(this,"$$s");h(this,"$$c");h(this,"$$cn",!1);h(this,"$$d",{});h(this,"$$r",!1);h(this,"$$p_d",{});h(this,"$$l",{});h(this,"$$l_u",new Map);h(this,"$$me");this.$$ctor=n,this.$$s=t,s&&this.attachShadow({mode:"open"})}addEventListener(n,t,s){if(this.$$l[n]=this.$$l[n]||[],this.$$l[n].push(t),this.$$c){const r=this.$$c.$on(n,t);this.$$l_u.set(t,r)}super.addEventListener(n,t,s)}removeEventListener(n,t,s){if(super.removeEventListener(n,t,s),this.$$c){const r=this.$$l_u.get(t);r&&(r(),this.$$l_u.delete(t))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let n=function(r){return i=>{const o=document.createElement("slot");r!=="default"&&(o.name=r),Kt(i,o)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;const t={},s=Ti(this);for(const r of this.$$s)r in s&&(r==="default"&&!this.$$d.children?(this.$$d.children=n(r),t.default=!0):t[r]=n(r));for(const r of this.attributes){const i=this.$$g_p(r.name);i in this.$$d||(this.$$d[i]=ot(i,r.value,this.$$p_d,"toProp"))}for(const r in this.$$p_d)!(r in this.$$d)&&this[r]!==void 0&&(this.$$d[r]=this[r],delete this[r]);this.$$c=Si({component:this.$$ctor,target:this.shadowRoot||this,props:{...this.$$d,$$slots:t,$$host:this}}),this.$$me=Vr(()=>{Xr(()=>{var r;this.$$r=!0;for(const i of lt(this.$$c)){if(!((r=this.$$p_d[i])!=null&&r.reflect))continue;this.$$d[i]=this.$$c[i];const o=ot(i,this.$$d[i],this.$$p_d,"toAttribute");o==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,o)}this.$$r=!1})});for(const r in this.$$l)for(const i of this.$$l[r]){const o=this.$$c.$on(r,i);this.$$l_u.set(i,o)}this.$$l={}}}attributeChangedCallback(n,t,s){var r;this.$$r||(n=this.$$g_p(n),this.$$d[n]=ot(n,s,this.$$p_d,"toProp"),(r=this.$$c)==null||r.$set({[n]:this.$$d[n]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(n){return lt(this.$$p_d).find(t=>this.$$p_d[t].attribute===n||!this.$$p_d[t].attribute&&t.toLowerCase()===n)||n}});function ot(e,n,t,s){var i;const r=(i=t[e])==null?void 0:i.type;if(n=r==="Boolean"&&typeof n!="boolean"?n!=null:n,!s||!t[e])return n;if(s==="toAttribute")switch(r){case"Object":case"Array":return n==null?null:JSON.stringify(n);case"Boolean":return n?"":null;case"Number":return n??null;default:return n}else switch(r){case"Object":case"Array":return n&&JSON.parse(n);case"Boolean":return n;case"Number":return n!=null?+n:n;default:return n}}function Ti(e){const n={};return e.childNodes.forEach(t=>{n[t.slot||"default"]=!0}),n}function xs(e,n,t,s,r,i){let o=class extends bs{constructor(){super(e,t,r),this.$$p_d=n}static get observedAttributes(){return lt(n).map(a=>(n[a].attribute||a).toLowerCase())}};return lt(n).forEach(a=>{De(o.prototype,a,{get(){return this.$$c&&a in this.$$c?this.$$c[a]:this.$$d[a]},set(l){var u;l=ot(a,l,n),this.$$d[a]=l;var c=this.$$c;if(c){var d=(u=ge(c,a))==null?void 0:u.get;d?c[a]=l:c.$set({[a]:l})}}})}),s.forEach(a=>{De(o.prototype,a,{get(){var l;return(l=this.$$c)==null?void 0:l[a]}})}),e.element=o,o}var Ri=ci('<button class="header svelte-188d8wh"><span><svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M5 6l3 3 3-3" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span> <span class="header-text"> </span></button> <div><!></div>',1);const Li={hash:"svelte-188d8wh",code:`:host {display:block;border:1px solid var(--dark-background-l);border-radius:4px;overflow:hidden;background:var(--dark-background);width:50%;max-width:700px;}.header.svelte-188d8wh {display:flex;align-items:center;cursor:pointer;padding:1rem;background:var(--dark-background-e);border:none;font-family:var(--global-font);width:100%;}.caret.svelte-188d8wh {transition:transform 0.2s;margin-right:1rem;width:1em;height:1em;display:inline-block;vertical-align:middle;transform:rotate(-90deg);}:host([expanded]) .caret.svelte-188d8wh,\r
.caret.expanded.svelte-188d8wh {transform:rotate(0deg);}.content.svelte-188d8wh {padding:1rem;display:none;}.content.expanded.svelte-188d8wh {display:block;}`};function Mi(e,n){Yt(n,!1),ws(e,Li);let t=Q(n,"header",12,""),s=ts(!1);function r(){G(s,!M(s))}var i=Ri(),o=Hr(i),a=X(o);let l;var c=j(a,2),d=X(c,!0);Y(c),Y(o);var u=j(o,2);let f;var p=X(u);return vi(p,n,"default",{}),Y(u),ls((g,_)=>{N(o,"aria-expanded",M(s)),l=xn(a,1,"caret svelte-188d8wh",null,l,g),Ot(d,t()),f=xn(u,1,"content svelte-188d8wh",null,f,_)},[()=>({expanded:M(s)}),()=>({expanded:M(s)})]),wn("click",o,r),wn("keydown",o,g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),r())}),Kt(e,i),Xt({get header(){return t()},set header(g){t(g),V()}})}customElements.define("collapse-view",xs(Mi,{header:{}},["default"],[],!0));var Ii=hi('<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" class="svelte-u4n63s"><defs><linearGradient x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%"></stop><stop offset="100%"></stop></linearGradient><linearGradient x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%"></stop><stop offset="100%"></stop></linearGradient><filter x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="5" dy="5" stdDeviation="10" flood-color="rgba(0,0,0,0.5)"></feDropShadow></filter><filter x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="25" dy="25" stdDeviation="25" flood-color="rgba(0,0,0,0.75)"></feDropShadow></filter></defs><g><rect x="0" y="0" width="300" height="300"></rect></g><text x="155" y="170" text-anchor="middle" dominant-baseline="middle" font-size="180" opacity="1.0"> </text><text x="150" y="165" text-anchor="middle" dominant-baseline="middle" font-size="180" stroke="rgba(255,255,255,0.3)" stroke-width="1"> </text></svg>');const Ai={hash:"svelte-u4n63s",code:":host {display:inline-block;}svg.svelte-u4n63s {filter:none;}"};function Ni(e,n){Yt(n,!1),ws(e,Ai);let t=Q(n,"text",12,"Hz"),s=Q(n,"size",12,300),r=Q(n,"radius",12,"0.5rem"),i=Q(n,"shadowColor",12,"var(--haze-color-shadow)"),o=Q(n,"foregroundTopColor",12,"var(--haze-color-foreground-top)"),a=Q(n,"foregroundBottomColor",12,"var(--haze-color-foreground-bottom)"),l=Q(n,"backgroundTopColor",12,"var(--haze-color-background-top)"),c=Q(n,"backgroundBottomColor",12,"var(--haze-color-background-bottom)");const d=Math.random().toString(36).substring(2,9),u=`bgGradient-${d}`,f=`textGradient-${d}`,p=`dropShadow-${d}`,g=`richShadow-${d}`;ki();var _=Ii(),m=X(_),E=X(m),x=X(E),b=j(x);Y(E);var S=j(E),se=X(S),bt=j(se);Y(S);var Se=j(S),$e=j(Se);Y(m);var re=j(m),Cs=X(re);Y(re);var et=j(re),Ss=X(et,!0);Y(et);var tt=j(et),$s=X(tt,!0);return Y(tt),Y(_),ls(()=>{yi(_,r()?`border-radius: ${r()};`:""),N(_,"width",s()),N(_,"height",s()),N(E,"id",u),N(x,"stop-color",l()),N(b,"stop-color",c()),N(S,"id",f),N(se,"stop-color",o()),N(bt,"stop-color",a()),N(Se,"id",p),N($e,"id",g),N(Cs,"fill",`url(#${u})`),N(et,"fill",i()),Ot(Ss,t()),N(tt,"fill",`url(#${f})`),N(tt,"filter",`url(#${p}) url(#${g})`),Ot($s,t())}),Kt(e,_),Xt({get text(){return t()},set text(I){t(I),V()},get size(){return s()},set size(I){s(I),V()},get radius(){return r()},set radius(I){r(I),V()},get shadowColor(){return i()},set shadowColor(I){i(I),V()},get foregroundTopColor(){return o()},set foregroundTopColor(I){o(I),V()},get foregroundBottomColor(){return a()},set foregroundBottomColor(I){a(I),V()},get backgroundTopColor(){return l()},set backgroundTopColor(I){l(I),V()},get backgroundBottomColor(){return c()},set backgroundBottomColor(I){c(I),V()}})}customElements.define("symbol-icon",xs(Ni,{text:{},size:{},radius:{},shadowColor:{},foregroundTopColor:{},foregroundBottomColor:{},backgroundTopColor:{},backgroundBottomColor:{}},[],[],!0));const Es="pane-visibility";function Oi(){const e=localStorage.getItem(Es);if(e)try{const n=JSON.parse(e);if(Array.isArray(n))return n}catch{}return null}function Cn(e){localStorage.setItem(Es,JSON.stringify(e))}window.addEventListener("DOMContentLoaded",()=>{const e=Array.from(document.querySelectorAll("symbol-toggle")),n=document.querySelector("pane-view");let t=Oi();(!t||t.length!==e.length)&&(t=Array(e.length).fill(!0),Cn(t)),e.forEach((l,c)=>{l.checked=t[c]??!0,l.addEventListener("toggle-change",d=>{t[c]=d.detail.checked,Cn(t),n.setVisiblePanes(t)})}),n.setVisiblePanes(t);const s=n.querySelector("#source-pane source-editor");s&&(s.attachEventListeners(),s.initialize("file:///c:/Users/Connor/Desktop/clarity/src/index.ts",Ct,at)),n.querySelector("program-tree");const r=n.querySelector("#ir-pane source-editor");r&&(r.attachEventListeners(),r.initialize("file:///c:/Users/Connor/Desktop/clarity/src/index.ts",Ct,at));const i=n.querySelector("#asm-pane source-editor");i&&(i.attachEventListeners(),i.initialize("file:///c:/Users/Connor/Desktop/clarity/src/index.ts",Ct,at));const o=new Uint8Array([72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33]),a=n.querySelector("hex-viewer");a&&a.initialize("file:///mock.bin",o,16)});const He=document.querySelector("output-window");He.messages=[];He.visible=!1;var it;const Pi=()=>{He.visible=!0,it!==void 0&&clearTimeout(it),it=window.setTimeout(()=>{He.visible=!1,it=void 0},3e3)};let kt=1;const Ct={notify:e=>{console.log(e);const n=[...He.messages];n.length>0&&n[n.length-1].rawText===e?(kt++,n[n.length-1].text=`${e} [x${kt}]`):(kt=1,n.push({id:Date.now().toString(),text:e,rawText:e,visible:!0})),He.messages=n,Pi()}},Di=new Worker(new URL("/clarity/assets/LanguageServerWorker-BOXhEwlU.js",import.meta.url),{type:"module"}),at=new Worker(new URL("/clarity/assets/LanguageClientWorker-2arvf2PA.js",import.meta.url),{type:"module"}),ks=new MessageChannel,Dt=ks.port1,qt=ks.port2;Di.postMessage({type:"connect",port:Dt},[Dt]);at.postMessage({type:"connect",port:qt},[qt]);Dt.start();qt.start();
