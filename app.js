/**
 * NS-STI Final High-Fidelity Diagnostic Engine
 * v1.6.0 - Case 2 formalized (Nodes 2.1 - 2.3)
 */

const diagnosticTree = {
    '0.1': {
        id: '0.1',
        type: 'welcome',
        title: 'Diagnóstico para servicios de Internet',
        headerText: 'Soporte de Nivel 1 - Método de procedimiento, Atención en la llamada entrante',
        options: [
            { label: 'Iniciar', nextStep: '0.2' }
        ]
    },
    '0.2': {
        id: '0.2',
        title: 'Identificación del Hardware',
        procedure: 'Identificación del modelo del equipo',
        objective: 'Ayudar al cliente a identificar su equipo si no conoce el modelo.',
        references: [
            { label: 'Modelo ZTE F6600', text: 'Cuatro antenas redondas.' },
            { label: 'Modelo ZTE F1611A', text: 'Dos antenas anchas y planas.' }
        ],
        question: '“Para poder asistirlo correctamente, ¿podría indicarme el modelo del equipo que tiene instalado en su domicilio?”',
        hardwareOptions: [
            { id: 'zte_f6600', label: 'Modelo F6600', nextStep: '0.3' },
            { id: 'zte_f1611a', label: 'Modelo F1611A', nextStep: '0.3' }
        ]
    },
    '0.3': {
        id: '0.3',
        title: 'Identificación del Modo de Conexión',
        procedure: 'Identificación del Modo',
        objective: 'Diferenciación entre configuración router (Standard) o puente (Bridge).',
        references: [
            { label: 'Modo Standard', text: 'El equipo de la empresa opera como router (múltiples puertos LAN ocupados, Wi-Fi activo).' },
            { label: 'Modo Bridge', text: 'El cliente usa su propio router (Solo puerto LAN 1 ocupado, luces Wi-Fi del módem apagadas).' }
        ],
        question: '“¿Usted utiliza su propio router para el Wi-Fi (modo Router), o usa el equipo que le entregamos de Nuevo Siglo (modo Bridge)?”',
        options: [
            { label: 'Modo Standard', nextStep: '1.0', metadata: { mode: 'Standard' } },
            { label: 'Modo Bridge', nextStep: 'bridge_info', metadata: { mode: 'Bridge' } }
        ]
    },
    '1.0': {
        id: '1.0',
        title: 'Verificación de Energía (Caso 1: POWER)',
        procedure: 'Diagnóstico de LED',
        objective: 'Confirmar que el módem recibe energía eléctrica.',
        question: '“¿La luz LED POWER está encendida y fija?”',
        leds: { power: 'eval', los: 'red', pon: 'green', internet: 'green' },
        activeLED: 'POWER',
        options: [
            { label: 'No', nextStep: '1.1' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '1.1': {
        id: '1.1',
        title: 'Verificación de energía en el domicilio',
        procedure: 'Resolución caso POWER - Paso 1',
        objective: 'Confirmar disponibilidad de electricidad disponible para probar el módem.',
        instruction: 'Indica al cliente que observe si hay luces encendidas o electrodomésticos funcionando.',
        references: [
            { text: 'Si el cliente tiene energía: podemos continuar con la prueba del equipo.' },
            { text: 'Si no hay energía: se debe esperar a que vuelva la electricidad antes de seguir con el soporte.' }
        ],
        question: '“¿Podría confirmar si tiene energía eléctrica en su casa en este momento?”',
        leds: { power: 'off', los: 'off', pon: 'off', internet: 'off' },
        activeLED: 'POWER',
        options: [
            { label: 'No', nextStep: 'error_no_power' },
            { label: 'Si', nextStep: '1.2' }
        ]
    },
    'error_no_power': {
        id: 'error_no_power',
        title: 'ERROR: Cliente sin energía',
        procedure: 'Cierre por falta de energía',
        objective: 'Finalizar diagnóstico hasta restablecimiento del suministro.',
        headerInfo: 'Soporte suspendido',
        question: 'Se debe esperar a que el suministro eléctrico sea restablecido por la empresa de energía.',
        options: [
            { label: 'Finalizar diagnóstico', nextStep: '0.1' }
        ]
    },
    '1.2': {
        id: '1.2',
        title: 'Comprobación del botón ON/OFF',
        procedure: 'Resolución caso POWER - Paso 2',
        objective: 'Verificar que el botón de encendido/apagado del módem funcione correctamente y permita energizar el equipo.',
        action: 'Indica al cliente que presione y suelte el botón rojo ON/OFF ubicado en la parte trasera del módem. Explica que, al hacerlo, la luz POWER debería encenderse y, luego de unos segundos, deberían encenderse las demás luces del panel frontal.',
        question: '¿La luz LED POWER está encendida y fija?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'on_off_images',
        leds: { power: 'eval', los: 'red', pon: 'green', internet: 'green' },
        activeLED: 'POWER',
        options: [
            { label: 'No', nextStep: '1.3' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    'on_off_images': {
        id: 'on_off_images',
        title: 'Guía Visual: Botón ON/OFF',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_1_2_button.png']
    },
    '1.3': {
        id: '1.3',
        title: 'Verificación de conexión del transformador',
        procedure: 'Resolución caso POWER - Paso 3',
        objective: 'Asegurar que el módem reciba energía eléctrica de forma estable y correcta.',
        action: 'Indica al cliente que revise ambas conexiones del cable de alimentación: en el módem y en el tomacorriente.<br><strong>Extremo del módem:</strong> “Desconecte el cable negro del puerto Power y vuelva a conectarlo firmemente.”<br><strong>Extremo del transformador:</strong> “Verifique que el otro extremo esté correctamente insertado en la toma de corriente.”',
        question: '¿La luz LED POWER está encendida y fija?',
        leds: { power: 'eval', los: 'red', pon: 'green', internet: 'green' },
        activeLED: 'POWER',
        options: [
            { label: 'No', nextStep: '1.4' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '1.4': {
        id: '1.4',
        title: 'Prueba en otro tomacorriente',
        procedure: 'Resolución caso POWER - Paso 4',
        objective: 'Confirmar que el tomacorriente suministra energía correctamente.',
        action: 'Pide al cliente desconectar el transformador del módem y conectar otro dispositivo (por ejemplo, una lámpara o un cargador) para comprobar si hay energía. Si el dispositivo no enciende, solicita que conecte el módem en otro tomacorriente —preferiblemente de otra habitación— y observe las luces del equipo.',
        question: '¿La luz LED POWER está encendida y fija?',
        leds: { power: 'eval', los: 'red', pon: 'green', internet: 'green' },
        activeLED: 'POWER',
        options: [
            { label: 'No', nextStep: '1.5' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '1.5': {
        id: '1.5',
        title: 'Prueba con transformador compatible de recambio',
        procedure: 'Resolución caso POWER - Paso 5',
        objective: 'Determinar si la falla proviene del transformador del módem.',
        action: 'Explica al cliente: “Vamos a revisar si el problema es el transformador del módem. Si tiene el servicio de cable o un dispositivo MESH, su transformador es compatible.” Indica al cliente: “Desconecte el transformador del módem y conecte el transformador del decodificador o del Mesh en el mismo lugar.”',
        question: '¿La luz LED POWER está encendida y fija?',
        leds: { power: 'eval', los: 'red', pon: 'green', internet: 'green' },
        activeLED: 'POWER',
        options: [
            { label: 'No', nextStep: 'l2_escalation' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    'sync_check': {
        id: 'sync_check',
        title: 'Verificación de Sincronismo',
        procedure: 'Diagnóstico de LED Caso 2: SYNC',
        objective: 'Verificar la conexión física de la fibra óptica.',
        question: '¿La luz PON está verde fija y la luz LOS está apagada?',
        leds: { power: 'green', los: 'off', pon: 'eval', internet: 'green' },
        activeLED: 'PON',
        options: [
            { label: 'No', nextStep: '2.1' },
            { label: 'Si', nextStep: 'finish_call' }
        ]
    },
    '2.1': {
        id: '2.1',
        title: 'Revisión del patchcord de fibra',
        procedure: 'Caso 2: LOS > Resolución paso 1',
        objective: 'Confirmar que el patchcord de fibra esté en óptimas condiciones.',
        action: '<strong>Explica al cliente:</strong> “Vamos a revisar las condiciones del patchcord de fibra (cable amarillo con punta verde).” Indica que verifique que el cable no esté doblado, forzado, presionado, cortado ni dañado.',
        question: '¿Se apagó la luz LED LOS después de revisar el patchcord?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'patchcord_images',
        leds: { power: 'green', los: 'red', pon: 'eval', internet: 'off' },
        activeLED: 'LOS',
        options: [
            { label: 'No', nextStep: '2.2' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '2.2': {
        id: '2.2',
        title: 'Reconexión del patchcord en el módem',
        procedure: 'Caso 2: LOS > Resolución paso 2',
        objective: 'Verificar que el patchcord esté correctamente conectado al módem.',
        action: '<strong>Indica al cliente:</strong> “Desconecte y vuelva a conectar el patchcord de fibra (cable amarillo con punta verde) en el módem. Está en la parte inferior del equipo.”<br><strong>Explica cómo desconectar:</strong> agarre la punta verde y tire con cuidado.<br><strong>Explica cómo reconectar:</strong> inserte el cable hasta que sienta un click.',
        question: '“¿Se apagó la luz LED LOS después de reconectar el patchcord?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'patchcord_images',
        leds: { power: 'green', los: 'red', pon: 'eval', internet: 'off' },
        activeLED: 'LOS',
        options: [
            { label: 'No', nextStep: '2.3' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '2.3': {
        id: '2.3',
        title: 'Reconexión del patchcord en la roseta de NS',
        procedure: 'Caso 2: LOS > Resolución paso 3',
        objective: 'Confirmar que el patchcord de fibra esté correctamente conectado a la roseta de Nuevo Siglo en la pared.',
        action: '<strong>Instrucciones:</strong> “Desconecte y vuelva a conectar el patchcord de fibra (cable amarillo con punta verde) en la roseta de la pared. Siga el cable hasta su terminación.”<br><strong>Explica cómo identificar la roseta de NS:</strong> tiene un sticker con el logo en la parte frontal.<br><strong>Aclaración:</strong> si hay dos rosetas (NS y servicio previo), asegúrese de usar la roseta de NS.',
        question: '“¿Se apagó la luz LED LOS después de reconectar el patchcord en la roseta?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'roseta_images',
        leds: { power: 'green', los: 'red', pon: 'eval', internet: 'off' },
        activeLED: 'LOS',
        options: [
            { label: 'No', nextStep: 'coordinar_visita' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    'patchcord_images': {
        id: 'patchcord_images',
        title: 'Guía Visual: Conector de Fibra',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_2_2_modem.png']
    },
    'roseta_images': {
        id: 'roseta_images',
        title: 'Guía Visual: Roseta NS',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_2_3_roseta.png']
    },
    'coordinar_visita': {
        id: 'coordinar_visita',
        title: 'Fallas en el encendido',
        procedure: 'Coordinar visita técnica',
        objective: 'Derivar el caso con Despacho.',
        instruction: 'En caso de tener fallas en el encendido del módem derivar el caso con Despacho.',
        action: 'Preparar y registrar la información relevante de la atención durante la llamada.',
        question: '',
        options: [
            { label: 'Coordinar visita técnica', nextStep: '0.1' }
        ]
    },
    'bridge_info': {
        id: 'bridge_info',
        title: 'Modo Bridge Detectado',
        procedure: 'Límites de Soporte',
        objective: 'Informar límites de soporte.',
        question: '“Al estar en modo Bridge, soporte para Wi-Fi depende de su propio router.”',
        options: [{ label: 'Entendido', nextStep: 'sync_check' }]
    },
    'l2_escalation': {
        id: 'l2_escalation',
        title: 'Escalación a Nivel 2',
        procedure: 'Derivación técnica',
        objective: 'Derivación técnica.',
        question: '“Pasaré su caso a ingeniería.”',
        options: [{ label: 'Finalizar', nextStep: '0.1' }]
    },
    'finish_call': {
        id: 'finish_call',
        title: 'Finalización del Diagnóstico',
        procedure: 'Cierre exitoso',
        objective: 'Cierre exitoso.',
        question: '“¿Puedo ayudarle en algo más?”',
        options: [{ label: 'Finalizar', nextStep: '0.1' }]
    }
};

let state = {
    history: ['0.1'],
    model: 'NO IDENT.',
    mode: 'NO DEF.'
};

const elements = {
    headerArea: document.querySelector('.app-header'),
    mainArea: document.querySelector('.main-content'),
    ledArea: document.querySelector('.app-footer')
};

function render() {
    const currentId = state.history[state.history.length - 1];
    const step = diagnosticTree[currentId];

    // Header logic for breadcrumbs
    if (step.id === '0.1') {
        elements.headerArea.innerHTML = `<div class="header-main-text" style="width: 100%; border: none;">${step.headerText}</div>`;
    } else {
        const hasDescriptiveBtn = step.hasDescriptiveImage;
        elements.headerArea.innerHTML = `
            <div class="header-back-area"><button class="back-btn" id="btn-atras">Atrás</button></div>
            ${hasDescriptiveBtn ? `
            <div class="header-visual-aid">
                <button class="visual-aid-btn" onclick="handleNext('${step.descriptiveImageStep}')">
                    <div class="visual-aid-label">Ver imagen descriptiva</div>
                    <div class="visual-aid-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                </button>
            </div>` : ''}
            <div class="header-main-text">Soporte de Nivel 1<br>Método de procedimiento<br>Atención en la llamada entrante</div>
            <div class="header-breadcrumbs">
                <div class="breadcrumb-box">
                    <span class="breadcrumb-label">Diagnóstico para servicios de Internet</span>
                    <span class="breadcrumb-value">Modelo: ${state.model}</span>
                    <span class="breadcrumb-value">Modo: ${state.mode}</span>
                </div>
                <div class="breadcrumb-box"><span class="breadcrumb-label">${step.procedure || ''}</span></div>
            </div>
        `;
        document.getElementById('btn-atras').onclick = handleBack;
    }

    // Body
    elements.mainArea.innerHTML = '';
    if (step.type === 'welcome') {
        elements.mainArea.innerHTML = `<div class="welcome-screen"><h1 class="welcome-title">${step.title}</h1><button class="btn btn-iniciar" onclick="handleNext('${step.options[0].nextStep}')">Iniciar</button></div>`;
    } else if (step.type === 'images_grid') {
        elements.mainArea.innerHTML = `<h1 class="step-title">${step.title}</h1><div class="desc-images-grid">${step.images.map(img => `<img src="${img}" class="full-mock-img">`).join('')}</div>`;
    } else {
        if (step.headerInfo) {
            const hInfo = document.createElement('h2');
            hInfo.className = 'header-info-callout'; hInfo.textContent = step.headerInfo;
            elements.mainArea.appendChild(hInfo);
        }
        const titleEl = document.createElement('h1'); titleEl.className = 'step-title'; titleEl.textContent = step.title;
        elements.mainArea.appendChild(titleEl);
        if (step.objective) {
            const objEl = document.createElement('p'); objEl.className = 'objective-text'; objEl.innerHTML = `<strong>Objetivo:</strong> ${step.objective}`;
            elements.mainArea.appendChild(objEl);
        }

        // Instructional text
        if (step.instruction) {
            const instEl = document.createElement('p'); instEl.className = 'instruction-text';
            instEl.innerHTML = step.instruction;
            elements.mainArea.appendChild(instEl);
        }

        if (step.action) {
            const actContainer = document.createElement('div'); actContainer.className = 'action-container';
            actContainer.innerHTML = `<p class="action-title">Acción a ejecutar:</p><p class="action-text">${step.action}</p>`;
            elements.mainArea.appendChild(actContainer);
        }
        if (step.references) {
            const refContainer = document.createElement('div'); refContainer.className = 'references-section';
            refContainer.innerHTML = step.references.some(r => r.label) ? `<p class="references-title">Referencias:</p>` : '';
            step.references.forEach(ref => {
                const item = document.createElement('p'); item.className = 'reference-item';
                item.innerHTML = ref.label ? `<strong>${ref.label}:</strong> ${ref.text}` : ref.text;
                refContainer.appendChild(item);
            });
            elements.mainArea.appendChild(refContainer);
        }
        if (step.question) {
            const qContainer = document.createElement('div'); qContainer.className = 'question-container';
            qContainer.innerHTML = `<p class="question-label">Pregunta al cliente:</p><div class="question-bubble"><div class="question-bubble-inner">${step.question}</div></div>`;
            elements.mainArea.appendChild(qContainer);
        }

        const intArea = document.createElement('div'); intArea.className = 'interaction-area';
        if (step.hardwareOptions) {
            intArea.className = 'hardware-images-container';
            step.hardwareOptions.forEach(hw => {
                const item = document.createElement('div'); item.className = 'hardware-option-item';
                item.innerHTML = `<div style="background: #eee; width: 250px; height: 180px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #888;">[Imagen ${hw.label}]</div><button class="btn btn-standard">${hw.label}</button>`;
                item.querySelector('button').onclick = () => { state.model = hw.label.replace('Modelo ', ''); handleNext(hw.nextStep); };
                intArea.appendChild(item);
            });
        } else {
            step.options.forEach(opt => {
                const btn = document.createElement('button');
                let btnClass = 'btn-standard';
                if (opt.label === 'Si') btnClass = 'btn-yes';
                if (opt.label === 'No') btnClass = 'btn-no';
                if (opt.label === 'Coordinar visita técnica') btnClass = 'btn-yes btn-wide';
                btn.className = `btn ${btnClass}`; btn.textContent = opt.label;
                btn.onclick = () => { if (opt.metadata && opt.metadata.mode) state.mode = opt.metadata.mode; handleNext(opt.nextStep); };
                intArea.appendChild(btn);
            });
        }
        elements.mainArea.appendChild(intArea);
    }

    // Footer
    if (step.id === '0.1' || step.id === '0.2' || step.id === '0.3' || step.id === 'coordinar_visita') {
        elements.ledArea.style.display = 'none';
    } else {
        elements.ledArea.style.display = 'flex'; elements.ledArea.innerHTML = '<div class="led-group"></div>';
        const group = elements.ledArea.querySelector('.led-group');
        ['POWER', 'LOS', 'PON', 'INTERNET'].forEach(ledName => {
            const ledKey = ledName.toLowerCase(); const ledStatus = step.leds ? step.leds[ledKey] : 'off';
            const isActive = step.activeLED === ledName;
            const box = document.createElement('div'); box.className = `led-box ${isActive ? 'active' : ''}`;
            let dotClass = ''; if (ledStatus === 'green' || (isActive && ledStatus === 'eval' && ledName !== 'LOS')) dotClass = 'green'; else if (ledStatus === 'red' || (isActive && ledName === 'LOS')) dotClass = 'red';
            box.innerHTML = `<span class="led-name">${ledName}</span><div class="led-dot ${dotClass}"></div>`;
            group.appendChild(box);
        });
    }
}

function handleNext(nextId) { state.history.push(nextId); render(); }
function handleBack() {
    if (state.history.length > 1) {
        state.history.pop();
        const prevId = state.history[state.history.length - 1];
        if (prevId === '0.2') state.model = 'NO IDENT.';
        if (prevId === '0.2' || prevId === '0.3' || prevId === '0.1') state.mode = 'NO DEF.';
        render();
    }
}
document.addEventListener('DOMContentLoaded', render);
