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
                confirmedLeds: {},
                startTime: new Date(),
                sessionId: this.generateSessionId(),
                canUndo: false
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

    escapeAttr(str) {
        return String(str).replace(/'/g, "\\'");
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
        const btn = document.getElementById('copy-btn');

        const onSuccess = () => {
            if (!btn) return;
            const originalText = btn.innerHTML;
            btn.innerHTML = '¡Copiado!';
            btn.classList.add('copy-success');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copy-success');
            }, 2000);
        };

        const fallbackCopy = () => {
            area.select();
            try {
                document.execCommand('copy');
                onSuccess();
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(area.value)
                .then(onSuccess)
                .catch(fallbackCopy);
        } else {
            fallbackCopy();
        }
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
                this.dispatch('NAVIGATE', { id: redirect, _fromLogic: true });
                return;
            }

            // Si ambos caminos (WiFi y LAN) ya están diagnosticados,
            // saltar NAV_CONNECTIVITY directo al cierre satisfactorio (6.1).
            if (nextNodeId === 'NAV_CONNECTIVITY') {
                const knownLeds = this.getKnownLeds();
                const wifiDone = knownLeds['wifi'] === 'on-green';
                const lanDone = this.state.history.includes('6.0');
                if (wifiDone && lanDone) {
                    this.dispatch('NAVIGATE', '6.1');
                    return;
                }
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
                const chosenOption = (currentStep.options || []).find(
                    (o) => o.label === choiceLabel && o.next === nextNodeId
                );
                if (chosenOption && chosenOption.leds) {
                    this.state.confirmedLeds = {
                        ...this.state.confirmedLeds,
                        ...chosenOption.leds
                    };
                }
            } else if (!data._fromLogic && (target.case || target.title)) {
                this.state.logs.push(
                    `${new Date().toLocaleTimeString()} - Iniciando: ${target.case || target.title}`
                );
            }

            this.state.history.push(this.state.node);
            this.state.node = nextNodeId;
            this.state.canUndo = true;
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
            const btn = document.getElementById('triage-next-btn');

            const isReady = !!this.state.subscriberId.trim();
            if (btn) btn.disabled = !isReady;

            this.saveState();
            return;
        }

        if (action === 'SET_TRIAGE_MODEL') {
            this.state.model = data;
            this.saveState();

            const btn = document.getElementById('triage-next-btn');
            if (btn) btn.disabled = !this.state.model;

            document.querySelectorAll('.form-triage-model').forEach(el => {
                if (el.dataset.modelId === this.state.model) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
            return;
        }

        if (action === 'SET_TRIAGE_MODE') {
            this.state.mode = data;
            this.saveState();

            const btn = document.getElementById('triage-start-btn');
            if (btn) btn.disabled = !this.state.mode;

            document.querySelectorAll('.form-triage-mode').forEach(el => {
                if (el.dataset.modeId === this.state.mode) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
            return;
        }

        if (action === 'BACK') {
            if (this.state.canUndo && this.state.history.length > 0) {
                this.state.node = this.state.history.pop();
                this.state.canUndo = false;
                this.state.logs.push(`${new Date().toLocaleTimeString()} - ⏪ Deshizo el último paso`);
            }
        }

        if (action === 'RESET_CONFIRM') {
            if (['0.1', '0.2', '0.3', '0.4'].includes(this.state.node)) {
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

        if (action === 'JUMP_TO_LED') {
            const ledStartNodes = {
                'power': '1.0',
                'los': '2.0',
                'pon': '3.0',
                'internet': '4.0',
                'wifi': '5.0',
                'lan': '6.0'
            };

            const targetNodeId = ledStartNodes[data.toLowerCase()];
            if (!targetNodeId) return;

            // Only allow jumping back if we have passed or are at that node in history
            const historyIndex = this.state.history.indexOf(targetNodeId);

            // If the node is not in history but is the current node, we just reset it practically
            if (historyIndex === -1 && this.state.node !== targetNodeId) {
                return;
            }

            if (
                window.confirm(
                    `¿Desea volver al diagnóstico de la luz ${data}? Se perderá el progreso posterior.`
                )
            ) {
                if (historyIndex !== -1) {
                    // Trim history up to the point we are jumping back to
                    this.state.history = this.state.history.slice(0, historyIndex);
                }

                // Clear any confirmed LEDs that were set after this point.
                // Rebuilding confirmed LEDs based on the new truncated history:
                let rebuiltConfirmed = {};
                this.state.history.forEach(nodeId => {
                    const step = TREE[nodeId];
                    // Also parse logs to find the chosen option to restore its specific child leds if needed?
                    // A simpler robust way: just clear future manual confirmed state, rely on getKnownLeds defaults for past.
                });
                // We'll reset confirmedLeds to empty, getKnownLeds will re-fetch based on the active node and history.
                this.state.confirmedLeds = {};

                this.state.node = targetNodeId;
                this.state.canUndo = false;
                this.state.logs.push(`${new Date().toLocaleTimeString()} - ⏪ Volvió a diagnóstico de LED ${data}`);

                this.saveState();
                this.render();
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
                confirmedLeds: {},
                startTime: new Date(),
                sessionId: this.generateSessionId(),
                canUndo: false
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
            
            ${this.state.node !== '0.1'
                ? `
                <div class="header-controls">
                    ${!['0.2', '0.3', '0.4'].includes(this.state.node) && step.type !== 'final'
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
            this.renderTriageSubscriber(main, step);
            this.registerKeyHandler(null);
        } else if (this.state.node === '0.3') {
            this.renderTriageModel(main, step);
            this.registerKeyHandler(null);
        } else if (this.state.node === '0.4') {
            this.renderTriageMode(main, step);
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

    renderTriageSubscriber(container, step) {
        const isReady = !!(this.state.subscriberId || '').trim();
        container.innerHTML = `
            <div class="view">
                <div class="title-section">
                    <h2>${step.title}</h2>
                    <p>${step.desc}</p>
                </div>

                <div class="input-group">
                    <label class="input-label">Identificador del Abonado</label>
                    <input type="text" id="sub-id" class="subscriber-input" 
                           placeholder="Número de Contrato" 
                           value="${this.state.subscriberId || ''}"
                           oninput="app.dispatch('SET_SUBSCRIBER', this.value)">
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center;">Por favor, ingrese el número de contrato para continuar.</p>
                </div>

                <div style="margin-top: 1.5rem; text-align:center;">
                    <button id="triage-next-btn" class="btn btn-yes" style="margin: 0.5rem auto 0;"
                            ${!isReady ? 'disabled' : ''}
                            onclick="app.dispatch('NAVIGATE', {id: '${step.next}', label: 'Continuar'})">
                        Continuar
                    </button>
                </div>
                ${this.state.canUndo ? `<button class="btn btn-back" style="margin: 0.5rem auto 0;" onclick="app.dispatch('BACK')">Deshacer Último Paso</button>` : ''}
            </div>
        `;
    }

    renderTriageModel(container, step) {
        const isReady = !!this.state.model;
        container.innerHTML = `
            <div class="view">
                <div class="title-section">
                    <h2>${step.title}</h2>
                    <p>${step.desc}</p>
                </div>

                <div class="card-grid">
                    ${Object.values(CONFIG.MODELS)
                .map(
                    (hw) => `
                        <div class="selection-card form-triage-model ${this.state.model === hw.id ? 'active' : ''
                        }" data-model-id="${hw.id}" 
                             onclick="app.dispatch('SET_TRIAGE_MODEL', '${hw.id}')">
                            <strong style="font-size: 1.2rem;">${hw.name}</strong>
                            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">${hw.desc
                        }</p>
                        </div>
                    `
                )
                .join('')}
                </div>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center;">Seleccione el equipo correspondiente para avanzar.</p>

                <div style="margin-top: 1.5rem; text-align:center;">
                    <button id="triage-next-btn" class="btn btn-yes" style="margin: 0.5rem auto 0;"
                            ${!isReady ? 'disabled' : ''}
                            onclick="app.dispatch('NAVIGATE', {id: '${step.next}', label: 'Continuar'})">
                        Continuar
                    </button>
                </div>
                ${this.state.canUndo ? `<button class="btn btn-back" style="margin: 0.5rem auto 0;" onclick="app.dispatch('BACK')">Deshacer Último Paso</button>` : ''}
            </div>
        `;
    }

    renderTriageMode(container, step) {
        const isReady = !!this.state.mode;
        container.innerHTML = `
            <div class="view">
                <div class="title-section">
                    <h2>${step.title}</h2>
                    <p>${step.desc}</p>
                </div>

                <div class="card-grid" style="grid-template-columns: 1fr 1fr; margin-top: 1rem;">
                    <div class="selection-card form-triage-mode ${this.state.mode === 'Standard' ? 'active' : ''
            }" data-mode-id="Standard"
                         onclick="app.dispatch('SET_TRIAGE_MODE', 'Standard')">
                         <strong>STANDARD</strong>
                    </div>
                    <div class="selection-card form-triage-mode ${this.state.mode === 'Bridge' ? 'active' : ''
            }" data-mode-id="Bridge"
                         onclick="app.dispatch('SET_TRIAGE_MODE', 'Bridge')">
                         <strong>BRIDGE</strong>
                    </div>
                </div>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center;">Seleccione el modo del servicio para comenzar.</p>

                <div style="margin-top: 1.5rem; text-align:center;">
                    <button id="triage-start-btn" class="btn btn-yes" style="margin: 0.5rem auto 0;"
                            ${!isReady ? 'disabled' : ''}
                            onclick="app.dispatch('NAVIGATE', {id: '${step.next}', label: 'Comenzar Diagnóstico'})">
                        Comenzar Diagnóstico
                    </button>
                </div>
                ${this.state.canUndo ? `<button class="btn btn-back" style="margin: 0.5rem auto 0;" onclick="app.dispatch('BACK')">Deshacer Último Paso</button>` : ''}
            </div>
        `;
    }

    renderStep(container, step) {
        const isNavConnectivity = this.state.node === 'NAV_CONNECTIVITY';
        const knownLeds = isNavConnectivity ? this.getKnownLeds() : {};
        const wifiDone = isNavConnectivity && knownLeds['wifi'] === 'on-green';
        const lanDone = isNavConnectivity && this.state.history.includes('6.0');
        const DONE_FOR_OPTION = { '5.0': wifiDone, '6.0': lanDone };

        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
            <div class="diagnostic-box">
                <div class="case-indicator">
                    <span>${step.case || 'DIAGNÓSTICO'}</span>
                    <span>OBJETIVO: ${step.objective || 'N/A'}</span>
                </div>
                ${step.action
                ? `<div class="instruction-card"><p class="instruction-text">${step.action}</p></div>`
                : ''
            }
                <div class="dialogue-bubble"><p class="dialogue-text">${step.question}</p></div>
                <div class="actions">
                    ${(step.options || [])
                .map((opt, idx) => {
                    const isDone = isNavConnectivity && !!DONE_FOR_OPTION[opt.next];

                    if (isDone) {
                        return `
                        <button class="btn btn-done" disabled title="Diagnóstico completado">
                            <span>✔ ${opt.label}</span>
                            <span style="font-size:0.7rem; opacity:0.75;">[OK]</span>
                        </button>`;
                    }

                    return `
                        <button class="btn ${opt.type === 'neutral'
                            ? 'btn-neutral'
                            : opt.type === 'success'
                                ? 'btn-yes'
                                : 'btn-no'
                        }" 
                                onclick="app.dispatch('NAVIGATE', {id: '${opt.next}', label: '${this.escapeAttr(opt.label)}'})">
                            <span>${opt.label}</span>
                            <span style="font-size:0.75rem; opacity:0.85;">[${idx + 1}]</span>
                        </button>
                    `;
                })
                .join('')}
                </div>
                ${this.state.canUndo ? `<button class="btn btn-back" style="margin: 0.5rem auto 0;" onclick="app.dispatch('BACK')">Deshacer Último Paso</button>` : ''}
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
                        <button class="btn btn-yes" onclick="app.dispatch('NAVIGATE', {id: '${opt.next}', label: '${this.escapeAttr(opt.label)}'})">
                            <span>${opt.label}</span>
                            <span style="font-size:0.75rem; opacity:0.85;">[${idx + 1}]</span>
                        </button>
                    `
                )
                .join('')}
                </div>
                ${this.state.canUndo ? `<button class="btn btn-back" style="margin: 0.5rem auto 0;" onclick="app.dispatch('BACK')">Deshacer Último Paso</button>` : ''}
            </div>
        `;
        container.appendChild(div);
    }

    renderSummary(container, step) {
        const closureNodeKey = this.state.history[this.state.history.length - 1] || this.state.node;
        const closureNode = TREE[closureNodeKey];
        const closureId = (closureNode && closureNode.id) ? closureNode.id : closureNodeKey;

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
ID CIERRE: ${closureId}
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

    getKnownLeds() {
        let knownLeds = {};
        [...this.state.history, this.state.node].forEach((nodeId) => {
            const s = TREE[nodeId];
            if (s && s.leds) {
                knownLeds = { ...knownLeds, ...s.leds };
            }
        });
        if (this.state.confirmedLeds) {
            knownLeds = { ...knownLeds, ...this.state.confirmedLeds };
        }
        return knownLeds;
    }

    renderTechnicalFooter(step) {
        const f = document.createElement('footer');
        f.className = 'app-footer';
        let leds = ['POWER', 'LOS', 'PON', 'INTERNET', 'WIFI', 'LAN'];
        if (this.state.mode === 'Bridge') {
            leds = leds.filter((l) => l !== 'INTERNET' && l !== 'WIFI');
        }

        const knownLeds = this.getKnownLeds();

        const ledStartNodes = {
            'power': '1.0',
            'los': '2.0',
            'pon': '3.0',
            'internet': '4.0',
            'wifi': '5.0',
            'lan': '6.0'
        };

        f.innerHTML = `
            <div class="led-monitor">
                ${leds
                .filter((l) => Object.prototype.hasOwnProperty.call(knownLeds, l.toLowerCase()))
                .map((l) => {
                    const key = l.toLowerCase();
                    const status = knownLeds[key] || 'off';
                    const isEvaluating = step.activeLed === l;
                    const canJump = this.state.history.includes(ledStartNodes[key]) || this.state.node === ledStartNodes[key];
                    const onClick = canJump && !isEvaluating ? `onclick="app.dispatch('JUMP_TO_LED', '${l}')"` : '';

                    return `
                        <div class="led-item ${canJump && !isEvaluating ? 'led-clickable' : ''}" ${onClick} title="${canJump && !isEvaluating ? 'Volver a diagnóstico de esta luz' : ''}">
                            <div class="led-circle ${status} ${isEvaluating ? 'active' : ''}"></div>
                            <span class="led-label" style="${isEvaluating ? 'color: var(--primary); font-weight: 800;' : ''
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

