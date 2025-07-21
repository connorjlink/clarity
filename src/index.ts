import * as ow from './output_window';
import * as se from './source_editor';
import * as hv from './HexViewer';
import './TabView';
import './ArticleSelector';
import './CustomIcon';

import './CollapseView.svelte';
import './ArticleSelector.svelte';

const outputWindow = document.getElementById('output-window') as ow.OutputWindowElement;
outputWindow.messages = [];
outputWindow.visible = false;

var fadeTimeout: any;
const showConsole = () => {
    outputWindow.visible = true;
    if (fadeTimeout) {
        clearTimeout(fadeTimeout.current);
    }
    // five seconds of inactivity
    fadeTimeout = setTimeout(() => outputWindow.visible = false, 10000);
};

const consoleListener = {
    notify: (msg: string) => {
        console.log(msg);
        outputWindow.messages = [...outputWindow.messages, { id: Date.now().toString(), text: msg, visible: true }];
        showConsole();
    }
};

/////////////////////////////////////////////////////////

const languageServerWorker = new Worker(new URL('./language_server_worker.ts', import.meta.url), { type: 'module' });
const languageClientWorker = new Worker(new URL('./language_client_worker.ts', import.meta.url), { type: 'module' });

const channel = new MessageChannel();

const clientPort = channel.port1;
const serverPort = channel.port2;

// Identify a message port over which to pass messages. This can be slow, which is why each component runs in its own worker.
languageServerWorker.postMessage({ type: 'connect', port: clientPort }, [clientPort]);
languageClientWorker.postMessage({ type: 'connect', port: serverPort }, [serverPort]);

clientPort.start();
serverPort.start();

/////////////////////////////////////////////////////////

const sourceEditor = document.querySelector('#main-editor') as se.SourceEditorElement;
sourceEditor.attachEventListeners();
// the source editor in this case is mocking the language server so that it can communicate with the client through the same channel
sourceEditor.initialize('file:///c:/Users/Connor/Desktop/clarity/src/index.ts', consoleListener, languageClientWorker);

// const data = new Uint8Array([0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21]);
// const hexViewer = document.createElement('hex-viewer') as hv.HexViewerElement;
// document.body.appendChild(hexViewer);
// hexViewer.initialize('file:///mock.bin', data, 0x10);


//const tabView = document.querySelector('my-tabview') as tv.TabHostElement;
//tabView.render();