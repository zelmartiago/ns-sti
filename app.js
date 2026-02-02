/**
 * NS-STI v5.7.0 - ULTIMATE ENTERPRISE
 * Professional UI with Subscriber ID, dynamic summary, and sanitized triage labels.
 */

const CONFIG = {
    VERSION: '5.7.0 (Enterprise)',
    BRAND: 'Nuevo Siglo',
    MODELS: {
        F6600: { id: 'F6600', name: 'F6600', desc: '4 Antenas' },
        F1611A: { id: 'F1611A', name: 'F1611A', desc: '2 Antenas' }
    }
};

const TREE = {
    '0.1': {
        id: '0.1',
        case: 'ATENCIÓN DE LLAMADA',
        title: 'Gestión FTTH',
        desc: 'Inicie el protocolo de soporte interactivo para asistencia técnica.',
        next: '0.2'
    },
    '0.2': {
        id: '0.2',
        case: 'TRIAJE PRIMARIO',
        title: 'Configuración del Servicio',
        desc: 'Seleccione el modelo del equipo y el modo de operación.',
        next: '1.0'
    },

    // CASO 1: POWER
    '1.0': {
        id: '1.0',
        case: 'CASO 1: LUZ POWER',
        title: 'Integridad Eléctrica',
        objective: 'Confirmar suministro de energía al equipo.',
        question: '¿La luz LED POWER está encendida y fija?',
        leds: { power: 'off' },
        activeLed: 'POWER',
        options: [
            { label: 'Sí, está encendida', next: '2.0', type: 'success' },
            { label: 'No, está apagada', next: '1.1', type: 'danger' }
        ]
    },
    '1.1': {
        id: '1.1',
        title: 'Suministro Eléctrico Dominical',
        objective: 'Descartar corte general de luz.',
        question: '¿Cuenta con energía eléctrica en el resto de su casa?',
        leds: { power: 'off' },
        options: [
            { label: 'Sí, hay energía', next: '1.2', type: 'success' },
            { label: 'No hay energía', next: 'ERR_NO_POWER', type: 'danger' }
        ]
    },
    '1.2': {
        id: '1.2',
        title: 'Acción de Encendido (Manual)',
        objective: 'Verificar el estado del botón físico.',
        action: 'Presione firmemente el botón rojo ON/OFF en la parte posterior del equipo.',
        question: '¿Logró encender la luz POWER?',
        leds: { power: 'off' },
        options: [
            { label: 'Sí, encendió', next: '2.0', type: 'success' },
            { label: 'No enciende', next: '1.3', type: 'danger' }
        ]
    },
    '1.3': {
        id: '1.3',
        title: 'Revisión de Cableado AC',
        objective: 'Asegurar conexión de la fuente de poder.',
        action: 'Verifique que el transformador esté bien conectado al módem y al tomacorriente.',
        question: '¿La luz Power encendió ahora?',
        leds: { power: 'off' },
        options: [
            { label: 'Sí, encendió', next: '2.0', type: 'success' },
            { label: 'No enciende', next: '1.5', type: 'danger' }
        ]
    },
    '1.5': {
        id: '1.5',
        case: 'CASO 1: ESCALAMIENTO N2',
        title: 'Derivación a Soporte Nivel 2',
        objective: 'Falla eléctrica persistente sin resolución técnica.',
        action: 'Informe al cliente que se enviará un técnico para revisar el equipo o fuente.',
        question: '¿Confirma la apertura del ticket por falla de Energía?',
        leds: { power: 'off' },
        options: [
            { label: 'Confirmar Derivación', next: '6.3_SUMMARY', type: 'success' },
            { label: 'Volver a intentar', next: '1.0', type: 'danger' }
        ]
    },

    // CASO 2: LOS
    '2.0': {
        id: '2.0',
        case: 'CASO 2: LUZ LOS',
        title: 'Sincronismo de Fibra',
        objective: 'Verificar la llegada de señal óptica.',
        question: '¿La luz LOS está apagada?',
        leds: { power: 'on-green', los: 'off' },
        activeLed: 'LOS',
        options: [
            { label: 'Sí, está apagada', next: '3.0', type: 'success' },
            { label: 'No, está prendida', next: '2.1', type: 'danger' }
        ]
    },
    '2.1': {
        id: '2.1',
        title: 'Inspección de Patchcord',
        objective: 'Detectar quiebres o daños en la fibra.',
        action: 'Revise el cable amarillo (fibra). No debe estar doblado, apretado o cortado.',
        question: '¿Se apagó la luz roja (LOS)?',
        leds: { power: 'on-green', los: 'on-red' },
        activeLed: 'LOS',
        options: [
            { label: 'Sí, se apagó', next: '3.0', type: 'success' },
            { label: 'Sigue encendida', next: '2.2', type: 'danger' }
        ]
    },
    '2.2': {
        id: '2.2',
        title: 'Reconexión en Módem',
        objective: 'Verificar que el patchcord esté correctamente conectado al módem.',
        action: 'Indique al cliente: “Desconecte y vuelva a conectar el patchcord de fibra (punta verde) en la parte inferior del módem”. Explique que debe tirar con cuidado e insertar hasta sentir un click.',
        question: '¿Se apagó la luz LED LOS tras reconectar en el módem?',
        leds: { power: 'on-green', los: 'on-red' },
        activeLed: 'LOS',
        options: [
            { label: 'Sí, se apagó', next: '3.0', type: 'success' },
            { label: 'Sigue encendida', next: '2.3', type: 'danger' }
        ]
    },
    '2.3': {
        id: '2.3',
        title: 'Reconexión en Roseta NS',
        objective: 'Confirmar conexión del patchcord a la roseta de pared de Nuevo Siglo.',
        action: 'Indique al cliente: “Desconecte y vuelva a conectar el cable en la roseta de la pared. Use la roseta que tiene el sticker de NS”.',
        question: '¿Se apagó la luz LED LOS tras reconectar en la roseta?',
        leds: { power: 'on-green', los: 'on-red' },
        activeLed: 'LOS',
        options: [
            { label: 'Sí, se apagó', next: '3.0', type: 'success' },
            { label: 'Sigue encendida', next: '2.4', type: 'danger' }
        ]
    },
    '2.4': {
        id: '2.4',
        case: 'CASO 2: ESCALAMIENTO N2',
        title: 'Derivación por Falla Acometida',
        objective: 'Falla física de señal sin resolución por manipulación.',
        action: 'Prepare la información y derive el caso a Segundo Nivel / Despacho por rotura externa.',
        question: '¿Confirma derivación a N2?',
        leds: { power: 'on-green', los: 'on-red' },
        options: [
            { label: 'Confirmar Derivación', next: '6.3_SUMMARY', type: 'success' },
            { label: 'Volver al inicio', next: '0.1', type: 'danger' }
        ]
    },

    // CASO 3: PON
    '3.0': {
        id: '3.0',
        case: 'CASO 3: LUZ PON',
        title: 'Vinculación Lógica',
        objective: 'Confirmar el enlace con la central (OLT).',
        question: '¿La luz PON está verde y fija?',
        leds: { power: 'on-green', los: 'off', pon: 'off' },
        activeLed: 'PON',
        options: [
            { label: 'Sí, está fija', next: 'MODE_BIFURCATION', type: 'success' },
            { label: 'No, parpadea', next: '3.1', type: 'danger' }
        ]
    },
    '3.1': {
        id: '3.1',
        title: 'Reinicio de Sincronismo',
        objective: 'Forzar nueva sesión lógica.',
        action: 'Reinicie el módem desenchufándolo 10 segundos.',
        question: '¿La luz PON quedó fija tras el reinicio?',
        leds: { power: 'on-green', los: 'off', pon: 'off' },
        options: [
            { label: 'Sí, sincronizó', next: 'MODE_BIFURCATION', type: 'success' },
            { label: 'Sigue parpadeando', next: '3.2', type: 'danger' }
        ]
    },
    '3.2': {
        id: '3.2',
        case: 'CASO 3: ESCALAMIENTO L3',
        title: 'Derivación por Falla de Autenticación',
        objective: 'El equipo sincroniza señal pero no vincula ID.',
        action: 'Contacte a Ledefyl (L3) para reaprovisionar la ONT.',
        question: '¿Se solicitó el reaprovisionamiento?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green' },
        options: [
            { label: 'Sí, realizar cierre', next: '6.3_SUMMARY', type: 'success' },
            { label: 'Falla aún persiste', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },

    // BIFURCACIÓN MODOS
    'MODE_BIFURCATION': {
        type: 'logic',
        condition: (state) => state.mode === 'Bridge' ? 'CASE_BRIDGE' : '4.0'
    },
    'CASE_BRIDGE': {
        id: 'BRIDGE-OK',
        case: 'CIERRE POR DEMARCACIÓN',
        title: 'Servicio en Bridge Validado',
        objective: 'Capa física y lógica operativas.',
        action: 'Informe al cliente que el servicio está UP. La red interna es privada.',
        question: '¿Finalizar atención en Bridge?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'off' },
        options: [{ label: 'Finalizar Gestión', next: '6.3_SUMMARY', type: 'success' }]
    },

    // CASO 4: INTERNET
    '4.0': {
        id: '4.0',
        case: 'CASO 4: LUZ INTERNET (PPPoE)',
        title: 'Sesión de Datos',
        objective: 'Validar la navegación IP.',
        question: '¿La luz INTERNET está encendida?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'off' },
        activeLed: 'INTERNET',
        options: [
            { label: 'Sí, navega OK', next: '5.0', type: 'success' },
            { label: 'No, está apagada', next: '4.1', type: 'danger' }
        ]
    },
    '4.1': {
        id: '4.1',
        title: 'Estado Comercial',
        objective: 'Descartar deuda o suspensión.',
        question: '¿El cliente se encuentra al día con sus pagos?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-red' },
        options: [
            { label: 'Sí, al día', next: '4.2', type: 'success' },
            { label: 'Con deuda / Pendiente', next: 'ESCALATE_COMMERCIAL', type: 'danger' }
        ]
    },
    '4.2': {
        id: '4.2',
        title: 'Solicitud Ledefyl BRAS',
        objective: 'Reconfiguración de discado.',
        action: 'Contacte a Ledefyl para resetear sesión PPPoE.',
        question: '¿Se restableció la luz de Internet?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-red' },
        options: [
            { label: 'Sí, solucionado', next: '5.0', type: 'success' },
            { label: 'No, derivar N2', next: '6.3_SUMMARY', type: 'danger' }
        ]
    },

    // CASO 5: WIFI
    '5.0': {
        id: '5.0',
        case: 'CASO 5: LUZ WIFI',
        title: 'Cobertura Inalámbrica',
        objective: 'Verificar estabilidad de la red Wi-Fi.',
        question: '¿El cliente puede conectarse y navegar?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-green', wifi: 'on-green' },
        activeLed: 'WIFI',
        options: [
            { label: 'Sí, conexión estable', next: '6.0', type: 'success' },
            { label: 'Cortes / Lentitud', next: '5.1', type: 'danger' }
        ]
    },
    '5.1': {
        id: '5.1',
        title: 'Ajuste de Espectro',
        objective: 'Cambio de canal por interferencia.',
        action: 'Indique al cliente que apague aparatos que hagan ruido y cambie de canal desde el portal.',
        question: '¿Mejoró la señal?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-green', wifi: 'on-warn' },
        options: [
            { label: 'Sí, mejoró', next: '6.0', type: 'success' },
            { label: 'Sigue mal', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },

    // CASO 6: LAN & CIERRE
    '6.0': {
        id: '6.0',
        case: 'CASO 6: LUZ LAN',
        title: 'Puertos Ethernet',
        objective: 'Validar cableado estructurado del cliente.',
        question: '¿Si conecta una PC por cable, tiene luz en el puerto?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-green', wifi: 'on-green', lan: 'on-green' },
        activeLed: 'LAN',
        options: [
            { label: 'Sí, puerto OK', next: '6.1', type: 'success' },
            { label: 'No detecta cable', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },
    '6.1': {
        id: '6.1',
        title: 'Cierre con Satisfacción',
        objective: 'Auditoría final de servicio.',
        action: 'Realice un Speedtest y confirme que sea acorde al plan contratado.',
        question: '¿Finalizamos la atención por éxito técnico?',
        options: [{ label: 'Finalizar Gestión', next: '6.3_SUMMARY', type: 'success' }]
    },

    '6.3_SUMMARY': {
        id: 'CIERRE',
        title: 'Resumen CRM STI',
        type: 'final'
    },

    'ESCALATE_VISIT': {
        id: 'N2-DERIVADO',
        case: 'DERIVACIÓN TÉCNICA',
        title: 'Visita Técnica / Campo',
        question: '¿Confirma envío de móvil a domicilio?',
        options: [{ label: 'Confirmar', next: '6.3_SUMMARY', type: 'success' }]
    },
    'ESCALATE_COMMERCIAL': {
        id: 'N2-COMERCIAL',
        case: 'DERIVACIÓN COMERCIAL',
        title: 'Gestión Administrativa',
        question: '¿El cliente acepta ser derivado a Cobranzas?',
        options: [{ label: 'Confirmar', next: '6.3_SUMMARY', type: 'success' }]
    },
    'ERR_NO_POWER': {
        id: 'CIERRE-ELECTRICO',
        title: 'Asistencia por Falta de Energía',
        objective: 'Informar canales de soporte eléctrico y finalizar gestión.',
        action: 'Indique al cliente: “Para normalizar su servicio de Nuevo Siglo, es imperativo que restaure primero la energía eléctrica. Puede contactar a Telegestiones UTE al 0800 1930 o consultar con un profesional certificado que asista su instalación interna”.',
        question: '¿Comprendió que debe acudir a UTE o a un técnico calificado para resolver el inconveniente eléctrico antes de que podamos operar sobre su módem?',
        options: [{ label: 'Sí, Finalizar gestión', next: '6.3_SUMMARY', type: 'success' }]
    }
};

class App {
    constructor() {
        this.state = {
            node: '0.1',
            history: [],
            subscriberId: '',
            model: null,
            mode: null,
            logs: [],
            startTime: new Date()
        };
        this.mount = document.getElementById('app');
        this.init();
    }

    init() { this.render(); }

    copyToClipboard() {
        const area = document.getElementById('crm-area');
        area.select();
        document.execCommand('copy');
        const btn = document.getElementById('copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '¡Copiado!';
        btn.classList.add('copy-success');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('copy-success');
        }, 2000);
    }

    dispatch(action, data) {
        if (action === 'NAVIGATE') {
            const nextNodeId = data;
            const target = TREE[nextNodeId];
            if (!target) return;

            if (target.type === 'logic') {
                const redirect = target.condition(this.state);
                this.dispatch('NAVIGATE', redirect);
                return;
            }

            this.state.history.push(this.state.node);
            this.state.node = nextNodeId;
            if (target.case || target.title) {
                this.state.logs.push(`${new Date().toLocaleTimeString()} - ${target.case || target.title}`);
            }
        }

        if (action === 'SET_SUBSCRIBER') {
            this.state.subscriberId = data;
            const btn = document.getElementById('triage-start-btn');
            const msg = document.getElementById('validation-msg');
            const input = document.getElementById('sub-id');

            const isReady = this.state.subscriberId && this.state.model && this.state.mode;
            if (btn) btn.disabled = !isReady;

            if (msg) {
                if (!isReady) {
                    let missing = [];
                    if (!this.state.subscriberId) missing.push('Nro. Abonado');
                    if (!this.state.model) missing.push('Modelo ONT');
                    if (!this.state.mode) missing.push('Modo Servicio');
                    msg.innerHTML = `Falta cargar: ${missing.join(', ')}`;
                } else {
                    msg.innerHTML = '';
                }
            }

            if (input) {
                if (!this.state.subscriberId) input.classList.add('required-hint');
                else input.classList.remove('required-hint');
            }

            return;
        }

        if (action === 'SET_TRIAGE') {
            this.state = { ...this.state, ...data };
            this.render(); // Re-render for buttons/cards selection
            return;
        }

        if (action === 'BACK') {
            if (this.state.history.length > 0) this.state.node = this.state.history.pop();
        }
        if (action === 'RESET') {
            this.state = { node: '0.1', history: [], subscriberId: '', model: null, mode: null, logs: [], startTime: new Date() };
        }
        this.render();
    }

    render() {
        const step = TREE[this.state.node];
        this.mount.innerHTML = '';

        const header = document.createElement('header');
        header.className = 'app-header';
        header.innerHTML = `
            <div class="brand">
                <div class="brand-logo">NS</div>
                <div class="brand-text">
                    <h1>${CONFIG.BRAND}</h1>
                    <p>SOPORTE TÉCNICO INTERACTIVO</p>
                </div>
            </div>
            <div class="header-status">
                ${this.state.node !== '0.1' ? `
                    <div class="header-badges">
                        <span class="badge">ID: ${this.state.subscriberId || 'N/A'}</span>
                        <span class="badge">${this.state.model || '?'}</span>
                        <span class="badge">${this.state.mode || '?'}</span>
                    </div>
                    <div class="node-id"># ${step.id}</div>
                ` : '<span class="badge">SISTEMA LISTO</span>'}
            </div>
        `;
        this.mount.appendChild(header);

        const main = document.createElement('main');
        main.className = 'app-main fade-in';
        if (this.state.node === '0.1') this.renderStart(main, step);
        else if (this.state.node === '0.2') this.renderTriage(main, step);
        else if (step.type === 'final') this.renderSummary(main, step);
        else this.renderStep(main, step);
        this.mount.appendChild(main);

        this.renderTechnicalFooter(step);
    }

    renderStart(container, step) {
        container.innerHTML = `
            <div class="view" style="text-align:center;">
                <h1 style="font-size: 2.2rem; margin-bottom: 1rem;">${step.title}</h1>
                <p style="color: var(--text-muted); margin-bottom: 3rem;">${step.desc}</p>
                <button class="btn btn-yes" style="margin: 0 auto;" 
                        onclick="app.dispatch('NAVIGATE', '${step.next}')">
                    Acceder al Panel
                </button>
            </div>
        `;
    }

    renderTriage(container, step) {
        let missing = [];
        if (!this.state.subscriberId) missing.push('Nro. Abonado');
        if (!this.state.model) missing.push('Modelo ONT');
        if (!this.state.mode) missing.push('Modo Servicio');
        const isReady = missing.length === 0;

        container.innerHTML = `
            <div class="view">
                <div class="title-section">
                    <h2>${step.title}</h2>
                    <p>${step.desc}</p>
                </div>

                <div class="input-group">
                    <label class="input-label">Identificador del Abonado</label>
                    <input type="text" id="sub-id" class="subscriber-input ${!this.state.subscriberId ? 'required-hint' : ''}" 
                           placeholder="Número de Contrato" 
                           value="${this.state.subscriberId || ''}"
                           oninput="app.dispatch('SET_SUBSCRIBER', this.value)">
                </div>

                <div class="card-grid">
                    ${Object.values(CONFIG.MODELS).map(hw => `
                        <div class="selection-card ${this.state.model === hw.id ? 'active' : ''} ${!this.state.model ? 'required-hint' : ''}" 
                             onclick="app.dispatch('SET_TRIAGE', {model: '${hw.id}'})">
                            <strong style="font-size: 1.2rem;">${hw.name}</strong>
                            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">${hw.desc}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="card-grid" style="grid-template-columns: 1fr 1fr; margin-top: 1rem;">
                    <div class="selection-card ${this.state.mode === 'Standard' ? 'active' : ''} ${!this.state.mode ? 'required-hint' : ''}" 
                         onclick="app.dispatch('SET_TRIAGE', {mode: 'Standard'})">
                         <strong>STANDARD</strong>
                    </div>
                    <div class="selection-card ${this.state.mode === 'Bridge' ? 'active' : ''} ${!this.state.mode ? 'required-hint' : ''}" 
                         onclick="app.dispatch('SET_TRIAGE', {mode: 'Bridge'})">
                         <strong>BRIDGE</strong>
                    </div>
                </div>

                <div style="margin-top: 1rem; text-align:center;">
                    <div id="validation-msg" class="validation-msg">${!isReady ? `Falta cargar: ${missing.join(', ')}` : ''}</div>
                    <button id="triage-start-btn" class="btn btn-yes" style="margin: 0.5rem auto 0;"
                            ${!isReady ? 'disabled' : ''}
                            onclick="app.dispatch('NAVIGATE', '${step.next}')">
                        Comenzar Diagnóstico
                    </button>
                </div>
            </div>
        `;
    }

    renderStep(container, step) {
        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
            <div class="diagnostic-box">
                <div class="case-indicator">
                    <span>${step.case || 'DIAGNÓSTICO'}</span>
                    <span>OBJETIVO: ${step.objective || 'N/A'}</span>
                </div>
                ${step.action ? `<div class="instruction-card"><p class="instruction-text">${step.action}</p></div>` : ''}
                <div class="dialogue-bubble"><p class="dialogue-text">${step.question}</p></div>
                <div class="actions">
                    ${(step.options || []).map(opt => `
                        <button class="btn btn-${opt.type === 'success' ? 'yes' : 'no'}" onclick="app.dispatch('NAVIGATE', '${opt.next}')">
                            ${opt.label}
                        </button>
                    `).join('')}
                </div>
                <button class="btn btn-back" style="margin: 0.5rem auto 0;" onclick="app.dispatch('BACK')">Volver</button>
            </div>
        `;
        container.appendChild(div);
    }

    renderSummary(container, step) {
        container.innerHTML = `
            <div class="view" style="height: 100%; justify-content: space-between;">
                <div class="title-section" style="margin-bottom: 0.5rem;">
                    <h2>${step.title}</h2>
                    <p>Reporte optimizado para CRM.</p>
                </div>
                
                <textarea id="crm-area" class="summary-area" readonly>--- REPORTE STI ---
ID ABONADO: ${this.state.subscriberId}
ID CIERRE: ${this.state.node}
EQUIPO: ${this.state.model} | MODO: ${this.state.mode}
INICIO: ${this.state.startTime.toLocaleString()}
FINAL: ${new Date().toLocaleString()}
---------------------------
PASOS EJECUTADOS:
${this.state.logs.join('\n')}
---------------------------</textarea>

                <div class="actions" style="margin-top: 1rem;">
                    <button id="copy-btn" class="btn btn-yes" onclick="app.copyToClipboard()">
                        Copiar Reporte
                    </button>
                    <button class="btn btn-back" onclick="app.dispatch('RESET')">
                        Nueva Atención
                    </button>
                </div>
            </div>
        `;
    }

    renderTechnicalFooter(step) {
        const isTechnicalNode = this.state.node !== '0.1' && this.state.node !== '0.2' && step.type !== 'final';
        const f = document.createElement('footer');
        f.className = 'app-footer';
        const leds = ['POWER', 'LOS', 'PON', 'INTERNET', 'WIFI', 'LAN'];

        // RECALCULATE KNOWN LEDS DYNAMICALLY FROM CURRENT PATH
        let knownLeds = {};
        [...this.state.history, this.state.node].forEach(nodeId => {
            const s = TREE[nodeId];
            if (s && s.leds) {
                knownLeds = { ...knownLeds, ...s.leds };
            }
        });

        f.innerHTML = `
            <div class="led-monitor">
                ${leds.filter(l => knownLeds.hasOwnProperty(l.toLowerCase())).map(l => {
            const key = l.toLowerCase();
            let status = knownLeds[key] || 'off';
            if (this.state.mode === 'Bridge' && (l === 'INTERNET' || l === 'WIFI')) status = 'disabled';
            const isEvaluating = step.activeLed === l;
            return `
                        <div class="led-item">
                            <div class="led-circle ${status} ${isEvaluating ? 'active' : ''}"></div>
                            <span class="led-label" style="${isEvaluating ? 'color: var(--primary); font-weight: 800;' : ''}">${l}</span>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
        this.mount.appendChild(f);
    }
}

const app = new App();
window.app = app;
