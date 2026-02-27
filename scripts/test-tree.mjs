import { TREE } from '../src/tree.js';
import { validateTree } from './validate-tree.mjs';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testModeBifurcation() {
    const logicNode = TREE.MODE_BIFURCATION;
    assert(
        logicNode && typeof logicNode.condition === 'function',
        'MODE_BIFURCATION debe existir y exponer condition(state).'
    );

    const bridgeTarget = logicNode.condition({ mode: 'Bridge' });
    const standardTarget = logicNode.condition({ mode: 'Standard' });

    assert(
        bridgeTarget === 'CASE_BRIDGE',
        `MODE_BIFURCATION con mode="Bridge" debe derivar a CASE_BRIDGE, obtuvo "${bridgeTarget}".`
    );
    assert(
        standardTarget === '4.0',
        `MODE_BIFURCATION con mode="Standard" debe derivar a "4.0", obtuvo "${standardTarget}".`
    );
}

function run() {
    const { errors } = validateTree(TREE);
    assert(errors.length === 0, `validateTree() reportó errores: ${errors.join(' | ')}`);

    testModeBifurcation();

    console.log('✅ Tests básicos de TREE ejecutados correctamente.');
}

run();


