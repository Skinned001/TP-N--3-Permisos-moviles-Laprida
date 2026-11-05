# Especificación técnica — ReportesInstituto

**Metodología:** Spec-Driven Development (SDD)  
**Institución:** Instituto Politécnico Formosa

## 1. Visión General del Proyecto

### Nombre

**ReportesInstituto**

### Propósito

Aplicación institucional para que alumnos del Instituto Politécnico Formosa
informen desperfectos edilicios o tecnológicos, indiquen el aula o sector
afectado y adjunten información útil para su resolución.

### Stack tecnológico

- **Aplicación móvil:** React Native.
- **Framework y módulos nativos:** Expo SDK 57.
- **Navegación:** Expo Router, con rutas definidas por archivos en `src/app`.
- **Lenguaje:** TypeScript.
- **Estado compartido:** React Context API.
- **Hardware y sistema:** `expo-camera`, `expo-location`,
  `expo-image-picker` y `expo-notifications`.

### Alcance funcional

1. Consultar la lista de reportes y abrir el detalle de cada uno.
2. Crear un reporte con título, descripción y sector/aula.
3. Capturar un código QR, elegir una foto o informar una ubicación.
4. Ofrecer alternativas manuales cuando un permiso no esté disponible.
5. Simular la resolución de un reporte mediante una notificación local.

El estado compartido inicial puede usar datos simulados. La persistencia remota
no forma parte de esta especificación hasta que se defina un backend.

## 2. Especificación de Permisos de Hardware (Principio de Mínimo Privilegio)

### Módulos y uso permitido

| Módulo | Uso | Alcance del permiso |
| --- | --- | --- |
| `expo-camera` | Leer códigos QR de aulas o sectores. | Cámara solo mientras se usa el escáner. No solicitar micrófono. |
| `expo-location` | Asociar el reporte a una ubicación o sector. | Ubicación en primer plano y solo al iniciar esa función. No solicitar ubicación en segundo plano. |
| `expo-notifications` | Avisar sobre una resolución simulada o cambio de estado. | Solicitar autorización cuando se habiliten los avisos; no obtener tokens push si no se incorpora un servicio remoto. |
| `expo-image-picker` | Elegir una imagen para adjuntar al reporte. | Abrir el selector nativo del sistema. No pedir acceso completo a la biblioteca para seleccionar una imagen. |

### Restricciones

- Está estrictamente prohibido instalar o importar `expo-permissions`, paquete
  obsoleto.
- Los permisos se consultan al entrar en la función pertinente y se solicitan
  justo antes de usarla; no se deben pedir todos al iniciar la app.
- No se solicitarán permisos de micrófono, grabación de audio, lectura amplia de
  medios ni ubicación en segundo plano mientras esas capacidades no formen
  parte del producto.
- No se solicitará un permiso de biblioteca completa para elegir una sola foto.
  La selección debe delegarse al Photo Picker/selector nativo y utilizar la URI
  devuelta por `expo-image-picker`.

### Estados normalizados

Toda interfaz que presente el estado de un permiso debe manejar estos cuatro
estados:

| Estado | Significado | Acción de interfaz |
| --- | --- | --- |
| `indeterminado` | La consulta todavía no terminó o el estado no está disponible. | Mostrar carga o informar que el estado no se pudo consultar; no afirmar que está concedido o denegado. |
| `concedido` | El sistema autorizó la capacidad requerida. | Habilitar la función correspondiente. |
| `preguntable` | El permiso no está concedido y el sistema todavía permite volver a solicitarlo. | Ofrecer una acción explícita para pedir permiso en contexto. |
| `bloqueado` | El usuario denegó el permiso y el sistema ya no permite mostrar el diálogo de solicitud. | Ofrecer Ajustes y una alternativa funcional sin ese permiso. |

`denegado` es una descripción del resultado del sistema, no un quinto estado:
si puede solicitarse de nuevo se normaliza como `preguntable`; si no, como
`bloqueado`. El estado interno `cargando`, si se conserva en un hook, debe
presentarse como `indeterminado` en la interfaz.

No se deben convertir excepciones de consulta o solicitud en un permiso
concedido o denegado: hay que registrar el error y presentar un mensaje que
permita continuar sin la función opcional.

## 3. Arquitectura UX Inbloqueable ("Permission Walls")

La denegación de un permiso nunca debe impedir navegar por la app, completar un
reporte ni utilizar las otras funciones. Cada pantalla debe solicitar solo el
permiso que necesita y conservar una alternativa operativa.

### Cámara denegada o bloqueada

- Permitir ingresar manualmente el código del aula o sector.
- Si el permiso está bloqueado, ofrecer un acceso opcional a Ajustes, sin
  ocultar ni deshabilitar el ingreso manual.
- Enviar el código manual al formulario del reporte de la misma manera que un
  código escaneado.

### Galería o selección de foto

- Abrir el selector de imágenes provisto por el sistema operativo mediante
  `expo-image-picker`.
- El selector debe limitar la elección a los elementos seleccionados por el
  usuario; no solicitar acceso completo a fotos o videos.
- Si el selector se cancela o no está disponible, continuar el formulario sin
  foto y mostrar un mensaje recuperable si ocurre un error.
- La foto es opcional: no debe impedir guardar el reporte.

### Ubicación denegada o bloqueada

- Ofrecer una lista de sectores institucionales para selección manual.
- Cuando se cuente con ubicación aproximada, permitir continuar y etiquetarla
  como aproximada.
- La ubicación es opcional: su ausencia no impide crear ni guardar el reporte.
- No solicitar ubicación en segundo plano.

### Navegación sin interrupciones

- El formulario de nuevo reporte funciona como hub para QR, foto y ubicación.
- Cada función secundaria devuelve el dato capturado al formulario, sin
  descartar el título o la descripción ya ingresados.
- Los fallbacks de permisos no deben cubrir la app completa ni bloquear las
  rutas principales.

## 4. Configuración Estricta de Tiendas (`app.json`)

### Requisitos de configuración

- Declarar explícitamente los config plugins de Expo Router, cámara,
  ubicación, selector de imágenes y notificaciones que use la aplicación.
- Escribir las descripciones de propósito en español, bajo el molde:
  **"Usamos tu [dato] para [beneficio concreto]"**.
- La descripción debe explicar una finalidad real y concreta, no una razón
  genérica como "mejorar la experiencia".
- Desactivar el micrófono en los plugins que lo habilitan por defecto.
- Usar solo permisos en primer plano para cámara y ubicación.
- Configurar `blockedPermissions` para excluir permisos que no se utilizan,
  después de revisar el manifiesto combinado de Android.
- No bloquear permisos necesarios para las capacidades declaradas ni agregar
  permisos de acceso amplio a medios para el Photo Picker.
- `expo-notifications` no requiere una descripción de uso de iOS; la solicitud
  debe explicarse en la interfaz cuando se active la función de avisos.
- En Android, crear el canal de notificaciones requerido por la plataforma
  antes de pedir autorización cuando corresponda.

### Ejemplo orientativo de `app.json`

Los valores deben mantenerse sincronizados con las funciones habilitadas y las
versiones de plugins instaladas:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "Usamos tu cámara para escanear el QR del aula y asociar el reporte al sector correcto.",
          "microphonePermission": false,
          "recordAudioAndroid": false
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicación mientras completás el reporte para localizar el desperfecto en un sector."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Usamos la foto que elegís para documentar el desperfecto en tu reporte.",
          "microphonePermission": false
        }
      ],
      [
        "expo-notifications",
        {
          "enableBackgroundRemoteNotifications": false
        }
      ]
    ],
    "android": {
      "blockedPermissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO"
      ]
    }
  }
}
```

`photosPermission` solo debe mostrarse si el flujo/plataforma efectivamente
requiere autorización de biblioteca. La selección de una imagen mediante el
selector del sistema no debe transformarse en una solicitud de acceso amplio.
La configuración final debe verificarse con el manifiesto generado para cada
plataforma y con la documentación de Expo SDK 57.

## 5. Árbol de Rutas y Estructura de Archivos

Las pantallas de navegación viven bajo `src/app`. Los componentes, contextos y
hooks reutilizables se mantienen fuera de esa carpeta para no convertirse en
rutas.

```text
src/
├── app/
│   ├── _layout.tsx                     # Stack raíz y providers globales
│   ├── (tabs)/
│   │   ├── _layout.tsx                 # Navegación por tabs
│   │   ├── index.tsx                   # / — Lista de reportes y acceso a creación
│   │   ├── avisos.tsx                  # /avisos — Avisos de la aplicación
│   │   └── permisos.tsx                # /permisos — Estado de permisos
│   ├── reporte/
│   │   ├── _layout.tsx                 # Stack del flujo de reportes
│   │   ├── nuevo.tsx                   # /reporte/nuevo — Formulario/hub
│   │   ├── escanear.tsx                # /reporte/escanear — QR o código manual
│   │   ├── foto.tsx                    # /reporte/foto — Selector nativo de fotos
│   │   ├── ubicacion.tsx               # /reporte/ubicacion — Ubicación/sector
│   │   └── [id].tsx                    # /reporte/:id — Detalle del reporte
│   ├── permisos/
│   │   └── [recurso].tsx               # /permisos/:recurso — Modal de permisos
│   └── ajustes-app.tsx                 # /ajustes-app — Preferencias de avisos
├── components/
│   └── PermisoFallback.tsx             # Mensajes y alternativas de permisos
├── context/
│   └── ReportesContext.tsx             # Estado compartido y operaciones de reportes
└── hooks/
    └── usePermiso.ts                   # Normalización y acciones de permisos
```

### Rutas dinámicas y modales

- `[id].tsx` y `[recurso].tsx` son rutas dinámicas; los parámetros deben
  validarse y normalizarse antes de usarse.
- El detalle de reporte es accesible como ruta normal desde la lista y por
  deep link.
- La pantalla de permisos se presenta como modal mediante la opción
  `presentation: "modal"` de su Stack.
- Si una pantalla debe interceptarse como modal conservando la ruta de fondo,
  se utilizará la convención de rutas interceptadas de Expo Router (`(.)`,
  `(..)`, etc.) en el grupo de navegación que la invoca. La ruta canónica debe
  seguir disponible para deep links y apertura directa.
- Las carpetas de grupos de rutas, como `(tabs)`, organizan navegadores y no
  forman parte de la URL pública.

### Estado compartido de reportes

`ReportesProvider` envuelve el Stack raíz. `useReportes` expone como mínimo la
lista de reportes y la operación para agregar uno. Cada reporte contiene:

```ts
{
  id: string;
  titulo: string;
  descripcion?: string;
  aula_sector: string;
  estado: "pendiente" | "en curso" | "resuelto";
}
```

El reporte nuevo se inserta al principio de la lista con estado `pendiente`.
Los datos capturados por las pantallas secundarias se devuelven al formulario y
se conservan al crear el reporte.
