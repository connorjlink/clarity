import { type OutputWindowMessage } from './OutputWindow';
const el = document.getElementById('myConsole') as any;
el.messages = [
    { id: '1', text: 'Hola mundo', visible: true },
    { id: '2', text: 'Mensaje 2', visible: true }
];
el.visible = true;