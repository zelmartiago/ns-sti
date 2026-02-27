import { TREE } from './src/tree.js';

const CONFIG = {
    VERSION: '5.8.0 (Enterprise)',
    BRAND: 'Nuevo Siglo',
    MODELS: {
        F6600: { id: 'F6600', name: 'F6600', desc: '4 Antenas' },
        F1611A: { id: 'F1611A', name: 'F1611A', desc: '2 Antenas' }
    }
};

class App {
    constructor() {
        this.keyHandler = null;

        let saved = null;
        try {
            saved = localStorage.getItem('ns_sti_state');
        } catch {
            saved = null;
        }

        if (saved) {
            this.state = JSON.parse(saved);
            if (this.state.startTime) {
                this.state.startTime = new Date(this.state.startTime);
            } else {
                this.state.startTime = new Date();
            }
            if (!this.state.sessionId) {
                this.state.sessionId = this.generateSessionId();
            }
        } else {
            this.state = {
                node: '0.1',
                history: [],
                subscriberId: '',
                operatorEmail: '',
                model: null,
                mode: null,
                logs: [],
                startTime: new Date(),
                sessionId: this.generateSessionId()
            };
        }

        this.mount = document.getElementById('app');
        this.init();
    }

    generateSessionId() {
        return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }

    saveState() {
        try {
            localStorage.setItem(
                'ns_sti_state',
                JSON.stringify({
                    ...this.state,
                    // serializar fecha en ISO para re-hidratar de forma robusta
                    startTime: this.state.startTime.toISOString()
                })
            );
        } catch {
            // Si localStorage falla (modo privado / restricciones), simplemente no persistimos
        }
    }

    init() {
        this.render();
    }

    registerKeyHandler(step) {
        if (this.keyHandler) {
            window.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }

        if (!step || !Array.isArray(step.options) || step.options.length === 0) {
            return;
        }

        this.keyHandler = (event) => {
            const tag = (event.target && event.target.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            const num = Number(event.key);
            if (!Number.isInteger(num) || num < 1) return;

            const index = num - 1;
            const option = step.options[index];
            if (!option) return;

            event.preventDefault();
            this.dispatch('NAVIGATE', { id: option.next, label: option.label });
        };

        window.addEventListener('keydown', this.keyHandler);
    }

    copyToClipboard() {
        const area = document.getElementById('crm-area');
        if (!area) return;
        area.select();
        document.execCommand('copy');
        const btn = document.getElementById('copy-btn');
        if (!btn) return;
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
            const currentStep = TREE[this.state.node];
            const nextNodeId = typeof data === 'string' ? data : data.id;
            const choiceLabel = typeof data === 'object' ? data.label : null;
            const target = TREE[nextNodeId];
            if (!target) return;

            if (target.type === 'logic') {
                const redirect = target.condition(this.state);
                this.dispatch('NAVIGATE', redirect);
                return;
            }

            if (currentStep && choiceLabel && currentStep.question) {
                const time = new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const nodeId = currentStep.id || this.state.node;
                const led = currentStep.activeLed ? ` | LED: ${currentStep.activeLed}` : '';
                this.state.logs.push(
                    `[${time}] [${nodeId}]${led} ${currentStep.question} -> R: ${choiceLabel}`
                );
            } else if (target.case || target.title) {
                this.state.logs.push(
                    `${new Date().toLocaleTimeString()} - Iniciando: ${target.case || target.title}`
                );
            }

            this.state.history.push(this.state.node);
            this.state.node = nextNodeId;
        }

        if (action === 'SET_OPERATOR') {
            this.state.operatorEmail = data.trim().toLowerCase();
            const btn = document.getElementById('access-btn');
            const isValid = this.state.operatorEmail.length >= 2 && !/\s/.test(this.state.operatorEmail);
            if (btn) btn.disabled = !isValid;
            this.saveState();
            return;
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
                    const missing = [];
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

            this.saveState();
            return;
        }

        if (action === 'SET_TRIAGE') {
            this.state = { ...this.state, ...data };
            this.saveState();
            this.render();
            return;
        }

        if (action === 'BACK') {
            if (this.state.history.length > 0) {
                this.state.node = this.state.history.pop();
            }
        }

        if (action === 'RESET_CONFIRM') {
            if (this.state.node === '0.1' || this.state.node === '0.2') {
                this.dispatch('RESET');
                return;
            }
            if (
                window.confirm(
                    '¿Realmente desea volver al inicio? Se perderá el progreso del diagnóstico actual.'
                )
            ) {
                this.dispatch('RESET');
            }
            return;
        }

        if (action === 'ABORT_SESSION') {
            if (
                window.confirm(
                    'Se registrará el cierre abrupto de la sesión (llamada caída/desconexión). ¿Continuar?'
                )
            ) {
                this.dispatch('NAVIGATE', '6.4_ABORTED');
            }
            return;
        }

        if (action === 'RESET') {
            try {
                localStorage.removeItem('ns_sti_state');
            } catch {
                // ignorar
            }
            this.state = {
                node: '0.1',
                history: [],
                subscriberId: '',
                operatorEmail: '',
                model: null,
                mode: null,
                logs: [],
                startTime: new Date(),
                sessionId: this.generateSessionId()
            };
        }

        this.saveState();
        this.render();
    }

    render() {
        const step = TREE[this.state.node];
        this.mount.innerHTML = '';

        const header = document.createElement('header');
        header.className = 'app-header';
        header.innerHTML = `
            <div class="brand" style="cursor: pointer;" onclick="app.dispatch('RESET_CONFIRM')">
                <div class="brand-logo" title="Volver al inicio">NS</div>
                <div class="brand-text">
                    <h1>${CONFIG.BRAND}</h1>
                    <p>SOPORTE TÉCNICO INTERACTIVO</p>
                </div>
            </div>
            
            ${
                this.state.node !== '0.1'
                    ? `
                <div class="header-controls">
                    ${
                        this.state.node !== '0.2' && step.type !== 'final'
                            ? `
                        <button class="btn-abort" onclick="app.dispatch('ABORT_SESSION')">
                            <span>⚠️</span> ABORTAR LLAMADA
                        </button>
                    `
                            : ''
                    }
                    
                    <div class="status-monitor">
                        <div class="header-badges">
                            <span class="badge">ID: ${this.state.subscriberId || 'N/A'}</span>
                            <span class="badge">${this.state.model || '?'}</span>
                            <span class="badge">${this.state.mode || '?'}</span>
                        </div>
                        <div class="node-id">NODO: ${step.id}</div>
                    </div>
                </div>
            `
                    : '<div class="header-status"><span class="badge">SISTEMA LISTO</span></div>'
            }
        `;
        this.mount.appendChild(header);

        const main = document.createElement('main');
        main.className = 'app-main fade-in';

        if (this.state.node === '0.1') {
            this.renderStart(main, step);
            this.registerKeyHandler(null);
        } else if (this.state.node === '0.2') {
            this.renderTriage(main, step);
            this.registerKeyHandler(null);
        } else if (this.state.node === 'ESCALATE_VISIT') {
            this.renderEscalation(main, step);
            this.registerKeyHandler(step);
        } else if (step.type === 'final') {
            this.renderSummary(main, step);
            this.registerKeyHandler(null);
        } else {
            this.renderStep(main, step);
            this.registerKeyHandler(step);
        }

        this.mount.appendChild(main);
        this.renderTechnicalFooter(step);
    }

    renderStart(container, step) {
        const isValid = (this.state.operatorEmail || '').length >= 2 && !/\s/.test(
            this.state.operatorEmail
        );
        container.innerHTML = `
            <div class="view" style="text-align:center;">
                <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">${step.title}</h1>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">${step.desc}</p>
                
                <div class="input-group" style="margin-bottom: 0.5rem; max-width: 450px;">
                    <label class="input-label">Usuario Técnico</label>
                    <div style="display: flex; align-items: stretch; background: white; border-radius: var(--radius-md); border: 2px solid var(--border); overflow: hidden;">
                        <input type="text" id="op-user" 
                               style="border: none; padding: 0.75rem 1rem; font-size: 1.1rem; flex: 1; outline: none; font-weight: 600;"
                               placeholder="su_nombre" 
                               value="${this.state.operatorEmail || ''}"
                               oninput="app.dispatch('SET_OPERATOR', this.value)">
                        <div style="background: #f1f5f9; padding: 0.75rem 1rem; color: var(--secondary); font-weight: 700; display: flex; align-items: center; border-left: 2px solid var(--border);">
                            @nuevosiglo.com.uy
                        </div>
                    </div>
                </div>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 2.5rem;">Identifíquese con su nombre de usuario de red.</p>

                <div style="display: block;">
                    <button id="access-btn" class="btn btn-yes" style="margin: 0 auto;" 
                            ${!isValid ? 'disabled' : ''}
                            onclick="app.dispatch('NAVIGATE', {id: '${step.next}', label: 'Iniciar Triage'})">
                        Acceder al Panel
                    </button>
                 </div>
            </div>
        `;
    }

    renderTriage(container, step) {
        const missing = [];
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
                    <input type="text" id="sub-id" class="subscriber-input ${
                        !this.state.subscriberId ? 'required-hint' : ''
                    }" 
                           placeholder="Número de Contrato" 
                           value="${this.state.subscriberId || ''}"
                           oninput="app.dispatch('SET_SUBSCRIBER', this.value)">
                </div>

                <div class="card-grid">
                    ${Object.values(CONFIG.MODELS)
                        .map(
                            (hw) => `
                        <div class="selection-card ${
                            this.state.model === hw.id ? 'active' : ''
                        } ${!this.state.model ? 'required-hint' : ''}" 
                             onclick="app.dispatch('SET_TRIAGE', {model: '${hw.id}'})">
                            <strong style="font-size: 1.2rem;">${hw.name}</strong>
                            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">${
                                hw.desc
                            }</p>
                        </div>
                    `
                        )
                        .join('')}
                </div>

                <div class="card-grid" style="grid-template-columns: 1fr 1fr; margin-top: 1rem;">
                    <div class="selection-card ${
                        this.state.mode === 'Standard' ? 'active' : ''
                    } ${!this.state.mode ? 'required-hint' : ''}" 
                         onclick="app.dispatch('SET_TRIAGE', {mode: 'Standard'})">
                         <strong>STANDARD</strong>
                    </div>
                    <div class="selection-card ${
                        this.state.mode === 'Bridge' ? 'active' : ''
                    } ${!this.state.mode ? 'required-hint' : ''}" 
                         onclick="app.dispatch('SET_TRIAGE', {mode: 'Bridge'})">
                         <strong>BRIDGE</strong>
                    </div>
                </div>

                <div style="margin-top: 1rem; text-align:center;">
                    <div id="validation-msg" class="validation-msg">${
                        !isReady ? `Falta cargar: ${missing.join(', ')}` : ''
                    }</div>
                    <button id="triage-start-btn" class="btn btn-yes" style="margin: 0.5rem auto 0;"
                            ${!isReady ? 'disabled' : ''}
                            onclick="app.dispatch('NAVIGATE', {id: '${step.next}', label: 'Confirmar Datos'})">
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
                ${
                    step.action
                        ? `<div class="instruction-card"><p class="instruction-text">${step.action}</p></div>`
                        : ''
                }
                <div class="dialogue-bubble"><p class="dialogue-text">${step.question}</p></div>
                <div class="actions">
                    ${(step.options || [])
                        .map(
                            (opt, idx) => `
                        <button class="btn ${
                            opt.type === 'neutral'
                                ? 'btn-neutral'
                                : opt.type === 'success'
                                ? 'btn-yes'
                                : 'btn-no'
                        }" 
                                onclick="app.dispatch('NAVIGATE', {id: '${opt.next}', label: '${opt.label}'})">
                            <span>${opt.label}</span>
                            <span style="font-size:0.75rem; opacity:0.85;">[${
                                idx + 1
                            }]</span>
                        </button>
                    `
                        )
                        .join('')}
                </div>
                <button class="btn btn-back" style="margin: 0.5rem auto 0;" onclick="app.dispatch('BACK')">Volver</button>
            </div>
        `;
        container.appendChild(div);
    }

    renderEscalation(container, step) {
        let reason = 'Falla técnica no resuelta en Nivel 1.';
        for (let i = this.state.history.length - 1; i >= 0; i -= 1) {
            const prevId = this.state.history[i];
            const prevStep = TREE[prevId];
            if (prevStep && prevStep.objective) {
                reason = prevStep.objective;
                break;
            }
        }

        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
            <div class="diagnostic-box">
                <div class="case-indicator">
                    <span>${step.case}</span>
                    <span>PROTOCOLO AGOTADO</span>
                </div>
                
                <div class="instruction-card" style="border-style: solid; border-color: var(--secondary); background: rgba(var(--secondary-rgb), 0.03);">
                    <h3 style="color: var(--secondary); margin-bottom: 0.25rem; font-size: 0.8rem; font-weight: 800;">MOTIVO DE LA DERIVACIÓN:</h3>
                    <p class="instruction-text" style="font-size: 1.1rem;">${reason}</p>
                </div>

                <div class="dialogue-bubble">
                    <p class="dialogue-text">${step.question}</p>
                </div>

                <div class="actions">
                    ${(step.options || [])
                        .map(
                            (opt, idx) => `
                        <button class="btn btn-yes" onclick="app.dispatch('NAVIGATE', {id: '${opt.next}', label: '${opt.label}'})">
                            <span>${opt.label}</span>
                            <span style="font-size:0.75rem; opacity:0.85;">[${idx + 1}]</span>
                        </button>
                    `
                        )
                        .join('')}
                </div>
                <button class="btn btn-back" style="margin: 0.5rem auto 0;" onclick="app.dispatch('BACK')">Volver al diagnóstico</button>
            </div>
        `;
        container.appendChild(div);
    }

    renderSummary(container, step) {
        container.innerHTML = `
            <div class="view" style="justify-content: center;">
                <div class="title-section" style="margin-bottom: 0.5rem;">
                    <h2>${step.title}</h2>
                    <p>Reporte optimizado para CRM.</p>
                </div>
                
                <textarea id="crm-area" class="summary-area" aria-label="Resumen CRM STI" readonly>--- REPORTE STI ---
ID SESIÓN: ${this.state.sessionId}
ID ABONADO: ${this.state.subscriberId}
OPERADOR: ${this.state.operatorEmail}@nuevosiglo.com.uy
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
        const f = document.createElement('footer');
        f.className = 'app-footer';
        let leds = ['POWER', 'LOS', 'PON', 'INTERNET', 'WIFI', 'LAN'];
        if (this.state.mode === 'Bridge') {
            leds = leds.filter((l) => l !== 'INTERNET' && l !== 'WIFI');
        }

        let knownLeds = {};
        [...this.state.history, this.state.node].forEach((nodeId) => {
            const s = TREE[nodeId];
            if (s && s.leds) {
                knownLeds = { ...knownLeds, ...s.leds };
            }
        });

        f.innerHTML = `
            <div class="led-monitor">
                ${leds
                    .filter((l) => Object.prototype.hasOwnProperty.call(knownLeds, l.toLowerCase()))
                    .map((l) => {
                        const key = l.toLowerCase();
                        const status = knownLeds[key] || 'off';
                        const isEvaluating = step.activeLed === l;
                        return `
                        <div class="led-item">
                            <div class="led-circle ${status} ${isEvaluating ? 'active' : ''}"></div>
                            <span class="led-label" style="${
                                isEvaluating ? 'color: var(--primary); font-weight: 800;' : ''
                            }">${l}</span>
                        </div>
                    `;
                    })
                    .join('')}
            </div>
        `;
        this.mount.appendChild(f);
    }
}

const app = new App();
window.app = app;

