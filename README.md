# NS-STI: Motor de Diagnóstico FTTH (v3.0.0)
## El "Cerebro" del Proyecto - Manual Técnico y Guía de Arquitectura

Bienvenido al repositorio autónomo de **NS-STI (Nuevo Siglo - Soporte Técnico Internet)**. Este documento sirve como Single Source of Truth para el entendimiento, mantenimiento y extensión de la herramienta de diagnóstico de Nivel 1.

---

## 1. Arquitectura del Flujo (Lógica Nodal)
El sistema opera mediante un **Árbol de Decisiones Nodal** implementado en `app.js`. El flujo se divide en dos grandes fases:

### A. Fase Lineal (Capas 1 a 4)
Es la fase obligatoria de validación física y de transporte. Ningún técnico puede saltar estos pasos:
- **Caso 0 (Triaje)**: Identificación de Modelo (ZTE) y Modo de Servicio (Standard/Bridge).
- **Caso 1 (POWER)**: Validación de integridad eléctrica y fuentes de poder.
- **Caso 2 (LOS)**: Validación física de la fibra óptica (Patchcord y Roseta).
- **Caso 3 (PON)**: Validación de sincronismo lógico con la OLT.
- **Caso 4 (INTERNET)**: Validación de sesión PPPoE y estado comercial.

### B. Bifurcación de Responsabilidad
- **Modo Standard**: Continúa hacia los Casos 5 (Wi-Fi) y 6 (Rendimiento/LAN). Soporte Full Stack gestionado por NS.
- **Modo Bridge**: El flujo finaliza tras el Caso 3. Se activa la **Cláusula de Demarcación**, informando al abonado que la red privada depende de su router propio.

### C. Fase Iterativa (Capas 5 y 6)
Validación de la experiencia final del usuario a través de bucles de prueba en múltiples dispositivos y test de velocidad (Speedtest).

---

## 2. Diccionario de Hardware
El sistema es adaptativo según el modelo seleccionado en el Nodo Maestro:

| Modelo | Descripción Visual | Activos del Sistema |
| :--- | :--- | :--- |
| **ZTE F6600** | 4 Antenas redondas | Carga `assets/node_1_2_button_f6600.png` y similares. |
| **ZTE F1611A** | 2 Antenas planas | Ajusta diagramas de botones y disposición de LEDs. |

> [!NOTE]
> Las variables de hardware aseguran que el técnico guíe al cliente con la descripción física exacta del equipo que tiene enfrente.

---

## 3. Protocolos de Escalamiento

### Nivel 2 (Presencial - Despacho)
- **Criterio**: Falla física de hardware (Módem no enciende tras 5 pruebas) o señal de fibra interrumpida (LOS rojo tras limpieza).
- **Acción**: El sistema genera un resumen solicitando visita técnica.

### Nivel 3 (Lógico - Ingeniería)
- **Ledefyl (26262680)**: Reaprovisionamiento lógico (PON parpadea) o reconfiguración de discado (INTERNET apagado).
- **Soporte L3 NS**: Análisis avanzado de latencia, saturación de canales Wi-Fi o problemas de DNS.

---

## 4. Guía de Mantenimiento para Futuros Agentes

### Cómo añadir un nuevo Módem (Ej. Huawei)
1. Abrir `app.js` y localizar el `diagnosticTree['0.2'].hardwareOptions`.
2. Añadir el nuevo objeto: `{ id: 'huawei_eg8145', label: 'Huawei EG8145', desc: 'Antenas integradas' }`.
3. Mapear las nuevas imágenes en los nodos descriptivos (`images_grid`).

### Cómo modificar scripts de diálogo
Los diálogos están contenidos en las propiedades `question` e `instruction` de cada nodo. Puede editarlos directamente sin alterar la lógica de navegación (`nextStep`).

### Compatibilidad
El código utiliza **Vanilla JavaScript (ES6)**. No añada dependencias de Node.js ni frameworks externos para asegurar que el archivo funcione abriéndolo directamente desde el explorador de archivos en cualquier PC de soporte.

---
**Desarrollado para Nuevo Siglo - Gold Master Edition v3.0.0**
