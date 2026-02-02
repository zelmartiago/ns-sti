/**
 * NS-STI Final High-Fidelity Diagnostic Engine
 * v2.0.0 - Case 6 & Final Closing Protocol (Gold Master)
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
        title: 'Identificación del Hardware',
        procedure: 'Identificación del modelo del equipo',
        objective: 'Ayudar al cliente a identificar su equipo si no conoce el modelo.',
        references: [
            { label: 'Modelo ZTE F6600', text: 'Cuatro antenas redondas.' },
            { label: 'Modelo ZTE F1611A', text: 'Dos antenas anchas y planas.' }
        ],
        question: '“Para poder asistirlo correctamente, ¿podría indicarme el modelo del equipo que tiene instalado en su domicilio?”',
        hardwareOptions: [
            { id: 'zte_f6600', label: 'Modelo F6600', nextStep: '0.3' },
            { id: 'zte_f1611a', label: 'Modelo F1611A', nextStep: '0.3' }
        ]
    },
    '0.3': {
        id: '0.3',
        title: 'Identificación del Modo de Conexión',
        procedure: 'Identificación del Modo',
        objective: 'Diferenciación entre configuración router (Standard) o puente (Bridge).',
        references: [
            { label: 'Modo Standard', text: 'El equipo de la empresa opera como router (múltiples puertos LAN ocupados, Wi-Fi activo).' },
            { label: 'Modo Bridge', text: 'El cliente usa su propio router (Solo puerto LAN 1 ocupado, luces Wi-Fi del módem apagadas).' }
        ],
        question: '“¿Usted utiliza su propio router para el Wi-Fi (modo Router), o usa el equipo que le entregamos de Nuevo Siglo (modo Bridge)?”',
        options: [
            { label: 'Modo Standard', nextStep: '1.0', metadata: { mode: 'Standard' } },
            { label: 'Modo Bridge', nextStep: 'bridge_info', metadata: { mode: 'Bridge' } }
        ]
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
        objective: 'Verificar que el botón de encendido/apagado del módem funcione correctamente y permita energizar el equipo.',
        action: 'Indica al cliente que presione y suelte el botón rojo ON/OFF ubicado en la parte trasera del módem. Explica que, al hacerlo, la luz POWER debería encenderse y, luego de unos segundos, deberían encenderse las demás luces del panel frontal.',
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
        objective: 'Asegurar que el módem reciba energía eléctrica de forma estable y correcta.',
        action: 'Indica al cliente que revise ambas conexiones del cable de alimentación: en el módem y en el tomacorriente.<br><strong>Extremo del módem:</strong> “Desconecte el cable negro del puerto Power y vuelva a conectarlo firmemente.”<br><strong>Extremo del transformador:</strong> “Verifique que el otro extremo esté correctamente insertado en la toma de corriente.”',
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
        objective: 'Confirmar que el tomacorriente suministra energía correctamente.',
        action: 'Pide al cliente desconectar el transformador del módem y conectar otro dispositivo (por ejemplo, una lámpara o un cargador) para comprobar si hay energía. Si el dispositivo no enciende, solicita que conecte el módem en otro tomacorriente —preferiblemente de otra habitación— y observe las luces del equipo.',
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
        objective: 'Determinar si la falla proviene del transformador del módem.',
        action: 'Explica al cliente: “Vamos a revisar si el problema es el transformador del módem. Si tiene el servicio de cable o un dispositivo MESH, su transformador es compatible.” Indica al cliente: “Desconecte el transformador del módem y conecte el transformador del decodificador o del Mesh en el mismo lugar.”',
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
        objective: 'Confirmar que el patchcord de fibra esté en óptimas condiciones.',
        action: '<strong>Explica al cliente:</strong> “Vamos a revisar las condiciones del patchcord de fibra (cable amarillo con punta verde).” Indica que verifique que el cable no esté doblado, forzado, presionado, cortado ni dañado.',
        question: '¿Se apagó la luz LED LOS después de revisar el patchcord?',
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
        title: 'Reconexión del patchcord en el módem',
        procedure: 'Caso 2: LOS > Resolución paso 2',
        objective: 'Verificar que el patchcord esté correctamente conectado al módem.',
        action: '<strong>Indica al cliente:</strong> “Desconecte y vuelva a conectar el patchcord de fibra (cable amarillo con punta verde) en el módem. Está en la parte inferior del equipo.”<br><strong>Explica cómo desconectar:</strong> agarre la punta verde y tire con cuidado.<br><strong>Explica cómo reconectar:</strong> inserte el cable hasta que sienta un click.',
        question: '“¿Se apagó la luz LED LOS después de reconectar el patchcord?”',
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
        title: 'Reconexión del patchcord en la roseta de NS',
        procedure: 'Caso 2: LOS > Resolución paso 3',
        objective: 'Confirmar que el patchcord de fibra esté correctamente conectado a la roseta de Nuevo Siglo en la pared.',
        action: '<strong>Instrucciones:</strong> “Desconecte y vuelva a conectar el patchcord de fibra (cable amarillo con punta verde) en la roseta de la pared. Siga el cable hasta su terminación.”<br><strong>Explica cómo identificar la roseta de NS:</strong> tiene un sticker con el logo en la parte frontal.<br><strong>Aclaración:</strong> si hay dos rosetas (NS y servicio previo), asegúrese de usar la roseta de NS.',
        question: '“¿Se apagó la luz LED LOS después de reconectar el patchcord en la roseta?”',
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
        title: 'Fallas en el encendido / Falla en LOS',
        procedure: 'Coordinar visita técnica',
        objective: 'Derivar el caso con Despacho.',
        instruction: 'En caso de tener fallas en el encendido o en la señal de fibra derivar el caso con Despacho.',
        action: 'Preparar y registrar la información relevante de la atención durante la llamada.',
        question: '',
        options: [
            { label: 'Coordinar visita técnica', nextStep: '0.1' }
        ]
    },
    '3.1': {
        id: '3.1',
        title: 'Verificación de luz LED PON',
        procedure: 'Caso 3: PON > Validación de Estado',
        objective: 'confirmar que el módem/ONT está sincronizado con la red FTTH de Nuevo Siglo.',
        instruction: '<strong>Interpretación de estados:</strong><br><strong>Encendida y fija:</strong> la conexión con la red óptica es correcta.<br><strong>Apagada o parpadeando:</strong> puede existir un problema en la señal óptica o en la conexión del ONT.',
        question: '“¿La luz que dice \'PON\' se encuentra encendida fija o está parpadeando?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'pon_check_images',
        leds: { power: 'green', los: 'off', pon: 'eval', internet: 'off' },
        activeLED: 'PON',
        options: [
            { label: 'Fija', nextStep: '4.1' },
            { label: 'Parpadea / Apagada', nextStep: '3.2' }
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
        title: 'Reinicio del módem',
        procedure: 'Caso 3: PON > Resolución paso 1',
        objective: 'reiniciar el módem para restablecer la conexión FTTH.',
        action: '<strong>Indica al cliente:</strong> “Presione el botón rojo ON/OFF en la parte trasera para apagar y volver a encender el equipo.”<br><strong>Alternativa:</strong> desconectar y volver a conectar el cable de energía del módem.<br>Espere 30 segundos después del reinicio para que el módem se estabilice.',
        question: '“¿Luego del reinicio, la luz LED PON quedó encendida y fija?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'pon_restart_images',
        leds: { power: 'green', los: 'off', pon: 'eval', internet: 'off' },
        activeLED: 'PON',
        options: [
            { label: 'No', nextStep: '3.3' },
            { label: 'Si', nextStep: '4.1' }
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
        title: 'Escalamiento No Disruptivo (Ledefyl)',
        procedure: 'Caso 3: PON > Resolución paso 2',
        objective: 'Coordinar acciones de reaprovisionamiento lógico.',
        instruction: 'Si tras el reinicio el LED PON sigue parpadeando, el agente debe solicitar a Ledefyl la ejecución de un Reaprovisionamiento del equipo en el sistema.',
        action: 'Solicite reaprovisionamiento a Ledefyl y espere la confirmación de ejecución.',
        question: '¿Se confirmó la ejecución del reaprovisionamiento?',
        leds: { power: 'green', los: 'off', pon: 'eval', internet: 'off' },
        activeLED: 'PON',
        options: [
            { label: 'Confirmado', nextStep: '3.4' }
        ]
    },
    '3.4': {
        id: '3.4',
        title: 'Verificación Post-Reaprovisionamiento',
        procedure: 'Caso 3: PON > Resolución paso 3',
        objective: 'Validar si la acción remota tuvo éxito.',
        question: '“¿Luego del ajuste que realizamos, la luz PON quedó fija?”',
        leds: { power: 'green', los: 'off', pon: 'eval', internet: 'green' },
        activeLED: 'PON',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_pon' },
            { label: 'Si', nextStep: '4.1' }
        ]
    },
    'coordinar_visita_pon': {
        id: 'coordinar_visita_pon',
        title: 'Coordinar visita técnica por LED PON',
        procedure: 'Escalamiento por falla lógica',
        objective: 'Derivar el caso a segundo nivel.',
        instruction: 'Si el reaprovisionamiento de Ledefyl no soluciona el parpadeo del LED PON, se debe derivar el caso a segundo nivel para una visita técnica en domicilio por falla de sincronismo.',
        action: '<strong>IMPORTANTE:</strong> Es obligatorio dejar constancia en el ticket de que se realizó el paso por Ledefyl sin éxito.',
        question: '',
        options: [
            { label: 'Finalizar y Registrar Ticket', nextStep: '0.1' }
        ]
    },
    '4.1': {
        id: '4.1',
        title: 'Verificación de luz LED INTERNET',
        procedure: 'Caso 4: INTERNET > Validación Inicial',
        objective: 'confirmar que el servicio de internet esté activo en el módem mediante la comprobación de la sesión PPPoE.',
        instruction: '<strong>Interpretación de estados:</strong><br><strong>Encendida o parpadeando:</strong> el módem tiene conexión activa a internet.<br><strong>Apagada:</strong> puede haber un problema de aprovisionamiento, sincronización o red.',
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
        title: 'Verificación del estado financiero comercial',
        procedure: 'Resolución caso INTERNET - Paso 1',
        objective: 'comprobar que el servicio de Internet del cliente no esté suspendido por impagos.',
        action: '<strong>Operador:</strong> revisar en el sistema comercial si existen suspensiones por impagos.<br><strong>Cliente:</strong> usar manejo de la espera mientras se verifica la información.',
        question: '“¿El cliente se encuentra al día con sus pagos y el servicio activo?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'commercial_check_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'eval' },
        activeLED: 'INTERNET',
        options: [
            { label: 'Si (Al día)', nextStep: '4.2_restart' },
            { label: 'No (Suspendido)', nextStep: 'error_commercial_debt' }
        ]
    },
    'commercial_check_images': {
        id: 'commercial_check_images',
        title: 'Guía Visual: Estado Comercial',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_4_3_commercial_check.png']
    },
    'error_commercial_debt': {
        id: 'error_commercial_debt',
        title: 'ERROR: Cliente suspendido por estado comercial',
        procedure: 'Cierre por deuda',
        objective: 'Finalizar diagnóstico por suspensión comercial.',
        headerInfo: 'Servicio suspendido',
        question: 'Se debe informar al cliente sobre su situación comercial y transferir al área correspondiente.',
        options: [
            { label: 'Finalizar diagnóstico', nextStep: '0.1' }
        ]
    },
    '4.2_restart': {
        id: '4.2_restart',
        title: 'Reinicio del módem para verificar INTERNET',
        procedure: 'Resolución caso INTERNET - Paso 2',
        objective: 'reiniciar el módem para restablecer la conexión de Internet.',
        action: '<strong>Indica al cliente:</strong> “Presione el botón rojo ON/OFF en la parte trasera para apagar y volver a encender el equipo.”<br><strong>Alternativa:</strong> desconectar y volver a conectar el cable de energía del módem.<br>Espere 30 segundos después del reinicio para que el módem se estabilice.',
        question: '“¿La luz LED INTERNET está encendida o parpadeando?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'internet_restart_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'eval' },
        activeLED: 'INTERNET',
        options: [
            { label: 'No', nextStep: '4.2_ledefyl' },
            { label: 'Si', nextStep: '4.3' }
        ]
    },
    'internet_restart_images': {
        id: 'internet_restart_images',
        title: 'Guía Visual: Reinicio INTERNET',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_4_2_restart_internet.png']
    },
    '4.2_ledefyl': {
        id: '4.2_ledefyl',
        title: 'Verificación de discado PPPoE',
        procedure: 'Resolución caso INTERNET - Paso 3',
        objective: 'Corregir posibles errores de credenciales o colgado de sesión en el BRAS.',
        instruction: 'Solicite a Ledefyl la reconfiguración del discado y espere la confirmación.',
        action: '<strong>Operador:</strong> llamar al 26262680 (Ledefyl) y comunicarle:<br><div style="font-style: italic; margin-top: 10px; border-left: 3px solid #ccc; padding-left: 10px;">“El servicio es el número xx-xx, LED INTERNET no enciende, LED POWER está encendida, LED LOS está apagada y LED PON está encendida. Por favor realicen una reconfiguración de discado PPPoE”</div>',
        question: '',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'ledefyl_call_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'eval' },
        activeLED: 'INTERNET',
        options: [
            { label: 'Continuar', nextStep: '4.2_verify' }
        ]
    },
    'ledefyl_call_images': {
        id: 'ledefyl_call_images',
        title: 'Guía Visual: Llamada a Ledefyl',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_4_2_ledefyl_call.png']
    },
    '4.2_verify': {
        id: '4.2_verify',
        title: 'Post verificación de discado PPPoE',
        procedure: 'Resolución caso INTERNET - Paso 3 (cont.)',
        objective: 'comprobar las credenciales del discado PPPoE fueron reacomodadas en el procedimiento previo.',
        question: '“¿La luz LED INTERNET quedó encendida o parpadeando?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'pppoe_verify_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'eval' },
        activeLED: 'INTERNET',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_internet' },
            { label: 'Si', nextStep: '4.3' }
        ]
    },
    'pppoe_verify_images': {
        id: 'pppoe_verify_images',
        title: 'Guía Visual: Post Verificación PPPoE',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_4_2_verify_pppoe.png']
    },
    '4.3': {
        id: '4.3',
        title: 'Comprobación de Navegación Inicial',
        procedure: 'Caso 4: INTERNET > Validación de Sesión',
        objective: 'Asegurar que el flujo de datos sea efectivo antes de pasar a la red local.',
        action: 'Pedir al cliente que intente ingresar a un sitio web de prueba.',
        question: '“¿Logra navegar correctamente en sus dispositivos tras el ajuste de sesión?”',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green' },
        activeLED: 'INTERNET',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_internet' },
            { label: 'Si', nextStep: '5.0' }
        ]
    },
    'coordinar_visita_internet': {
        id: 'coordinar_visita_internet',
        title: 'Fallas en el discado',
        procedure: 'Coordinar visita técnica',
        objective: 'Cierre por falla en INTERNET',
        instruction: 'En caso de tener fallas en el discado de internet, estos son los teléfonos de contacto con despacho.',
        action: 'Marcar caso como: "Falla de Navegación tras ajuste lógico".',
        question: '',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'internet_escalation_images',
        options: [
            { label: 'Coordinar visita técnica', nextStep: '0.1' }
        ]
    },
    'internet_escalation_images': {
        id: 'internet_escalation_images',
        title: 'Guía Visual: Fallas en el discado',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_internet_escalation_v2.png']
    },
    '5.0': {
        id: '5.0',
        title: 'Identificación del tipo de conexión del dispositivo',
        procedure: 'Selección Case 5 | Case 6',
        objective: 'determinar si el dispositivo está conectado de forma inalámbrica (WLAN/Wi-Fi) o por cable (LAN).',
        references: [
            { label: 'Conexión LAN', text: 'dispositivo conectado directamente al módem con un cable Ethernet.' },
            { label: 'Conexión WLAN/Wi-Fi', text: 'dispositivo conectado de forma inalámbrica al módem o router.' }
        ],
        question: '“¿El dispositivo que desea revisar está conectado por Wi-Fi o por cable de red?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'connection_type_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green', wifi: 'eval', lanx: 'eval' },
        activeLED: 'WIFI',
        options: [
            { label: 'WIFI', nextStep: '5.1' },
            { label: 'LAN', nextStep: '6.0_lan' }
        ]
    },
    'connection_type_images': {
        id: 'connection_type_images',
        title: 'Guía Visual: Tipo de Conexión',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_connection_type.png']
    },
    '5.1': {
        id: '5.1',
        title: 'Verificación de luz LED Wi-Fi',
        procedure: 'Diagnóstico de LED Caso 5: WIFI',
        objective: 'confirmar que la red inalámbrica esté activa en el módem.',
        references: [
            { label: 'Luz encendida', text: 'indica que la red Wi-Fi del módem está activa y disponible para los dispositivos.' },
            { label: 'Luz apagada o parpadeando', text: 'puede haber un problema de configuración o hardware del Wi-Fi.' }
        ],
        question: '“¿Se encuentran encendidas las luces que dicen \'2.4G\' o \'5G\' en el frente del equipo?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'wifi_check_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green', wifi: 'eval' },
        activeLED: 'WIFI',
        options: [
            { label: 'No', nextStep: '5.2' },
            { label: 'Si', nextStep: '5.3' }
        ]
    },
    'wifi_check_images': {
        id: 'wifi_check_images',
        title: 'Guía Visual: LED Wi-Fi',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_5_1_wifi_check.png']
    },
    '5.2': {
        id: '5.2',
        title: 'Activación del Wi-Fi mediante botón WPS/Wi-Fi',
        procedure: 'Resolución caso WIFI - Paso 1',
        objective: 'encender la red Wi-Fi del módem usando el botón WPS/Wi-Fi.',
        action: '<strong>Indica al cliente:</strong> “Presione el botón blanco WPS/Wi-Fi en el lateral de la terminal por un segundo.”',
        question: '“¿Luego de presionar el botón, la luz LED Wi-Fi se encendió?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'wps_button_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green', wifi: 'eval' },
        activeLED: 'WIFI',
        options: [
            { label: 'No', nextStep: '5.2_l3_activation' },
            { label: 'Si', nextStep: '5.3' }
        ]
    },
    'wps_button_images': {
        id: 'wps_button_images',
        title: 'Guía Visual: Botón WPS',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_5_2_wps_button.png']
    },
    '5.2_l3_activation': {
        id: '5.2_l3_activation',
        title: 'Activación remota L3',
        procedure: 'Caso 5: Wi-Fi > Gestión remota L3',
        objective: 'Solicitar la activación remota de la radio Wi-Fi mediante consola de administración.',
        instruction: 'Solicite a Soporte Nivel 3 el encendido forzado de los módulos inalámbricos.',
        action: 'Consulte con L3 para la activación vía TR-069 o consola.',
        question: '¿Se confirmó la activación remota?',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green', wifi: 'eval' },
        activeLED: 'WIFI',
        options: [
            { label: 'Confirmado', nextStep: '5.3' },
            { label: 'Falla Técnica', nextStep: 'coordinar_visita_wifi' }
        ]
    },
    '5.3': {
        id: '5.3',
        title: 'Configuración de Credenciales (SSID/KEY)',
        procedure: 'Caso 5: Wi-Fi > Gestión remota L3',
        objective: 'Asegurar que los parámetros de red sean correctos.',
        instruction: 'Si las luces encienden pero el cliente no puede conectar, solicitar el seteo de credenciales de Wi-Fi.',
        action: 'Coordinar con L3 el cambio de SSID y Password si es necesario.',
        question: '“¿Logra conectar sus dispositivos con el nombre de red y contraseña confirmados?”',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green', wifi: 'green' },
        activeLED: 'WIFI',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_wifi' },
            { label: 'Si', nextStep: '6.1' }
        ]
    },
    'coordinar_visita_wifi': {
        id: 'coordinar_visita_wifi',
        title: 'Falla Técnica por Wi-Fi',
        procedure: 'Escalamiento',
        objective: 'Cierre por falla de radiofrecuencia',
        instruction: 'Si la activación L3 falla, se escala por posible daño en el módulo de radio del módem.',
        action: 'Registrar intento fallido por consola.',
        question: '',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'wifi_escalation_images',
        options: [
            { label: 'Coordinar visita técnica', nextStep: '0.1' }
        ]
    },
    'wifi_escalation_images': {
        id: 'wifi_escalation_images',
        title: 'Guía Visual: Escalamiento Wi-Fi',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_wifi_escalation.png']
    },
    '6.0_lan': {
        id: '6.0_lan',
        title: 'Verificación de luces LANx',
        procedure: 'Diagnóstico de LED Caso 6: LANx',
        objective: 'confirmar que los puertos LANx del módem estén activos.',
        references: [
            { label: 'Luces encendidas', text: 'indica que la conexión por cable (Ethernet) está activa.' },
            { label: 'Luces apagadas', text: 'problema de cable, puerto o configuración del dispositivo.' }
        ],
        question: '“¿Las luces LED LANx, en los puertos donde hay cables conectados, están encendidas?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'lan_check_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green', lanx: 'eval' },
        activeLED: 'LANx',
        options: [
            { label: 'No', nextStep: 'coordinar_visita_lan' },
            { label: 'Si', nextStep: '6.1_speedtest' }
        ]
    },
    'lan_check_images': {
        id: 'lan_check_images',
        title: 'Guía Visual: Puertos LAN',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_6_lan_check.png']
    },
    '6.1_speedtest': {
        id: '6.1_speedtest',
        title: 'Comprobar el acceso a internet (LAN)',
        procedure: 'Resolución caso LAN - Paso 2',
        objective: 'Validar funcionamiento de internet por cable.',
        action: '<strong>Indica al cliente:</strong> “Utilice el navegador web y dirígase al sitio speedtest.net. Presione INICIO.”',
        question: '“¿Logró comprobar su acceso a internet con éxito y la velocidad es adecuada?”',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'speedtest_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green', lanx: 'green' },
        activeLED: 'LANx',
        options: [
            { label: 'No', nextStep: '6.2_advanced' },
            { label: 'Si', nextStep: '6.1' }
        ]
    },
    'speedtest_images': {
        id: 'speedtest_images',
        title: 'Guía Visual: Speedtest',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_6_navigation_test.png']
    },
    'coordinar_visita_lan': {
        id: 'coordinar_visita_lan',
        title: 'Fallas en los puertos de red',
        procedure: 'Coordinar visita técnica',
        objective: 'Cierre por falla física LAN',
        instruction: 'En caso de tener fallas en los puertos de red, contactar con despacho.',
        action: 'Registrar estado de puerto apagado con cable conectado.',
        question: '',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'lan_escalation_images',
        options: [
            { label: 'Coordinar visita técnica', nextStep: '0.1' }
        ]
    },
    'lan_escalation_images': {
        id: 'lan_escalation_images',
        title: 'Guía Visual: Fallas LAN',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_lan_failure.png']
    },
    '6.1': {
        id: '6.1',
        title: 'Verificación de Navegación Efectiva (Multi-dispositivo)',
        procedure: 'Caso 6: COMPROBACIÓN FINAL > Paso 1',
        objective: 'Asegurar experiencia óptima tras ajustes.',
        action: 'Solicitar prueba en varios dispositivos (celular, laptop, deco, etc.).',
        question: '“¿La velocidad se siente adecuada y logra navegar en todos sus dispositivos?”',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green', wifi: 'green', lanx: 'green' },
        activeLED: 'INTERNET',
        options: [
            { label: 'No (Lentitud/Cortes)', nextStep: '6.2_advanced' },
            { label: 'Si (Óptimo)', nextStep: '6.3_summary' }
        ]
    },
    '6.2_advanced': {
        id: '6.2_advanced',
        title: 'Asistencia Avanzada (Soporte Nivel 3)',
        procedure: 'Caso 6: COMPROBACIÓN FINAL > Paso 2',
        objective: 'Diagnóstico avanzado de rendimiento.',
        instruction: 'Solicitar a N3: Comprobar saturación de canales Wi-Fi, latencias o bloqueos DNS.',
        action: '<strong>Operador:</strong> Coordinar con ingeniería Nivel 3 para revisión de consola remota.',
        question: '¿Logró resolver el problema con ayuda de L3?',
        hasDescriptiveImage: true,
        descriptiveImageStep: 'l3_advanced_images',
        leds: { power: 'green', los: 'off', pon: 'green', internet: 'green' },
        activeLED: 'INTERNET',
        options: [
            { label: 'Si (Resuelto)', nextStep: '6.3_summary' },
            { label: 'No (Escalar L2)', nextStep: 'coordinar_visita_advanced' }
        ]
    },
    'l3_advanced_images': {
        id: 'l3_advanced_images',
        title: 'Guía Visual: Escalamiento Nivel 3',
        procedure: 'Ayuda Visual',
        type: 'images_grid',
        images: ['assets/node_6_l3_escalation.png']
    },
    'coordinar_visita_advanced': {
        id: 'coordinar_visita_advanced',
        title: 'Coordinar Visita Técnica (Nivel 2)',
        procedure: 'Escalamiento por rendimiento',
        objective: 'Revisión técnica presencial por ruido o interferencia.',
        action: 'Registrar que persiste lentitud tras validación lógica de Nivel 3.',
        question: '',
        options: [
            { label: 'Finalizar y Registrar Ticket', nextStep: '0.1' }
        ]
    },
    '6.3_summary': {
        id: '6.3_summary',
        title: 'Resumen y Cierre del Incidente',
        procedure: 'Diagnóstico Finalizado > Cierre de Incidente',
        objective: 'Documentar proceso para CRM.',
        type: 'summary_closing',
        question: '“Hemos verificado que su servicio se encuentra funcionando correctamente. ¿Hay algo más en lo que pueda ayudarlo?”',
        options: [
            { label: 'Finalizar Diagnóstico', nextStep: '0.1' }
        ]
    },
    'bridge_info': {
        id: 'bridge_info',
        title: 'Modo Bridge Detectado',
        procedure: 'Límites de Soporte',
        objective: 'Informar límites de soporte.',
        question: '“Al estar en modo Bridge, soporte para Wi-Fi depende de su propio router.”',
        options: [{ label: 'Entendido', nextStep: 'sync_check' }]
    },
    'l2_escalation': {
        id: 'l2_escalation',
        title: 'Escalación a Nivel 2',
        procedure: 'Derivación técnica',
        objective: 'Derivación técnica.',
        question: '“Pasaré su caso a ingeniería.”',
        options: [{ label: 'Finalizar', nextStep: '0.1' }]
    },
    'finish_call': {
        id: 'finish_call',
        title: 'Diagnóstico Exitoso - Fin de Llamada',
        procedure: 'Cierre exitoso',
        objective: 'Cierre exitoso.',
        question: '“¿Puedo ayudarle en algo más? Muchas gracias por comunicarse con Nuevo Siglo.”',
        options: [{ label: 'Finalizar', nextStep: '0.1' }]
    }
};

let state = {
    history: ['0.1'],
    model: 'NO IDENT.',
    mode: 'NO DEF.',
    log: [] // To store decisions for summary
};

const elements = {
    headerArea: document.querySelector('.app-header'),
    mainArea: document.querySelector('.main-content'),
    ledArea: document.querySelector('.app-footer')
};

function render() {
    const currentId = state.history[state.history.length - 1];
    const step = diagnosticTree[currentId];

    // Header logic for breadcrumbs
    if (step.id === '0.1') {
        elements.headerArea.innerHTML = `<div class="header-main-text" style="width: 100%; border: none;">${step.headerText}</div>`;
    } else {
        const hasDescriptiveBtn = step.hasDescriptiveImage;
        elements.headerArea.innerHTML = `
            <div class="header-back-area"><button class="back-btn" id="btn-atras">Atrás</button></div>
            ${hasDescriptiveBtn ? `
            <div class="header-visual-aid">
                <button class="visual-aid-btn" onclick="handleNext('${step.descriptiveImageStep}')">
                    <div class="visual-aid-label">Ver imagen descriptiva</div>
                    <div class="visual-aid-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                </button>
            </div>` : ''}
            <div class="header-main-text">Soporte de Nivel 1<br>Método de procedimiento<br>Atención en la llamada entrante</div>
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

    // Body
    elements.mainArea.innerHTML = '';

    if (step.type === 'summary_closing') {
        renderSummary(step);
    } else if (step.id === '0.1') {
        elements.mainArea.innerHTML = `<div class="welcome-screen"><h1 class="welcome-title">${step.title}</h1><button class="btn btn-iniciar" onclick="handleNext('${step.options[0].nextStep}')">Iniciar</button></div>`;
    } else if (step.type === 'images_grid') {
        elements.mainArea.innerHTML = `<h1 class="step-title">${step.title}</h1><div class="desc-images-grid">${step.images.map(img => `<img src="${img}" class="full-mock-img">`).join('')}</div>`;
    } else {
        if (step.headerInfo) {
            const hInfo = document.createElement('h2');
            hInfo.className = 'header-info-callout'; hInfo.textContent = step.headerInfo;
            elements.mainArea.appendChild(hInfo);
        }
        const titleEl = document.createElement('h1'); titleEl.className = 'step-title'; titleEl.textContent = step.title;
        elements.mainArea.appendChild(titleEl);
        if (step.objective) {
            const objEl = document.createElement('p'); objEl.className = 'objective-text'; objEl.innerHTML = `<strong>Objetivo:</strong> ${step.objective}`;
            elements.mainArea.appendChild(objEl);
        }

        // Instructional text
        if (step.instruction) {
            const instEl = document.createElement('p'); instEl.className = 'instruction-text';
            instEl.innerHTML = step.instruction;
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
        if (step.hardwareOptions) {
            intArea.className = 'hardware-images-container';
            step.hardwareOptions.forEach(hw => {
                const item = document.createElement('div'); item.className = 'hardware-option-item';
                item.innerHTML = `<div style="background: #eee; width: 250px; height: 180px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #888;">[Imagen ${hw.label}]</div><button class="btn btn-standard">${hw.label}</button>`;
                item.querySelector('button').onclick = () => { state.model = hw.label.replace('Modelo ', ''); handleNext(hw.nextStep); };
                intArea.appendChild(item);
            });
        } else {
            step.options.forEach(opt => {
                const btn = document.createElement('button');
                let btnClass = 'btn-standard';
                const label = opt.label;
                if (label === 'Si' || label === 'Confirmado' || label === 'Fija' || label.includes('Fija') || label.includes('Al día') || label === 'Continuar' || label === 'Escalamiento' || label === 'WIFI' || label === 'LAN' || label.includes('Óptimo')) btnClass = 'btn-yes';
                if (label === 'No' || label === 'Parpadea / Apagada' || label === 'Apagada' || label.includes('Suspendido') || label === 'Falla Técnica' || label.includes('Lentitud')) btnClass = 'btn-no';
                if (label.includes('visita técnica') || label.includes('Registrar Ticket') || label.includes('Finalizar Diagnóstico')) btnClass = 'btn-yes btn-wide';
                btn.className = `btn ${btnClass}`; btn.textContent = label;
                btn.onclick = () => {
                    if (opt.metadata && opt.metadata.mode) state.mode = opt.metadata.mode;
                    state.log.push({ step: step.title, answer: label });
                    handleNext(opt.nextStep);
                };
                intArea.appendChild(btn);
            });
        }
        elements.mainArea.appendChild(intArea);
    }

    // Footer
    if (step.id === '0.1' || step.id === '0.2' || step.id === '0.3' || step.id.includes('coordinar_visita') || (step.id.includes('error') && !step.id.includes('commercial')) || step.id === 'finish_call' || step.id.includes('escalation_images') || step.type === 'summary_closing') {
        elements.ledArea.style.display = 'none';
    } else {
        elements.ledArea.style.display = 'flex'; elements.ledArea.innerHTML = '<div class="led-group"></div>';
        const group = elements.ledArea.querySelector('.led-group');
        const ledsToShow = ['POWER', 'LOS', 'PON', 'INTERNET', 'WIFI', 'LANx'];
        ledsToShow.forEach(ledName => {
            const ledKey = ledName.toLowerCase(); const ledStatus = step.leds ? step.leds[ledKey] : 'off';
            const isActive = step.activeLED === ledName;
            const box = document.createElement('div'); box.className = `led-box ${isActive ? 'active' : ''}`;
            let dotClass = '';
            if (ledStatus === 'green' || (isActive && ledStatus === 'eval' && ledName !== 'LOS' && ledName !== 'LANx')) dotClass = 'green';
            else if (ledStatus === 'red' || (isActive && ledName === 'LOS')) dotClass = 'red';
            else if (ledName === 'LANx' && ledStatus === 'eval') dotClass = 'green';
            box.innerHTML = `<span class="led-name">${ledName}</span><div class="led-dot ${dotClass}"></div>`;
            group.appendChild(box);
        });
    }
}

function renderSummary(step) {
    const titleEl = document.createElement('h1'); titleEl.className = 'step-title'; titleEl.textContent = step.title;
    elements.mainArea.appendChild(titleEl);

    const summaryCard = document.createElement('div');
    summaryCard.className = 'summary-card';

    let summaryText = `RESUMEN DE DIAGNÓSTICO NS-STI - v2.0.0\n`;
    summaryText += `----------------------------------------\n`;
    summaryText += `Modelo: ${state.model} | Modo: ${state.mode}\n`;
    summaryText += `----------------------------------------\n`;
    state.log.forEach(entry => {
        summaryText += `> ${entry.step}: ${entry.answer}\n`;
    });
    summaryText += `----------------------------------------\n`;
    summaryText += `ESTADO FINAL: SERVICIO OPERATIVO`;

    summaryCard.innerHTML = `
        <p class="objective-text">Copia este resumen para el registro en el CRM:</p>
        <textarea id="summary-text" class="summary-textarea" readonly>${summaryText}</textarea>
        <button class="btn btn-standard" onclick="copyToClipboard()" style="margin-top:10px;">Copiar al Portapapeles</button>
        <div class="question-container" style="margin-top:30px;">
            <p class="question-label">Pregunta al cliente:</p>
            <div class="question-bubble"><div class="question-bubble-inner">${step.question}</div></div>
        </div>
        <div class="interaction-area">
            <button class="btn btn-yes btn-wide" onclick="resetApp()">${step.options[0].label}</button>
        </div>
    `;
    elements.mainArea.appendChild(summaryCard);
}

function copyToClipboard() {
    const copyText = document.getElementById("summary-text");
    copyText.select();
    document.execCommand("copy");
    alert("Resumen copiado con éxito.");
}

function resetApp() {
    state = { history: ['0.1'], model: 'NO IDENT.', mode: 'NO DEF.', log: [] };
    render();
}

function handleNext(nextId) { state.history.push(nextId); render(); }
function handleBack() {
    if (state.history.length > 1) {
        state.history.pop();
        const prevId = state.history[state.history.length - 1];
        if (prevId === '0.2') state.model = 'NO IDENT.';
        if (prevId === '0.2' || prevId === '0.3' || prevId === '0.1') state.mode = 'NO DEF.';
        render();
    }
}
document.addEventListener('DOMContentLoaded', render);
