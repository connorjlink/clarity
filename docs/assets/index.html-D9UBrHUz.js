var Rs=Object.defineProperty;var en=t=>{throw TypeError(t)};var Ls=(t,n,e)=>n in t?Rs(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var h=(t,n,e)=>Ls(t,typeof n!="symbol"?n+"":n,e),xt=(t,n,e)=>n.has(t)||en("Cannot "+e);var _=(t,n,e)=>(xt(t,n,"read from private field"),e?e.call(t):n.get(t)),I=(t,n,e)=>n.has(t)?en("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(t):n.set(t,e),D=(t,n,e,s)=>(xt(t,n,"write to private field"),s?s.call(t,e):n.set(t,e),e),Be=(t,n,e)=>(xt(t,n,"access private method"),e);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();const Ms=`
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
`,$n=new CSSStyleSheet;$n.replaceSync(Ms);class Is extends HTMLElement{constructor(){super();h(this,"_messages",[]);h(this,"_visible",!0);h(this,"_endRef",null);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[$n]}static get observedAttributes(){return["visible"]}get messages(){return this._messages}set messages(e){this._messages=e,this.render(),this.scrollToEnd()}get visible(){return this._visible}set visible(e){this._visible=e,this.render()}scrollToEnd(){this._endRef&&this._endRef.scrollIntoView({behavior:"smooth"})}connectedCallback(){this.render()}attributeChangedCallback(e,s,r){e==="visible"&&(this.visible=r!=="false")}render(){this.shadowRoot.innerHTML=`
            <div class="console ${this.visible?"":"fade-out"}">
                ${this._messages.map(e=>`<div class="console-line">${e.text}</div>`).join("")}
                <div id="end"></div>
            </div>
        `,this._endRef=this.shadowRoot.querySelector("#end"),this.scrollToEnd()}}customElements.define("output-window",Is);class As{constructor(n){h(this,"original");h(this,"addBuffer");h(this,"pieces");this.original=n,this.addBuffer="",this.pieces=[{buffer:"original",start:0,length:n.length}]}insert(n,e){if(e.length===0)return;const s=this.addBuffer.length;this.addBuffer+=e;let r=0,i=0;for(;i<this.pieces.length;i++){const c=this.pieces[i];if(r+c.length>=n)break;r+=c.length}if(i===this.pieces.length){this.pieces.push({buffer:"add",start:s,length:e.length});return}const o=this.pieces[i],a=n-r,l=[];a>0&&l.push({buffer:o.buffer,start:o.start,length:a}),l.push({buffer:"add",start:s,length:e.length}),a<o.length&&l.push({buffer:o.buffer,start:o.start+a,length:o.length-a}),this.pieces.splice(i,1,...l)}delete(n,e){let s=0,r=0;for(;r<this.pieces.length&&s+this.pieces[r].length<=n;)s+=this.pieces[r].length,r++;const i=r,o=n-s;let a=e;const l=[];for(;a>0&&r<this.pieces.length;){const c=this.pieces[r],d=r===i?o:0,u=c.length-d;Math.max(0,c.length-u),d>0&&l.push({buffer:c.buffer,start:c.start,length:d}),u<c.length&&l.push({buffer:c.buffer,start:c.start+d+a,length:c.length-(d+a)}),a-=u,r++}this.pieces.splice(i,r-i,...l)}getText(){let n="";for(const e of this.pieces){const s=e.buffer==="original"?this.original:this.addBuffer;n+=s.substr(e.start,e.length)}return n}}var tn;(t=>{t.Error=1,t.Warning=2,t.Info=3,t.Log=4,t.Debug=5})(tn||(tn={}));var nn;(t=>{t.File=1,t.Module=2,t.Namespace=3,t.Package=4,t.Class=5,t.Method=6,t.Property=7,t.Field=8,t.Constructor=9,t.Enum=10,t.Interface=11,t.Function=12,t.Variable=13,t.Constant=14,t.String=15,t.Number=16,t.Boolean=17,t.Array=18,t.Object=19,t.Key=20,t.Null=21,t.EnumMember=22,t.Struct=23,t.Event=24,t.Operator=25,t.TypeParameter=26})(nn||(nn={}));var sn;(t=>{t.None=0,t.Full=1,t.Incremental=2})(sn||(sn={}));var rn;(t=>{t.Text=1,t.Read=2,t.Write=3})(rn||(rn={}));var on;(t=>{t.Error=1,t.Warning=2,t.Information=3,t.Hint=4})(on||(on={}));var an;(t=>{t.Text=1,t.Method=2,t.Function=3,t.Constructor=4,t.Field=5,t.Variable=6,t.Class=7,t.Interface=8,t.Module=9,t.Property=10,t.Unit=11,t.Value=12,t.Enum=13,t.Keyword=14,t.Snippet=15,t.Color=16,t.File=17,t.Reference=18,t.Folder=19,t.EnumMember=20,t.Constant=21,t.Struct=22,t.Event=23,t.Operator=24,t.TypeParameter=25})(an||(an={}));const Ns=`
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
`,Tn=new CSSStyleSheet;Tn.replaceSync(Ns);function Ct(t){let n="";return t.childNodes.forEach((e,s,r)=>{e.nodeType===Node.TEXT_NODE?n+=e.data:e.tagName==="BR"?n+=`
`:e.tagName==="DIV"?(n+=Ct(e),s<r.length-1&&(n+=`
`)):e.nodeType===Node.ELEMENT_NODE&&(n+=Ct(e))}),n}function Ps(t){let n=0;const e=window.getSelection();if(e&&e.rangeCount>0){const s=e.getRangeAt(0),r=s.cloneRange();r.selectNodeContents(t),r.setEnd(s.endContainer,s.endOffset),n=r.toString().length}return n}function Os(t,n){const e=window.getSelection();if(!e)return;let s=0,r=[t],i,o=!1;for(;r.length&&!o&&(i=r.pop(),!!i);)if(i.nodeType===Node.TEXT_NODE){const a=i.length;if(s+a>=n){const l=document.createRange();l.setStart(i,n-s),l.collapse(!0),e.removeAllRanges(),e.addRange(l),o=!0}else s+=a}else{let a=Array.from(i.childNodes);for(let l=a.length-1;l>=0;l--)r.push(a[l])}}class Ds extends HTMLElement{constructor(){super();h(this,"_pieceTable");h(this,"_consoleListener",null);h(this,"_inputRef",null);h(this,"_highlightRef",null);h(this,"_sourceUri","");h(this,"_lastText","");h(this,"_client",null);h(this,"_hasInitialized",!1);h(this,"_boundInputCallback",this.inputCallback.bind(this));h(this,"_boundScrollCallback",this.scrollCallback.bind(this));h(this,"_boundKeydownCallback",this.keydownCallback.bind(this));this._pieceTable=new As("function nvr main = () {}"),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Tn]}connectedCallback(){}disconnectedCallback(){var e;(e=this._client)==null||e.postMessage({type:"execute",method:"closeDocument",params:{uri:this._sourceUri}})}initialize(e,s,r){var i;this._hasInitialized=!0,this._consoleListener||(this._consoleListener=s),r&&(this._client=r,this._client.addEventListener("message",o=>{var a,l,c;o.data.type==="log"?(a=this._consoleListener)==null||a.notify(o.data.message):o.data.type==="error"?(l=this._consoleListener)==null||l.notify(o.data.message):o.data.type==="compileResult"&&((c=this._consoleListener)==null||c.notify(JSON.stringify(o.data.result)))}),this._client.addEventListener("messageerror",o=>{var a;(a=this._consoleListener)==null||a.notify(o.data)}),this._sourceUri=e),(i=this._client)==null||i.postMessage({type:"execute",method:"openDocument",params:{uri:this._sourceUri,sourceCode:this._pieceTable.getText()}}),this.render()}inputCallback(e){this.handleInputChange(e)}scrollCallback(e){this.syncScroll()}keydownCallback(e){this.handleKeyDown(e)}attachEventListeners(){var e,s,r;(e=this._inputRef)==null||e.addEventListener("input",this._boundInputCallback),(s=this._inputRef)==null||s.addEventListener("scroll",this._boundScrollCallback),(r=this._inputRef)==null||r.addEventListener("keydown",this._boundKeydownCallback)}detachEventListeners(){var e,s,r;(e=this._inputRef)==null||e.removeEventListener("input",this._boundInputCallback),(s=this._inputRef)==null||s.removeEventListener("scroll",this._boundScrollCallback),(r=this._inputRef)==null||r.removeEventListener("keydown",this._boundKeydownCallback)}handleInputChange(e){if(!this._inputRef)return;const s=Ct(this._inputRef),r=Ps(this._inputRef);let i=0;for(;i<this._lastText.length&&i<s.length&&this._lastText[i]===s[i];)i++;let o=this._lastText.length-1,a=s.length-1;for(;o>=i&&a>=i&&this._lastText[o]===s[a];)o--,a--;o>=i&&this._pieceTable.delete(i,o-i+1),a>=i&&this._pieceTable.insert(i,s.slice(i,a+1)),this._lastText=s,this.renderHighlight([]),Os(this._inputRef,r)}handleKeyDown(e){e.key==="Tab"&&(e.preventDefault(),document.execCommand("insertText",!1,"    ")),e.key==="Enter"&&(e.preventDefault(),document.execCommand("insertLineBreak"))}renderHighlight(e){var s;this._highlightRef&&(this._pieceTable.getText(),(s=this._client)==null||s.postMessage({type:"execute",method:"recycle",params:{uri:this._sourceUri,deltas:e}}))}syncScroll(){this._inputRef&&this._highlightRef&&(this._highlightRef.scrollTop=this._inputRef.scrollTop,this._highlightRef.scrollLeft=this._inputRef.scrollLeft)}render(){if(!this._hasInitialized)throw new Error("call initialize() on SourceEditorElement before rendering.");const e=this._pieceTable.getText();this.shadowRoot.innerHTML=`
            <div class="editor-shell">
                <pre class="highlight-layer"></pre>
                <div class="input-layer" contenteditable="true" spellcheck="false"></div>
            </div>
        `,this._highlightRef=this.shadowRoot.querySelector(".highlight-layer"),this._inputRef=this.shadowRoot.querySelector(".input-layer"),this._inputRef&&(this._inputRef.textContent=e,this._lastText=e),this.attachEventListeners(),this.renderHighlight([])}}customElements.define("source-editor",Ds);const qs=`
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
`,Rn=new CSSStyleSheet;Rn.replaceSync(qs);class zs extends HTMLElement{constructor(){super();h(this,"_data",new Uint8Array);h(this,"_columns",16);h(this,"_highlightRef",null);h(this,"_client",null);h(this,"_symbols",[]);h(this,"_sourceUri","");h(this,"_hasInitialized",!1);h(this,"_resizeObserver",null);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Rn]}connectedCallback(){const e=this.parentElement??this;this._resizeObserver=new ResizeObserver(()=>this._onResize()),this._resizeObserver.observe(e)}disconnectedCallback(){var e,s;(e=this._resizeObserver)==null||e.disconnect(),(s=this._client)==null||s.postMessage({type:"execute",method:"closeDocument",params:{uri:this._sourceUri}})}initialize(e,s,r=16,i=null){var o,a;this._hasInitialized=!0,this._client=i,this._sourceUri=e,this._data=s,this._columns=r,(o=this._client)==null||o.addEventListener("message",l=>{l.data.type==="symbolInfo"&&l.data.uri===this._sourceUri&&(this._symbols=l.data.symbols,this.render())}),(a=this._client)==null||a.postMessage({type:"execute",method:"openDocument",params:{uri:this._sourceUri,sourceCode:Array.from(this._data).map(l=>l.toString(16).padStart(2,"0")).join(" ")}}),this.render()}setColumns(e){e!==this._columns&&(this._columns=e,this.render())}_onResize(){const e=parseInt(getComputedStyle(this.shadowRoot.host).fontSize.replace("px","")),s=e*8,r=this._columns*8,i=e*2,o=this.getBoundingClientRect().width-s-r-i,a=Math.max(1,o/24);Math.abs(a-this._columns)>.5&&this.setColumns(Math.floor(a))}getSymbolAt(e){for(const s of this._symbols)if(e>=s.address&&e<s.address+s.length)return s;return null}render(){if(!this._hasInitialized)throw new Error("call initialize() on HexViewerElement before rendering.");this.shadowRoot.innerHTML=`
            <div class="hex-shell">
                <pre class="hex-highlight-layer"></pre>
            </div>
        `,this._highlightRef=this.shadowRoot.querySelector(".hex-highlight-layer"),this._highlightRef&&(this._highlightRef.innerHTML=this.renderHex())}renderHex(){let e='<table class="hex-table"><thead>';e+="<tr>",e+='<th class="hex-address">Address</th>',e+='<th colspan="'+this._columns+'">Offset</th>',e+='<th class="hex-ascii">ASCII</th>',e+="</tr>",e+='<tr class="header-spacer-row"></tr>',e+='<tr class="hex-offset-row">',e+="<th></th>";for(let s=0;s<this._columns;s++)e+=`<th class="hex-offset">+${s.toString(16).toUpperCase()}</th>`;e+="<th></th>",e+="</tr>",e+='<tr class="header-spacer-row"></tr>',e+="</thead><tbody>";for(let s=0;s<Math.ceil(this._data.length/this._columns);s++){const r=s*this._columns;e+="<tr>",e+=`<td class="hex-address">${r.toString(16).padStart(8,"0")}</td>`;for(let i=0;i<this._columns;i++){const o=r+i;if(o<this._data.length){const a=this.getSymbolAt(o),l=a?a.color:"#ccc",c=this._data[o].toString(16).padStart(2,"0");e+=`<td class="hex-byte" style="color:${l}">${c}</td>`}else e+="<td></td>"}e+='<td class="hex-ascii">';for(let i=0;i<this._columns;i++){const o=r+i;if(o<this._data.length){const a=this._data[o];e+=a>=32&&a<=126?String.fromCharCode(a):"."}else e+=" "}e+="</td>",e+="</tr>"}return e+="</tbody></table>",e}}customElements.define("hex-viewer",zs);class Hs{constructor(n=[],e=[]){h(this,"nodes",new Map);h(this,"connections",new Map);n.forEach(s=>this.nodes.set(s.id,s)),e.forEach(s=>this.connect(s.from,s.to))}static connectionKey(n,e){return[n.nodeId,n.clickspotId,e.nodeId,e.clickspotId].sort().join("|")}getNodes(){return Array.from(this.nodes.values())}getAllConnections(){return Array.from(this.connections.values()).flatMap(n=>Array.from(n))}getConnections(n){const e=new Set;for(const s of this.connections.values())for(const r of s)(r.from.nodeId===n||r.to.nodeId===n)&&e.add(r);return e}addNode(n){this.nodes.set(n.id,n)}removeNode(n){this.nodes.delete(n);for(const[e,s]of Array.from(this.connections.entries()))for(const r of s)(r.from.nodeId===e||r.to.nodeId===e)&&s.delete(r),s.size===0&&this.connections.delete(e)}updateNodePosition(n,e){const s=this.nodes.get(n);s&&(s.position=e)}setParent(n,e){const s=this.nodes.get(n);s&&(s.parentId=e)}connect(n,e){var a,l;if(n.nodeId===e.nodeId)return;let s=this.connections.get(n.nodeId);s||(s=new Set,this.connections.set(n.nodeId,s)),s.add({from:n,to:e});const r=document.querySelector("program-tree");r&&(r.setNodeConnected(n.nodeId,n.clickspotId,!0),r.setNodeConnected(e.nodeId,e.clickspotId,!0));var i=(a=this.nodes.get(n.nodeId))==null?void 0:a.clickspots.find(c=>c.id===n.clickspotId);i&&(i.isConnected=!0);var o=(l=this.nodes.get(e.nodeId))==null?void 0:l.clickspots.find(c=>c.id===e.clickspotId);o&&(o.isConnected=!0)}disconnect(n){var r,i;for(const[o,a]of this.connections.entries())for(const l of a)if(l.from.nodeId===n.nodeId&&l.from.clickspotId===n.clickspotId||l.to.nodeId===n.nodeId&&l.to.clickspotId===n.clickspotId){const c=document.querySelector("program-tree");c&&(c.setNodeConnected(l.from.nodeId,l.from.clickspotId,!1),c.setNodeConnected(l.to.nodeId,l.to.clickspotId,!1));var e=(r=this.nodes.get(l.from.nodeId))==null?void 0:r.clickspots.find(d=>d.id===l.from.clickspotId);e&&(e.isConnected=!1);var s=(i=this.nodes.get(l.to.nodeId))==null?void 0:i.clickspots.find(d=>d.id===l.to.clickspotId);s&&(s.isConnected=!1),a.delete(l),a.size===0&&this.connections.delete(o);break}}load(n,e){this.nodes.clear(),this.connections.clear(),n.forEach(s=>this.nodes.set(s.id,s)),e.forEach(s=>this.connect(s.from,s.to))}}const Ws=`
    :host {
        position: absolute;
    }

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
`,Ln=new CSSStyleSheet;Ln.replaceSync(Ws);class Bs extends HTMLElement{constructor(){super();h(this,"onMove");h(this,"onConnectStart");h(this,"onConnectEnd");h(this,"onDisconnect");h(this,"onTempLine");h(this,"isClickspotConnected");h(this,"screenToWorld");h(this,"worldToScreen");h(this,"_areCallbacksSet",!1);h(this,"_contentRef");h(this,"_nodeId","");h(this,"_position",{x:0,y:0});h(this,"_clickspots",[]);h(this,"_isDragging",!1);h(this,"_dragOffset",{x:0,y:0});this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Ln]}static get observedAttributes(){return["id","x","y"]}setCallbacks(e){Object.assign(this,e),this._areCallbacksSet=!0}connectedCallback(){this.render()}attributeChangedCallback(e,s,r){e==="node-id"&&r&&(this._nodeId=r),this.render()}set data(e){this._nodeId=e.nodeId,this._position=e.position,this._clickspots=e.clickspots,this._isDragging=!1,this._dragOffset={x:0,y:0},this.render()}elementFromPoint(e,s){const r=this.shadowRoot.elementFromPoint(e,s);return r||null}clickspotFromId(e){return this.shadowRoot.querySelector(`#${e}`)}getBoundingClientRect(){const e=this.shadowRoot.querySelector(`#${this._nodeId}`);return e?e.getBoundingClientRect():new DOMRect(0,0,0,0)}getRealNode(){return this.shadowRoot.querySelector(`#${this._nodeId}`)}updateTransform(e){this._position=e,this._contentRef&&(this._contentRef.style.transform=`translate3d(${this._position.x}px, ${this._position.y}px, 0)`)}setConnected(e,s){const r=this.clickspotFromId(e);r&&r.classList.toggle("connected",s)}attachEventListeners(){var e,s;(e=this.shadowRoot.querySelector(".node-header"))==null||e.addEventListener("mousedown",r=>{this.startNodeDrag(r)}),(s=this.shadowRoot.querySelectorAll(".node-clickspot"))==null||s.forEach(r=>{r.addEventListener("mousedown",i=>{this.handleClickspotMouseDown(r.getAttribute("id"),i)})})}getLocationByClassList(e){return e.contains("left")?"left":e.contains("right")?"right":e.contains("bottom")?"bottom":null}startNodeDrag(e){if(e.button!==0)return;this._isDragging=!0;const s=this.screenToWorld({x:e.clientX,y:e.clientY});this._dragOffset={x:s.x-this._position.x,y:s.y-this._position.y};const r=o=>{var l;if(!this._isDragging)return;const a=this.screenToWorld({x:o.clientX,y:o.clientY});(l=this.onMove)==null||l.call(this,{x:a.x-this._dragOffset.x,y:a.y-this._dragOffset.y})},i=()=>{this._isDragging=!1,document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",i)};document.addEventListener("mousemove",r),document.addEventListener("mouseup",i)}handleClickspotMouseDown(e,s){if(s.button===0)if(this.isClickspotConnected({nodeId:this._nodeId,clickspotId:e,location:null}))this.onDisconnect({nodeId:this._nodeId,clickspotId:e,location:null});else{const r=s.target.closest(".node-clickspot");if(!r){this.onTempLine(null);return}this._isDragging=!0;const i=r.getBoundingClientRect(),o={x:i.left+i.width/2,y:i.top+i.height/2},a=this.screenToWorld(o),l=s.target.closest(".node");if(!l){this.onTempLine(null);return}const c=l.getAttribute("id");if(!c){this.onTempLine(null);return}const d=r.closest(".node-clickspot-container");if(!d){this.onTempLine(null);return}const u=this.getLocationByClassList(d.classList);this.onConnectStart({nodeId:c,clickspotId:e,location:u});const f=v=>{if(!this._isDragging){this.onTempLine(null);return}const g={x:v.clientX,y:v.clientY},b=this.screenToWorld(g);this.onTempLine([{start:{x:a.x,y:a.y},end:{x:b.x,y:b.y}},u])},p=v=>{this._isDragging=!1,document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",p);const g={x:v.clientX,y:v.clientY},b=Array.from(this.parentElement.querySelectorAll("tree-node"));let E=null,x=null;for(const Ce of b){const $e=Ce.getBoundingClientRect();if(g.x>=$e.left&&g.x<=$e.right&&g.y>=$e.top&&g.y<=$e.bottom){const re=Ce.elementFromPoint(g.x,g.y);if(re&&re.classList.contains("node-clickspot")&&!re.classList.contains("connected")){E=Ce.getRealNode(),x=re;break}}}if(!E){this.onTempLine(null);return}if(!x||!x.classList.contains("node-clickspot")||x.classList.contains("connected")){this.onTempLine(null);return}const w=x.getAttribute("id"),O=E.getAttribute("id");if(!w||!O){this.onTempLine(null);return}const se=x.closest(".node-clickspot-container");if(!se){this.onTempLine(null);return}const bt=this.getLocationByClassList(se.classList);O&&O!==c&&this.onConnectEnd({nodeId:c,clickspotId:e,location:u},{nodeId:O,clickspotId:w,location:bt}),this.onTempLine(null)};document.addEventListener("mousemove",f),document.addEventListener("mouseup",p)}}render(){this.shadowRoot.innerHTML=`
            <div
                id="${this._nodeId}"
                class="node shadowed"
            >
                <div class="node-header">
                    <img src="/res/expression.svg" class="node-icon" />
                    <span>Exponentiation Expression</span>
                </div>
                <div class="node-body">
                    ${["left","bottom","right"].map(e=>`
                        <div class="node-clickspot-container ${e}">
                            ${this._clickspots.filter(s=>s.location===e).map(s=>`
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
        `,this._contentRef=this.shadowRoot.querySelector(`#${this._nodeId}`),this.updateTransform(this._position),this._areCallbacksSet&&this.attachEventListeners()}}customElements.define("tree-node",Bs);const Us=`
    *, *::before, *::after {
        box-sizing: border-box;
    }
    .pane-descriptor {
        display: flex;
        padding: 0.5rem;
        background: var(--dark-background-e);
        border-top: 1px solid var(--node-border);
        border-bottom: 1px solid var(--node-border);
        width: 100%;
        position: relative;
        z-index: 2;
    }
        .pane-descriptor .grow {
            flex: 1;
            text-align: right;
        }
`,Mn=new CSSStyleSheet;Mn.replaceSync(Us);class Fs extends HTMLElement{constructor(){super();h(this,"_header","");h(this,"_pluginNameRef","");h(this,"_pluginRef",null);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Mn]}connectedCallback(){this._header=this.getAttribute("data-header")||"",this._pluginNameRef=this.getAttribute("id")||"",this.render()}getPlugin(){return this._pluginRef}render(){if(this.shadowRoot.innerHTML=`
            <div class="pane-descriptor">${this._header}</div>
        `,this._pluginNameRef){const e=document.createElement("span");e.className="grow",this.shadowRoot.querySelector(".pane-descriptor").appendChild(e),this._pluginRef=e}}}customElements.define("pane-status",Fs);const Vs=`
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
`,In=new CSSStyleSheet;In.replaceSync(Vs);const Me=class Me extends HTMLElement{constructor(){super();h(this,"_container");h(this,"_scale",1);h(this,"_scalePlugin");h(this,"_isPanning",!1);h(this,"_position",{x:0,y:0});h(this,"_lastPosition",{x:0,y:0});this.onMouseDown=this.onMouseDown.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onWheel=this.onWheel.bind(this),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[In],this._scalePlugin=document.querySelector("#ast-zoom-plugin")}connectedCallback(){this.render(),this.updateTransform(),this._container.addEventListener("mousedown",this.onMouseDown),this._container.addEventListener("wheel",this.onWheel,{passive:!1})}disconnectedCallback(){this._container.removeEventListener("mousedown",this.onMouseDown),this._container.removeEventListener("wheel",this.onWheel),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("mouseup",this.onMouseUp)}screenToWorld(e){return{x:(e.x-this._position.x)/this._scale,y:(e.y-this._position.y)/this._scale}}worldToScreen(e){return{x:e.x*this._scale+this._position.x,y:e.y*this._scale+this._position.y}}getTransform(){return{scale:this._scale,position:{...this._position}}}updateTransform(){this._container.style.transform=`translate(${this._position.x}px, ${this._position.y}px) scale(${this._scale})`,this._scalePlugin.getPlugin().innerHTML=`${Math.floor(parseFloat(this._scale.toFixed(2))*100)}%`}onMouseDown(e){let s=e.target;for(;s;){if(s.nodeName.toLowerCase()==="tree-node")return;s=s.parentElement}this._isPanning=!0,this._lastPosition={x:e.clientX-this._position.x,y:e.clientY-this._position.y},window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("mouseup",this.onMouseUp),this._container.style.cursor="grabbing"}onMouseMove(e){this._isPanning&&(this._position.x=e.clientX-this._lastPosition.x,this._position.y=e.clientY-this._lastPosition.y,this.updateTransform())}onMouseUp(){this._isPanning=!1,window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("mouseup",this.onMouseUp),this._container.style.cursor="grab",setTimeout(()=>{this._isPanning||(this._container.style.cursor="default")},1e3)}onWheel(e){e.preventDefault();const s=-e.deltaY*.001,r=Math.min(Me.maxScale,Math.max(Me.minScale,this._scale+s)),i=this.getBoundingClientRect(),o=e.clientX-i.left,a=e.clientY-i.top,l=o-this._position.x,c=a-this._position.y,d=r/this._scale;this._position.x=o-l*d,this._position.y=a-c*d,this._scale=r,this.updateTransform()}render(){this.shadowRoot.innerHTML=`
            <div class="wrapper">
                <div class="container">
                    <slot name="transformed-view-slot"></slot>
                </div>
            </div>
        `,this._container=this.shadowRoot.querySelector(".container")}};h(Me,"minScale",.2),h(Me,"maxScale",3);let $t=Me;customElements.define("transformed-view",$t);const js=`
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
`,An=new CSSStyleSheet;An.replaceSync(js);class Nn extends HTMLElement{constructor(){super();h(this,"_nodeManager");h(this,"_transformedViewRef");h(this,"_contentRef");h(this,"_connectionsCanvas");h(this,"_canvasRef");this._nodeManager=new Hs([{id:"node1",label:"Hello, 123123",position:{x:100,y:100},clickspots:[{id:"clickspot-a",location:"left"},{id:"clickspot-b",location:"right"},{id:"clickspot-e",location:"bottom"}]},{id:"node2",label:"This is a new test node",position:{x:400,y:200},clickspots:[{id:"clickspot-c",location:"left"},{id:"clickspot-d",location:"bottom"}]},{id:"node3",label:"Testing testing testing",position:{x:550,y:400},clickspots:[{id:"clickspot-f",location:"left"},{id:"clickspot-g",location:"left"}]}]),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[An]}connectedCallback(){this.render()}attributeChangedCallback(e,s,r){}setNodeConnected(e,s,r){const i=this.shadowRoot.querySelector(`tree-node[data-node-id="${e}"]`);i&&i.setConnected(s,r)}getClickspotCenterScreen(e,s){const r=this.shadowRoot.querySelector(`tree-node[data-node-id="${e}"]`);if(!r||!this._connectionsCanvas)return null;const i=r.clickspotFromId(s);if(!i)return null;const o=i.getBoundingClientRect(),a=this._connectionsCanvas.getBoundingClientRect();return{x:o.left+o.width/2-a.left,y:o.top+o.height/2-a.top}}isClickspotConnected(e){const s=this._nodeManager.getConnections(e.nodeId);for(const r of s)if(r.from.clickspotId===e.clickspotId||r.to.clickspotId===e.clickspotId)return!0;return!1}handleConnectStart(e){}handleConnectEnd(e,s){e&&(e.nodeId!==s.nodeId||e.clickspotId!==s.clickspotId)&&(this._nodeManager.connect(e,s),this.handleTempLine(null)),this.renderLines()}handleRemoveLines(e){this._nodeManager.disconnect(e),!(!this._connectionsCanvas||!this._canvasRef)&&this.renderLines()}handleNodeMove(e,s){this._nodeManager.updateNodePosition(e,s);const r=this.shadowRoot.querySelector(`tree-node[data-node-id="${e}"]`);r&&r.updateTransform(s),this.renderLines()}clearLines(){!this._connectionsCanvas||!this._canvasRef||this._canvasRef.clearRect(0,0,this._connectionsCanvas.width,this._connectionsCanvas.height)}renderLines(){if(!this._connectionsCanvas||!this._canvasRef||!this._transformedViewRef)return;this.clearLines();const e=this._nodeManager.getAllConnections();for(const s of e){const r=this.getClickspotCenterScreen(s.from.nodeId,s.from.clickspotId),i=this.getClickspotCenterScreen(s.to.nodeId,s.to.clickspotId);!r||!i||!s.from.location||this.drawBezierPathScreen(r,i,s.from.location,s.to.location,"rgb(143, 132, 213)",2,!1)}}handleTempLine(e){var d;if(this.renderLines(),!e||!this._canvasRef)return;const{start:s,end:r}=e[0],i=e[1],o=this.getBoundingClientRect()||{left:0,top:0},a=(d=this._transformedViewRef)==null?void 0:d.getTransform();a&&(s.x*=a.scale,s.y*=a.scale,r.x*=a.scale,r.y*=a.scale);const l={x:s.x-o.left,y:s.y-o.top},c={x:r.x-o.left,y:r.y-o.top};this.drawBezierPathScreen(l,c,i,null,"rgb(171, 167, 200)",2,!0)}getBezierPath(e,s,r){const{start:i,end:o}=e,a=100;let l=r;if(!r&&s){const p=o.x-i.x,v=o.y-i.y,g=Math.atan2(v,p)*180/Math.PI;s==="left"?g>-45&&g<45?l="left":g>=45&&g<=135?l="bottom":l=null:s==="right"?g>135||g<-135?l="right":g>=-135&&g<=-45?l="bottom":l=null:s==="bottom"&&(g>135||g<-135?l="right":g>-45&&g<45?l="left":g>=45&&g<=135&&(l="bottom"))}let c=i.x,d=i.y;s==="left"?c-=a:s==="right"?c+=a:s==="bottom"&&(d+=a);let u=o.x,f=o.y;return l==="left"?u-=a:l==="right"?u+=a:l==="bottom"&&(f+=a),[i.x,i.y,c,d,u,f,o.x,o.y]}drawBezierPathScreen(e,s,r,i,o,a,l){var g;if(!this._canvasRef)return;const c=(g=this._transformedViewRef)==null?void 0:g.getTransform();c&&(e.x/=c.scale,e.y/=c.scale,s.x/=c.scale,s.y/=c.scale);const d=100;let u=e.x,f=e.y;r==="left"?u-=d:r==="right"?u+=d:r==="bottom"&&(f+=d);let p=s.x,v=s.y;i==="left"?p-=d:i==="right"?p+=d:i==="bottom"&&(v+=d),this._canvasRef.save(),l?this._canvasRef.setLineDash([4,4]):this._canvasRef.setLineDash([]),this._canvasRef.beginPath(),this._canvasRef.moveTo(e.x,e.y),this._canvasRef.bezierCurveTo(u,f,p,v,s.x,s.y),this._canvasRef.strokeStyle=o,this._canvasRef.lineWidth=a,this._canvasRef.stroke(),this._canvasRef.restore()}resizeCanvas(){if(!this._connectionsCanvas)return;const e=this._connectionsCanvas.parentElement;if(e){const s=e.getBoundingClientRect();this._connectionsCanvas.width=s.width,this._connectionsCanvas.height=s.height}}renderNodes(){if(!this._contentRef)return;const e=new Map;this._contentRef.querySelectorAll("tree-node").forEach(r=>{const i=r.getAttribute("id");i&&e.set(i,r)});const s=new Set;for(const r of this._nodeManager.getNodes()){s.add(r.id);let i=e.get(r.id);i||(i=document.createElement("tree-node"),i.data={nodeId:r.id,position:r.position,clickspots:r.clickspots},i.setCallbacks({onMove:a=>this.handleNodeMove(r.id,a),onConnectStart:a=>this.handleConnectStart(a),onConnectEnd:(a,l)=>this.handleConnectEnd(a,l),onDisconnect:a=>this.handleRemoveLines(a),onTempLine:a=>this.handleTempLine(a),isClickspotConnected:a=>this.isClickspotConnected(a),screenToWorld:a=>{var l;return((l=this._transformedViewRef)==null?void 0:l.screenToWorld(a))??a},worldToScreen:a=>{var l;return((l=this._transformedViewRef)==null?void 0:l.worldToScreen(a))??a}}),i.setAttribute("data-node-id",r.id),this._contentRef.appendChild(i));const o=i.querySelector(".node-content");o&&(o.textContent=r.label)}e.forEach((r,i)=>{s.has(i)||r.remove()})}render(){this.shadowRoot.innerHTML=`
            <transformed-view id="program-tree-transformed-view">
                <div id="transform-content" slot="transformed-view-slot">
                    <canvas id="connections-canvas"></canvas>
                </div>
            </transformed-view>
        `,this._transformedViewRef=this.shadowRoot.querySelector("#program-tree-transformed-view"),this._contentRef=this._transformedViewRef.querySelector("#transform-content"),this._connectionsCanvas=this._contentRef.querySelector("#connections-canvas"),this._canvasRef=this._connectionsCanvas.getContext("2d"),window.addEventListener("resize",()=>{this.resizeCanvas(),this.renderLines()}),this.resizeCanvas(),this.renderLines(),this.renderNodes()}}h(Nn,"observedAttributes",[]);customElements.define("program-tree",Nn);class Ys extends HTMLElement{constructor(){super(...arguments);h(this,"tabsContent");h(this,"pages",[])}connectedCallback(){this.render(),window.addEventListener("popstate",s=>{var i;const r=((i=s.state)==null?void 0:i.tab)??this.getTabIndexFromUrl();typeof r=="number"&&r>=0&&r<this.pages.length&&this.activatePage(r,!1)});const e=this.getTabIndexFromUrl();typeof e=="number"&&e>=0&&e<this.pages.length&&this.activatePage(e,!1)}getTabIndexFromUrl(){let e=window.location.pathname.replace(/^\//,"");e.startsWith("clarity/")&&(e=e.substring(8));const s=Array.from(this.querySelectorAll("my-tab"));for(let r=0;r<s.length;r++)if(s[r].getAttribute("route")===e)return r;return 0}activatePage(e,s=!0){if(this.pages.forEach((r,i)=>{const o=this.tabsContent.querySelectorAll("input"),a=i===e;r.classList.toggle("active",a),o[i]&&(o[i].checked=a)}),s){const i=Array.from(this.querySelectorAll("my-tab"))[e].getAttribute("route")||"",a=`${window.location.origin}/clarity/${i}`;history.pushState({tab:e},"",a)}}render(){const e=this.querySelector("my-header");if(e){const i=e.children[0];if(i){let o=document.createElement("div");o.className="tabs-bar",i.classList.add("tabs-header"),o.appendChild(i),this.prepend(o)}e.remove()}this.tabsContent=document.createElement("div"),this.tabsContent.className="tabs-content";const s=this.querySelector(".tabs-bar");s?s.append(this.tabsContent):this.prepend(this.tabsContent),Array.from(this.querySelectorAll("my-tab")).forEach((i,o)=>{const a=i.getAttribute("label")||`Tab ${o+1}`,l=`tab-${o}`,c=`tabpanel-${o}`,d=document.createElement("input");d.type="radio",d.id=l,d.checked=o===0,d.addEventListener("change",()=>this.activatePage(o,!0));const u=document.createElement("label");u.htmlFor=l,u.textContent=a;const f=document.createElement("span");f.className="tab-radio-wrapper",f.appendChild(d),f.appendChild(u),this.tabsContent.appendChild(f),i.classList.add("page"),i.setAttribute("id",c),o===0&&i.classList.add("active"),this.pages.push(i)})}}customElements.define("my-tabview",Ys);class Xs extends HTMLElement{}customElements.define("my-tab",Xs);class Gs extends HTMLElement{}customElements.define("my-header",Gs);class Js extends HTMLElement{constructor(){super()}connectedCallback(){this.render()}render(){const n=document.createElement("div");n.className="article-list";const e=this.querySelectorAll("my-article");for(let r=0;r<e.length;r++){const i=e[r],o=i.querySelector("my-article-header");if(!o){console.warn(`Article ${r} does not have a header.`);continue}const a=document.createElement("div");a.className="article-item shadowed hoverable",a.innerHTML=o.outerHTML,a.addEventListener("click",()=>{const l=this.querySelector(".article-content-container");l&&(n.style.display="none",l.style.display="flex",l.innerHTML=i.innerHTML)}),n.appendChild(a)}this.innerHTML="";let s=document.createElement("div");s.className="article-content-container",s.style.display="none",this.appendChild(n),this.appendChild(s)}}class Zs extends HTMLElement{constructor(){super(...arguments);h(this,"_rendered",!1)}connectedCallback(){this.render()}render(){if(this._rendered)return;this._rendered=!0;const e=this.getAttribute("article-title")||"Untitled Article",s=this.getAttribute("article-description")||"",r=document.createElement("header"),i=document.createElement("div"),o=document.createElement("h1");o.textContent=e;const a=document.createElement("p");a.className="article-desc",a.textContent=s,i.appendChild(o),i.appendChild(a),r.appendChild(i);const l=this.querySelector("symbol-icon");l&&r.prepend(l);const c=document.createElement("section"),d=document.createElement("main"),u=document.createElement("article"),f=this.querySelector("my-article-content");f&&u.appendChild(f),d.appendChild(u);const p=document.createElement("aside"),v=document.createElement("span");v.textContent="More Articles";const g=document.createElement("nav");g.className="article-nav",p.appendChild(v),p.appendChild(g),c.appendChild(d),c.appendChild(p);const b=document.createElement("footer"),E=document.createElement("div");E.innerHTML=`
            <span>Source code available at <a href="https://github.com/connorjlink/clarity">https://github.com/connorjlink/clarity</a>.</span>
            <br>
            <span>&copy; 2025 Connor J. Link. All Rights Reserved.</span>
        `,b.appendChild(E),this.textContent="",this.appendChild(r),this.appendChild(c),this.appendChild(b),Array.from(document.querySelectorAll("my-article-header symbol-icon"))}}class Qs extends HTMLElement{connectedCallback(){this.render()}render(){const n=this.getAttribute("article-title")||"Untitled Article",e=this.getAttribute("article-description")||"No description provided.",s=this.querySelector("symbol-icon");this.innerHTML=`
            <div class="article-header">
                ${s?s.outerHTML:""}
                <div>
                    <h2 class="article-title">${n}</h2>
                    <p class="article-desc">${e}</p>
                </div>
            </div>
        `}}customElements.define("my-articleselector",Js);customElements.define("my-article-header",Qs);customElements.define("my-article",Zs);const Pn=`
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
`,Ks=new CSSStyleSheet;Ks.replaceSync(Pn);const ln="resizable-pane-widths";class er extends HTMLElement{constructor(){super();h(this,"columns",[]);h(this,"handles",[]);h(this,"widths",[]);h(this,"draggingIndex",null);h(this,"startX",0);h(this,"startWidths",[]);h(this,"visible",[]);h(this,"originalPanes",[]);h(this,"onHandleMouseDown",e=>{const s=e.target;this.draggingIndex=parseInt(s.dataset.index),this.startX=e.clientX,this.startWidths=this.getCurrentWidths(),s.classList.add("dragging"),e.preventDefault()});h(this,"onMouseMove",e=>{if(this.draggingIndex===null)return;const s=e.clientX-this.startX,r=this.draggingIndex;let i=[...this.startWidths];const o=50;i[r]+=s,i[r+1]-=s;for(let l=r+1;l<i.length;l++)if(i[l]<o){const c=o-i[l];i[l]=o,l+1<i.length&&(i[l+1]-=c)}for(let l=r;l>=0;l--)if(i[l]<o){const c=o-i[l];i[l]=o,l-1>=0&&(i[l-1]-=c)}for(let l=i.length-1;l>=0;l--)i[l]<o&&(i[l]=o);for(let l=0;l<i.length;l++)i[l]<o&&(i[l]=o);const a=i.reduce((l,c)=>l+c,0);this.widths=i.map(l=>l/a),this.applyWidths(),this.startWidths=i,this.startX=e.clientX});h(this,"onMouseUp",e=>{this.draggingIndex!==null&&(this.handles[this.draggingIndex].classList.remove("dragging"),this.saveWidths(),this.draggingIndex=null)})}connectedCallback(){this.originalPanes.length===0&&(this.originalPanes=Array.from(this.querySelectorAll(".pane-column"))),this.loadWidths(),this.render(),this.applyWidths(),this.addHandleEvents()}disconnectedCallback(){this.removeHandleEvents()}setVisiblePanes(e){this.visible=e,this.render(),this.applyWidths(),this.addHandleEvents()}render(){this.innerHTML=`<style>${Pn}</style>`;const e=document.createElement("div");e.className="pane-row",this.columns=[],this.handles=[],this.originalPanes.forEach((s,r)=>{if(Array.from(s.querySelectorAll(".handle")).forEach(i=>i.remove()),this.visible[r]&&(e.appendChild(s),this.columns.push(s),this.columns.length-1<this.visible.filter(Boolean).length-1)){const i=document.createElement("div");i.className="handle",i.dataset.index=(this.columns.length-1).toString(),e.appendChild(i),this.handles.push(i)}}),this.appendChild(e)}addHandleEvents(){this.handles.forEach(e=>{e.addEventListener("mousedown",this.onHandleMouseDown)}),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("mouseup",this.onMouseUp)}removeHandleEvents(){this.handles.forEach(e=>{e.removeEventListener("mousedown",this.onHandleMouseDown)}),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("mouseup",this.onMouseUp)}getCurrentWidths(){return this.columns.map(e=>e.getBoundingClientRect().width)}applyWidths(){this.widths.length!==this.columns.length&&(this.widths=Array(this.columns.length).fill(1/this.columns.length));const e=this.querySelector(".pane-row");if(!e)return;let s="";for(let i=0;i<this.columns.length;i++)s+=`${this.widths[i]*100}% `,i<this.columns.length-1&&(s+="1px ");e.style.gridTemplateColumns=s.trim();let r=1;this.columns.forEach(i=>{i.classList.contains("hidden")||(i.style.gridColumn=`${r}`,r+=2)}),this.handles.forEach((i,o)=>{i.style.gridColumn=`${2*(o+1)}`})}saveWidths(){localStorage.setItem(ln,JSON.stringify(this.widths))}loadWidths(){const e=localStorage.getItem(ln);if(e)try{const s=JSON.parse(e);Array.isArray(s)&&s.length===this.columns.length&&(this.widths=s)}catch{}}}customElements.define("pane-view",er);const tr=`
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
`,On=new CSSStyleSheet;On.replaceSync(tr);class nr extends HTMLElement{constructor(){super();h(this,"_checked",!0);h(this,"_onIcon",null);h(this,"_offIcon",null);h(this,"_titleText",null);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[On]}get checked(){return this._checked}set checked(e){this._checked=e,this.render()}connectedCallback(){this._onIcon=this.querySelector("on-icon"),this._offIcon=this.querySelector("off-icon"),this._titleText=this.getAttribute("title")||null,this.render()}render(){this.shadowRoot.innerHTML=`
            <div class="container" title="${this._titleText||""}">
                <input type="checkbox" ${this._checked?"checked":""}>
            </div>
        `;const e=this.shadowRoot.querySelector("input");e.addEventListener("change",()=>{this._checked=e.checked,this.dispatchEvent(new CustomEvent("toggle-change",{detail:{checked:this._checked}}))});const s=this.shadowRoot.querySelector(".container");this._onIcon&&s.appendChild(this._onIcon),this._offIcon&&s.appendChild(this._offIcon)}}customElements.define("symbol-toggle",nr);const sr="5";var Cn;typeof window<"u"&&((Cn=window.__svelte??(window.__svelte={})).v??(Cn.v=new Set)).add(sr);let Qe=!1,rr=!1;function ir(){Qe=!0}ir();const or=2,ar=8,lr=2,cr="[",dr="]",Fe={},$=Symbol(),hr="http://www.w3.org/1999/xhtml",Dn=!1;var qn=Array.isArray,ur=Array.prototype.indexOf,fr=Array.from,lt=Object.keys,De=Object.defineProperty,ge=Object.getOwnPropertyDescriptor,zn=Object.getOwnPropertyDescriptors,pr=Object.prototype,gr=Array.prototype,zt=Object.getPrototypeOf,cn=Object.isExtensible;function vr(t){return t()}function ct(t){for(var n=0;n<t.length;n++)t[n]()}function _r(){var t,n,e=new Promise((s,r)=>{t=s,n=r});return{promise:e,resolve:t,reject:n}}const H=2,Hn=4,_t=8,mt=16,ue=32,xe=64,Wn=128,F=256,dt=512,T=1024,z=2048,Ee=4096,qe=8192,ke=16384,Ht=32768,mr=65536,dn=1<<17,yr=1<<18,Wt=1<<19,Bt=1<<20,Tt=1<<21,Ut=1<<22,ve=1<<23,Ie=Symbol("$state"),Bn=Symbol("legacy props"),wr=Symbol(""),Ft=new class extends Error{constructor(){super(...arguments);h(this,"name","StaleReactionError");h(this,"message","The reaction that called `getAbortSignal()` was re-run or destroyed")}},Un=3,hn=8;function br(){throw new Error("https://svelte.dev/e/await_outside_boundary")}function xr(){throw new Error("https://svelte.dev/e/async_derived_orphan")}function Er(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function kr(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function Sr(t){throw new Error("https://svelte.dev/e/effect_orphan")}function Cr(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function $r(){throw new Error("https://svelte.dev/e/hydration_failed")}function Tr(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function Rr(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function Lr(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Mr(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Vt(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let S=!1;function nt(t){S=t}let k;function we(t){if(t===null)throw Vt(),Fe;return k=t}function jt(){return we(We(k))}function Y(t){if(S){if(We(k)!==null)throw Vt(),Fe;k=t}}function Fn(t){return t===this.v}function Ir(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function Vn(t){return!Ir(t,this.v)}let C=null;function ht(t){C=t}function Yt(t,n=!1,e){C={p:C,c:null,e:null,s:t,x:null,l:Qe&&!n?{s:null,u:null,$:[]}:null}}function Xt(t){var n=C,e=n.e;if(e!==null){n.e=null;for(var s of e)ls(s)}return t!==void 0&&(n.x=t),C=n.p,t??{}}function Ke(){return!Qe||C!==null&&C.l===null}const Ar=new WeakMap;function Nr(t){var n=y;if(n===null)return m.f|=ve,t;if((n.f&Ht)===0){if((n.f&Wn)===0)throw!n.parent&&t instanceof Error&&jn(t),t;n.b.error(t)}else Gt(t,n)}function Gt(t,n){for(;n!==null;){if((n.f&Wn)!==0)try{n.b.error(t);return}catch(e){t=e}n=n.parent}throw t instanceof Error&&jn(t),t}function jn(t){const n=Ar.get(t);n&&(De(t,"message",{value:n.message}),De(t,"stack",{value:n.stack}))}let je=[],Rt=[];function Yn(){var t=je;je=[],ct(t)}function Pr(){var t=Rt;Rt=[],ct(t)}function Xn(t){je.length===0&&queueMicrotask(Yn),je.push(t)}function Or(){je.length>0&&Yn(),Rt.length>0&&Pr()}function Dr(){for(var t=y.b;t!==null&&!t.has_pending_snippet();)t=t.parent;return t===null&&br(),t}function Jt(t){var n=H|z,e=m!==null&&(m.f&H)!==0?m:null;return y===null||e!==null&&(e.f&F)!==0?n|=F:y.f|=Wt,{ctx:C,deps:null,effects:null,equals:Fn,f:n,fn:t,reactions:null,rv:0,v:$,wv:0,parent:e??y,ac:null}}function qr(t,n){let e=y;e===null&&xr();var s=e.b,r=void 0,i=Qt($),o=null,a=!m;return Jr(()=>{try{var l=t()}catch(p){l=Promise.reject(p)}var c=()=>l;r=(o==null?void 0:o.then(c,c))??Promise.resolve(l),o=r;var d=W,u=s.pending;a&&(s.update_pending_count(1),u||d.increment());const f=(p,v=void 0)=>{o=null,u||d.activate(),v?v!==Ft&&(i.f|=ve,It(i,v)):((i.f&ve)!==0&&(i.f^=ve),It(i,p)),a&&(s.update_pending_count(-1),u||d.decrement()),Qn()};if(r.then(f,p=>f(null,p||"unknown")),d)return()=>{queueMicrotask(()=>d.neuter())}}),new Promise(l=>{function c(d){function u(){d===r?l(i):c(r)}d.then(u,u)}c(r)})}function Gn(t){const n=Jt(t);return n.equals=Vn,n}function Jn(t){var n=t.effects;if(n!==null){t.effects=null;for(var e=0;e<n.length;e+=1)de(n[e])}}function zr(t){for(var n=t.parent;n!==null;){if((n.f&H)===0)return n;n=n.parent}return null}function Zt(t){var n,e=y;he(zr(t));try{Jn(t),n=vs(t)}finally{he(e)}return n}function Zn(t){var n=Zt(t);if(t.equals(n)||(t.v=n,t.wv=ps()),!Se)if(le!==null)le.set(t,t.v);else{var e=(ce||(t.f&F)!==0)&&t.deps!==null?Ee:T;R(t,e)}}function Hr(t,n,e){const s=Ke()?Jt:Gn;if(n.length===0){e(t.map(s));return}var r=W,i=y,o=Wr(),a=Dr();Promise.all(n.map(l=>qr(l))).then(l=>{r==null||r.activate(),o();try{e([...t.map(s),...l])}catch(c){(i.f&ke)===0&&Gt(c,i)}r==null||r.deactivate(),Qn()}).catch(l=>{a.error(l)})}function Wr(){var t=y,n=m,e=C;return function(){he(t),Z(n),ht(e)}}function Qn(){he(null),Z(null),ht(null)}const st=new Set;let W=null,le=null,un=new Set,ut=[];function Kn(){const t=ut.shift();ut.length>0&&queueMicrotask(Kn),t()}let Re=[],yt=null,Lt=!1;var Ge,Ne,Pe,oe,Je,Ze,fe,Oe,ae,K,pe,te,es,ts,Mt;const vt=class vt{constructor(){I(this,te);I(this,Ge,new Map);I(this,Ne,new Map);I(this,Pe,new Set);I(this,oe,0);I(this,Je,null);I(this,Ze,!1);I(this,fe,[]);I(this,Oe,[]);I(this,ae,[]);I(this,K,[]);I(this,pe,[]);h(this,"skipped_effects",new Set)}capture(n,e){_(this,Ne).has(n)||_(this,Ne).set(n,e),_(this,Ge).set(n,n.v)}activate(){W=this}deactivate(){W=null;for(const n of un)if(un.delete(n),n(),W!==null)break}neuter(){D(this,Ze,!0)}flush(){Re.length>0?this.flush_effects():Be(this,te,Mt).call(this),W===this&&(_(this,oe)===0&&st.delete(this),this.deactivate())}flush_effects(){var n=Ae;Lt=!0;try{var e=0;for(vn(!0);Re.length>0;){if(e++>1e3){var s,r;Br()}Be(this,te,es).call(this,Re),me.clear()}}finally{Lt=!1,vn(n),yt=null}}increment(){D(this,oe,_(this,oe)+1)}decrement(){if(D(this,oe,_(this,oe)-1),_(this,oe)===0){for(const n of _(this,ae))R(n,z),_e(n);for(const n of _(this,K))R(n,z),_e(n);for(const n of _(this,pe))R(n,z),_e(n);D(this,ae,[]),D(this,K,[]),this.flush()}else this.deactivate()}add_callback(n){_(this,Pe).add(n)}settled(){return(_(this,Je)??D(this,Je,_r())).promise}static ensure(n=!0){if(W===null){const e=W=new vt;st.add(W),n&&vt.enqueue(()=>{W===e&&e.flush()})}return W}static enqueue(n){ut.length===0&&queueMicrotask(Kn),ut.unshift(n)}};Ge=new WeakMap,Ne=new WeakMap,Pe=new WeakMap,oe=new WeakMap,Je=new WeakMap,Ze=new WeakMap,fe=new WeakMap,Oe=new WeakMap,ae=new WeakMap,K=new WeakMap,pe=new WeakMap,te=new WeakSet,es=function(n){var i;Re=[];var e=null;if(st.size>1){e=new Map,le=new Map;for(const[o,a]of _(this,Ge))e.set(o,{v:o.v,wv:o.wv}),o.v=a;for(const o of st)if(o!==this)for(const[a,l]of _(o,Ne))e.has(a)||(e.set(a,{v:a.v,wv:a.wv}),a.v=l)}for(const o of n)Be(this,te,ts).call(this,o);if(_(this,fe).length===0&&_(this,oe)===0){var s=_(this,ae),r=_(this,K);D(this,ae,[]),D(this,K,[]),D(this,pe,[]),Be(this,te,Mt).call(this),fn(s),fn(r),(i=_(this,Je))==null||i.resolve()}else{for(const o of _(this,ae))R(o,T);for(const o of _(this,K))R(o,T);for(const o of _(this,pe))R(o,T)}if(e){for(const[o,{v:a,wv:l}]of e)o.wv<=l&&(o.v=a);le=null}for(const o of _(this,fe))Ve(o);for(const o of _(this,Oe))Ve(o);D(this,fe,[]),D(this,Oe,[])},ts=function(n){var d;n.f^=T;for(var e=n.first;e!==null;){var s=e.f,r=(s&(ue|xe))!==0,i=r&&(s&T)!==0,o=i||(s&qe)!==0||this.skipped_effects.has(e);if(!o&&e.fn!==null){if(r)e.f^=T;else if((s&Hn)!==0)_(this,K).push(e);else if(wt(e))if((s&Ut)!==0){var a=(d=e.b)!=null&&d.pending?_(this,Oe):_(this,fe);a.push(e)}else(e.f&mt)!==0&&_(this,pe).push(e),Ve(e);var l=e.first;if(l!==null){e=l;continue}}var c=e.parent;for(e=e.next;e===null&&c!==null;)e=c.next,c=c.parent}},Mt=function(){if(!_(this,Ze))for(const n of _(this,Pe))n();_(this,Pe).clear()};let ze=vt;function V(t){var n;const e=ze.ensure(!1);for(;;){if(Or(),Re.length===0)return e===W&&e.flush(),yt=null,n;e.flush_effects()}}function Br(){try{Cr()}catch(t){Gt(t,yt)}}function fn(t){var n=t.length;if(n!==0){for(var e=0;e<n;e++){var s=t[e];if((s.f&(ke|qe))===0&&wt(s)){var r=pt;if(Ve(s),s.deps===null&&s.first===null&&s.nodes_start===null&&(s.teardown===null&&s.ac===null?us(s):s.fn=null),pt>r&&(s.f&Bt)!==0)break}}for(;e<n;e+=1)_e(t[e])}}function _e(t){for(var n=yt=t;n.parent!==null;){n=n.parent;var e=n.f;if(Lt&&n===y&&(e&mt)!==0)return;if((e&(xe|ue))!==0){if((e&T)===0)return;n.f^=T}}Re.push(n)}const me=new Map;function Qt(t,n){var e={f:0,v:t,reactions:null,equals:Fn,rv:0,wv:0};return e}function ie(t,n){const e=Qt(t);return si(e),e}function ns(t,n=!1,e=!0){var r;const s=Qt(t);return n||(s.equals=Vn),Qe&&e&&C!==null&&C.l!==null&&((r=C.l).s??(r.s=[])).push(s),s}function G(t,n,e=!1){m!==null&&(!J||(m.f&dn)!==0)&&Ke()&&(m.f&(H|mt|Ut|dn))!==0&&!(P!=null&&P.includes(t))&&Mr();let s=e?Le(n):n;return It(t,s)}function It(t,n){if(!t.equals(n)){var e=t.v;Se?me.set(t,n):me.set(t,e),t.v=n,ze.ensure().capture(t,e),(t.f&H)!==0&&((t.f&z)!==0&&Zt(t),R(t,(t.f&F)===0?T:Ee)),t.wv=ps(),ss(t,z),Ke()&&y!==null&&(y.f&T)!==0&&(y.f&(ue|xe))===0&&(B===null?ri([t]):B.push(t))}return n}function Et(t){G(t,t.v+1)}function ss(t,n){var e=t.reactions;if(e!==null)for(var s=Ke(),r=e.length,i=0;i<r;i++){var o=e[i],a=o.f;!s&&o===y||((a&z)===0&&R(o,n),(a&H)!==0?ss(o,Ee):(a&z)===0&&_e(o))}}function Le(t){if(typeof t!="object"||t===null||Ie in t)return t;const n=zt(t);if(n!==pr&&n!==gr)return t;var e=new Map,s=qn(t),r=ie(0),i=ye,o=a=>{if(ye===i)return a();var l=m,c=ye;Z(null),mn(i);var d=a();return Z(l),mn(c),d};return s&&e.set("length",ie(t.length)),new Proxy(t,{defineProperty(a,l,c){(!("value"in c)||c.configurable===!1||c.enumerable===!1||c.writable===!1)&&Rr();var d=e.get(l);return d===void 0?d=o(()=>{var u=ie(c.value);return e.set(l,u),u}):G(d,c.value,!0),!0},deleteProperty(a,l){var c=e.get(l);if(c===void 0){if(l in a){const d=o(()=>ie($));e.set(l,d),Et(r)}}else G(c,$),Et(r);return!0},get(a,l,c){var p;if(l===Ie)return t;var d=e.get(l),u=l in a;if(d===void 0&&(!u||(p=ge(a,l))!=null&&p.writable)&&(d=o(()=>{var v=Le(u?a[l]:$),g=ie(v);return g}),e.set(l,d)),d!==void 0){var f=L(d);return f===$?void 0:f}return Reflect.get(a,l,c)},getOwnPropertyDescriptor(a,l){var c=Reflect.getOwnPropertyDescriptor(a,l);if(c&&"value"in c){var d=e.get(l);d&&(c.value=L(d))}else if(c===void 0){var u=e.get(l),f=u==null?void 0:u.v;if(u!==void 0&&f!==$)return{enumerable:!0,configurable:!0,value:f,writable:!0}}return c},has(a,l){var f;if(l===Ie)return!0;var c=e.get(l),d=c!==void 0&&c.v!==$||Reflect.has(a,l);if(c!==void 0||y!==null&&(!d||(f=ge(a,l))!=null&&f.writable)){c===void 0&&(c=o(()=>{var p=d?Le(a[l]):$,v=ie(p);return v}),e.set(l,c));var u=L(c);if(u===$)return!1}return d},set(a,l,c,d){var w;var u=e.get(l),f=l in a;if(s&&l==="length")for(var p=c;p<u.v;p+=1){var v=e.get(p+"");v!==void 0?G(v,$):p in a&&(v=o(()=>ie($)),e.set(p+"",v))}if(u===void 0)(!f||(w=ge(a,l))!=null&&w.writable)&&(u=o(()=>ie(void 0)),G(u,Le(c)),e.set(l,u));else{f=u.v!==$;var g=o(()=>Le(c));G(u,g)}var b=Reflect.getOwnPropertyDescriptor(a,l);if(b!=null&&b.set&&b.set.call(d,c),!f){if(s&&typeof l=="string"){var E=e.get("length"),x=Number(l);Number.isInteger(x)&&x>=E.v&&G(E,x+1)}Et(r)}return!0},ownKeys(a){L(r);var l=Reflect.ownKeys(a).filter(u=>{var f=e.get(u);return f===void 0||f.v!==$});for(var[c,d]of e)d.v!==$&&!(c in a)&&l.push(c);return l},setPrototypeOf(){Lr()}})}var pn,rs,is,os;function At(){if(pn===void 0){pn=window,rs=/Firefox/.test(navigator.userAgent);var t=Element.prototype,n=Node.prototype,e=Text.prototype;is=ge(n,"firstChild").get,os=ge(n,"nextSibling").get,cn(t)&&(t.__click=void 0,t.__className=void 0,t.__attributes=null,t.__style=void 0,t.__e=void 0),cn(e)&&(e.__t=void 0)}}function ft(t=""){return document.createTextNode(t)}function be(t){return is.call(t)}function We(t){return os.call(t)}function X(t,n){if(!S)return be(t);var e=be(k);if(e===null)e=k.appendChild(ft());else if(n&&e.nodeType!==Un){var s=ft();return e==null||e.before(s),we(s),s}return we(e),e}function Ur(t,n){if(!S){var e=be(t);return e instanceof Comment&&e.data===""?We(e):e}return k}function j(t,n=1,e=!1){let s=S?k:t;for(var r;n--;)r=s,s=We(s);if(!S)return s;if(e&&(s==null?void 0:s.nodeType)!==Un){var i=ft();return s===null?r==null||r.after(i):s.before(i),we(i),i}return we(s),s}function Fr(t){t.textContent=""}function as(t){y===null&&m===null&&Sr(),m!==null&&(m.f&F)!==0&&y===null&&kr(),Se&&Er()}function Vr(t,n){var e=n.last;e===null?n.last=n.first=t:(e.next=t,t.prev=e,n.last=t)}function ne(t,n,e,s=!0){var r=y;r!==null&&(r.f&qe)!==0&&(t|=qe);var i={ctx:C,deps:null,nodes_start:null,nodes_end:null,f:t|z,first:null,fn:n,last:null,next:null,parent:r,b:r&&r.b,prev:null,teardown:null,transitions:null,wv:0,ac:null};if(e)try{Ve(i),i.f|=Ht}catch(l){throw de(i),l}else n!==null&&_e(i);var o=e&&i.deps===null&&i.first===null&&i.nodes_start===null&&i.teardown===null&&(i.f&Wt)===0;if(!o&&s&&(r!==null&&Vr(i,r),m!==null&&(m.f&H)!==0)){var a=m;(a.effects??(a.effects=[])).push(i)}return i}function jr(t){const n=ne(_t,null,!1);return R(n,T),n.teardown=t,n}function gn(t){as();var n=y.f,e=!m&&(n&ue)!==0&&(n&Ht)===0;if(e){var s=C;(s.e??(s.e=[])).push(t)}else return ls(t)}function ls(t){return ne(Hn|Bt,t,!1)}function Yr(t){return as(),ne(_t|Bt,t,!0)}function Xr(t){ze.ensure();const n=ne(xe,t,!0);return()=>{de(n)}}function Gr(t){ze.ensure();const n=ne(xe,t,!0);return(e={})=>new Promise(s=>{e.outro?ti(n,()=>{de(n),s(void 0)}):(de(n),s(void 0))})}function Jr(t){return ne(Ut|Wt,t,!0)}function Zr(t,n=0){return ne(_t|n,t,!0)}function cs(t,n=[],e=[]){Hr(n,e,s=>{ne(_t,()=>t(...s.map(L)),!0)})}function Qr(t,n=!0){return ne(ue,t,!0,n)}function ds(t){var n=t.teardown;if(n!==null){const e=Se,s=m;_n(!0),Z(null);try{n.call(null)}finally{_n(e),Z(s)}}}function hs(t,n=!1){var r;var e=t.first;for(t.first=t.last=null;e!==null;){(r=e.ac)==null||r.abort(Ft);var s=e.next;(e.f&xe)!==0?e.parent=null:de(e,n),e=s}}function Kr(t){for(var n=t.first;n!==null;){var e=n.next;(n.f&ue)===0&&de(n),n=e}}function de(t,n=!0){var e=!1;(n||(t.f&yr)!==0)&&t.nodes_start!==null&&t.nodes_end!==null&&(ei(t.nodes_start,t.nodes_end),e=!0),hs(t,n&&!e),gt(t,0),R(t,ke);var s=t.transitions;if(s!==null)for(const i of s)i.stop();ds(t);var r=t.parent;r!==null&&r.first!==null&&us(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=t.ac=null}function ei(t,n){for(;t!==null;){var e=t===n?null:We(t);t.remove(),t=e}}function us(t){var n=t.parent,e=t.prev,s=t.next;e!==null&&(e.next=s),s!==null&&(s.prev=e),n!==null&&(n.first===t&&(n.first=s),n.last===t&&(n.last=e))}function ti(t,n){var e=[];fs(t,e,!0),ni(e,()=>{de(t),n&&n()})}function ni(t,n){var e=t.length;if(e>0){var s=()=>--e||n();for(var r of t)r.out(s)}else n()}function fs(t,n,e){if((t.f&qe)===0){if(t.f^=qe,t.transitions!==null)for(const o of t.transitions)(o.is_global||e)&&n.push(o);for(var s=t.first;s!==null;){var r=s.next,i=(s.f&mr)!==0||(s.f&ue)!==0;fs(s,n,i?e:!1),s=r}}}let Ae=!1;function vn(t){Ae=t}let Se=!1;function _n(t){Se=t}let m=null,J=!1;function Z(t){m=t}let y=null;function he(t){y=t}let P=null;function si(t){m!==null&&(P===null?P=[t]:P.push(t))}let N=null,q=0,B=null;function ri(t){B=t}let pt=1,Ye=0,ye=Ye;function mn(t){ye=t}let ce=!1;function ps(){return++pt}function wt(t){var u;var n=t.f;if((n&z)!==0)return!0;if((n&Ee)!==0){var e=t.deps,s=(n&F)!==0;if(e!==null){var r,i,o=(n&dt)!==0,a=s&&y!==null&&!ce,l=e.length;if((o||a)&&(y===null||(y.f&ke)===0)){var c=t,d=c.parent;for(r=0;r<l;r++)i=e[r],(o||!((u=i==null?void 0:i.reactions)!=null&&u.includes(c)))&&(i.reactions??(i.reactions=[])).push(c);o&&(c.f^=dt),a&&d!==null&&(d.f&F)===0&&(c.f^=F)}for(r=0;r<l;r++)if(i=e[r],wt(i)&&Zn(i),i.wv>t.wv)return!0}(!s||y!==null&&!ce)&&R(t,T)}return!1}function gs(t,n,e=!0){var s=t.reactions;if(s!==null&&!(P!=null&&P.includes(t)))for(var r=0;r<s.length;r++){var i=s[r];(i.f&H)!==0?gs(i,n,!1):n===i&&(e?R(i,z):(i.f&T)!==0&&R(i,Ee),_e(i))}}function vs(t){var v;var n=N,e=q,s=B,r=m,i=ce,o=P,a=C,l=J,c=ye,d=t.f;N=null,q=0,B=null,ce=(d&F)!==0&&(J||!Ae||m===null),m=(d&(ue|xe))===0?t:null,P=null,ht(t.ctx),J=!1,ye=++Ye,t.ac!==null&&(t.ac.abort(Ft),t.ac=null);try{t.f|=Tt;var u=(0,t.fn)(),f=t.deps;if(N!==null){var p;if(gt(t,q),f!==null&&q>0)for(f.length=q+N.length,p=0;p<N.length;p++)f[q+p]=N[p];else t.deps=f=N;if(!ce||(d&H)!==0&&t.reactions!==null)for(p=q;p<f.length;p++)((v=f[p]).reactions??(v.reactions=[])).push(t)}else f!==null&&q<f.length&&(gt(t,q),f.length=q);if(Ke()&&B!==null&&!J&&f!==null&&(t.f&(H|Ee|z))===0)for(p=0;p<B.length;p++)gs(B[p],t);return r!==null&&r!==t&&(Ye++,B!==null&&(s===null?s=B:s.push(...B))),(t.f&ve)!==0&&(t.f^=ve),u}catch(g){return Nr(g)}finally{t.f^=Tt,N=n,q=e,B=s,m=r,ce=i,P=o,ht(a),J=l,ye=c}}function ii(t,n){let e=n.reactions;if(e!==null){var s=ur.call(e,t);if(s!==-1){var r=e.length-1;r===0?e=n.reactions=null:(e[s]=e[r],e.pop())}}e===null&&(n.f&H)!==0&&(N===null||!N.includes(n))&&(R(n,Ee),(n.f&(F|dt))===0&&(n.f^=dt),Jn(n),gt(n,0))}function gt(t,n){var e=t.deps;if(e!==null)for(var s=n;s<e.length;s++)ii(t,e[s])}function Ve(t){var n=t.f;if((n&ke)===0){R(t,T);var e=y,s=Ae;y=t,Ae=!0;try{(n&mt)!==0?Kr(t):hs(t),ds(t);var r=vs(t);t.teardown=typeof r=="function"?r:null,t.wv=pt;var i;Dn&&rr&&(t.f&z)!==0&&t.deps}finally{Ae=s,y=e}}}function L(t){var n=t.f,e=(n&H)!==0;if(m!==null&&!J){var s=y!==null&&(y.f&ke)!==0;if(!s&&!(P!=null&&P.includes(t))){var r=m.deps;if((m.f&Tt)!==0)t.rv<Ye&&(t.rv=Ye,N===null&&r!==null&&r[q]===t?q++:N===null?N=[t]:(!ce||!N.includes(t))&&N.push(t));else{(m.deps??(m.deps=[])).push(t);var i=t.reactions;i===null?t.reactions=[m]:i.includes(m)||i.push(m)}}}else if(e&&t.deps===null&&t.effects===null){var o=t,a=o.parent;a!==null&&(a.f&F)===0&&(o.f^=F)}if(Se){if(me.has(t))return me.get(t);if(e){o=t;var l=o.v;return((o.f&T)===0&&o.reactions!==null||_s(o))&&(l=Zt(o)),me.set(o,l),l}}else if(e){if(o=t,le!=null&&le.has(o))return le.get(o);wt(o)&&Zn(o)}if((t.f&ve)!==0)throw t.v;return t.v}function _s(t){if(t.v===$)return!0;if(t.deps===null)return!1;for(const n of t.deps)if(me.has(n)||(n.f&H)!==0&&_s(n))return!0;return!1}function oi(t){var n=J;try{return J=!0,t()}finally{J=n}}const ai=-7169;function R(t,n){t.f=t.f&ai|n}function li(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(Ie in t)Nt(t);else if(!Array.isArray(t))for(let n in t){const e=t[n];typeof e=="object"&&e&&Ie in e&&Nt(e)}}}function Nt(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let s in t)try{Nt(t[s],n)}catch{}const e=zt(t);if(e!==Object.prototype&&e!==Array.prototype&&e!==Map.prototype&&e!==Set.prototype&&e!==Date.prototype){const s=zn(e);for(let r in s){const i=s[r].get;if(i)try{i.call(t)}catch{}}}}}function ci(t){var n=m,e=y;Z(null),he(null);try{return t()}finally{Z(n),he(e)}}const di=new Set,yn=new Set;function hi(t,n,e,s={}){function r(i){if(s.capture||Ue.call(n,i),!i.cancelBubble)return ci(()=>e==null?void 0:e.call(this,i))}return t.startsWith("pointer")||t.startsWith("touch")||t==="wheel"?Xn(()=>{n.addEventListener(t,r,s)}):n.addEventListener(t,r,s),r}function wn(t,n,e,s,r){var i={capture:s,passive:r},o=hi(t,n,e,i);(n===document.body||n===window||n===document||n instanceof HTMLMediaElement)&&jr(()=>{n.removeEventListener(t,o,i)})}function Ue(t){var x;var n=this,e=n.ownerDocument,s=t.type,r=((x=t.composedPath)==null?void 0:x.call(t))||[],i=r[0]||t.target,o=0,a=t.__root;if(a){var l=r.indexOf(a);if(l!==-1&&(n===document||n===window)){t.__root=n;return}var c=r.indexOf(n);if(c===-1)return;l<=c&&(o=l)}if(i=r[o]||t.target,i!==n){De(t,"currentTarget",{configurable:!0,get(){return i||e}});var d=m,u=y;Z(null),he(null);try{for(var f,p=[];i!==null;){var v=i.assignedSlot||i.parentNode||i.host||null;try{var g=i["__"+s];if(g!=null&&(!i.disabled||t.target===i))if(qn(g)){var[b,...E]=g;b.apply(i,[t,...E])}else g.call(i,t)}catch(w){f?p.push(w):f=w}if(t.cancelBubble||v===n||v===null)break;i=v}if(f){for(let w of p)queueMicrotask(()=>{throw w});throw f}}finally{t.__root=n,delete t.currentTarget,Z(d),he(u)}}}function ms(t){var n=document.createElement("template");return n.innerHTML=t.replaceAll("<!>","<!---->"),n.content}function Xe(t,n){var e=y;e.nodes_start===null&&(e.nodes_start=t,e.nodes_end=n)}function ui(t,n){var e=(n&lr)!==0,s,r=!t.startsWith("<!>");return()=>{if(S)return Xe(k,null),k;s===void 0&&(s=ms(r?t:"<!>"+t));var i=e||rs?document.importNode(s,!0):s.cloneNode(!0);{var o=be(i),a=i.lastChild;Xe(o,a)}return i}}function fi(t,n,e="svg"){var s=!t.startsWith("<!>"),r=`<${e}>${s?t:"<!>"+t}</${e}>`,i;return()=>{if(S)return Xe(k,null),k;if(!i){var o=ms(r),a=be(o);i=be(a)}var l=i.cloneNode(!0);return Xe(l,l),l}}function pi(t,n){return fi(t,n,"svg")}function Kt(t,n){if(S){y.nodes_end=k,jt();return}t!==null&&t.before(n)}const gi=["touchstart","touchmove"];function vi(t){return gi.includes(t)}function Pt(t,n){var e=n==null?"":typeof n=="object"?n+"":n;e!==(t.__t??(t.__t=t.nodeValue))&&(t.__t=e,t.nodeValue=e+"")}function ys(t,n){return ws(t,n)}function _i(t,n){At(),n.intro=n.intro??!1;const e=n.target,s=S,r=k;try{for(var i=be(e);i&&(i.nodeType!==hn||i.data!==cr);)i=We(i);if(!i)throw Fe;nt(!0),we(i),jt();const o=ws(t,{...n,anchor:i});if(k===null||k.nodeType!==hn||k.data!==dr)throw Vt(),Fe;return nt(!1),o}catch(o){if(o===Fe)return n.recover===!1&&$r(),At(),Fr(e),nt(!1),ys(t,n);throw o}finally{nt(s),we(r)}}const Te=new Map;function ws(t,{target:n,anchor:e,props:s={},events:r,context:i,intro:o=!0}){At();var a=new Set,l=u=>{for(var f=0;f<u.length;f++){var p=u[f];if(!a.has(p)){a.add(p);var v=vi(p);n.addEventListener(p,Ue,{passive:v});var g=Te.get(p);g===void 0?(document.addEventListener(p,Ue,{passive:v}),Te.set(p,1)):Te.set(p,g+1)}}};l(fr(di)),yn.add(l);var c=void 0,d=Gr(()=>{var u=e??n.appendChild(ft());return Qr(()=>{if(i){Yt({});var f=C;f.c=i}r&&(s.$$events=r),S&&Xe(u,null),c=t(u,s)||{},S&&(y.nodes_end=k),i&&Xt()}),()=>{var v;for(var f of a){n.removeEventListener(f,Ue);var p=Te.get(f);--p===0?(document.removeEventListener(f,Ue),Te.delete(f)):Te.set(f,p)}yn.delete(l),u!==e&&((v=u.parentNode)==null||v.removeChild(u))}});return Ot.set(c,d),c}let Ot=new WeakMap;function mi(t,n){const e=Ot.get(t);return e?(Ot.delete(t),e(n)):Promise.resolve()}function yi(t,n,e,s,r){var a;S&&jt();var i=(a=n.$$slots)==null?void 0:a[e],o=!1;i===!0&&(i=n.children,o=!0),i===void 0||i(t,o?()=>s:s)}function bs(t,n){Xn(()=>{var e=t.getRootNode(),s=e.host?e:e.head??e.ownerDocument.head;if(!s.querySelector("#"+n.hash)){const r=document.createElement("style");r.id=n.hash,r.textContent=n.code,s.appendChild(r)}})}const bn=[...` 	
\r\f \v\uFEFF`];function wi(t,n,e){var s=t==null?"":""+t;if(e){for(var r in e)if(e[r])s=s?s+" "+r:r;else if(s.length)for(var i=r.length,o=0;(o=s.indexOf(r,o))>=0;){var a=o+i;(o===0||bn.includes(s[o-1]))&&(a===s.length||bn.includes(s[a]))?s=(o===0?"":s.substring(0,o))+s.substring(a+1):o=a}}return s===""?null:s}function bi(t,n){return t==null?null:String(t)}function xn(t,n,e,s,r,i){var o=t.__className;if(S||o!==e||o===void 0){var a=wi(e,s,i);(!S||a!==t.getAttribute("class"))&&(a==null?t.removeAttribute("class"):t.className=a),t.__className=e}else if(i&&r!==i)for(var l in i){var c=!!i[l];(r==null||c!==!!r[l])&&t.classList.toggle(l,c)}return i}function xi(t,n,e,s){var r=t.__style;if(S||r!==n){var i=bi(n);(!S||i!==t.getAttribute("style"))&&(i==null?t.removeAttribute("style"):t.style.cssText=i),t.__style=n}return s}const Ei=Symbol("is custom element"),ki=Symbol("is html");function A(t,n,e,s){var r=Si(t);S&&(r[n]=t.getAttribute(n),n==="src"||n==="srcset"||n==="href"&&t.nodeName==="LINK")||r[n]!==(r[n]=e)&&(n==="loading"&&(t[wr]=e),e==null?t.removeAttribute(n):typeof e!="string"&&Ci(t).includes(n)?t[n]=e:t.setAttribute(n,e))}function Si(t){return t.__attributes??(t.__attributes={[Ei]:t.nodeName.includes("-"),[ki]:t.namespaceURI===hr})}var En=new Map;function Ci(t){var n=En.get(t.nodeName);if(n)return n;En.set(t.nodeName,n=[]);for(var e,s=t,r=Element.prototype;r!==s;){e=zn(s);for(var i in e)e[i].set&&n.push(i);s=zt(s)}return n}function $i(t=!1){const n=C,e=n.l.u;if(!e)return;let s=()=>li(n.s);if(t){let r=0,i={};const o=Jt(()=>{let a=!1;const l=n.s;for(const c in l)l[c]!==i[c]&&(i[c]=l[c],a=!0);return a&&r++,r});s=()=>L(o)}e.b.length&&Yr(()=>{kn(n,s),ct(e.b)}),gn(()=>{const r=oi(()=>e.m.map(vr));return()=>{for(const i of r)typeof i=="function"&&i()}}),e.a.length&&gn(()=>{kn(n,s),ct(e.a)})}function kn(t,n){if(t.l.s)for(const e of t.l.s)L(e);n()}let rt=!1;function Ti(t){var n=rt;try{return rt=!1,[t(),rt]}finally{rt=n}}function Q(t,n,e,s){var x;var r=!Qe||(e&or)!==0,i=(e&ar)!==0,o=s,a=!0,l=()=>(a&&(a=!1,o=s),o),c;{var d=Ie in t||Bn in t;c=((x=ge(t,n))==null?void 0:x.set)??(d&&n in t?w=>t[n]=w:void 0)}var u,f=!1;[u,f]=Ti(()=>t[n]),u===void 0&&s!==void 0&&(u=l(),c&&(r&&Tr(),c(u)));var p;if(r?p=()=>{var w=t[n];return w===void 0?l():(a=!0,w)}:p=()=>{var w=t[n];return w!==void 0&&(o=void 0),w===void 0?o:w},c){var v=t.$$legacy;return function(w,O){return arguments.length>0?((!r||!O||v||f)&&c(O?p():w),w):p()}}var g=!1,b=Gn(()=>(g=!1,p()));L(b);var E=y;return function(w,O){if(arguments.length>0){const se=O?L(b):r&&i?Le(w):w;return G(b,se),g=!0,o!==void 0&&(o=se),w}return Se&&g||(E.f&ke)!==0?b.v:L(b)}}function Ri(t){return new Li(t)}var ee,U;class Li{constructor(n){I(this,ee);I(this,U);var i;var e=new Map,s=(o,a)=>{var l=ns(a,!1,!1);return e.set(o,l),l};const r=new Proxy({...n.props||{},$$events:{}},{get(o,a){return L(e.get(a)??s(a,Reflect.get(o,a)))},has(o,a){return a===Bn?!0:(L(e.get(a)??s(a,Reflect.get(o,a))),Reflect.has(o,a))},set(o,a,l){return G(e.get(a)??s(a,l),l),Reflect.set(o,a,l)}});D(this,U,(n.hydrate?_i:ys)(n.component,{target:n.target,anchor:n.anchor,props:r,context:n.context,intro:n.intro??!1,recover:n.recover})),(!((i=n==null?void 0:n.props)!=null&&i.$$host)||n.sync===!1)&&V(),D(this,ee,r.$$events);for(const o of Object.keys(_(this,U)))o==="$set"||o==="$destroy"||o==="$on"||De(this,o,{get(){return _(this,U)[o]},set(a){_(this,U)[o]=a},enumerable:!0});_(this,U).$set=o=>{Object.assign(r,o)},_(this,U).$destroy=()=>{mi(_(this,U))}}$set(n){_(this,U).$set(n)}$on(n,e){_(this,ee)[n]=_(this,ee)[n]||[];const s=(...r)=>e.call(this,...r);return _(this,ee)[n].push(s),()=>{_(this,ee)[n]=_(this,ee)[n].filter(r=>r!==s)}}$destroy(){_(this,U).$destroy()}}ee=new WeakMap,U=new WeakMap;let xs;typeof HTMLElement=="function"&&(xs=class extends HTMLElement{constructor(n,e,s){super();h(this,"$$ctor");h(this,"$$s");h(this,"$$c");h(this,"$$cn",!1);h(this,"$$d",{});h(this,"$$r",!1);h(this,"$$p_d",{});h(this,"$$l",{});h(this,"$$l_u",new Map);h(this,"$$me");this.$$ctor=n,this.$$s=e,s&&this.attachShadow({mode:"open"})}addEventListener(n,e,s){if(this.$$l[n]=this.$$l[n]||[],this.$$l[n].push(e),this.$$c){const r=this.$$c.$on(n,e);this.$$l_u.set(e,r)}super.addEventListener(n,e,s)}removeEventListener(n,e,s){if(super.removeEventListener(n,e,s),this.$$c){const r=this.$$l_u.get(e);r&&(r(),this.$$l_u.delete(e))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let n=function(r){return i=>{const o=document.createElement("slot");r!=="default"&&(o.name=r),Kt(i,o)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;const e={},s=Mi(this);for(const r of this.$$s)r in s&&(r==="default"&&!this.$$d.children?(this.$$d.children=n(r),e.default=!0):e[r]=n(r));for(const r of this.attributes){const i=this.$$g_p(r.name);i in this.$$d||(this.$$d[i]=ot(i,r.value,this.$$p_d,"toProp"))}for(const r in this.$$p_d)!(r in this.$$d)&&this[r]!==void 0&&(this.$$d[r]=this[r],delete this[r]);this.$$c=Ri({component:this.$$ctor,target:this.shadowRoot||this,props:{...this.$$d,$$slots:e,$$host:this}}),this.$$me=Xr(()=>{Zr(()=>{var r;this.$$r=!0;for(const i of lt(this.$$c)){if(!((r=this.$$p_d[i])!=null&&r.reflect))continue;this.$$d[i]=this.$$c[i];const o=ot(i,this.$$d[i],this.$$p_d,"toAttribute");o==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,o)}this.$$r=!1})});for(const r in this.$$l)for(const i of this.$$l[r]){const o=this.$$c.$on(r,i);this.$$l_u.set(i,o)}this.$$l={}}}attributeChangedCallback(n,e,s){var r;this.$$r||(n=this.$$g_p(n),this.$$d[n]=ot(n,s,this.$$p_d,"toProp"),(r=this.$$c)==null||r.$set({[n]:this.$$d[n]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(n){return lt(this.$$p_d).find(e=>this.$$p_d[e].attribute===n||!this.$$p_d[e].attribute&&e.toLowerCase()===n)||n}});function ot(t,n,e,s){var i;const r=(i=e[t])==null?void 0:i.type;if(n=r==="Boolean"&&typeof n!="boolean"?n!=null:n,!s||!e[t])return n;if(s==="toAttribute")switch(r){case"Object":case"Array":return n==null?null:JSON.stringify(n);case"Boolean":return n?"":null;case"Number":return n??null;default:return n}else switch(r){case"Object":case"Array":return n&&JSON.parse(n);case"Boolean":return n;case"Number":return n!=null?+n:n;default:return n}}function Mi(t){const n={};return t.childNodes.forEach(e=>{n[e.slot||"default"]=!0}),n}function Es(t,n,e,s,r,i){let o=class extends xs{constructor(){super(t,e,r),this.$$p_d=n}static get observedAttributes(){return lt(n).map(a=>(n[a].attribute||a).toLowerCase())}};return lt(n).forEach(a=>{De(o.prototype,a,{get(){return this.$$c&&a in this.$$c?this.$$c[a]:this.$$d[a]},set(l){var u;l=ot(a,l,n),this.$$d[a]=l;var c=this.$$c;if(c){var d=(u=ge(c,a))==null?void 0:u.get;d?c[a]=l:c.$set({[a]:l})}}})}),s.forEach(a=>{De(o.prototype,a,{get(){var l;return(l=this.$$c)==null?void 0:l[a]}})}),t.element=o,o}var Ii=ui('<button class="header svelte-188d8wh"><span><svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M5 6l3 3 3-3" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span> <span class="header-text"> </span></button> <div><!></div>',1);const Ai={hash:"svelte-188d8wh",code:`:host {display:block;border:1px solid var(--dark-background-l);border-radius:4px;overflow:hidden;background:var(--dark-background);width:50%;max-width:700px;}.header.svelte-188d8wh {display:flex;align-items:center;cursor:pointer;padding:1rem;background:var(--dark-background-e);border:none;font-family:var(--global-font);width:100%;}.caret.svelte-188d8wh {transition:transform 0.2s;margin-right:1rem;width:1em;height:1em;display:inline-block;vertical-align:middle;transform:rotate(-90deg);}:host([expanded]) .caret.svelte-188d8wh,\r
.caret.expanded.svelte-188d8wh {transform:rotate(0deg);}.content.svelte-188d8wh {padding:1rem;display:none;}.content.expanded.svelte-188d8wh {display:block;}`};function Ni(t,n){Yt(n,!1),bs(t,Ai);let e=Q(n,"header",12,""),s=ns(!1);function r(){G(s,!L(s))}var i=Ii(),o=Ur(i),a=X(o);let l;var c=j(a,2),d=X(c,!0);Y(c),Y(o);var u=j(o,2);let f;var p=X(u);return yi(p,n,"default",{}),Y(u),cs((v,g)=>{A(o,"aria-expanded",L(s)),l=xn(a,1,"caret svelte-188d8wh",null,l,v),Pt(d,e()),f=xn(u,1,"content svelte-188d8wh",null,f,g)},[()=>({expanded:L(s)}),()=>({expanded:L(s)})]),wn("click",o,r),wn("keydown",o,v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),r())}),Kt(t,i),Xt({get header(){return e()},set header(v){e(v),V()}})}customElements.define("collapse-view",Es(Ni,{header:{}},["default"],[],!0));var Pi=pi('<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" class="svelte-u4n63s"><defs><linearGradient x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%"></stop><stop offset="100%"></stop></linearGradient><linearGradient x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%"></stop><stop offset="100%"></stop></linearGradient><filter x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="5" dy="5" stdDeviation="10" flood-color="rgba(0,0,0,0.5)"></feDropShadow></filter><filter x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="25" dy="25" stdDeviation="25" flood-color="rgba(0,0,0,0.75)"></feDropShadow></filter></defs><g><rect x="0" y="0" width="300" height="300"></rect></g><text x="155" y="170" text-anchor="middle" dominant-baseline="middle" font-size="180" opacity="1.0"> </text><text x="150" y="165" text-anchor="middle" dominant-baseline="middle" font-size="180" stroke="rgba(255,255,255,0.3)" stroke-width="1"> </text></svg>');const Oi={hash:"svelte-u4n63s",code:":host {display:inline-block;}svg.svelte-u4n63s {filter:none;}"};function Di(t,n){Yt(n,!1),bs(t,Oi);let e=Q(n,"text",12,"Hz"),s=Q(n,"size",12,300),r=Q(n,"radius",12,"0.5rem"),i=Q(n,"shadowColor",12,"var(--haze-color-shadow)"),o=Q(n,"foregroundTopColor",12,"var(--haze-color-foreground-top)"),a=Q(n,"foregroundBottomColor",12,"var(--haze-color-foreground-bottom)"),l=Q(n,"backgroundTopColor",12,"var(--haze-color-background-top)"),c=Q(n,"backgroundBottomColor",12,"var(--haze-color-background-bottom)");const d=Math.random().toString(36).substring(2,9),u=`bgGradient-${d}`,f=`textGradient-${d}`,p=`dropShadow-${d}`,v=`richShadow-${d}`;$i();var g=Pi(),b=X(g),E=X(b),x=X(E),w=j(x);Y(E);var O=j(E),se=X(O),bt=j(se);Y(O);var Ce=j(O),$e=j(Ce);Y(b);var re=j(b),Cs=X(re);Y(re);var et=j(re),$s=X(et,!0);Y(et);var tt=j(et),Ts=X(tt,!0);return Y(tt),Y(g),cs(()=>{xi(g,r()?`border-radius: ${r()};`:""),A(g,"width",s()),A(g,"height",s()),A(E,"id",u),A(x,"stop-color",l()),A(w,"stop-color",c()),A(O,"id",f),A(se,"stop-color",o()),A(bt,"stop-color",a()),A(Ce,"id",p),A($e,"id",v),A(Cs,"fill",`url(#${u})`),A(et,"fill",i()),Pt($s,e()),A(tt,"fill",`url(#${f})`),A(tt,"filter",`url(#${p}) url(#${v})`),Pt(Ts,e())}),Kt(t,g),Xt({get text(){return e()},set text(M){e(M),V()},get size(){return s()},set size(M){s(M),V()},get radius(){return r()},set radius(M){r(M),V()},get shadowColor(){return i()},set shadowColor(M){i(M),V()},get foregroundTopColor(){return o()},set foregroundTopColor(M){o(M),V()},get foregroundBottomColor(){return a()},set foregroundBottomColor(M){a(M),V()},get backgroundTopColor(){return l()},set backgroundTopColor(M){l(M),V()},get backgroundBottomColor(){return c()},set backgroundBottomColor(M){c(M),V()}})}customElements.define("symbol-icon",Es(Di,{text:{},size:{},radius:{},shadowColor:{},foregroundTopColor:{},foregroundBottomColor:{},backgroundTopColor:{},backgroundBottomColor:{}},[],[],!0));const ks="pane-visibility";function qi(){const t=localStorage.getItem(ks);if(t)try{const n=JSON.parse(t);if(Array.isArray(n))return n}catch{}return null}function Sn(t){localStorage.setItem(ks,JSON.stringify(t))}window.addEventListener("DOMContentLoaded",()=>{const t=Array.from(document.querySelectorAll("symbol-toggle")),n=document.querySelector("pane-view");let e=qi();(!e||e.length!==t.length)&&(e=Array(t.length).fill(!0),Sn(e)),t.forEach((l,c)=>{l.checked=e[c]??!0,l.addEventListener("toggle-change",d=>{e[c]=d.detail.checked,Sn(e),n.setVisiblePanes(e)})}),n.setVisiblePanes(e);const s=n.querySelector("#source-pane source-editor");s&&(s.attachEventListeners(),s.initialize("file:///c:/Users/Connor/Desktop/clarity/src/index.ts",St,at)),n.querySelector("program-tree");const r=n.querySelector("#ir-pane source-editor");r&&(r.attachEventListeners(),r.initialize("file:///c:/Users/Connor/Desktop/clarity/src/index.ts",St,at));const i=n.querySelector("#asm-pane source-editor");i&&(i.attachEventListeners(),i.initialize("file:///c:/Users/Connor/Desktop/clarity/src/index.ts",St,at));const o=new Uint8Array([72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33,72,101,120,32,86,105,101,119,101,114,33]),a=n.querySelector("hex-viewer");a&&a.initialize("file:///mock.bin",o,16)});const He=document.querySelector("output-window");He.messages=[];He.visible=!1;var it;const zi=()=>{He.visible=!0,it!==void 0&&clearTimeout(it),it=window.setTimeout(()=>{He.visible=!1,it=void 0},3e3)};let kt=1;const St={notify:t=>{console.log(t);const n=[...He.messages];n.length>0&&n[n.length-1].rawText===t?(kt++,n[n.length-1].text=`${t} [x${kt}]`):(kt=1,n.push({id:Date.now().toString(),text:t,rawText:t,visible:!0})),He.messages=n,zi()}},Hi=new Worker(new URL("/assets/LanguageServerWorker-BOXhEwlU.js",import.meta.url),{type:"module"}),at=new Worker(new URL("/assets/LanguageClientWorker-2arvf2PA.js",import.meta.url),{type:"module"}),Ss=new MessageChannel,Dt=Ss.port1,qt=Ss.port2;Hi.postMessage({type:"connect",port:Dt},[Dt]);at.postMessage({type:"connect",port:qt},[qt]);Dt.start();qt.start();
