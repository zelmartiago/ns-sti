# NS-STI: Motor de Diagnóstico FTTH (v5.8.0 Enterprise)
## El "Cerebro" del Proyecto - Manual Técnico y Guía de Arquitectura

Bienvenido al repositorio de **NS-STI (Nuevo Siglo - Soporte Técnico Interactivo)**. Esta herramienta es el estándar de oro para el diagnóstico de Nivel 1 en despliegues FTTH, diseñada para garantizar una atención técnica uniforme, auditable y de alta precisión.

---

## 1. Arquitectura del Sistema
El sistema es una **Single Page Application (SPA)** construida con **Vanilla JavaScript**, lo que garantiza portabilidad absoluta y ejecución instantánea en cualquier entorno de soporte sin dependencias externas.

### Componentes Clave:
- **Motor Nodal (`app.js`)**: Gestiona un árbol de decisiones (`TREE`) con soporte para bifurcaciones lógicas dinámicas.
- **Estado Persistente**: Utiliza `localStorage` para recuperar sesiones en caso de recarga accidental.
- **Sistema de Auditoría**: Registra cada interacción (Pregunta -> Respuesta) con marcas de tiempo para su posterior volcado en el CRM.

---

## 2. Flujo Operativo de Trabajo

### Fase I: Identificación y Triage
1. **Acceso Técnico**: El operador debe identificarse con su usuario de red.
2. **Identificación del Abonado**: Registro obligatorio del Nro. de Contrato.
3. **Perfilado de Hardware**:
   - **Modelos**: ZTE F6600 (4 antenas) o ZTE F1611A (2 antenas).
   - **Modos**: Standard (Soporte NS Full) o Bridge (Demarcación en Capa 3).

### Fase II: Diagnóstico por Capas
El motor guía al técnico a través del modelo OSI simplificado para FTTH:
- **Capa 1 (Energía)**: Integridad eléctrica y encendido físico.
- **Capa 2 (Óptica/LOS)**: Validación de señal física, limpieza y conexión de patchcord/roseta.
- **Capa 3 (Enlace/PON)**: Sincronismo lógico con la OLT.
- **Capa 4 (Servicio/INTERNET)**: Sesión PPPoE, estado comercial (deuda) y gestión con Ledefyl (N3).
- **Capa 5/6 (Experiencia/WIFI/LAN)**: Validación de conectividad inalámbrica, cableada y pruebas de rendimiento.

---

## 3. Características de la Edición Enterprise

### Resumen CRM Dinámico
Al finalizar cada gestión, el sistema genera un bloque de texto estructurado listo para copiar y pegar en el CRM corporativo, incluyendo:
- Metadatos de la sesión (Operador, Abonado, Equipo, Tiempos).
- **Log de Pasos**: Detalle cronológico de cada paso ejecutado y la respuesta del cliente.
- **ID de Cierre**: Categorización automática del resultado (ej. `ESCALATE_VISIT`, `CASE_BRIDGE`, `CIERRE-ELECTRICO`).

### Monitor de LEDs Interactivo
En la parte inferior de la interfaz, un panel visual muestra el estado teórico de los LEDs del módem en tiempo real, reflejando las comprobaciones que el técnico va validando con el cliente.

### Protocolos de Escalamiento
- **Nivel 2 (Visita Técnica)**: Activado automáticamente ante fallas físicas insalvables o roturas de fibra.
- **Nivel 3 (Ingeniería/Ledefyl)**: Guía específica para coordinar con el centro de gestión de red (Tels: 26262680).

---

## 4. Guía para Desarrolladores y Mantenedores

### Añadir nuevos Nodos o Modelos
- **Módems**: Modificar el objeto `CONFIG.MODELS` en `app.js`.
- **Lógica**: Los nodos pueden ser de tipo `logic` (usando una función `condition` para decidir el siguiente paso basándose en el estado de la aplicación).
- **Estilos**: El archivo `styles.css` utiliza variables CSS (`:root`) para facilitar cambios de branding rápidos.

### Seguridad y Validación
- Se implementó una sanitización básica de entradas para el Usuario Técnico y Nro. de Abonado.
- El sistema impide el avance si no se completan los campos obligatorios del Triage.

---

## 5. Requisitos de Ejecución
- **Navegador**: Chrome, Edge o Firefox (Versiones actualizadas).
- **Instalación**: No requiere. Abrir `index.html` directamente.
- **Compatibilidad**: Diseñado para funcionar en resoluciones de escritorio estándar en centros de atención telefónica.

---
**Desarrollado para Nuevo Siglo - Enterprise Gold Edition v5.8.0**
