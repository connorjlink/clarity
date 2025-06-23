import './OutputWindow';
import './ProgramTree';
import './TransformedView';
import './TreeNode';
import './NodeManager';

const el = document.getElementById('output-window') as any;
el.messages = [
    { id: '1', text: 'Hola mundo', visible: true },
    { id: '2', text: 'Mensaje 2', visible: true }
];
el.visible = true;
