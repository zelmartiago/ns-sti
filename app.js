/**
 * NS-STI v5.5.0 - GOLD MASTER PREMIUM UI/UX
 * Enhanced diagnostic engine with clear separation of Instruction, Dialogue, and Actions.
 */

const CONFIG = {
    VERSION: '5.5.0 (Premium UI)',
    BRAND: 'Nuevo Siglo',
    MODELS: {
        F6600: { id: 'F6600', name: 'ZTE F6600', icon: '📡', desc: '4 Antenas' },
        F1611A: { id: 'F1611A', name: 'ZTE F1611A', icon: '📶', desc: '2 Antenas' }
    }
};

const TREE = {
    '0.1': {
        id: '0.1',
        case: 'CASO 0: ATENCIÓN DE LLAMADA',
        title: 'Inicio de Gestión',
        desc: 'Bienvenido al asistente de soporte técnico FTTH.',
        next: '0.2'
    },
    '0.2': {
        id: '0.2',
        case: 'CASO 0: TRIAJE PRIMARIO',
        title: 'Selección de Entorno',
        desc: 'Identifique el equipo y modo de operación.',
        next: '1.0'
    },

    // CASO 1: POWER
    '1.0': {
        id: '1.0',
        case: 'CASO 1: LUZ POWER',
        title: 'Integridad Eléctrica',
        objective: 'Confirmar suministro de energía al equipo.',
        question: '¿La luz LED POWER está encendida y fija?',
        leds: { power: 'off' }, // Start OFF, only ON after "Yes"
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
        leds: { power: 'off', los: 'off', pon: 'off' },
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
        leds: { power: 'on-green', los: 'off' }, // LOS starts off in question
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
        leds: { power: 'on-green', los: 'on-red', pon: 'off' },
        activeLed: 'LOS',
        options: [
            { label: 'Sí, se apagó', next: '3.0', type: 'success' },
            { label: 'Sigue encendida', next: '2.2', type: 'danger' }
        ]
    },
    '2.2': {
        id: '2.2',
        case: 'CASO 2: ESCALAMIENTO N2',
        title: 'Derivación por Falla Acometida',
        objective: 'Falla física de señal sin resolución por usuario.',
        action: 'Derive a Soporte de Segundo Nivel por posible rotura de fibra externa.',
        question: '¿Confirma derivación a N2 por señal LOS?',
        leds: { power: 'on-green', los: 'on-red', pon: 'off' },
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
        leds: { power: 'on-green', los: 'off', pon: 'off' }, // PON unknown until confirmed
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
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'off', wifi: 'off', lan: 'off' },
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
        title: 'Reset de Sesión BRAS',
        objective: 'Liberar sesión PPPoE bloqueada.',
        action: 'Solicite a L3 un reset de puerto en el BRAS.',
        question: '¿Se restableció la navegación?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-green' },
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
        title: 'Cierre por Falta de Suministro',
        question: '¿El cliente comprendió que debe esperar a que vuelva la luz?',
        options: [{ label: 'Cerrar Llamada', next: '6.3_SUMMARY', type: 'success' }]
    }
};

class App {
    constructor() {
        this.state = {
            node: '0.1',
            history: [],
            model: null,
            mode: null,
            logs: [],
            startTime: new Date(),
            prevLeds: {} // Persistence helper
        };
        this.mount = document.getElementById('app');
        this.init();
    }

    init() { this.render(); }

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

            // Save LED state of current node before leaving
            const currentStep = TREE[this.state.node];
            if (currentStep.leds) this.state.prevLeds = { ...this.state.prevLeds, ...currentStep.leds };

            this.state.history.push(this.state.node);
            this.state.node = nextNodeId;
            if (target.case || target.title) {
                this.state.logs.push(`${new Date().toLocaleTimeString()} - ${target.case || target.title}`);
            }
        }

        if (action === 'SET_TRIAGE') this.state = { ...this.state, ...data };
        if (action === 'BACK') {
            if (this.state.history.length > 0) this.state.node = this.state.history.pop();
        }
        if (action === 'RESET') {
            this.state = { node: '0.1', history: [], model: null, mode: null, logs: [], startTime: new Date(), prevLeds: {} };
        }
        this.render();
    }

    render() {
        const step = TREE[this.state.node];
        this.mount.innerHTML = '';

        // --- HEADER ---
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
                        <span class="badge">${this.state.model || '?'}</span>
                        <span class="badge">${this.state.mode || '?'}</span>
                    </div>
                    <div class="node-id"># ${step.id}</div>
                ` : '<span class="badge">LISTO</span>'}
            </div>
        `;
        this.mount.appendChild(header);

        // --- MAIN ---
        const main = document.createElement('main');
        main.className = 'app-main fade-in';
        if (this.state.node === '0.1') this.renderStart(main, step);
        else if (this.state.node === '0.2') this.renderTriage(main, step);
        else if (step.type === 'final') this.renderSummary(main, step);
        else this.renderStep(main, step);
        this.mount.appendChild(main);

        // --- FOOTER ---
        this.renderTechnicalFooter(step);
    }

    renderStart(container, step) {
        container.innerHTML = `
            <div class="view" style="text-align:center;">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${step.title}</h1>
                <p style="color: var(--text-muted); margin-bottom: 3rem;">${step.desc}</p>
                <button class="btn btn-yes" style="margin: 0 auto;" onclick="app.dispatch('NAVIGATE', '${step.next}')">
                    Iniciar Atención 📞
                </button>
            </div>
        `;
    }

    renderTriage(container, step) {
        container.innerHTML = `
            <div class="view">
                <div class="title-section">
                    <h2>${step.title}</h2>
                    <p>${step.desc}</p>
                </div>
                <div class="card-grid">
                    ${Object.values(CONFIG.MODELS).map(hw => `
                        <div class="selection-card ${this.state.model === hw.id ? 'active' : ''}" 
                             onclick="app.dispatch('SET_TRIAGE', {model: '${hw.id}'})">
                            <div class="icon-box">${hw.icon}</div>
                            <strong>${hw.name}</strong>
                        </div>
                    `).join('')}
                </div>
                <div class="card-grid" style="grid-template-columns: 1fr 1fr; margin-top: 1rem;">
                    <div class="selection-card ${this.state.mode === 'Standard' ? 'active' : ''}" 
                         onclick="app.dispatch('SET_TRIAGE', {mode: 'Standard'})">
                         <strong>MODO STANDARD</strong>
                    </div>
                    <div class="selection-card ${this.state.mode === 'Bridge' ? 'active' : ''}" 
                         onclick="app.dispatch('SET_TRIAGE', {mode: 'Bridge'})">
                         <strong>MODO BRIDGE</strong>
                    </div>
                </div>
                <div style="margin-top: 2rem; text-align:center;">
                    <button class="btn btn-yes" style="margin: 0 auto;"
                            ${!this.state.model || !this.state.mode ? 'disabled' : ''}
                            onclick="app.dispatch('NAVIGATE', '${step.next}')">
                        Comenzar Diagnóstico 🚀
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
                
                ${step.action ? `
                    <div class="instruction-card">
                        <p class="instruction-text">${step.action}</p>
                    </div>
                ` : ''}

                <div class="dialogue-bubble">
                    <p class="dialogue-text">${step.question}</p>
                </div>
                
                <div class="actions">
                    ${(step.options || []).map(opt => `
                        <button class="btn btn-${opt.type === 'success' ? 'yes' : 'no'}" 
                                onclick="app.dispatch('NAVIGATE', '${opt.next}')">
                            ${opt.label}
                        </button>
                    `).join('')}
                </div>
                <button class="btn btn-back" style="margin: 1rem auto 0;" onclick="app.dispatch('BACK')">← Volver</button>
            </div>
        `;
        container.appendChild(div);
    }

    renderSummary(container, step) {
        container.innerHTML = `
            <div class="view">
                <div class="title-section">
                    <h2>${step.title}</h2>
                    <p>Gestión finalizada. Copie el reporte para el CRM.</p>
                </div>
                <textarea class="summary-area" readonly>--- REPORTE STI ---
ID CIERRE: ${this.state.node}
EQUIPO: ${this.state.model} | MODO: ${this.state.mode}
---------------------------
LOGS:
${this.state.logs.join('\n')}
---------------------------</textarea>
                <button class="btn btn-yes" style="margin: 1rem auto;" onclick="app.dispatch('RESET')">Nueva Atención</button>
            </div>
        `;
    }

    renderTechnicalFooter(step) {
        const f = document.createElement('footer');
        f.className = 'app-footer';
        const leds = ['POWER', 'LOS', 'PON', 'INTERNET', 'WIFI', 'LAN'];

        // Logic for persisting leds
        const currentLeds = { ...this.state.prevLeds, ...(step.leds || {}) };

        f.innerHTML = `
            <div class="led-monitor">
                ${leds.map(l => {
            const key = l.toLowerCase();
            let status = currentLeds[key] || 'off';
            if (this.state.mode === 'Bridge' && (l === 'INTERNET' || l === 'WIFI')) status = 'disabled';
            const isEvaluating = step.activeLed === l;
            return `
                        <div class="led-item">
                            <div class="led-circle ${status} ${isEvaluating ? 'active' : ''}"></div>
                            <span class="led-label">${l}</span>
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
