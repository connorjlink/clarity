import './OutputWindow';
import './ProgramTree';
import './TransformedView';
import './TreeNode';
import './NodeManager';
import './SourceEditor';

import { OutputWindowElement } from './OutputWindow';
import { SourceEditorElement } from './SourceEditor';

const console = document.getElementById('output-window') as OutputWindowElement;
console.messages = [
    { id: '1', text: 'Hola mundo', visible: true },
    { id: '2', text: 'Mensaje 2', visible: true }
];
console.visible = true;

var fadeTimeout: any;

const showConsole = () => {
    console.visible = true;
    if (fadeTimeout) {
        clearTimeout(fadeTimeout.current);
    }
    // three seconds of inactivity
    fadeTimeout = setTimeout(() => console.visible = false, 3000);
};

const consoleListener = {
    notify: (msg: string) => {
        console.messages = [...console.messages, { id: Date.now().toString(), text: msg, visible: true }];
        showConsole();
    }
};

const sourceEditor = document.querySelector('#main-editor') as SourceEditorElement;
sourceEditor.attachEventListeners(consoleListener);
