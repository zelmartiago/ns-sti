/**
 * NS-STI: Advanced Diagnostic Engine
 * Architecture: State-Driven Nodal Graph
 * Developed with Premium UI/UX focus
 */

const CONFIG = {
    VERSION: '3.1.0-UX',
    BRAND_NAME: 'NS-STI',
    MODELS: {
        F6600: { id: 'F6600', name: 'ZTE F6600', antennas: '4 Redondas', icon: '📡' },
        F1611A: { id: 'F1611A', name: 'ZTE F1611A', antennas: '2 Planas', icon: '📶' }
    }
};

const TREE = {
    'WELCOME': {
        type: 'hero',
        title: 'Asistente de Diagnóstico Inteligente',
        subtitle: 'Nuevo Siglo - Soporte Técnico Nivel 1',
        description: 'Bienvenido. Inicie el triaje para identificar la falla y determinar el alcance de responsabilidad técnica.',
        cta: 'Comenzar Triage',
        next: 'MASTER_BIFURCATION'
    },
    'MASTER_BIFURCATION': {
        type: 'bifurcation',
        title: 'Triaje Primario',
        subtitle: 'Seleccione modelo y modo para habilitar la ruta correcta.',
        next: 'POWER_CHECK'
    },
    'POWER_CHECK': {
        id: '1.0',
        case: 'CASO 1: POWER',
        title: 'Verificación de Energía',
        objective: 'Confirmar integridad eléctrica en la terminal ONT.',
        question: '¿La luz LED POWER se encuentra encendida fija?',
        leds: { power: 'on-green', los: 'off', pon: 'off', internet: 'off', wifi: 'off', lan: 'off' },
        options: [
            { label: 'Sí, está encendida', next: 'SYNC_CHECK', variant: 'success' },
            { label: 'No, está apagada', next: 'POWER_TROUBLESHOOT', variant: 'danger' }
        ]
    },
    'POWER_TROUBLESHOOT': {
        title: 'Troubleshooting de Energía',
        objective: 'Restablecer alimentación eléctrica.',
        action: 'Solicite revisar botón ON/OFF (trasero) y conexión del transformador.',
        question: '¿Logró encender tras estas acciones?',
        options: [
            { label: 'Sí, encendió', next: 'SYNC_CHECK', variant: 'success' },
            { label: 'No, persiste apagado', next: 'ESCALATE_POWER', variant: 'danger' }
        ]
    },
    'SYNC_CHECK': {
        id: '2.0',
        case: 'CASO 2: LOS & SYNC',
        title: 'Integridad de Fibra Óptica',
        objective: 'Verificar sincronismo físico con la red central.',
        question: '¿Luz PON fija y LOS apagada?',
        leds: { power: 'on-green', los: 'on-red', pon: 'on-green', internet: 'off' },
        options: [
            { label: 'Sí, sincronizado', next: 'PON_VALIDATE', variant: 'success' },
            { label: 'No, LOS roja o PON parpadea', next: 'FIBER_TROUBLESHOOT', variant: 'danger' }
        ]
    },
    'FIBER_TROUBLESHOOT': {
        title: 'Revisión de Enlace Óptico',
        action: 'Verificar patchcord amarillo y conexión firme en Roseta NS.',
        question: '¿Se normalizó el estado de los LEDs?',
        options: [
            { label: 'Sí, normalizado', next: 'PON_VALIDATE', variant: 'success' },
            { label: 'No, persiste falla', next: 'ESCALATE_FIBER', variant: 'danger' }
        ]
    },
    'PON_VALIDATE': {
        id: '3.0',
        case: 'CASO 3: PON',
        title: 'Validación de Aprovisionamiento',
        objective: 'Confirmar vinculación lógica del terminal.',
        question: '¿PON permanece verde fija?',
        nextLogic: (state) => state.mode === 'Bridge' ? 'BRIDGE_DEMARCATION' : 'INTERNET_CHECK',
        options: [
            { label: 'Confirmar y Continuar', next: 'AUTO_NEXT', variant: 'primary' }
        ]
    },
    'BRIDGE_DEMARCATION': {
        title: 'Cierre por Demarcación',
        subtitle: 'Modo Bridge Detectado',
        objective: 'Límite de responsabilidad técnica.',
        text: 'Sr./Sra. Cliente: Su terminal está sincronizada correctamente. Al estar en Modo Bridge, la gestión de su red interna depende de su router privado.',
        question: '¿Desea finalizar el caso bajo esta cláusula?',
        options: [
            { label: 'Cerrar Incidente', next: 'SUMMARY', variant: 'success' }
        ]
    },
    'INTERNET_CHECK': {
        id: '4.0',
        case: 'CASO 4: INTERNET',
        title: 'Sesión y Navegación',
        objective: 'Validar salida a Internet vía PPPoE.',
        question: '¿LED INTERNET activo y logra navegar?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-green', wifi: 'on-green' },
        options: [
            { label: 'Navega OK', next: 'WIFI_LAN_CHECK', variant: 'success' },
            { label: 'No navega / LED apagado', next: 'INTERNET_TROUBLESHOOT', variant: 'danger' }
        ]
    },
    'WIFI_LAN_CHECK': {
        id: '5.0',
        case: 'CASO 5 & 6: LAN / WIFI',
        title: 'Auditoría de Red Local',
        question: '¿El servicio funciona correctamente en todos sus dispositivos?',
        options: [
            { label: 'Servicio Óptimo', next: 'SUMMARY', variant: 'success' },
            { label: 'Fallas de cobertura/velocidad', next: 'ADVANCED_SUPPORT', variant: 'warn' }
        ]
    },
    'SUMMARY': {
        type: 'summary',
        title: 'Atención Finalizada',
        subtitle: 'Generación de reporte para CRM'
    },
    // Generic Escatations
    'ESCALATE_POWER': { title: 'Falla Técnica: Energía', question: 'Coordinar visita por falla de hardware.', options: [{ label: 'Ir al Resumen', next: 'SUMMARY' }] },
    'ESCALATE_FIBER': { title: 'Falla Técnica: Fibra', question: 'Coordinar visita por falla de señal.', options: [{ label: 'Ir al Resumen', next: 'SUMMARY' }] }
};

class DiagnosticEngine {
    constructor() {
        this.state = {
            currentStep: 'WELCOME',
            model: null,
            mode: null,
            history: [],
            logs: [],
            startTime: new Date()
        };
        this.appEl = document.getElementById('app');
        this.init();
    }

    init() {
        this.render();
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    handleSelection(type, val) {
        this.state[type] = val;
        this.render();
    }

    handleNext(nextId) {
        const currentData = TREE[this.state.currentStep];

        if (nextId === 'AUTO_NEXT' && currentData.nextLogic) {
            nextId = currentData.nextLogic(this.state);
        }

        this.state.history.push(this.state.currentStep);
        this.state.logs.push({
            step: currentData.title || currentData.case,
            timestamp: new Date().toLocaleTimeString()
        });

        this.setState({ currentStep: nextId });
    }

    handleBack() {
        if (this.state.history.length > 0) {
            const prev = this.state.history.pop();
            this.setState({ currentStep: prev });
        }
    }

    render() {
        const step = TREE[this.state.currentStep];
        this.appEl.innerHTML = '';

        // --- Header ---
        const header = this.createHeader(step);
        this.appEl.appendChild(header);

        // --- Main Content ---
        const main = document.createElement('main');
        main.className = 'app-main fade-in';

        const view = document.createElement('div');
        view.className = 'view';

        switch (step.type) {
            case 'hero':
                view.appendChild(this.renderHero(step));
                break;
            case 'bifurcation':
                view.appendChild(this.renderBifurcation(step));
                break;
            case 'summary':
                view.appendChild(this.renderSummary(step));
                break;
            default:
                view.appendChild(this.renderDiagnosticStep(step));
        }

        main.appendChild(view);
        this.appEl.appendChild(main);

        // --- Footer ---
        if (this.state.currentStep !== 'WELCOME' && this.state.currentStep !== 'SUMMARY') {
            this.appEl.appendChild(this.createFooter(step));
        }
    }

    createHeader(step) {
        const h = document.createElement('header');
        h.className = 'app-header';

        const isStart = this.state.currentStep === 'WELCOME';

        h.innerHTML = `
            <div class="brand">
                <div class="brand-logo">NS</div>
                <div class="brand-text">
                    <h1>${CONFIG.BRAND_NAME}</h1>
                    <p>FTTH Diagnostic Engine v${CONFIG.VERSION}</p>
                </div>
            </div>
            <div class="header-status">
                ${!isStart ? `
                    <div class="breadcrumb-info">
                        <span class="badge">${this.state.model || 'MODELO?'}</span>
                        <span class="badge">${this.state.mode || 'MODO?'}</span>
                    </div>
                ` : ''}
            </div>
        `;

        if (this.state.history.length > 0) {
            const backBtn = document.createElement('button');
            backBtn.className = 'btn btn-outline';
            backBtn.innerHTML = '← Atrás';
            backBtn.onclick = () => this.handleBack();
            h.prepend(backBtn);
        }

        return h;
    }

    renderHero(step) {
        const div = document.createElement('div');
        div.className = 'title-section';
        div.innerHTML = `
            <h2>${step.title}</h2>
            <p>${step.description}</p>
            <div style="margin-top: 3rem">
                <button class="btn btn-primary" style="padding: 1rem 3rem" onclick="engine.handleNext('${step.next}')">
                    ${step.cta}
                </button>
            </div>
        `;
        return div;
    }

    renderBifurcation(step) {
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="title-section">
                <h2>${step.title}</h2>
                <p>${step.subtitle}</p>
            </div>
            
            <div class="card-grid">
                ${Object.values(CONFIG.MODELS).map(hw => `
                    <div class="selection-card ${this.state.model === hw.id ? 'active' : ''}" onclick="engine.handleSelection('model', '${hw.id}')">
                        <div class="icon-box">${hw.icon}</div>
                        <div class="hw-label">${hw.name}</div>
                        <div class="hw-desc">${hw.antennas} Antenas</div>
                    </div>
                `).join('')}
            </div>

            <div class="card-grid" style="grid-template-columns: 1fr 1fr; margin-top: 1.5rem;">
                <div class="selection-card ${this.state.mode === 'Standard' ? 'active' : ''}" onclick="engine.handleSelection('mode', 'Standard')">
                    <div class="icon-box">🏠</div>
                    <div class="hw-label">Standard</div>
                    <div class="hw-desc">Gestión NS</div>
                </div>
                <div class="selection-card ${this.state.mode === 'Bridge' ? 'active' : ''}" onclick="engine.handleSelection('mode', 'Bridge')">
                    <div class="icon-box">🌉</div>
                    <div class="hw-label">Bridge</div>
                    <div class="hw-desc">Router Propio</div>
                </div>
            </div>

            <div style="margin-top: 3rem; text-align: center;">
                <button id="master-start" class="btn btn-primary btn-wide" 
                        ${!this.state.model || !this.state.mode ? 'disabled' : ''} 
                        onclick="engine.handleNext('${step.next}')">
                    Iniciar Diagnóstico Técnico
                </button>
            </div>
        `;
        return div;
    }

    renderDiagnosticStep(step) {
        const div = document.createElement('div');
        div.className = 'diagnostic-box';

        div.innerHTML = `
            <div class="step-header">
                ${step.case ? `<span class="step-label">${step.case}</span>` : ''}
                <h2 style="font-size: 1.5rem; font-weight: 700;">${step.title}</h2>
            </div>
            
            ${step.objective ? `<div class="objective-banner">${step.objective}</div>` : ''}
            
            ${step.action ? `
                <div style="background: #fff; border: 1px solid var(--border); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                    <strong style="color: var(--primary); display: block; margin-bottom: 0.5rem;">Acción Técnica:</strong>
                    ${step.action}
                </div>
            ` : ''}

            ${step.question ? `
                <div class="question-bubble">${step.question}</div>
            ` : ''}

            <div class="actions">
                ${(step.options || []).map(opt => `
                    <button class="btn btn-${opt.variant || 'primary'}" onclick="engine.handleNext('${opt.next}')">
                        ${opt.label}
                    </button>
                `).join('')}
            </div>
        `;
        return div;
    }

    renderSummary(step) {
        const logsStr = this.state.logs.map(l => `[${l.timestamp}] ${l.step}`).join('\n');
        const finalStatus = this.state.mode === 'Bridge' ? 'DEMARCACIÓN CAPA 2' : 'PROCEDIMIENTO FINALIZADO';

        const div = document.createElement('div');
        div.innerHTML = `
            <div class="title-section">
                <h2>${step.title}</h2>
                <p>Copia el siguiente resumen para el CRM.</p>
            </div>
            
            <textarea class="summary-area" readonly>
CASO: ${this.state.model} [${this.state.mode}]
ESTADO: ${finalStatus}
TIEMPO: ${Math.round((new Date() - this.state.startTime) / 60000)} min

FLUJO LÓGICO:
${logsStr}
            </textarea>

            <div class="actions">
                <button class="btn btn-primary" onclick="location.reload()">Nuevo Diagnóstico</button>
            </div>
        `;
        return div;
    }

    createFooter(step) {
        const f = document.createElement('footer');
        f.className = 'app-footer';

        const leds = ['POWER', 'LOS', 'PON', 'INTERNET', 'WIFI', 'LAN'];

        f.innerHTML = `
            <div class="led-monitor">
                ${leds.map(l => {
            const key = l.toLowerCase();
            let state = (step.leds && step.leds[key]) ? step.leds[key] : 'off';

            // Bridge blinding
            if (this.state.mode === 'Bridge' && (l === 'INTERNET' || l === 'WIFI')) state = 'disabled';

            return `
                        <div class="led-item">
                            <div class="led-circle ${state}"></div>
                            <span class="led-label">${l}</span>
                        </div>
                    `;
        }).join('')}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
                SECURE HANDSHAKE: <span style="color: var(--accent);">ENABLED</span>
            </div>
        `;
        return f;
    }
}

// Global Engine Instance
const engine = new DiagnosticEngine();
window.engine = engine;
