import * as ow from './OutputWindow';
import * as se from './SourceEditor';
import * as hv from './HexViewer';
import * as pt from './ProgramTree';
import './TabView';
import './ArticleSelector';
import './PaneView';
import './SymbolToggle';
import './PaneStatus';

import './CollapseView.svelte';
import './SymbolIcon.svelte';


const PANE_VISIBILITY_KEY = 'pane-visibility';

function getInitialVisibility(): boolean[] | null {
    const saved = localStorage.getItem(PANE_VISIBILITY_KEY);
    if (saved) {
        try {
            const arr = JSON.parse(saved);
            if (Array.isArray(arr)) {
                return arr;
            }
        } catch {}
    }
    return null;
}

function saveVisibility(visible: boolean[]) {
    localStorage.setItem(PANE_VISIBILITY_KEY, JSON.stringify(visible));
}

window.addEventListener('DOMContentLoaded', () => {
    const toggles = Array.from(document.querySelectorAll('symbol-toggle')) as any[];
    const paneView = document.querySelector('pane-view') as any;
    let visible = getInitialVisibility();
    if (!visible || visible.length !== toggles.length) {
        visible = Array(toggles.length).fill(true);
        saveVisibility(visible);
    }

    toggles.forEach((toggle, i) => {
        toggle.checked = visible[i] ?? true;
        toggle.addEventListener('toggle-change', (e: any) => {
            visible[i] = e.detail.checked;
            saveVisibility(visible);
            paneView.setVisiblePanes(visible);
        });
    });

    paneView.setVisiblePanes(visible);

    const sourceEditor = paneView.querySelector('#source-pane source-editor') as se.SourceEditorElement;
    if (sourceEditor) {
        sourceEditor.attachEventListeners();
        sourceEditor.initialize('file:///c:/Users/Connor/Desktop/clarity/src/index.ts', consoleListener, languageClientWorker);
    }

    const programTree = paneView.querySelector('program-tree') as pt.ProgramTreeElement;
    if (programTree) {
    }
    
    const irViewer = paneView.querySelector('#ir-pane source-editor') as se.SourceEditorElement;
    if (irViewer) {
        irViewer.attachEventListeners();
        irViewer.initialize('file:///c:/Users/Connor/Desktop/clarity/src/index.ts', consoleListener, languageClientWorker);
    }

    const asmViewer = paneView.querySelector('#asm-pane source-editor') as se.SourceEditorElement;
    if (asmViewer) {
        asmViewer.attachEventListeners();
        asmViewer.initialize('file:///c:/Users/Connor/Desktop/clarity/src/index.ts', consoleListener, languageClientWorker);
    }
    
    const data = new Uint8Array([0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21]);

    const hexViewer = paneView.querySelector('hex-viewer') as hv.HexViewerElement;
    if (hexViewer) {
        hexViewer.initialize('file:///mock.bin', data, 0x10);
    }

});

/////////////////////////////////////////////////////////

const outputWindow = document.querySelector('output-window') as ow.OutputWindowElement;
outputWindow.messages = [];
outputWindow.visible = false;

var fadeTimeout: number | undefined;
const showConsole = () => {
    outputWindow.visible = true;
    if (fadeTimeout !== undefined) {
        clearTimeout(fadeTimeout);
    }
    // resettable three seconds of inactivity
    fadeTimeout = window.setTimeout(() => {
        outputWindow.visible = false;
        fadeTimeout = undefined;
    }, 3000);
};

let lastMsgText: string | null = null;
let lastMsgCount = 1;

const consoleListener = {
    notify: (msg: string) => {
        console.log(msg);

        const messages = [...outputWindow.messages];
        if (
            messages.length > 0 &&
            messages[messages.length - 1].rawText === msg
        ) {
            lastMsgCount++;
            messages[messages.length - 1].text = `${msg} [x${lastMsgCount}]`;
        } else {
            lastMsgText = msg;
            lastMsgCount = 1;
            messages.push({
                id: Date.now().toString(),
                text: msg,
                rawText: msg, // para comparación eficiente
                visible: true
            });
        }
        outputWindow.messages = messages;
        showConsole();
    }
};

/////////////////////////////////////////////////////////

const languageServerWorker = new Worker(new URL('./LanguageServerWorker.ts', import.meta.url), { type: 'module' });
const languageClientWorker = new Worker(new URL('./LanguageClientWorker.ts', import.meta.url), { type: 'module' });

const channel = new MessageChannel();

const clientPort = channel.port1;
const serverPort = channel.port2;

// Identify a message port over which to pass messages. This can be slow, which is why each component runs in its own worker.
languageServerWorker.postMessage({ type: 'connect', port: clientPort }, [clientPort]);
languageClientWorker.postMessage({ type: 'connect', port: serverPort }, [serverPort]);

clientPort.start();
serverPort.start();

/////////////////////////////////////////////////////////

//const tabView = document.querySelector('my-tabview') as tv.TabHostElement;
//tabView.render();
