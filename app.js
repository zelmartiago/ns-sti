/**
 * NS-STI v5.0.0 - GOLD MASTER REBORN
 * Combines high-fidelity UI/UX with the original formal diagnostic structure.
 * Features: Node tracking, persistent LED monitoring, and full case loop.
 */

const CONFIG = {
    VERSION: '5.0.0 (Gold Master)',
    BRAND: 'Nuevo Siglo',
    MODELS: {
        F6600: { id: 'F6600', name: 'ZTE F6600', icon: '📡', desc: '4 Antenas (Redondas)' },
        F1611A: { id: 'F1611A', name: 'ZTE F1611A', icon: '📶', desc: '2 Antenas (Planas)' }
    }
};

const TREE = {
    '0.1': {
        id: '0.1',
        case: 'CASO 0: ATENCIÓN DE LLAMADA',
        title: 'Inicio de Gestión',
        desc: 'Soporte Técnico Nivel 1 - Inicie el triaje para comenzar.',
        cta: 'Iniciar Atención',
        next: '0.2'
    },
    '0.2': {
        id: '0.2',
        case: 'CASO 0: TRIAJE',
        title: 'Selección de Terminal y Modo',
        desc: 'Identifique el equipo y modo de operación del servicio.',
        next: '1.0'
    },

    // CASO 1: POWER
    '1.0': {
        id: '1.0',
        case: 'CASO 1: LUZ POWER',
        title: 'Integridad Eléctrica',
        objective: 'Confirmar que el módem recibe energía.',
        question: '¿La luz LED POWER está encendida y fija?',
        leds: { power: 'on-green', los: 'off', pon: 'off', internet: 'off', wifi: 'off', lan: 'off' },
        activeLed: 'POWER',
        options: [
            { label: 'Sí, está encendida', next: '2.0', type: 'success' },
            { label: 'No, está apagada', next: '1.1', type: 'danger' }
        ]
    },
    '1.1': {
        id: '1.1',
        title: 'Suministro en Domicilio',
        objective: 'Descartar corte de energía general.',
        question: '¿Tiene energía eléctrica en su casa en este momento?',
        options: [
            { label: 'Sí, tengo energía', next: '1.2', type: 'success' },
            { label: 'No hay energía', next: 'ERR_NO_POWER', type: 'danger' }
        ]
    },
    '1.2': {
        id: '1.2',
        title: 'Botón ON/OFF',
        objective: 'Verificar encendido manual del equipo.',
        action: 'Presione y suelte el botón rojo ON/OFF en la parte trasera.',
        question: '¿Encendió la luz POWER?',
        options: [
            { label: 'Sí', next: '2.0', type: 'success' },
            { label: 'Todavía no', next: '1.3', type: 'danger' }
        ]
    },
    '1.3': {
        id: '1.3',
        title: 'Conexión del Transformador',
        objective: 'Asegurar alimentación estable.',
        action: 'Revise la conexión en el módem y el tomacorriente.',
        question: '¿Encendió la luz POWER?',
        options: [
            { label: 'Sí', next: '2.0', type: 'success' },
            { label: 'Todavía no', next: '1.4', type: 'danger' }
        ]
    },
    '1.4': {
        id: '1.4',
        title: 'Prueba de Enchufe',
        objective: 'Descartar falla en el tomacorriente.',
        action: 'Pruebe conectar el módem en otro enchufe cercano.',
        question: '¿Logró encender?',
        options: [
            { label: 'Sí', next: '2.0', type: 'success' },
            { label: 'No, persiste apagado', next: '1.5', type: 'danger' }
        ]
    },
    '1.5': {
        id: '1.5',
        title: 'Cambio de Transformador',
        objective: 'Validar falla del adaptador DC.',
        action: 'Use el transformador del Deco o Mesh si es compatible.',
        question: '¿Funciona ahora?',
        options: [
            { label: 'Sí', next: '2.0', type: 'success' },
            { label: 'No, derivar visita', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },

    // CASO 2: LOS
    '2.0': {
        id: '2.0',
        case: 'CASO 2: LUZ LOS',
        title: 'Sincronismo Físico',
        objective: 'Verificar la integridad de la señal de fibra.',
        question: '¿La luz PON está verde fija y la LOS está apagada?',
        leds: { power: 'on-green', los: 'on-red', pon: 'on-green', internet: 'off' },
        activeLed: 'LOS',
        options: [
            { label: 'Sí, sincronismo OK', next: '3.0', type: 'success' },
            { label: 'No, LOS roja / PON titila', next: '2.1', type: 'danger' }
        ]
    },
    '2.1': {
        id: '2.1',
        title: 'Revisión de Fibra',
        objective: 'Detectar daños físicos en el patchcord.',
        action: 'Inspeccione el cable amarillo. No debe estar doblado o cortado.',
        question: '¿Se normalizaron los LEDs?',
        options: [
            { label: 'Sí', next: '3.0', type: 'success' },
            { label: 'No', next: '2.2', type: 'danger' }
        ]
    },
    '2.2': {
        id: '2.2',
        title: 'Reconexión de Bornes',
        objective: 'Asegurar conexión en Módem y Roseta.',
        action: 'Desconecte y vuelva a insertar el conector verde hasta el click.',
        question: '¿Se apagó la luz LOS?',
        options: [
            { label: 'Sí', next: '3.0', type: 'success' },
            { label: 'No, derivar visita', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },

    // CASO 3: PON
    '3.0': {
        id: '3.0',
        case: 'CASO 3: LUZ PON',
        title: 'Enlace Lógico FTTH',
        objective: 'Confirmar vinculación con la OLT.',
        question: '¿Luz PON fija?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'off' },
        activeLed: 'PON',
        options: [
            { label: 'Sí, fija', next: 'MODE_BIFURCATION', type: 'success' },
            { label: 'No, parpadea', next: '3.1', type: 'danger' }
        ]
    },
    '3.1': {
        id: '3.1',
        title: 'Reinicio Lógico',
        objective: 'Forzar nueva sesión de fibra.',
        action: 'Reinicie el equipo desde el botón ON/OFF.',
        question: '¿Quedó fija tras el reinicio?',
        options: [
            { label: 'Sí', next: 'MODE_BIFURCATION', type: 'success' },
            { label: 'Sigue parpadeando', next: '3.2', type: 'danger' }
        ]
    },
    '3.2': {
        id: '3.2',
        title: 'Soporte Ledefyl (L3)',
        objective: 'Reaprovisionamiento remoto.',
        action: 'Solicite reaprovisionamiento a Ledefyl (26262680).',
        question: '¿Se confirmó el éxito del proceso?',
        options: [
            { label: 'Confirmado y funcionando', next: 'MODE_BIFURCATION', type: 'success' },
            { label: 'Falla persistente', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },

    // BIFURCACIÓN MODOS
    'MODE_BIFURCATION': {
        type: 'logic',
        condition: (state) => state.mode === 'Bridge' ? 'CASE_BRIDGE' : '4.0'
    },
    'CASE_BRIDGE': {
        id: 'BRIDGE',
        title: 'Límite de Responsabilidad',
        objective: 'Cierre de ciclo por demarcación.',
        text: 'Servicio verificado en Capa 2 satisfactoriamente. El equipo está en BRIDGE y la red privada es responsabilidad del abonado.',
        question: '¿Finalizar atención?',
        options: [{ label: 'Finalizar', next: '6.3_SUMMARY', type: 'success' }]
    },

    // CASO 4: INTERNET
    '4.0': {
        id: '4.0',
        case: 'CASO 4: LUZ INTERNET (DISCADO PPPoE)',
        title: 'Navegación y Sesión',
        objective: 'Verificar sesión de datos activa.',
        question: '¿Luz INTERNET activa (fija o parpadeo)?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-green' },
        activeLed: 'INTERNET',
        options: [
            { label: 'Sí, navega OK', next: '5.0', type: 'success' },
            { label: 'No, LED apagado', next: '4.1', type: 'danger' }
        ]
    },
    '4.1': {
        id: '4.1',
        title: 'Estado Comercial',
        objective: 'Descartar deuda o suspensión.',
        question: '¿El cliente se encuentra al día con sus pagos?',
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
        options: [
            { label: 'Sí, restablecido', next: '5.0', type: 'success' },
            { label: 'No, persiste falla', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },

    // CASO 5: WIFI
    '5.0': {
        id: '5.0',
        case: 'CASO 5: LUZ WIFI',
        title: 'Red Inalámbrica',
        objective: 'Asegurar cobertura local.',
        question: '¿El cliente navega correctamente por Wi-Fi?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-green', wifi: 'on-green' },
        activeLed: 'WIFI',
        options: [
            { label: 'Sí, navega bien', next: '6.0', type: 'success' },
            { label: 'Lentitud o desconexión', next: '5.1', type: 'warn' }
        ]
    },
    '5.1': {
        id: '5.1',
        title: 'Auditoría de Canales (L3)',
        objective: 'Optimización de espectro radioféctrico.',
        action: 'Verifique saturación de canales en soporte L3.',
        question: '¿Se logró estabilizar?',
        options: [
            { label: 'Sí, resuelto', next: '6.0', type: 'success' },
            { label: 'No, derivar intervención', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },

    // CASO 6: LAN & CIERRE
    '6.0': {
        id: '6.0',
        case: 'CASO 6: LUZ LAN',
        title: 'Puertos Ethernet',
        objective: 'Validar conexiones cableadas.',
        question: '¿Cables LAN detectados y funcionales?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-green', wifi: 'on-green', lan: 'on-green' },
        activeLed: 'LAN',
        options: [
            { label: 'Sí, puertos OK', next: '6.1', type: 'success' },
            { label: 'Falla de puertos', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },
    '6.1': {
        id: '6.1',
        title: 'Validación Speedtest',
        objective: 'Auditoría de ancho de banda garantizado.',
        question: '¿Velocidad acorde al plan contratado?',
        options: [
            { label: 'Velocidad Correcta', next: '6.3_SUMMARY', type: 'success' },
            { label: 'Baja performance', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },

    '6.3_SUMMARY': {
        id: '6.3',
        title: 'Finalización / Resumen CRM',
        type: 'final'
    },

    // ESCALAMIENTOS
    'ESCALATE_VISIT': { title: 'Visita Técnica / N2', question: '¿Confirma derivación por falla técnica persistente?', options: [{ label: 'Confirmar y Resumir', next: '6.3_SUMMARY' }] },
    'ESCALATE_COMMERCIAL': { title: 'Derivación Comercial', question: 'Indicar al cliente que debe regularizar su situación.', options: [{ label: 'Ir al Resumen', next: '6.3_SUMMARY' }] },
    'ERR_NO_POWER': { title: 'Cierre: Sin Suministro', question: 'Informar que se reactivará el soporte al volver la luz.', options: [{ label: 'Cerrar', next: '6.3_SUMMARY' }] }
};

class App {
    constructor() {
        this.state = {
            node: '0.1',
            history: [],
            model: null,
            mode: null,
            logs: [],
            startTime: new Date()
        };
        this.mount = document.getElementById('app');
        this.init();
    }

    init() {
        this.render();
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

        if (action === 'SET_TRIAGE') {
            this.state = { ...this.state, ...data };
        }

        if (action === 'BACK') {
            if (this.state.history.length > 0) {
                this.state.node = this.state.history.pop();
            }
        }

        if (action === 'RESET') {
            this.state = { node: '0.1', history: [], model: null, mode: null, logs: [], startTime: new Date() };
        }

        this.render();
    }

    render() {
        const step = TREE[this.state.node];
        this.mount.innerHTML = '';

        // Header (Redesing with Logo and Node IDs)
        const header = document.createElement('header');
        header.className = 'app-header';
        header.innerHTML = `
            <div class="brand">
                <div class="brand-logo">NS</div>
                <div>
                    <h1 style="font-size: 1.1rem; font-weight:700;">${CONFIG.BRAND}</h1>
                    <p style="font-size: 0.65rem; color: #64748b;">v${CONFIG.VERSION}</p>
                </div>
            </div>
            <div style="text-align: right;">
                ${this.state.node !== '0.1' ? `
                    <div style="display:flex; gap: 8px; margin-bottom: 4px; justify-content: flex-end;">
                        <span class="badge" style="background: #eff6ff; color: #2563eb;">${this.state.model || 'MODELO?'}</span>
                        <span class="badge" style="background: #f0fdf4; color: #16a34a;">${this.state.mode || 'MODO?'}</span>
                    </div>
                    <div style="font-size: 0.7rem; font-weight:700; color: #94a3b8;">NODO ACTUAL: ${step.id}</div>
                ` : '<span class="badge">SISTEMA LISTO</span>'}
            </div>
        `;
        this.mount.appendChild(header);

        // Body with animations
        const main = document.createElement('main');
        main.className = 'app-main fade-in';

        if (this.state.node === '0.1') this.renderStart(main, step);
        else if (this.state.node === '0.2') this.renderTriage(main, step);
        else if (step.type === 'final') this.renderSummary(main, step);
        else this.renderStep(main, step);

        this.mount.appendChild(main);

        // Persistent Footer for all technical steps
        if (this.state.node !== '0.1' && this.state.node !== '0.2' && step.type !== 'final') {
            this.renderTechnicalFooter(step);
        }
    }

    renderStart(container, step) {
        container.innerHTML = `
            <div style="text-align:center; padding: 4rem 1rem;">
                <div class="icon-box" style="margin: 0 auto 2rem; width: 80px; height: 80px; font-size: 2.5rem;">🤖</div>
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${step.title}</h1>
                <p style="color: #64748b; margin-bottom: 3rem; max-width: 500px; margin-inline: auto;">${step.desc}</p>
                <button class="btn btn-primary" style="padding: 1rem 4rem; font-size: 1.1rem; box-shadow: 0 10px 15px -3px rgba(0, 102, 255, 0.4);" onclick="app.dispatch('NAVIGATE', '${step.next}')">
                    ${step.cta}
                </button>
            </div>
        `;
    }

    renderTriage(container, step) {
        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
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
                        <p style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">${hw.desc}</p>
                    </div>
                `).join('')}
            </div>
            <div class="card-grid" style="grid-template-columns: 1fr 1fr; margin-top: 1.5rem;">
                <div class="selection-card ${this.state.mode === 'Standard' ? 'active' : ''}" 
                     onclick="app.dispatch('SET_TRIAGE', {mode: 'Standard'})">
                     <span style="font-size:0.85rem; font-weight:700;">MODO STANDARD</span>
                </div>
                <div class="selection-card ${this.state.mode === 'Bridge' ? 'active' : ''}" 
                     onclick="app.dispatch('SET_TRIAGE', {mode: 'Bridge'})">
                     <span style="font-size:0.85rem; font-weight:700;">MODO BRIDGE</span>
                </div>
            </div>
            <div style="margin-top: 3rem; text-align:center;">
                <button class="btn btn-primary btn-wide" 
                        ${!this.state.model || !this.state.mode ? 'disabled' : ''}
                        onclick="app.dispatch('NAVIGATE', '${step.next}')">
                    Iniciar Diagnóstico Técnico
                </button>
            </div>
        `;
        container.appendChild(div);
    }

    renderStep(container, step) {
        const div = document.createElement('div');
        div.className = 'diagnostic-box view';
        div.innerHTML = `
            <div class="step-header">
                ${step.case ? `<span class="step-label">${step.case}</span>` : ''}
                <h2>${step.title}</h2>
            </div>
            ${step.objective ? `<div class="objective-banner">${step.objective}</div>` : ''}
            ${step.action ? `<div class="action-card" style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; line-height: 1.6;"><strong>⚙️ ACCIÓN:</strong> ${step.action}</div>` : ''}
            
            <div class="question-bubble">${step.question}</div>
            
            <div class="actions">
                ${(step.options || []).map(opt => `
                    <button class="btn btn-${opt.type || 'primary'}" style="min-width: 180px;" onclick="app.dispatch('NAVIGATE', '${opt.next}')">
                        ${opt.label}
                    </button>
                `).join('')}
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid #e2e8f0; padding-top: 1rem;">
                <button class="btn btn-outline" style="width: 100%; border: none; font-size: 0.8rem; color: #94a3b8;" onclick="app.dispatch('BACK')">← VOLVER AL PASO ANTERIOR</button>
            </div>
        `;
        container.appendChild(div);
    }

    renderSummary(container, step) {
        container.innerHTML = `
            <div class="title-section">
                <h2>${step.title}</h2>
                <p>Resumen final de la gestión STI.</p>
            </div>
            <textarea class="summary-area" readonly>
--- REPORTE FINAL NS-STI ---
ID NODO CIERRE: ${this.state.node}
EQUIPO: ${this.state.model} | MODO: ${this.state.mode}
DURACIÓN: ${Math.round((new Date() - this.state.startTime) / 60000)} min
---------------------------
PASOS EJECUTADOS:
${this.state.logs.join('\n')}
---------------------------
DIAGNÓSTICO: ATENCIÓN FINALIZADA.
            </textarea>
            <div class="actions" style="margin-top: 2rem;">
                <button class="btn btn-primary btn-wide" onclick="app.dispatch('RESET')">Nueva Atención</button>
            </div>
        `;
    }

    renderTechnicalFooter(step) {
        const f = document.createElement('footer');
        f.className = 'app-footer';
        const leds = ['POWER', 'LOS', 'PON', 'INTERNET', 'WIFI', 'LAN'];

        f.innerHTML = `
            <div class="led-monitor">
                ${leds.map(l => {
            const key = l.toLowerCase();
            let status = (step.leds && step.leds[key]) || 'off';
            // Blinding rule
            if (this.state.mode === 'Bridge' && (l === 'INTERNET' || l === 'WIFI')) status = 'disabled';

            const isEvaluating = step.activeLed === l;
            return `
                        <div class="led-item" style="${isEvaluating ? 'transform: translateY(-5px);' : ''}">
                            <div class="led-circle ${status} ${isEvaluating ? 'active' : ''}" 
                                 style="${isEvaluating ? 'border: 3px solid #000; scale: 1.2;' : ''}"></div>
                            <span class="led-label" style="${isEvaluating ? 'color: #000; font-weight: 800;' : ''}">${l}</span>
                            ${isEvaluating ? '<div style="width: 4px; height: 4px; background: var(--primary); border-radius: 50%; margin-top: 4px;"></div>' : ''}
                        </div>
                    `;
        }).join('')}
            </div>
            <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 700; display:flex; align-items:center; gap: 8px;">
                <div style="width: 8px; height: 8px; background: var(--accent); border-radius: 50%;"></div>
                ESTADO TERMINAL EN TIEMPO REAL
            </div>
        `;
        this.mount.appendChild(f);
    }
}

const app = new App();
window.app = app;
