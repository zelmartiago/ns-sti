/**
 * NS-STI: MOTOR DE DIAGNÓSTICO PARA SERVICIOS FTTH
 * v3.0.0 - Gold Master Edition (Documented & Consolidated)
 * Entorno: Vanilla JS (Browser compatible Chrome/Edge/Firefox)
 */

/* -------------------------------------------------------------------------- */
/* 1. ÁRBOL DE DECISIONES NODAL (DATA STRUCTURE)                              */
/* -------------------------------------------------------------------------- */
const diagnosticTree = {
    // CASO 0: Inicio y Triaje Maestro
    '0.1': {
        id: '0.1',
        type: 'welcome',
        title: 'Diagnóstico para servicios de Internet',
        headerText: 'Soporte de Nivel 1 - Método de procedimiento, Atención en la llamada entrante',
        options: [{ label: 'Iniciar', nextStep: '0.2' }]
    },
    '0.2': {
        id: '0.2',
        title: 'Nodo Maestro de Bifurcación',
        procedure: 'Triaje Técnico: Hardware y Modo',
        objective: 'Definir el modelo de equipo y el modo de servicio para una ruta de diagnóstico determinista.',
        type: 'master_node',
        hardwareOptions: [
            { id: 'zte_f6600', label: 'ZTE F6600', desc: 'Cuatro antenas redondas.' },
            { id: 'zte_f1611a', label: 'ZTE F1611A', desc: 'Dos antenas anchas y planas.' }
        ],
        modeOptions: [
            { id: 'standard', label: 'Modo Standard', desc: 'Internet y Wi-Fi gestionados por NS.' },
            { id: 'bridge', label: 'Modo Bridge', desc: 'Router propio; NS solo sincronismo.' }
        ],
        nextStep: '1.0'
    },

    // CASO 1: POWER - Integridad eléctrica
    '1.0': {
        id: '1.0',
        title: 'Verificación de Energía (Caso 1)',
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
        title: 'Corte de Energía en Domicilio',
        procedure: 'Resolución POWER - P1',
        objective: 'Descartar falta de suministro general.',
        question: '“¿Tiene energía eléctrica en su casa en este momento?”',
        options: [
            { label: 'No', nextStep: 'error_no_power' },
            { label: 'Si', nextStep: '1.2' }
        ]
    },
    'error_no_power': {
        id: 'error_no_power',
        title: 'ERROR: Suministro Eléctrico',
        headerInfo: 'Soporte suspendido',
        question: 'Informar al cliente: El soporte se retomará al restablecerse el suministro.',
        options: [{ label: 'Finalizar', nextStep: '0.1' }]
    },
    '1.2': {
        id: '1.2',
        title: 'Comprobación de Botón Físico',
        procedure: 'Resolución POWER - P2',
        objective: 'Verificar encendido manual.',
        action: 'Solicite presionar el botón rojo ON/OFF en la parte trasera.',
        question: '¿Encendió la luz POWER?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'on_off_images',
        options: [
            { label: 'No', nextStep: '1.3' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '1.3': {
        id: '1.3',
        title: 'Conexión de Transformador',
        procedure: 'Resolución POWER - P3',
        objective: 'Asegurar alimentación estable.',
        action: 'Reconexión física en módem y tomacorriente.',
        question: '¿Encendió la luz POWER?',
        options: [
            { label: 'No', nextStep: '1.4' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '1.4': {
        id: '1.4',
        title: 'Prueba de Tomacorriente',
        procedure: 'Resolución POWER - P4',
        objective: 'Descartar falla en enchufe.',
        action: 'Probar otro dispositivo en la misma toma o mover el módem.',
        question: '¿Encendió la luz POWER?',
        options: [
            { label: 'No', nextStep: '1.5' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '1.5': {
        id: '1.5',
        title: 'Cambio de Transformador (Cross-Check)',
        procedure: 'Resolución POWER - P5',
        objective: 'Validar falla de fuente de poder.',
        action: 'Usar transformador de Deco o Mesh (compatibles).',
        question: '¿Encendió?',
        options: [
            { label: 'No', nextStep: 'l2_escalation' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },

    // CASO 2: LOS - Integridad de la Fibra Óptica
    'sync_check': {
        id: 'sync_check',
        title: 'Verificación de Sincronismo',
        procedure: 'Diagnóstico LED Caso 2',
        objective: 'Validar conexión física de fibra.',
        question: '¿PON verde fija y LOS apagada?',
        leds: { power: 'green', los: 'off', pon: 'eval', internet: 'green' },
        activeLED: 'PON',
        options: [
            { label: 'No', nextStep: '2.1' },
            { label: 'Si', nextStep: '3.1' }
        ]
    },
    '2.1': {
        id: '2.1',
        title: 'Estado de Patchcord',
        procedure: 'Resolución LOS - P1',
        objective: 'Inspección visual del cable de fibra.',
        action: 'Verificar dobleces bruscos o cortes en el cable amarillo.',
        question: '¿Se apagó LOS?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'patchcord_images',
        options: [
            { label: 'No', nextStep: '2.2' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '2.2': {
        id: '2.2',
        title: 'Reconexión en Módem',
        procedure: 'Resolución LOS - P2',
        objective: 'Asegurar clic mecánico del conector verde.',
        question: '¿Se apagó LOS?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'patchcord_images',
        options: [
            { label: 'No', nextStep: '2.3' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },
    '2.3': {
        id: '2.3',
        title: 'Reconexión en Roseta',
        procedure: 'Resolución LOS - P3',
        objective: 'Validar punto de entrada de red.',
        action: 'Reconectar en la caja de pared con logo NS.',
        question: '¿Se apagó LOS?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'roseta_images',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_los' },
            { label: 'Si', nextStep: 'sync_check' }
        ]
    },

    // CASO 3: PON - Sincronismo Lógico
    '3.1': {
        id: '3.1',
        title: 'Validación LED PON',
        procedure: 'Caso 3: Sincronismo',
        objective: 'Confirmar ONT vinculada a la OLT.',
        question: '“¿La luz LED PON está encendida fija?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'pon_check_images',
        leds: { power: 'green', los: 'off', pon: 'eval', internet: 'off' },
        activeLED: 'PON',
        options: [
            { label: 'Si (Fija)', nextStep: 'bifurcate_mode_path' },
            { label: 'No (Parpadea)', nextStep: '3.2' }
        ]
    },
    '3.2': {
        id: '3.2',
        title: 'Reinicio Eléctrico',
        procedure: 'Resolución PON - P1',
        objective: 'Forzar nueva negociación de fibra.',
        question: '¿Quedó fija tras reiniciar?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'pon_restart_images',
        options: [
            { label: 'No', nextStep: '3.3' },
            { label: 'Si', nextStep: 'bifurcate_mode_path' }
        ]
    },
    '3.3': {
        /* NODO 3.3: ESCALAMIENTO NO DISRUPTIVO (LEDEFYL)
          Propósito: Intentar recuperación lógica remota.
          Trigger: LED PON parpadeando tras reinicio.
        */
        id: '3.3',
        title: 'Reaprovisionamiento Ledefyl',
        procedure: 'Resolución PON - P2',
        objective: 'Ajuste lógico en sistema central.',
        action: 'Llamar a Ledefyl (26262680) para re-aprovisionar.',
        question: '¿Confirmado?',
        options: [{ label: 'Confirmado', nextStep: '3.4' }]
    },
    '3.4': {
        id: '3.4',
        title: 'Verificación Post-Ajuste',
        procedure: 'Resolución PON - P3',
        question: '¿Quedó fija?',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_pon' },
            { label: 'Si', nextStep: 'bifurcate_mode_path' }
        ]
    },

    // BIFURCACIÓN DE RESPONSABILIDAD (MODO BRIDGE VS STANDARD)
    'bifurcate_mode_path': {
        /* LÓGICA DE DEMARCACIÓN
           Determina si el soporte continúa hacia Capas Superiores (Standard)
           o finaliza en Capa 2 (Bridge).
        */
        id: 'bifurcate_mode_path',
        type: 'mode_check',
        nextMap: { 'Standard': '4.1', 'Bridge': 'bridge_closure' }
    },
    'bridge_closure': {
        id: 'bridge_closure',
        title: 'Límite de Responsabilidad',
        procedure: 'Cierre de Demarcación',
        instruction: 'Sr./Sra. Cliente, su terminal está sincronizada. En Modo Bridge, la red privada depende de su router.',
        question: '¿Cerrar incidente?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'bridge_flow_images',
        options: [{ label: 'Cerrar Incidente', nextStep: '6.3_summary' }]
    },

    // CASO 4: INTERNET - Sesión PPPoE
    '4.1': {
        id: '4.1',
        title: 'Validación LED INTERNET',
        procedure: 'Caso 4: Sesión',
        objective: 'Validar autenticación PPPoE.',
        question: '¿INTERNET encendida o parpadeando?',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'eval' },
        activeLED: 'INTERNET',
        options: [
            { label: 'Si', nextStep: '4.3' },
            { label: 'No', nextStep: '4.2_commercial' }
        ]
    },
    '4.2_commercial': {
        id: '4.2_commercial',
        title: 'Revisión Comercial',
        objective: 'Descartar deuda/suspensión.',
        question: '¿Cliente al día?',
        options: [
            { label: 'Si', nextStep: '4.2_restart' },
            { label: 'No', nextStep: 'error_commercial_debt' }
        ]
    },
    '4.2_restart': {
        id: '4.2_restart',
        title: 'Reinicio de Sesión',
        question: '¿Encendió INTERNET?',
        options: [
            { label: 'No', nextStep: '4.2_ledefyl' },
            { label: 'Si', nextStep: '4.3' }
        ]
    },
    '4.2_ledefyl': {
        id: '4.2_ledefyl',
        title: 'Reconfiguración PPPoE',
        action: 'Solicitar a Ledefyl (26262680) reconfiguración de discado.',
        options: [{ label: 'Continuar', nextStep: '4.2_verify' }]
    },
    '4.2_verify': {
        id: '4.2_verify',
        title: 'Post Verificación PPPoE',
        question: '¿Encendió INTERNET?',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_internet' },
            { label: 'Si', nextStep: '4.3' }
        ]
    },
    '4.3': {
        id: '4.3',
        title: 'Navegación Inicial',
        question: '¿Logra navegar?',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_internet' },
            { label: 'Si', nextStep: '5.0' }
        ]
    },

    // CASO 5 & 6: RED LOCAL Y AUDITORÍA FINAL
    '5.0': {
        id: '5.0',
        title: 'Modo de Conexión Local',
        options: [
            { label: 'WIFI', nextStep: '5.1' },
            { label: 'LAN', nextStep: '6.0_lan' }
        ]
    },
    '5.1': {
        id: '5.1',
        title: 'LED Wi-Fi',
        question: '¿Luces 2.4/5G activas?',
        options: [
            { label: 'No', nextStep: '5.2' },
            { label: 'Si', nextStep: '5.3' }
        ]
    },
    '5.2': {
        id: '5.2',
        title: 'Botón WPS/Wi-Fi',
        action: 'Presione botón lateral por 1s.',
        options: [
            { label: 'No', nextStep: '5.2_l3_activation' },
            { label: 'Si', nextStep: '5.3' }
        ]
    },
    '5.2_l3_activation': {
        id: '5.2_l3_activation',
        title: 'Activación Remota L3',
        options: [
            { label: 'Confirmado', nextStep: '5.3' },
            { label: 'Falla Técnica', nextStep: 'coordinar_visita_wifi' }
        ]
    },
    '5.3': {
        id: '5.3',
        title: 'Credenciales Wi-Fi',
        question: '¿Conecta en dispositivos?',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_wifi' },
            { label: 'Si', nextStep: '6.1' }
        ]
    },
    '6.0_lan': {
        id: '6.0_lan',
        title: 'LED LANx',
        question: '¿Puertos activos?',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_lan' },
            { label: 'Si', nextStep: '6.1_speedtest' }
        ]
    },
    '6.1_speedtest': {
        id: '6.1_speedtest',
        title: 'Auditoría Speedtest',
        question: '¿Velocidad Óptima?',
        options: [
            { label: 'No', nextStep: '6.2_advanced' },
            { label: 'Si', nextStep: '6.1' }
        ]
    },
    '6.1': {
        id: '6.1',
        title: 'Validación Multi-dispositivo',
        question: '¿Servicio 100% operativo?',
        options: [
            { label: 'No', nextStep: '6.2_advanced' },
            { label: 'Si', nextStep: '6.3_summary' }
        ]
    },
    '6.2_advanced': {
        id: '6.2_advanced',
        title: 'Soporte Especializado L3',
        procedure: 'Caso 6: Rendimiento',
        objective: 'Análisis de canales, latencia y DNS.',
        options: [
            { label: 'Si (Resuelto)', nextStep: '6.3_summary' },
            { label: 'No (Escalar L2)', nextStep: 'coordinar_visita_advanced' }
        ]
    },

    // CIERRE Y RESUMEN CRM
    '6.3_summary': {
        id: '6.3_summary',
        title: 'Finalización de Diagnóstico',
        type: 'summary_closing',
        question: '¿Alguna otra consulta adicional?',
        options: [{ label: 'Reset Aplicación', nextStep: '0.1' }]
    },

    // ASSETS Y REDIRECCIONES
    'on_off_images': { id: 'on_off_images', type: 'images_grid', images: ['assets/node_1_2_button.png'] },
    'patchcord_images': { id: 'patchcord_images', type: 'images_grid', images: ['assets/node_2_2_modem.png'] },
    'roseta_images': { id: 'roseta_images', type: 'images_grid', images: ['assets/node_2_3_roseta.png'] },
    'pon_check_images': { id: 'pon_check_images', type: 'images_grid', images: ['assets/node_3_1_pon_check.png'] },
    'pon_restart_images': { id: 'pon_restart_images', type: 'images_grid', images: ['assets/node_3_2_restart.png'] },
    'internet_check_images': { id: 'internet_check_images', type: 'images_grid', images: ['assets/node_4_1_internet_check.png'] },
    'bridge_flow_images': { id: 'bridge_flow_images', type: 'images_grid', images: ['assets/node_bridge_flow.png'] },
    'coordinar_visita_los': { id: 'coordinar_visita_los', title: 'Visita Técnica (Fibra)', options: [{ label: 'Registrar', nextStep: 'summary_final_redirect' }] },
    'coordinar_visita_pon': { id: 'coordinar_visita_pon', title: 'Visita Técnica (SYNC)', options: [{ label: 'Registrar', nextStep: 'summary_final_redirect' }] },
    'coordinar_visita_internet': { id: 'coordinar_visita_internet', title: 'Visita Técnica (BRAS)', options: [{ label: 'Registrar', nextStep: 'summary_final_redirect' }] },
    'coordinar_visita_wifi': { id: 'coordinar_visita_wifi', title: 'Visita Técnica (WLAN)', options: [{ label: 'Registrar', nextStep: 'summary_final_redirect' }] },
    'coordinar_visita_lan': { id: 'coordinar_visita_lan', title: 'Visita Técnica (LAN)', options: [{ label: 'Registrar', nextStep: 'summary_final_redirect' }] },
    'coordinar_visita_advanced': { id: 'coordinar_visita_advanced', title: 'Visita Técnica (N2)', options: [{ label: 'Registrar', nextStep: 'summary_final_redirect' }] },
    'summary_final_redirect': { id: 'summary_final_redirect', nextStep: '6.3_summary' },
    'l2_escalation': { id: 'l2_escalation', title: 'Escalamiento N2', options: [{ label: 'Registrar', nextStep: 'summary_final_redirect' }] }
};

/* -------------------------------------------------------------------------- */
/* 2. CORE LOGIC & STATE MANAGEMENT                                           */
/* -------------------------------------------------------------------------- */
let state = {
    history: ['0.1'],
    model: 'NO IDENT.',
    mode: 'NO DEF.',
    log: []
};

const elements = {
    headerArea: document.querySelector('.app-header'),
    mainArea: document.querySelector('.main-content'),
    ledArea: document.querySelector('.app-footer')
};

/** RENDERIZADO PRINCIPAL
 * Propósito: Orquestar la actualización de la UI basada en el estado actual.
 */
function render() {
    const currentId = state.history[state.history.length - 1];
    let step = diagnosticTree[currentId];

    // Salto automático para nodos de control lógico
    if (step && step.type === 'mode_check') {
        const nextId = step.nextMap[state.mode];
        state.history.push(nextId);
        step = diagnosticTree[nextId];
    }

    renderHeader(step);
    renderBody(step);
    renderFooter(step);
}

/** COMPONENTE: HEADER
 * Gestiona Breadcrumbs, Botón Atrás y Ayudas Visuales.
 */
function renderHeader(step) {
    if (step.id === '0.1') {
        elements.headerArea.innerHTML = `<div class="header-main-text" style="width: 100%; border: none;">${step.headerText}</div>`;
    } else {
        const hasVisualAid = step.hasDescriptiveImage;
        elements.headerArea.innerHTML = `
            <div class="header-back-area"><button class="back-btn" onclick="handleBack()">Atrás</button></div>
            ${hasVisualAid ? `
            <div class="header-visual-aid">
                <button class="visual-aid-btn" onclick="handleVisualAid('${step.descriptiveImageStep}')">
                    <div class="visual-aid-label">Ayuda Visual</div>
                </button>
            </div>` : ''}
            <div class="header-main-text">Soporte Técnico Nivel 1</div>
            <div class="header-breadcrumbs">
                <div class="breadcrumb-box">
                    <span class="breadcrumb-label">FTTH Diagnostic</span>
                    <span class="breadcrumb-value">${state.model} [${state.mode}]</span>
                </div>
                <div class="breadcrumb-box"><span class="breadcrumb-label">${step.procedure || 'Escalamiento'}</span></div>
            </div>
        `;
    }
}

/** COMPONENTE: BODY
 * Renderiza el contenido dinámico del paso actual.
 */
function renderBody(step) {
    elements.mainArea.innerHTML = '';

    if (step.type === 'master_node') {
        renderMasterNode(step);
    } else if (step.type === 'summary_closing') {
        renderSummary(step);
    } else if (step.id === '0.1') {
        elements.mainArea.innerHTML = `<div class="welcome-screen"><h1 class="welcome-title">${step.title}</h1><button class="btn btn-iniciar" onclick="handleNext('0.2')">Iniciar</button></div>`;
    } else if (step.type === 'images_grid') {
        elements.mainArea.innerHTML = `<h1 class="step-title">Guía Visual</h1><div class="desc-images-grid">${step.images.map(img => `<img src="${img}" class="full-mock-img">`).join('')}</div>`;
    } else {
        const content = document.createElement('div');
        content.innerHTML = `
            <h1 class="step-title">${step.title}</h1>
            ${step.objective ? `<p class="objective-text"><strong>Objetivo:</strong> ${step.objective}</p>` : ''}
            ${step.instruction ? `<p class="instruction-text">${step.instruction}</p>` : ''}
            ${step.action ? `<div class="action-container"><p class="action-title">Acción:</p><p class="action-text">${step.action}</p></div>` : ''}
            ${step.question ? `<div class="question-container"><p class="question-label">Pregunta:</p><div class="question-bubble">${step.question}</div></div>` : ''}
        `;

        const actions = document.createElement('div');
        actions.className = 'interaction-area';
        (step.options || []).forEach(opt => {
            const btn = document.createElement('button');
            const label = opt.label;
            btn.className = `btn btn-standard ${getBtnClass(label)}`;
            btn.textContent = label;
            btn.onclick = () => {
                state.log.push({ step: step.title, answer: label });
                handleNext(opt.nextStep);
            };
            actions.appendChild(btn);
        });
        content.appendChild(actions);
        elements.mainArea.appendChild(content);
    }
}

/** COMPONENTE: FOOTER (LED BAR)
 * Muestra el estado de los LEDs con lógica de ocultamiento para Modo Bridge.
 */
function renderFooter(step) {
    const hiddenSteps = ['0.1', '0.2', '6.3_summary', 'images_grid'];
    if (hiddenSteps.includes(step.id) || step.type === 'master_node' || step.type === 'images_grid') {
        elements.ledArea.style.display = 'none';
        return;
    }

    elements.ledArea.style.display = 'flex';
    elements.ledArea.innerHTML = '<div class="led-group"></div>';
    const group = elements.ledArea.querySelector('.led-group');

    ['POWER', 'LOS', 'PON', 'INTERNET', 'WIFI', 'LANx'].forEach(name => {
        const key = name.toLowerCase();
        let status = (step.leds && step.leds[key]) ? step.leds[key] : 'off';

        // Regla de Negocio: En Bridge no se diagnostica Wi-Fi ni Internet.
        if (state.mode === 'Bridge' && (name === 'INTERNET' || name === 'WIFI')) status = 'disabled';

        const isActive = step.activeLED === name;
        const box = document.createElement('div');
        box.className = `led-box ${isActive ? 'active' : ''} ${status === 'disabled' ? 'led-disabled' : ''}`;
        box.innerHTML = `<span class="led-name">${name}</span><div class="led-dot ${getLedColor(name, status, isActive)}"></div>`;
        group.appendChild(box);
    });
}

function renderMasterNode(step) {
    const container = document.createElement('div');
    container.className = 'master-node-container';
    container.innerHTML = `
        <h1 class="step-title">Configuración Inicial</h1>
        <div class="master-section">
            <h2>1. Seleccione Hardware</h2>
            <div class="hardware-cards">
                ${step.hardwareOptions.map(hw => `
                    <div class="hw-card ${state.model.includes(hw.label.split(' ')[1]) ? 'selected' : ''}" onclick="selectHW('${hw.label}')">
                        <div class="hw-img-placeholder">[${hw.label}]</div>
                        <div class="hw-label">${hw.label}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="master-section">
            <h2>2. Seleccione Modo</h2>
            <div class="mode-selectors">
                ${step.modeOptions.map(m => `
                    <div class="mode-select-item ${state.mode === m.label.replace('Modo ', '') ? 'selected' : ''}" onclick="selectMode('${m.label}')">
                        <div class="mode-label">${m.label}</div>
                        <div class="mode-desc">${m.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <button id="master-next-btn" class="btn btn-yes btn-wide" ${state.model === 'NO IDENT.' || state.mode === 'NO DEF.' ? 'disabled' : ''} onclick="handleNext('1.0')">Iniciar Diagnóstico</button>
    `;
    elements.mainArea.appendChild(container);
}

function renderSummary(step) {
    const diagnosticLog = state.log.map(e => `> ${e.step}: ${e.answer}`).join('\n');
    const result = state.mode === 'Bridge' ?
        'DIAGNÓSTICO FINALIZADO EN CAPA 2 - EQUIPO EN BRIDGE OK' :
        'SERVICIO 100% OPERATIVO - AUDITORÍA COMPLETA';

    elements.mainArea.innerHTML = `
        <h1 class="step-title">Resumen CRM</h1>
        <textarea class="summary-textarea" readonly>NS-STI REPORT v3.0\nMODO: ${state.mode} | HW: ${state.model}\n------------------\n${diagnosticLog}\n------------------\n${result}</textarea>
        <button class="btn btn-standard" onclick="copyToClipboard()">Copiar Reporte</button>
        <div class="question-container" style="margin-top:20px;"><div class="question-bubble">${step.question}</div></div>
        <button class="btn btn-yes btn-wide" onclick="resetApp()">Nueva Atención</button>
    `;
}

/* -------------------------------------------------------------------------- */
/* 3. UTILS & EVENT HANDLERS                                                  */
/* -------------------------------------------------------------------------- */
window.selectHW = (l) => { state.model = l.replace('ZTE ', ''); render(); };
window.selectMode = (l) => { state.mode = l.replace('Modo ', ''); render(); };
window.handleNext = (id) => { state.history.push(id); render(); };
window.handleVisualAid = (id) => { state.history.push(id); render(); };
window.handleBack = () => {
    if (state.history.length > 1) {
        state.history.pop();
        if (diagnosticTree[state.history[state.history.length - 1]].type === 'mode_check') state.history.pop();
        render();
    }
};
window.resetApp = () => { location.reload(); };
window.copyToClipboard = () => { document.querySelector('.summary-textarea').select(); document.execCommand('copy'); alert('Copiado al portapapeles.'); };

function getBtnClass(l) {
    if (l.includes('Si') || l.includes('Confirmado') || l.includes('Cerrar') || l.includes('Iniciar') || l.includes('Reset')) return 'btn-yes';
    if (l.includes('No') || l.includes('Falla')) return 'btn-no';
    return '';
}

function getLedColor(name, status, active) {
    if (status === 'green' || (active && status === 'eval' && name !== 'LOS')) return 'green';
    if (status === 'red' || (active && name === 'LOS')) return 'red';
    if (status === 'disabled') return 'disabled';
    return 'off';
}

document.addEventListener('DOMContentLoaded', render);
