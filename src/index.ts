import * as ow from './output_window';
import * as se from './source_editor';

const outputWindow = document.getElementById('output-window') as ow.OutputWindowElement;
outputWindow.messages = [
    { id: '1', text: 'Hola mundo', visible: true },
    { id: '2', text: 'Mensaje 2', visible: true }
];
outputWindow.visible = true;


var fadeTimeout: any;
const showConsole = () => {
    outputWindow.visible = true;
    if (fadeTimeout) {
        clearTimeout(fadeTimeout.current);
    }
    // three seconds of inactivity
    fadeTimeout = setTimeout(() => outputWindow.visible = false, 3000);
};

const consoleListener = {
    notify: (msg: string) => {
        console.log(msg);
        outputWindow.messages = [...outputWindow.messages, { id: Date.now().toString(), text: msg, visible: true }];
        showConsole();
    }
};

const sourceEditor = document.querySelector('#main-editor') as se.SourceEditorElement;
sourceEditor.attachEventListeners(consoleListener);

/////////////////////////////////////////////////////////

const languageClientWorker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

languageClientWorker.onerror = (error) => {
    consoleListener.notify(`Worker error: ${error.message}`);
}

languageClientWorker.onmessage = (event) => {
    const data = event.data;
    if (data.type === 'log') {
        consoleListener.notify(data.message);
    } else if (data.type === 'error') {
        consoleListener.notify(`Error: ${data.message}`);
    } else if (data.type === 'compileResult') {
        // Handle compile result
        consoleListener.notify(`Compile result: ${JSON.stringify(data.result)}`);
    }
};

languageClientWorker.onmessageerror = (event) => {
    consoleListener.notify(`Message error: ${event.data}`);
}
