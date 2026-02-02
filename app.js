/**
 * NS-STI Final High-Fidelity Diagnostic Engine
 * v2.2.0 - Master Bifurcation Node Implementation
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
        objective: 'Verificar que el botón de encendido/apagado del módem funcione correctamente.',
        action: 'Indica al cliente que presione y suelte el botón rojo ON/OFF ubicado en la parte trasera del módem.',
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
        objective: 'Asegurar que el módem reciba energía eléctrica de forma estable.',
        action: 'Indica al cliente que revise ambas conexiones del cable de alimentación: en el módem y en el tomacorriente.',
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
        objective: 'Confirmar que el tomacorriente suministra energía.',
        action: 'Pide al cliente desconectar el transformador del módem y conectar otro dispositivo. Si enciende, solicite que conecte el módem en ese tomacorriente.',
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
        objective: 'Determinar si la falla proviene del transformador.',
        action: 'Indica al cliente: “Desconecte el transformador del módem y conecte el transformador del decodificador o del Mesh en el mismo lugar.”',
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
            { label: 'Si', nextStep: '3.1' }
        ]
    },
    '2.1': {
        id: '2.1',
        title: 'Revisión del patchcord de fibra',
        procedure: 'Caso 2: LOS > Resolución paso 1',
        objective: 'Confirmar condiciones físicas del patchcord.',
        action: '“Verifique que el cable amarillo con punta verde no esté doblado o dañado.”',
        question: '¿Se apagó la luz LED LOS después de revisar?',
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
        title: 'Reconexión del conector verde en el módem',
        procedure: 'Caso 2: LOS > Resolución paso 2',
        objective: 'Asegurar conexión firme en el equipo.',
        action: '“Desconecte y vuelva a insertar el conector verde hasta sentir un click.”',
        question: '“¿Se apagó la luz LED LOS?”',
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
        title: 'Reconexión en la roseta de NS',
        procedure: 'Caso 2: LOS > Resolución paso 3',
        objective: 'Confirmar conexión en la pared.',
        action: '“Desconecte y vuelva a conectar en la roseta identificada con logo NS.”',
        question: '“¿Se apagó la luz LED LOS?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'roseta_images',
        leds: { power: 'green', los: 'red', pon: 'eval', internet: 'off' },
        activeLED: 'LOS',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_los' },
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
    'coordinar_visita_los': {
        id: 'coordinar_visita_los',
        title: 'Falla en LOS / Señal de Fibra',
        procedure: 'Coordinar visita técnica',
        objective: 'Derivar con Despacho.',
        question: 'Derivar por falla física en fibra óptica.',
        options: [{ label: 'Finalizar y Registrar', nextStep: 'summary_final_redirect' }]
    },
    '3.1': {
        id: '3.1',
        title: 'Verificación de luz LED PON',
        procedure: 'Caso 3: PON > Validación de Estado',
        objective: 'confirmar sincronismo con FTTH.',
        question: '“¿La luz LED PON se encuentra encendida fija?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'pon_check_images',
        leds: { power: 'green', los: 'off', pon: 'eval', internet: 'off' },
        activeLED: 'PON',
        options: [
            { label: 'Si (Fija)', nextStep: 'bifurcate_mode_path' },
            { label: 'No (Parpadea / Apagada)', nextStep: '3.2' }
        ]
    },
    'pon_check_images': {
        id: 'pon_check_images',
        title: 'Guía Visual: Estado PON/LOS',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_3_1_pon_check.png']
    },
    '3.2': {
        id: '3.2',
        title: 'Reinicio para sincronismo',
        procedure: 'Caso 3: PON > Resolución paso 1',
        objective: 'reiniciar para restablecer conexión.',
        action: '“Apague y encienda el equipo con el botón ON/OFF.”',
        question: '“¿Luego del reinicio, la luz PON quedó fija?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'pon_restart_images',
        leds: { power: 'green', los: 'off', pon: 'eval', internet: 'off' },
        activeLED: 'PON',
        options: [
            { label: 'No', nextStep: '3.3' },
            { label: 'Si', nextStep: 'bifurcate_mode_path' }
        ]
    },
    'pon_restart_images': {
        id: 'pon_restart_images',
        title: 'Guía Visual: Reinicio del Equipo',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_3_2_restart.png']
    },
    '3.3': {
        id: '3.3',
        title: 'Reaprovisionamiento Ledefyl',
        procedure: 'Caso 3: PON > Resolución paso 2',
        objective: 'Reaprovisionamiento lógico.',
        action: 'Solicite reaprovisionamiento a Ledefyl (26262680).',
        question: '¿Se confirmó la ejecución?',
        options: [{ label: 'Confirmado', nextStep: '3.4' }]
    },
    '3.4': {
        id: '3.4',
        title: 'Verificación Post-Reaprovisionamiento',
        procedure: 'Caso 3: PON > Resolución paso 3',
        objective: 'Validar éxito del ajuste.',
        question: '“¿La luz PON quedó fija ahora?”',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_pon' },
            { label: 'Si', nextStep: 'bifurcate_mode_path' }
        ]
    },
    'coordinar_visita_pon': {
        id: 'coordinar_visita_pon',
        title: 'Coordinar visita técnica por sincronismo',
        options: [{ label: 'Finalizar y Registrar', nextStep: 'summary_final_redirect' }]
    },
    'bifurcate_mode_path': {
        id: 'bifurcate_mode_path',
        type: 'mode_check',
        nextMap: { 'Standard': '4.1', 'Bridge': 'bridge_closure' }
    },
    'bridge_closure': {
        id: 'bridge_closure',
        title: 'Límite de Responsabilidad Técnica',
        procedure: 'Cierre de Demarcación (Modo Bridge)',
        objective: 'Finalizar soporte en ONT sincronizada.',
        instruction: 'Sr./Sra. Cliente, hemos verificado que nuestra terminal ONT se encuentra sincronizada y funcionando correctamente. Al encontrarse su servicio en Modo Bridge, la gestión del discado a Internet y la red Wi-Fi dependen exclusivamente de su router privado. Le sugerimos revisar la configuración de su equipo o contactar al soporte de su fabricante.',
        action: 'Educar al cliente sobre su responsabilidad privada.',
        question: '¿Desea cerrar el incidente bajo esta cláusula?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'bridge_flow_images',
        options: [{ label: 'Cerrar Incidente', nextStep: '6.3_summary' }]
    },
    'bridge_flow_images': {
        id: 'bridge_flow_images',
        title: 'Mapa de Flujo: Modo Bridge',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_bridge_flow.png']
    },
    '4.1': {
        id: '4.1',
        title: 'Verificación de luz LED INTERNET',
        procedure: 'Caso 4: INTERNET > Validación Inicial',
        objective: 'confirmar sesión PPPoE.',
        question: '“¿La luz que dice \'INTERNET\' se encuentra encendida fija o parpadeando?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'internet_check_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'eval' },
        activeLED: 'INTERNET',
        options: [
            { label: 'Si (Fija/Parpadeo)', nextStep: '4.3' },
            { label: 'No (Apagada)', nextStep: '4.2_commercial' }
        ]
    },
    'internet_check_images': {
        id: 'internet_check_images',
        title: 'Guía Visual: Estado INTERNET',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_4_1_internet_check.png']
    },
    '4.2_commercial': {
        id: '4.2_commercial',
        title: 'Verificación del estado comercial',
        procedure: 'Resolución caso INTERNET - Paso 1',
        question: '“¿El cliente se encuentra al día?”',
        options: [
            { label: 'Si (Al día)', nextStep: '4.2_restart' },
            { label: 'No (Suspendido)', nextStep: 'error_commercial_debt' }
        ]
    },
    'error_commercial_debt': { id: 'error_commercial_debt', title: 'ERROR: Suspensión Comercial', options: [{ label: 'Finalizar', nextStep: '0.1' }] },
    '4.2_restart': {
        id: '4.2_restart',
        title: 'Reinicio del módem',
        procedure: 'Resolución caso INTERNET - Paso 2',
        objective: 'restablecer discado.',
        question: '“¿Encendió la luz INTERNET?”',
        options: [
            { label: 'No', nextStep: '4.2_ledefyl' },
            { label: 'Si', nextStep: '4.3' }
        ]
    },
    '4.2_ledefyl': {
        id: '4.2_ledefyl',
        title: 'Reconfiguración PPPoE (Ledefyl)',
        procedure: 'Resolución caso INTERNET - Paso 3',
        action: 'Llamar a Ledefyl (26262680). “Solicito reconfiguración de discado PPPoE para el servicio xx-xx.”',
        question: 'Espere confirmación.',
        options: [{ label: 'Continuar', nextStep: '4.2_verify' }]
    },
    '4.2_verify': {
        id: '4.2_verify',
        title: 'Post verificación de discado',
        question: '“¿Encendió la luz INTERNET ahora?”',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_internet' },
            { label: 'Si', nextStep: '4.3' }
        ]
    },
    '4.3': {
        id: '4.3',
        title: 'Comprobación de Navegación Inicial',
        procedure: 'Caso 4: INTERNET > Validación de Sesión',
        question: '“¿Logra navegar correctamente?”',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_internet' },
            { label: 'Si', nextStep: '5.0' }
        ]
    },
    'coordinar_visita_internet': { id: 'coordinar_visita_internet', title: 'Fallas en el discado', options: [{ label: 'Coordinar visita', nextStep: 'summary_final_redirect' }] },
    '5.0': {
        id: '5.0',
        title: 'Selección del tipo de conexión',
        procedure: 'Selección WLAN | LAN',
        options: [{ label: 'WIFI', nextStep: '5.1' }, { label: 'LAN', nextStep: '6.0_lan' }]
    },
    '5.1': {
        id: '5.1',
        title: 'Verificación de luz LED Wi-Fi',
        question: '“¿Luces 2.4G / 5G encendidas?”',
        options: [{ label: 'No', nextStep: '5.2' }, { label: 'Si', nextStep: '5.3' }]
    },
    '5.2': {
        id: '5.2',
        title: 'Activación botón Wi-Fi',
        action: 'Presione botón lateral.',
        question: '“¿Encendió?”',
        options: [{ label: 'No', nextStep: '5.2_l3_activation' }, { label: 'Si', nextStep: '5.3' }]
    },
    '5.2_l3_activation': {
        id: '5.2_l3_activation', title: 'Activación remota L3',
        options: [{ label: 'Confirmado', nextStep: '5.3' }, { label: 'Falla Técnica', nextStep: 'coordinar_visita_wifi' }]
    },
    '5.3': {
        id: '5.3', title: 'Credenciales Wi-Fi',
        question: '“¿Logra conectar con SSID/Clave confirmados?”',
        options: [{ label: 'No', nextStep: 'coordinar_visita_wifi' }, { label: 'Si', nextStep: '6.1' }]
    },
    'coordinar_visita_wifi': { id: 'coordinar_visita_wifi', title: 'Falla de Radiofrecuencia', options: [{ label: 'Coordinar visita', nextStep: 'summary_final_redirect' }] },
    '6.0_lan': {
        id: '6.0_lan', title: 'Verificación luces LANx',
        question: '“¿Luces LANx encendidas?”',
        options: [{ label: 'No', nextStep: 'coordinar_visita_lan' }, { label: 'Si', nextStep: '6.1_speedtest' }]
    },
    '6.1_speedtest': {
        id: '6.1_speedtest', title: 'Test de Acceso (LAN)',
        question: '“¿Velocidad adecuada en speedtest?”',
        options: [{ label: 'No', nextStep: '6.2_advanced' }, { label: 'Si', nextStep: '6.1' }]
    },
    'coordinar_visita_lan': { id: 'coordinar_visita_lan', title: 'Falla en Puertos de Red', options: [{ label: 'Coordinar visita', nextStep: 'summary_final_redirect' }] },
    '6.1': {
        id: '6.1', title: 'Auditoría Final de Calidad',
        question: '“¿Servicio óptimo en todos los dispositivos?”',
        options: [{ label: 'No (Lentitud)', nextStep: '6.2_advanced' }, { label: 'Si (Óptimo)', nextStep: '6.3_summary' }]
    },
    '6.2_advanced': {
        id: '6.2_advanced', title: 'Nivel 3: Latencia y DNS',
        options: [{ label: 'Si (Resuelto)', nextStep: '6.3_summary' }, { label: 'No (Escalar L2)', nextStep: 'coordinar_visita_advanced' }]
    },
    'coordinar_visita_advanced': { id: 'coordinar_visita_advanced', title: 'Visita Técnica N2', options: [{ label: 'Finalizar y Registrar', nextStep: 'summary_final_redirect' }] },
    '6.3_summary': {
        id: '6.3_summary',
        title: 'Resumen y Cierre del Incidente',
        procedure: 'Diagnóstico Finalizado > Cierre de Incidente',
        type: 'summary_closing',
        question: '“¿Hay algo más en lo que pueda ayudarlo?”',
        options: [{ label: 'Finalizar Diagnóstico', nextStep: '0.1' }]
    },
    'summary_final_redirect': { id: 'summary_final_redirect', nextStep: '6.3_summary' }
};

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

function render() {
    const currentId = state.history[state.history.length - 1];
    let step = diagnosticTree[currentId];

    if (step && step.type === 'mode_check') {
        const nextId = step.nextMap[state.mode];
        state.history.push(nextId);
        step = diagnosticTree[nextId];
    }

    // Header logic
    if (step.id === '0.1') {
        elements.headerArea.innerHTML = `<div class="header-main-text" style="width: 100%; border: none;">${step.headerText}</div>`;
    } else {
        const hasDescriptiveBtn = step.hasDescriptiveImage;
        elements.headerArea.innerHTML = `
            <div class="header-back-area"><button class="back-btn" id="btn-atras">Atrás</button></div>
            ${hasDescriptiveBtn ? `
            <div class="header-visual-aid">
                <button class="visual-aid-btn" onclick="handleVisualAid('${step.descriptiveImageStep}')">
                    <div class="visual-aid-label">Ver imagen descriptiva</div>
                </button>
            </div>` : ''}
            <div class="header-main-text">Soporte de Nivel 1<br>Atención en la llamada entrante</div>
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

    elements.mainArea.innerHTML = '';

    if (step.type === 'master_node') {
        renderMasterNode(step);
    } else if (step.type === 'summary_closing') {
        renderSummary(step);
    } else if (step.id === '0.1') {
        elements.mainArea.innerHTML = `<div class="welcome-screen"><h1 class="welcome-title">${step.title}</h1><button class="btn btn-iniciar" onclick="handleNext('${step.options[0].nextStep}')">Iniciar</button></div>`;
    } else if (step.type === 'images_grid') {
        elements.mainArea.innerHTML = `<h1 class="step-title">${step.title}</h1><div class="desc-images-grid">${step.images.map(img => `<img src="${img}" class="full-mock-img">`).join('')}</div>`;
    } else {
        if (step.headerInfo) {
            const hInfo = document.createElement('h2'); hInfo.className = 'header-info-callout'; hInfo.textContent = step.headerInfo;
            elements.mainArea.appendChild(hInfo);
        }
        const titleEl = document.createElement('h1'); titleEl.className = 'step-title'; titleEl.textContent = step.title;
        elements.mainArea.appendChild(titleEl);
        if (step.objective) {
            const objEl = document.createElement('p'); objEl.className = 'objective-text'; objEl.innerHTML = `<strong>Objetivo:</strong> ${step.objective}`;
            elements.mainArea.appendChild(objEl);
        }
        if (step.instruction) {
            const instEl = document.createElement('p'); instEl.className = 'instruction-text'; instEl.innerHTML = step.instruction;
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
        step.options.forEach(opt => {
            const btn = document.createElement('button');
            let btnClass = 'btn-standard';
            const label = opt.label;
            if (label.includes('Si') || label.includes('Confirmado') || label.includes('Fija') || label.includes('Al día') || label.includes('Continuar') || label.includes('Cerrar') || label.includes('WIFI') || label.includes('LAN') || label.includes('Óptimo')) btnClass = 'btn-yes';
            if (label.includes('No') || label.includes('Parpadea') || label.includes('Apagada') || label.includes('Suspendido') || label.includes('Falla Técnica') || label.includes('Lentitud')) btnClass = 'btn-no';
            if (label.includes('visita') || label.includes('Registrar') || label.includes('Finalizar Diagnóstico')) btnClass = 'btn-yes btn-wide';
            btn.className = `btn ${btnClass}`; btn.textContent = label;
            btn.onclick = () => {
                if (opt.metadata && opt.metadata.mode) state.mode = opt.metadata.mode;
                state.log.push({ step: step.title, answer: label });
                handleNext(opt.nextStep);
            };
            intArea.appendChild(btn);
        });
        elements.mainArea.appendChild(intArea);
    }

    // Footer
    if (step.id === '0.1' || step.id === '0.2' || step.id.includes('coordinar_visita') || step.type === 'summary_closing' || (step.id === 'bridge_closure' && state.mode === 'Bridge') || step.type === 'master_node' || step.type === 'images_grid') {
        elements.ledArea.style.display = 'none';
    } else {
        elements.ledArea.style.display = 'flex'; elements.ledArea.innerHTML = '<div class="led-group"></div>';
        const group = elements.ledArea.querySelector('.led-group');
        const ledsToShow = ['POWER', 'LOS', 'PON', 'INTERNET', 'WIFI', 'LANx'];
        ledsToShow.forEach(ledName => {
            const ledKey = ledName.toLowerCase();
            let ledStatus = (step.leds && step.leds[ledKey]) ? step.leds[ledKey] : 'off';

            // Logica determinista de ocultamiento para Modo Bridge en INTERNET y WIFI
            if (state.mode === 'Bridge' && (ledName === 'INTERNET' || ledName === 'WIFI')) {
                ledStatus = 'disabled';
            }

            const isActive = step.activeLED === ledName;
            const box = document.createElement('div'); box.className = `led-box ${isActive ? 'active' : ''} ${ledStatus === 'disabled' ? 'led-disabled' : ''}`;
            let dotClass = '';
            if (ledStatus === 'green' || (isActive && ledStatus === 'eval' && ledName !== 'LOS' && ledName !== 'LANx')) dotClass = 'green';
            else if (ledStatus === 'red' || (isActive && ledName === 'LOS')) dotClass = 'red';
            else if ((ledName === 'LANx' || ledName === 'WIFI') && ledStatus === 'eval') dotClass = 'green';
            else if (ledStatus === 'disabled') dotClass = 'disabled';

            box.innerHTML = `<span class="led-name">${ledName}</span><div class="led-dot ${dotClass}"></div>`;
            group.appendChild(box);
        });
    }
}

function renderMasterNode(step) {
    const titleEl = document.createElement('h1'); titleEl.className = 'step-title'; titleEl.textContent = step.title;
    elements.mainArea.appendChild(titleEl);

    const masterContainer = document.createElement('div');
    masterContainer.className = 'master-node-container';

    masterContainer.innerHTML = `
        <div class="master-section">
            <h2>1. Selección de Terminal (Hardware)</h2>
            <div class="hardware-cards">
                ${step.hardwareOptions.map(hw => `
                    <div class="hw-card ${state.model === hw.label.replace('ZTE ', '') ? 'selected' : ''}" onclick="selectHW('${hw.label}')">
                        <div class="hw-img-placeholder">[Imagen ${hw.label}]</div>
                        <div class="hw-label">${hw.label}</div>
                        <div class="hw-desc">${hw.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="master-section">
            <h2>2. Selección de Modo (Servicio)</h2>
            <div class="mode-selectors">
                ${step.modeOptions.map(m => `
                    <div class="mode-select-item ${state.mode === m.label.replace('Modo ', '') ? 'selected' : ''}" onclick="selectMode('${m.label}')">
                        <div class="mode-radio"></div>
                        <div class="mode-info">
                            <div class="mode-label">${m.label}</div>
                            <div class="mode-desc">${m.desc}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="interaction-area">
            <button id="master-next-btn" class="btn btn-yes btn-wide" disabled onclick="handleNextMaster('${step.nextStep}')">Iniciar Diagnóstico</button>
        </div>
    `;
    elements.mainArea.appendChild(masterContainer);
    checkMasterEnable();
}

window.selectHW = (label) => {
    state.model = label.replace('ZTE ', '');
    render();
};

window.selectMode = (label) => {
    state.mode = label.replace('Modo ', '');
    render();
};

window.handleNextMaster = (nextId) => {
    state.log.push({ step: 'Triaje Inicial', answer: `Modelo: ${state.model} | Modo: ${state.mode}` });
    handleNext(nextId);
};

function checkMasterEnable() {
    const btn = document.getElementById('master-next-btn');
    if (btn && state.model !== 'NO IDENT.' && state.mode !== 'NO DEF.') {
        btn.disabled = false;
    }
}

function renderSummary(step) {
    const titleEl = document.createElement('h1'); titleEl.className = 'step-title'; titleEl.textContent = step.title;
    elements.mainArea.appendChild(titleEl);

    const summaryCard = document.createElement('div');
    summaryCard.className = 'summary-card';

    let summaryText = `RESUMEN CRM NS-STI - v2.2.0\n`;
    summaryText += `----------------------------------------\n`;
    summaryText += `Inicio de atención | Modelo: ${state.model} | Modo: ${state.mode}\n`;
    summaryText += `----------------------------------------\n`;
    state.log.forEach(entry => { if (entry.step !== 'Triaje Inicial') summaryText += `> ${entry.step}: ${entry.answer}\n`; });
    summaryText += `----------------------------------------\n`;
    if (state.mode === 'Bridge') {
        summaryText += `DIAGNÓSTICO FINALIZADO EN CAPA 2\nEQUIPO EN BRIDGE CON SINCRONISMO OK\nSE INSTRUYE AL CLIENTE RED PRIVADA.`;
    } else { summaryText += `ESTADO FINAL: SERVICIO OPERATIVO`; }

    summaryCard.innerHTML = `
        <textarea id="summary-text" class="summary-textarea" readonly>${summaryText}</textarea>
        <button class="btn btn-standard" onclick="copyToClipboard()">Copiar al Portapapeles</button>
        <div class="question-container" style="margin-top:20px;">
            <div class="question-bubble"><div class="question-bubble-inner">${step.question}</div></div>
        </div>
        <button class="btn btn-yes btn-wide" onclick="resetApp()">${step.options[0].label}</button>
    `;
    elements.mainArea.appendChild(summaryCard);
}

function copyToClipboard() { document.getElementById("summary-text").select(); document.execCommand("copy"); alert("Resumen copiado."); }
function resetApp() { state = { history: ['0.1'], model: 'NO IDENT.', mode: 'NO DEF.', log: [] }; render(); }
function handleNext(nextId) { state.history.push(nextId); render(); }
function handleVisualAid(aidId) { state.history.push(aidId); render(); }
function handleBack() {
    if (state.history.length > 1) {
        state.history.pop();
        const prevId = state.history[state.history.length - 1];
        if (diagnosticTree[prevId].type === 'mode_check') state.history.pop();
        const nowId = state.history[state.history.length - 1];
        if (nowId === '0.2') { state.model = 'NO IDENT.'; state.mode = 'NO DEF.'; }
        render();
    }
}
document.addEventListener('DOMContentLoaded', render);
