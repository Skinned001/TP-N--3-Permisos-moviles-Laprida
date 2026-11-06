# Guía de uso y funcionamiento — ReportesInstituto

## 1. ¿Qué es esta aplicación?

ReportesInstituto es una aplicación móvil para informar desperfectos del
Instituto Politécnico Formosa. Permite consultar reportes de ejemplo, buscar y
filtrar por estado, iniciar un reporte nuevo y, opcionalmente, asociar un aula,
una ubicación o una foto. También incluye una bandeja de avisos de ejemplo y
pantallas para consultar y solicitar permisos del dispositivo.

La app está hecha con React Native, TypeScript, Expo y Expo Router. Actualmente
los reportes y avisos son datos de demostración: no hay una API ni una base de
datos conectadas.

## 2. Cómo ejecutar el proyecto

La aplicación Expo está dentro de la carpeta `ReportesInstituto`.

1. Instalar Node.js LTS y npm.
2. Abrir una terminal en la raíz del repositorio y ejecutar:

   ```bash
   cd ReportesInstituto
   npm install
   npm start
   ```

3. Seguir las instrucciones de Expo para abrir la app en Expo Go o en un
   emulador.

Comandos disponibles desde `ReportesInstituto`:

| Comando | Uso |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo de Expo. |
| `npm run android` | Inicia Expo orientado a Android. |
| `npm run ios` | Inicia Expo orientado a iOS. |
| `npm run web` | Inicia la versión web. |
| `npm run typecheck` | Ejecuta TypeScript sin generar archivos (`tsc --noEmit`). |

## 3. Estructura de carpetas y archivos

### Raíz del repositorio

| Carpeta o archivo | Función |
| --- | --- |
| `ReportesInstituto/` | Proyecto Expo de la aplicación. |
| `README.md` | Resumen del proyecto y primeros pasos para ejecutarlo. |
| `spec.md` | Especificación y requisitos del trabajo. |
| `RESPUESTAS.MD` | Material de apoyo y respuestas del proyecto. |
| `prompts_historial.md` | Historial de instrucciones usadas durante la construcción. |
| `.git/` | Metadatos de Git; no contiene código de la app. |
| `.expo/` | Archivos generados por Expo durante el desarrollo. |

### Dentro de `ReportesInstituto/`

| Carpeta o archivo | Función |
| --- | --- |
| `src/app/` | Rutas y pantallas. Expo Router interpreta su estructura de archivos. |
| `src/app/(tabs)/` | Pantallas que aparecen en la barra inferior. El nombre entre paréntesis agrupa rutas, pero no forma parte de la URL. |
| `src/app/reporte/` | Flujo para crear reportes y consultar su detalle. |
| `src/app/permisos/` | Pantallas de información de permisos; `[recurso].tsx` es una ruta dinámica. |
| `src/components/` | Componentes visuales reutilizables, como el estado alternativo cuando un permiso falta. |
| `src/context/` | Estado compartido entre pantallas. Actualmente contiene los reportes en memoria. |
| `src/hooks/` | Hooks reutilizables para lógica de React, incluido el estado unificado de permisos. |
| `node_modules/` | Dependencias instaladas por npm. No se modifica manualmente ni se versiona como código propio. |
| `.expo/` | Estado y archivos locales generados por Expo. |
| `app.json` | Configuración de Expo y textos que explican por qué la app solicita permisos nativos. |
| `package.json` | Dependencias, nombre del punto de entrada y comandos del proyecto. |
| `tsconfig.json` | Configuración de TypeScript; el proyecto tiene el modo estricto habilitado. |
| `index.ts` y `App.tsx` | Archivos iniciales del template. El `main` actual de `package.json` es `expo-router/entry`, por lo que las rutas activas se resuelven desde `src/app`; `App.tsx` conserva la pantalla de inicio de ejemplo y no implementa esas rutas. |

## 4. Pantallas y navegación

La barra inferior contiene estas tres secciones:

| Pantalla | Ruta | Qué permite hacer |
| --- | --- | --- |
| Reportes | `/` (archivo `src/app/(tabs)/index.tsx`) | Ver reportes, buscar por título o sector, filtrar por estado, ordenar por prioridad, abrir un detalle e iniciar un reporte nuevo. |
| Avisos | `/avisos` | Ver avisos institucionales de muestra; los avisos no leídos se resaltan con una línea cian. |
| Permisos | `/permisos` | Consultar los estados de permisos de cámara, ubicación y notificaciones y, cuando corresponda, pedirlos o ir a Ajustes. |

Las pantallas apiladas de reportes están configuradas en
`src/app/reporte/_layout.tsx`:

| Ruta | Función |
| --- | --- |
| `/reporte/nuevo` | Formulario para título y descripción, accesos a datos opcionales y botón para guardar. |
| `/reporte/escanear` | Escanea un QR de aula. Si no se concede cámara, se puede escribir el código manualmente. |
| `/reporte/foto` | Permite seleccionar una imagen de la galería. |
| `/reporte/ubicacion` | Solicita ubicación en primer plano o permite escoger un sector de una lista manual. |
| `/reporte/[id]` | Muestra los datos del reporte seleccionado y permite simular su resolución. |

Además:

- `/ajustes-app` muestra la opción para habilitar notificaciones de resolución.
- `/permisos/[recurso]` es una pantalla modal de información sobre un permiso.

El layout raíz `src/app/_layout.tsx` envuelve la navegación en
`ReportesProvider`, por eso las pantallas pueden compartir los reportes.
`src/app/(tabs)/_layout.tsx` configura la barra inferior.

## 5. Funciones principales y flujo de uso

### Consultar, buscar y filtrar reportes

En la pantalla **Reportes**:

1. Cada tarjeta muestra el título, aula o sector y estado.
2. Al tocar una tarjeta se abre `/reporte/[id]`.
3. El buscador encuentra coincidencias parciales en el título o el sector y no
   distingue mayúsculas de minúsculas.
4. Los botones **Todos**, **Pendiente**, **En curso** y **Resuelto** filtran por
   estado. Aunque los botones se muestran con mayúscula inicial, el código
   compara los estados sin distinguir mayúsculas.
5. Los resultados se ordenan: pendiente primero, en curso después y resuelto al
   final.
6. El botón **+ Nuevo Reporte** abre el formulario.

### Crear un reporte

1. Escribir un título y una descripción. Ambos campos son obligatorios.
2. Si se desea, elegir **Escanear QR de Aula**, **Adjuntar Foto** o **Marcar
   Ubicación**.
3. Guardar el reporte. La interfaz muestra un indicador de carga y espera
   brevemente para simular el envío.
4. El reporte se agrega al estado compartido con estado inicial `pendiente` y la
   app vuelve a la lista.

Si no se especifica un sector, el registro usa `A designar`. El código QR
escaneado se usa como sector cuando no se eligió uno por ubicación.

### Adjuntar aula, ubicación y foto

- **QR:** `expo-camera` lee códigos QR. Sin permiso, el usuario puede introducir
  el código manualmente y continuar. No se necesita habilitar audio para
  escanear.
- **Ubicación:** `expo-location` solicita permiso de primer plano. Si se
  rechaza, hay sectores de ejemplo para elegir manualmente. Si se concede, la
  pantalla consulta la posición y retorna el texto `Coordenadas capturadas`.
- **Foto:** `expo-image-picker` abre la galería y vuelve al formulario con el
  URI de la imagen seleccionada.

Los tres datos son opcionales y no bloquean la creación del reporte.

### Avisos y permisos

- **Avisos:** `src/app/(tabs)/avisos.tsx` contiene tres avisos simulados; el
  atributo `leido` controla el borde cian. Esta bandeja no está conectada al
  sistema de notificaciones.
- **Panel de permisos:** los estados pueden ser **Cargando**, **Concedido**,
  **Preguntable** o **Bloqueado**. Si el usuario vuelve desde Ajustes, el hook
  actualiza el estado del permiso cuando la app vuelve a primer plano.
- **Ajustes de la app:** el switch solicita permiso de notificaciones. Deslizar
  el switch a apagado solo cambia la preferencia visual local; no revoca un
  permiso ya otorgado al sistema operativo.
- **Resolución simulada:** en el detalle, **Simular Resolución** muestra una
  alerta en web o intenta programar una notificación local inmediata en móvil.
  No cambia el estado del reporte a `resuelto`.

## 6. Cómo se organiza el código

### Reportes compartidos

`src/context/ReportesContext.tsx` define:

- `EstadoReporte`: los estados permitidos (`pendiente`, `en curso`,
  `resuelto`).
- `Reporte`: la forma de un reporte (`id`, `titulo`, `descripcion`,
  `aula_sector` y `estado`).
- `mockReportes`: registros iniciales de demostración.
- `ReportesProvider`: mantiene la lista en estado React.
- `agregarReporte`: crea un ID con `Date.now()`, establece `pendiente` y
  agrega el nuevo reporte al inicio de la lista.
- `useReportes`: permite que una pantalla lea los reportes o agregue uno; si se
  usa fuera de `ReportesProvider`, produce un error explícito.

### Permisos

`src/hooks/usePermiso.ts` normaliza la respuesta de las APIs nativas:

- Mantiene el estado del permiso en React.
- Convierte la respuesta nativa a los estados de la interfaz.
- Expone `pedir` para solicitar el permiso y `abrirAjustes` para abrir los
  ajustes del sistema.
- Consulta de nuevo el permiso cuando la app vuelve a estar activa.
- Marca como parcial la ubicación aproximada de Android o el acceso limitado a
  fotos, cuando esa información la entrega la API.

`src/components/PermisoFallback.tsx` reutiliza la interfaz para explicar por qué
se necesita un permiso, pedirlo, abrir Ajustes y ofrecer campos o acciones
alternativas. Así, por ejemplo, el usuario puede seguir con un código de aula
manual cuando no usa la cámara.

### Configuración nativa

`app.json` registra los plugins de Expo para Router, cámara, ubicación y
selector de imágenes. Los textos de permiso describen el beneficio para el
usuario. La configuración de cámara declara `recordAudioAndroid: false`; la
lista de permisos bloqueados de Android excluye audio y ciertos permisos de
lectura de medios.

Los permisos se solicitan al usar la función correspondiente, no todos al
iniciar la aplicación. El selector de galería está implementado en la pantalla
de foto; el flujo actual no toma una foto directamente desde la cámara.

## 7. Preguntas frecuentes

### ¿Los reportes se guardan si cierro la aplicación?

No. Se guardan en memoria mediante React Context. Al reiniciar la app, se vuelve
a cargar la lista de ejemplo. Para persistencia real hace falta una base de
datos local o un backend.

### ¿El reporte se envía a la institución?

No todavía. El tiempo de espera del formulario simula un envío, pero no hay una
API conectada.

### ¿Cómo agrego un reporte?

Desde **Reportes**, tocá **+ Nuevo Reporte**, completá título y descripción y
tocá **Guardar Reporte**. Aula, foto y ubicación son opcionales.

### ¿Qué pasa si no concedo acceso a la cámara?

Podés escribir el código del aula manualmente. No es necesario conceder el
permiso para continuar con esa alternativa.

### ¿Qué pasa si no concedo acceso a la ubicación?

Podés seleccionar manualmente uno de los sectores ofrecidos. La ubicación
también es opcional.

### ¿La foto se guarda en el reporte?

La pantalla devuelve el URI de la imagen y el formulario indica que hay una
foto adjunta. Sin embargo, la estructura `Reporte` y la función
`agregarReporte` actuales no guardan ese URI, por lo que no queda asociado al
registro.

### ¿Se guardan las coordenadas exactas?

No. La pantalla consulta la ubicación, pero por ahora agrega el texto
`Coordenadas capturadas` como sector en lugar de guardar latitud y longitud.

### ¿Los avisos de la pestaña son notificaciones reales?

No. Son tarjetas de ejemplo que se muestran dentro de la app. Las notificaciones
locales se usan únicamente en el flujo de ajustes y en la simulación de
resolución.

### ¿Por qué un permiso aparece como bloqueado?

El sistema ya no permite volver a mostrar el diálogo de solicitud. Usá **Abrir
Ajustes** desde la app para cambiar el permiso manualmente, si el sistema lo
permite.

### ¿Para qué sirve el borde cian en un aviso?

Indica que el aviso está marcado como no leído (`leido: false`) en los datos de
muestra.

### ¿Dónde cambio los avisos que aparecen en la bandeja?

En `src/app/(tabs)/avisos.tsx`, dentro del arreglo `mockAvisos`. Actualmente se
edita el código para cambiar los datos; no existe una pantalla de administración.

### ¿Dónde agrego una pantalla nueva?

Creá un archivo de pantalla dentro de `src/app/`. Expo Router deriva la ruta de
su ubicación y nombre. Para opciones de Stack o Tabs, revisá el `_layout.tsx`
correspondiente.

### ¿Cómo verifico el TypeScript?

Desde `ReportesInstituto`, ejecutá `npm run typecheck`.

## 8. Alcance actual y posibles mejoras

La aplicación es una base funcional para probar pantallas, navegación,
permisos y estados locales. Antes de usarla como sistema institucional real,
sería necesario considerar, entre otros puntos:

- conectar los reportes y avisos a un backend y definir autenticación;
- persistir información en el dispositivo o en un servidor;
- guardar y visualizar fotos asociadas a cada reporte;
- guardar coordenadas reales o un sector confirmado por el usuario;
- implementar un ciclo real de estados y actualización del reporte;
- conectar avisos institucionales con una fuente de datos y definir su lectura;
- validar permisos y flujos en builds nativos y dispositivos reales.
