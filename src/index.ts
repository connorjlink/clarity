import * as pt from './ProgramTree';
import './TabView';
import './PaneView';

import { mount } from 'svelte';

import './PaneStatus.svelte';
import './CollapseView.svelte';
import './SymbolIcon.svelte';
import './HexViewer.svelte';
import './SymbolToggle.svelte';
import './SymbolTristate.svelte';
import './OutputWindow.svelte';
import HomePage from './HomePage.svelte';
import StatisticsPage from './StatisticsPage.svelte';
import LearnPage from './LearnPage.svelte';
import AboutPage from './AboutPage.svelte'; 
import SourceEditor from './SourceEditor.svelte';

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

customElements.whenDefined('output-window').then(() => {
    const outputWindow = document.querySelector('output-window') as any;
    const consoleListener = {
        notify: (msg: string) => {
            console.log(msg);
            outputWindow.addMessage(msg);
        }
    };

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

        const homeContent = document.querySelector('#home-content');
        if (homeContent) {
            mount(HomePage, {
                target: homeContent,
                props: {}
            });
        }

        const sourceEditor2 = paneView.querySelector('#source-pane source-editor');
        if (sourceEditor2) {
            sourceEditor2.attachEventListeners();
            sourceEditor2.initialize('file:///C:/source.hz', consoleListener, languageClientWorker);
        }

        const sourceEditor = paneView.querySelector('#source-editor');
        if (sourceEditor) {
            mount(SourceEditor, {
                target: sourceEditor,
                props: {
                    initialText: ';; Source Code\n\n(module\n  (func $main (export "main")\n    (nop)\n  )\n)\n\n\n\n\n\n\n\n',
                    softWrap: true,
                    readOnly: false,
                    allowLoadFromDisk: true,
                    pluginId: 'source-editor-plugin'
                }
            });
        }

        const programTree = paneView.querySelector('program-tree') as pt.ProgramTreeElement;
        if (programTree) {
        }

        const irEditor = paneView.querySelector('#ir-editor');
        if (irEditor) {
            mount(SourceEditor, {
                target: irEditor,
                props: {
                    initialText: ';; Intermediate Representation\n\n;; @main:\n  ret\n',
                    softWrap: true,
                    readOnly: true,
                    allowLoadFromDisk: false,
                    pluginId: 'ir-editor-plugin'
                }
            });
        }

        const asmEditor = paneView.querySelector('#asm-editor');
        if (asmEditor) {
            mount(SourceEditor, {
                target: asmEditor,
                props: {
                    initialText: ';; Assembly Code\n\nsection .text\n  global _start\n\n_start:\n  nop\n',
                    softWrap: true,
                    readOnly: true,
                    allowLoadFromDisk: false,
                    pluginId: 'asm-editor-plugin'
                }
            });
        }

        const data = new Uint8Array([0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21, 0x48, 0x65, 0x78, 0x20, 0x56, 0x69, 0x65, 0x77, 0x65, 0x72, 0x21]);

        const hexViewer = paneView.querySelector('hex-viewer');
        if (hexViewer) {
            customElements.whenDefined('hex-viewer').then(() => {
                hexViewer.initialize('file:///program.exe', data, languageClientWorker);
            });
        }

        const outputTristate = document.querySelector('symbol-tristate') as any;
        if (outputTristate) {
            outputTristate.state = 0;
            outputTristate.addEventListener('tristate-change', (e: any) => {
                const state = e.detail.state;
                console.log(`Output window state changed to: ${state}`);
                if (state === 0) {
                    outputWindow.auto();
                } else if (state === 1) {
                    outputWindow.show();
                } else if (state === 2) {
                    outputWindow.hide();
                }
            });
        }

    });
});

/////////////////////////////////////////////////////////

const statisticsPage = document.querySelector('#statistics-page');
if (statisticsPage) {
    mount(StatisticsPage, {
        target: statisticsPage,
        props: {}
    });
}

const learnPage = document.querySelector('#learn-page');
if (learnPage) {
    mount(LearnPage, {
        target: learnPage,
        props: {}
    });
}

const aboutPage = document.querySelector('#about-page');
if (aboutPage) {
    mount(AboutPage, {
        target: aboutPage,
        props: {}
    });
}

/////////////////////////////////////////////////////////

const languageServerWorker = new Worker(new URL('./LSPServerWorker.ts', import.meta.url), { type: 'module' });
const languageClientWorker = new Worker(new URL('./LSPClientWorker.ts', import.meta.url), { type: 'module' });

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
