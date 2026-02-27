export const TREE = {
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
            { label: 'Confirmar Visita Técnica', next: '6.3_SUMMARY', type: 'success' },
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
            { label: 'Confirmar Visita Técnica', next: '6.3_SUMMARY', type: 'success' },
            { label: 'Volver al diagnóstico', next: 'ESCALATE_VISIT', type: 'danger' }
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
        title: 'Reinicio de Energía',
        objective: 'Forzar nueva sesión de sincronismo mediante reinicio eléctrico.',
        action: 'Indique al cliente: “Presione el botón rojo ON/OFF en la parte trasera para apagar y volver a encender el equipo”. Alternativa: desenchufar fuente 10s. Espere 30 segundos tras el reinicio.',
        question: '¿La luz LED PON está encendida y fija?',
        leds: { power: 'on-green', los: 'off', pon: 'off' },
        activeLed: 'PON',
        options: [
            { label: 'Sí, quedó fija', next: 'MODE_BIFURCATION', type: 'success' },
            { label: 'Sigue parpadeando', next: '3.2', type: 'danger' }
        ]
    },
    '3.2': {
        id: '3.2',
        title: 'Reconexión en Módem',
        objective: 'Asegurar que el patchcord de fibra esté correctamente conectado al módem.',
        action: 'Indique al cliente: “Desconecte y vuelva a conectar el patchcord de fibra (punta verde) en la parte inferior del módem”. Tire con cuidado de la punta verde e inserte hasta sentir un click.',
        question: '¿La luz LED PON está encendida y fija?',
        leds: { power: 'on-green', los: 'off', pon: 'on-warn' },
        activeLed: 'PON',
        options: [
            { label: 'Sí, quedó fija', next: 'MODE_BIFURCATION', type: 'success' },
            { label: 'Sigue parpadeando', next: '3.3', type: 'danger' }
        ]
    },
    '3.3': {
        id: '3.3',
        title: 'Reconexión en Roseta NS',
        objective: 'Confirmar conexión del patchcord a la roseta de pared de Nuevo Siglo.',
        action: 'Indique al cliente: “Desconecte y vuelva a conectar el patchcord en la roseta de la pared”. Identifique la roseta con sticker de NS. Si hay dos, asegúrese de usar la de NS.',
        question: '¿La luz LED PON está encendida y fija?',
        leds: { power: 'on-green', los: 'off', pon: 'on-warn' },
        activeLed: 'PON',
        options: [
            { label: 'Sí, quedó fija', next: 'MODE_BIFURCATION', type: 'success' },
            { label: 'Sigue parpadeando', next: '3.4', type: 'danger' }
        ]
    },
    '3.4': {
        id: '3.4',
        case: 'CASO 3: ESCALAMIENTO L3',
        title: 'Validación con Ledefyl',
        objective: 'Revisión del módem y comprobación de aprovisionamiento.',
        action: 'Operador: Llame a Ledefyl (Tels: 26262680). Solicite revisión del aprovisionamiento del equipo. Cliente: Manejo de espera.',
        question: '¿La luz PON sincronizó tras la gestión con Ledefyl?',
        leds: { power: 'on-green', los: 'off', pon: 'on-warn' },
        activeLed: 'PON',
        options: [
            { label: 'Sí, sincronizó', next: 'MODE_BIFURCATION', type: 'success' },
            { label: 'Falla persiste', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },

    // BIFURCACIÓN MODOS
    MODE_BIFURCATION: {
        type: 'logic',
        condition: (state) => (state.mode === 'Bridge' ? 'CASE_BRIDGE' : '4.0')
    },
    CASE_BRIDGE: {
        id: 'CASE_BRIDGE',
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
        case: 'CASO 4: LUZ INTERNET',
        title: 'Verificación de luz LED INTERNET',
        objective: 'Confirmar que el servicio de internet esté activo en el módem.',
        question: '¿La luz LED INTERNET está encendida o parpadeando?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'off' },
        activeLed: 'INTERNET',
        options: [
            { label: 'Sí, encendida', next: 'NAV_CONNECTIVITY', type: 'success' },
            { label: 'No, está apagada', next: '4.1', type: 'danger' }
        ]
    },
    '4.1': {
        id: '4.1',
        title: 'Reinicio del Módem',
        objective: 'Restablecer la conexión de Internet mediante un reinicio del hardware.',
        action: 'Indique al cliente: “Presione el botón rojo ON/OFF en la parte trasera para apagar y volver a encender el equipo”. Alternativa: desenchufar fuente 10s. Espere 30 segundos.',
        question: '¿La luz LED INTERNET encendió tras el reinicio?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'off' },
        activeLed: 'INTERNET',
        options: [
            { label: 'Sí, encendió', next: 'NAV_CONNECTIVITY', type: 'success' },
            { label: 'No, sigue apagada', next: '4.2', type: 'danger' }
        ]
    },
    '4.2': {
        id: '4.2',
        title: 'Estado Financiero Comercial',
        objective: 'Comprobar que el servicio no esté suspendido por impagos.',
        action: 'Operador: revise en el sistema comercial si existen suspensiones. Cliente: manejo de la espera.',
        question: '¿El servicio está al día y la luz sigue apagada?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'off' },
        activeLed: 'INTERNET',
        options: [
            { label: 'Al día', next: '4.3', type: 'success' },
            { label: 'Con deuda', next: 'CASE_COMMERCIAL_DEBT', type: 'danger' }
        ]
    },
    '4.3': {
        id: '4.3',
        title: 'Verificación de Discado PPPoE',
        objective: 'Comprobar junto a Ledefyl las credenciales de discado.',
        action: 'Operador: llame al 26262680 (Ledefyl). Informe: “El servicio es el número de abonado, LED INTERNET no enciende, POWER OK, LOS OFF, PON OK. Por favor comprueben si ven algo fuera de lo esperado”.',
        question: '¿Realizó la gestión con Ledefyl?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'off' },
        activeLed: 'INTERNET',
        options: [
            { label: 'Gestión completada', next: '4.4', type: 'success' },
            { label: 'Falla persistente', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },
    '4.4': {
        id: '4.4',
        title: 'Post Verificación de Discado',
        objective: 'Confirmar si la luz sincronizó tras el reajuste de credenciales.',
        question: '¿La luz LED INTERNET está ahora encendida o parpadeando?',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'off' },
        activeLed: 'INTERNET',
        options: [
            { label: 'Sí, sincronizó', next: 'NAV_CONNECTIVITY', type: 'success' },
            { label: 'No, coordinar visita', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },
    NAV_CONNECTIVITY: {
        id: 'NAV_CONNECTIVITY',
        case: 'CONECTIVIDAD DEL CLIENTE',
        title: 'Tipo de Conexión',
        objective: 'Definir el método de acceso para continuar el diagnóstico final.',
        question: 'Elija el medio de conexión del dispositivo a revisar:',
        leds: { power: 'on-green', los: 'off', pon: 'on-green', internet: 'on-green' },
        options: [
            { label: 'Diagnosticar Wi-Fi', next: '5.0', type: 'neutral' },
            { label: 'Diagnosticar Cable (LAN)', next: '6.0', type: 'neutral' }
        ]
    },

    // CASO 5: WIFI
    '5.0': {
        id: '5.0',
        case: 'CASO 5: LUZ WIFI',
        title: 'Verificación de Luz LED Wi-Fi',
        objective: 'Confirmar que la red inalámbrica esté activa en el módem.',
        action: 'Referencias:<br>• Encendida: Red activa y disponible.<br>• Apagada/Parpadeando: Problema de configuración o hardware.',
        question: '¿La luz LED Wi-Fi está encendida y fija?',
        leds: { wifi: 'off' },
        activeLed: 'WIFI',
        options: [
            { label: 'Sí, encendida', next: '5.2', type: 'success' },
            { label: 'No, está apagada', next: '5.1', type: 'danger' }
        ]
    },
    '5.1': {
        id: '5.1',
        title: 'Activación Manual Wi-Fi',
        objective: 'Encender la red inalámbrica mediante el botón físico del equipo.',
        action: 'Indique al cliente: “Presione el botón blanco WPS/Wi-Fi en el lateral de la terminal por un segundo”.',
        question: '¿La luz LED Wi-Fi encendió ahora?',
        leds: { wifi: 'off' },
        activeLed: 'WIFI',
        options: [
            { label: 'Sí, encendió', next: '5.2', type: 'success' },
            { label: 'No enciende', next: 'ESCALATE_WIFI', type: 'danger' }
        ]
    },
    '5.2': {
        id: '5.2',
        title: 'Conexión a la Red',
        objective: 'Vincular el dispositivo del cliente a la red inalámbrica del servicio.',
        action: 'Indique al cliente: “Utilice las credenciales de autenticación (nombre de red y contraseña) para conectarse a su red”.',
        question: '¿Logró conectarse exitosamente a la red?',
        leds: { wifi: 'on-green' },
        activeLed: 'WIFI',
        options: [
            { label: 'Sí, conectado', next: '5.4', type: 'success' },
            { label: 'No puede conectar', next: '5.3', type: 'danger' }
        ]
    },
    '5.3': {
        id: '5.3',
        title: 'Recuperación de Credenciales',
        objective: 'Configurar parámetros SSID/Password vía interfaz web interna.',
        action: 'Requiere: PC + Cable Ethernet.<br>1. Conecte PC al puerto LAN del módem.<br>2. En Navegador: http://192.168.1.1 (User: user / Pass: user1234).<br>3. Local Network -> WLAN -> WLAN SSID Configuration.<br>4. Cambie Nombre y Contraseña, guarde y reinicie equipo.',
        question: '¿Logró recuperar el acceso tras este procedimiento?',
        leds: { wifi: 'on-green' },
        options: [
            { label: 'Sí, acceso recuperado', next: '5.4', type: 'success' },
            { label: 'Falla persistente', next: 'ESCALATE_WIFI', type: 'danger' }
        ]
    },
    '5.4': {
        id: '5.4',
        title: 'Verificación de Otros Dispositivos',
        objective: 'Asegurar la conectividad total en el domicilio.',
        question: '¿Hay algún otro dispositivo que el cliente quiera revisar?',
        options: [
            { label: 'Sí, revisar otro', next: 'NAV_CONNECTIVITY', type: 'success' },
            { label: 'No, gestión completa', next: '6.1', type: 'no' }
        ]
    },

    // CASO 6: LAN & CIERRE
    '6.0': {
        id: '6.0',
        case: 'CASO 6: LUZ LAN',
        title: 'Puertos Ethernet',
        objective: 'Validar cableado estructurado del cliente.',
        question: '¿Si conecta una PC por cable, tiene luz en el puerto?',
        leds: { lan: 'off' },
        activeLed: 'LAN',
        options: [
            { label: 'Sí, puerto OK', next: '5.4', type: 'success', leds: { lan: 'on-green' } },
            { label: 'No detecta cable', next: 'ESCALATE_VISIT', type: 'danger' }
        ]
    },
    '6.1': {
        id: '6.1',
        title: 'Cierre con Satisfacción',
        objective: 'Auditoría final de servicio.',
        action: 'Validar navegación en <a href="https://www.nuevosiglo.com.uy/" target="_blank">www.nuevosiglo.com.uy</a> y realizar prueba de velocidad en <a href="https://www.speedtest.net/" target="_blank">www.speedtest.net</a>.',
        question: '¿Los resultados son conformes y acordes al plan?',
        options: [{ label: 'Finalizar Gestión', next: '6.3_SUMMARY', type: 'success' }]
    },

    '6.3_SUMMARY': {
        id: '6.3_SUMMARY',
        title: 'Resumen CRM STI',
        type: 'final'
    },

    ESCALATE_VISIT: {
        id: 'ESCALATE_VISIT',
        case: 'DERIVACIÓN TÉCNICA',
        title: 'Coordinación de Visita Técnica',
        question: '¿Confirma el envío de personal técnico al domicilio del abonado?',
        options: [{ label: 'Confirmar Visita Técnica', next: '6.3_SUMMARY', type: 'success' }]
    },
    CASE_COMMERCIAL_DEBT: {
        id: 'CASE_COMMERCIAL_DEBT',
        case: 'ESTADO COMERCIAL',
        title: 'Gestión por Suspensión Administrativa',
        objective: 'Notificar deuda y finalizar gestión técnica.',
        action: 'Indique al cliente: “Su servicio se encuentra suspendido. Para restaurar la conexión, debe actualizar su situación económica mediante los canales de cobro habilitados”.',
        question: '¿El cliente comprendió que debe regularizar su pago para recuperar el servicio?',
        options: [{ label: 'Sí, Finalizar gestión', next: '6.3_SUMMARY', type: 'success' }]
    },
    ESCALATE_WIFI: {
        id: 'ESCALATE_WIFI',
        case: 'CASO 5: ESCALAMIENTO N2',
        title: 'Fallas en el Wi-Fi',
        objective: 'Falla persistente en la radio inalámbrica.',
        action: 'En caso de tener fallas con la radio Wi-Fi, este caso debe derivarse a soporte técnico de segundo nivel. Prepare y registre la información relevante de la atención durante la llamada.',
        question: '¿Confirma coordinación de visita técnica por falla Wi-Fi?',
        options: [{ label: 'Confirmar Visita Técnica', next: '6.3_SUMMARY', type: 'success' }]
    },
    ERR_NO_POWER: {
        id: 'ERR_NO_POWER',
        title: 'Asistencia por Falta de Energía',
        objective: 'Informar canales de soporte eléctrico y finalizar gestión.',
        action: 'Indique al cliente: “Para normalizar su servicio de Nuevo Siglo, es imperativo que restaure primero la energía eléctrica. Puede contactar a Telegestiones UTE al 0800 1930 o consultar con un profesional certificado que asista su instalación interna”.',
        question: '¿Comprendió que debe acudir a UTE o a un técnico calificado para resolver el inconveniente eléctrico antes de que podamos operar sobre su módem?',
        options: [{ label: 'Sí, Finalizar gestión', next: '6.3_SUMMARY', type: 'success' }]
    },
    '6.4_ABORTED': {
        id: '6.4_ABORTED',
        title: 'Gestión Interrumpida',
        objective: 'Finalizar gestión por caída de llamada o desconexión.',
        action: 'Se ha solicitado el cierre abrupto de la sesión. Se procederá a generar el reporte con los pasos alcanzados hasta el momento.',
        question: '¿Confirma el cierre de la gestión actual?',
        options: [{ label: 'Confirmar Cierre', next: '6.3_SUMMARY', type: 'danger' }]
    }
};

