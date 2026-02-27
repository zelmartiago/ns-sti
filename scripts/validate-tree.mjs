import { TREE } from '../src/tree.js';

export function validateTree(tree) {
    const errors = [];
    const warnings = [];
    const nodeIds = new Set(Object.keys(tree));

    if (!nodeIds.has('0.1')) {
        errors.push('Falta nodo raíz "0.1".');
    }

    for (const [id, node] of Object.entries(tree)) {
        if (Array.isArray(node.options)) {
            node.options.forEach((opt, idx) => {
                if (!opt || typeof opt.next !== 'string') {
                    errors.push(`Nodo "${id}" opción #${idx + 1} no tiene un destino "next" de tipo string.`);
                } else if (!nodeIds.has(opt.next)) {
                    errors.push(
                        `Nodo "${id}" opción #${idx + 1} apunta a nodo inexistente "${opt.next}".`
                    );
                }
            });
        }
    }

    for (const [id, node] of Object.entries(tree)) {
        if (node.type === 'logic') {
            if (typeof node.condition !== 'function') {
                errors.push(`Nodo lógico "${id}" no tiene una función condition(state).`);
                // eslint-disable-next-line no-continue
                continue;
            }
            const sampleStates = [{ mode: 'Bridge' }, { mode: 'Standard' }];
            const producedTargets = new Set();
            for (const sample of sampleStates) {
                try {
                    const target = node.condition(sample);
                    if (typeof target === 'string') {
                        producedTargets.add(target);
                    }
                } catch {
                    errors.push(
                        `Nodo lógico "${id}" lanzó un error al evaluar condition(state) con sample=${JSON.stringify(
                            sample
                        )}.`
                    );
                }
            }
            if (producedTargets.size === 0) {
                errors.push(
                    `Nodo lógico "${id}" no devolvió destinos válidos para los estados de muestra.`
                );
            }
            for (const target of producedTargets) {
                if (!nodeIds.has(target)) {
                    errors.push(
                        `Nodo lógico "${id}" deriva a nodo inexistente "${target}" según condition(state).`
                    );
                }
            }
        }
    }

    if (nodeIds.has('0.1')) {
        const reachable = new Set();
        const queue = ['0.1'];

        while (queue.length > 0) {
            const currentId = queue.shift();
            if (reachable.has(currentId)) continue;
            reachable.add(currentId);

            const node = tree[currentId];
            if (!node) continue;

            if (typeof node.next === 'string') {
                queue.push(node.next);
            }
            if (Array.isArray(node.options)) {
                node.options.forEach((opt) => {
                    if (opt && typeof opt.next === 'string') {
                        queue.push(opt.next);
                    }
                });
            }
            if (node.type === 'logic' && typeof node.condition === 'function') {
                ['Bridge', 'Standard'].forEach((mode) => {
                    try {
                        const target = node.condition({ mode });
                        if (typeof target === 'string') {
                            queue.push(target);
                        }
                    } catch {
                        // ignorar aquí, ya se validó antes
                    }
                });
            }
        }

        for (const id of nodeIds) {
            if (!reachable.has(id)) {
                warnings.push(`Nodo "${id}" no es alcanzable desde el nodo raíz "0.1".`);
            }
        }
    }

    for (const [id, node] of Object.entries(tree)) {
        if (node.type === 'final' && Array.isArray(node.options) && node.options.length > 0) {
            errors.push(`Nodo final "${id}" no debería tener opciones configuradas.`);
        }
    }

    return { errors, warnings };
}

if (process.argv[1] && process.argv[1].endsWith('validate-tree.mjs')) {
    const { errors, warnings } = validateTree(TREE);
    if (errors.length > 0) {
        console.error('❌ Validación del árbol TREE falló:');
        errors.forEach((e) => console.error(' -', e));
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.warn('⚠️ Advertencias de validación TREE:');
        warnings.forEach((w) => console.warn(' -', w));
    }

    console.log('✅ Árbol TREE válido. Nodos totales:', Object.keys(TREE).length);
}

