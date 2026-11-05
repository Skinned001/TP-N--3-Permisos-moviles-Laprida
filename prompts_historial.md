# Prompt 0 la precuela:

Actuá como un desarrollador Senior en React Native. Vamos a iniciar el proyecto "ReportesInstituto".
Necesito que me des exclusivamente los comandos de terminal (bash) para ejecutar en orden y configurar el entorno desde cero. 

Requisitos de los comandos:
1. Crear el proyecto con `npx create-expo-app@latest ReportesInstituto --template blank-typescript`.
2. Navegar dentro de la carpeta del proyecto.
3. Instalar Expo Router y sus dependencias base obligatorias (`expo-router`, `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants`, `expo-status-bar`).
4. Instalar las dependencias de hardware requeridas para este proyecto: `expo-camera`, `expo-location`, `expo-image-picker` y `expo-notifications`.
5. Modificar el `package.json` para que el "main" apunte a "expo-router/entry".

Regla estricta: NO incluyas `expo-permissions` en ninguna instalación. Solo devolvé los comandos y una brevísima explicación de cómo ejecutarlos.

# Prompt Inicial:
Actuá como un desarrollador Senior en React Native y Expo Router (SDK 57). 
Estamos construyendo una app llamada "ReportesInstituto" con TypeScript. Asumí que ya inicialicé el proyecto con `npx create-expo-app@latest --template blank-typescript`.

1. Dame el comando exacto de `npx expo install` para instalar SOLAMENTE: expo-camera, expo-location, expo-image-picker y expo-notifications. Regla estricta: NO uses `expo-permissions` (está deprecado).
2. Generá el código completo para `app.json` aplicando el principio de mínimo privilegio:
   - En `expo.android.blockedPermissions`, excluimos explícitamente: "android.permission.RECORD_AUDIO", "android.permission.READ_MEDIA_IMAGES", "android.permission.READ_MEDIA_VIDEO".
   - En `expo.plugins`, configurá `expo-camera` con `microphonePermission: false` y `recordAudioAndroid: false`. 
   - Añadí textos de propósito (`cameraPermission` y `locationWhenInUsePermission`) siguiendo estrictamente el molde "Usamos tu [dato] para [beneficio concreto]." orientados a escanear aulas y ubicar desperfectos en el edificio.

# Prompt 2: Árbol de Enrutamiento y Diseño Base:

Basado en el proyecto "ReportesInstituto", generá el esqueleto de enrutamiento usando Expo Router en la carpeta `src/app`. No implementes la lógica interna todavía, solo los componentes funcionales base que devuelvan un texto indicando qué pantalla es.

1. Creá el layout raíz `src/app/_layout.tsx` configurando un Stack donde la ruta `permisos/[recurso]` tenga `presentation: "modal"`.
2. Creá el grupo `(tabs)` con su `_layout.tsx` y las pantallas: `index.tsx` (Lista de reportes), `avisos.tsx` (Bandeja) y `permisos.tsx` (Panel de estados).
3. Creá la carpeta `reporte` con un `_layout.tsx` (Stack) y las pantallas: `nuevo.tsx`, `escanear.tsx`, `foto.tsx`, `ubicacion.tsx` y `[id].tsx`.
4. Creá los archivos `src/app/ajustes-app.tsx` y `src/app/permisos/[recurso].tsx`.
5. Estilos: En todos los archivos generados, aplicá `StyleSheet` usando una paleta de modo oscuro (dark theme). Usá fondos gris pizarra (dark slate, ej: #1E293B) con textos claros, y acentos/botones en color cian (#06B6D4) o azul profundo para contraste alto.

# Prompt 3: El Hook Unificado de Permisos 

Vamos a implementar el motor de permisos en `src/hooks/usePermiso.ts`.
Creá la función `usePermiso` que reciba como parámetro el array que devuelven los hooks nativos de Expo (ej. `[permiso, pedirPermiso, consultarPermiso]`).

Requisitos obligatorios:
1. Retornar un objeto con: `estado` (tipo literal: 'cargando' | 'concedido' | 'preguntable' | 'bloqueado'), `parcial` (boolean), `pedir` (función) y `abrirAjustes` (usa Linking.openSettings).
2. Escuchar el ciclo de vida: Usá `AppState.addEventListener`. Cuando la app pase a estado 'active', ejecutá `consultarPermiso()` (el tercer elemento de la tupla) para refrescar el permiso si el usuario vuelve de la app de Ajustes.
3. Derivación del estado:
   - null -> 'cargando'
   - granted === true -> 'concedido'
   - granted === false y canAskAgain === true -> 'preguntable'
   - granted === false y canAskAgain === false -> 'bloqueado'
4. Derivación parcial: `parcial` es true si `permiso.android?.accuracy === 'coarse'` o si `(permiso as any).accessPrivileges === 'limited'`.

# Prompt 4: Componente de UI Fallback

Creá el componente reutilizable `src/components/PermisoFallback.tsx`.

Props requeridas: `estado` ('cargando' | 'preguntable' | 'bloqueado'), `recurso` (string), `mensaje` (string), `onPedir` (función), `onAbrirAjustes` (función).

Lógica de renderizado (mantené el diseño dark/cian definido anteriormente):
1. Si estado es 'cargando': Renderizá un ActivityIndicator centrado.
2. Si estado es 'preguntable': Mostrá el `mensaje` y un botón principal que diga "Continuar" (ejecuta onPedir).
3. Si estado es 'bloqueado': Mostrá un texto de alerta indicando que el acceso a `recurso` está desactivado permanentemente y un botón que diga "Abrir Ajustes" (ejecuta onAbrirAjustes).
No incluyas botones de "Ahora no" ni "Cancelar" en este componente.

# Prompt 5: Escáner QR y Fallback (Fase 3)

Actuá como un desarrollador React Native. Vamos a implementar la pantalla `/reporte/escanear.tsx`.

1. Importá el hook personalizado `usePermiso` desde `src/hooks/usePermiso` y pasale como argumento la ejecución de `useCameraPermissions()` de `expo-camera`.
2. Importá tu componente `PermisoFallback`.
3. Lógica de renderizado basada en el `estado` que devuelve `usePermiso`:
   - Si es 'cargando', 'preguntable' o 'bloqueado', retorná el componente `<PermisoFallback>` pasándole las props correspondientes (recurso="cámara", mensaje="Usamos tu cámara para leer el código QR del aula.", onPedir={pedir}, onAbrirAjustes={abrirAjustes}).
   - Si el estado es 'bloqueado', AGREGÁ debajo del PermisoFallback un `<TextInput>` y un `<Button>` para que el usuario pueda escribir y enviar el código del aula manualmente (este es nuestro fallback funcional).
   - Si el estado es 'concedido', renderizá el componente `<CameraView>` configurado para escanear códigos de barras.
4. Mantené los estilos consistentes con el tema oscuro (fondos #1E293B, acentos cian).

# Prompt 6: Galería Privada y Segura (Fase 3)

Vamos a implementar la pantalla `/reporte/foto.tsx`.
Regla estricta: NO debes importar ni usar `useMediaLibraryPermissions` ni `requestMediaLibraryPermissionsAsync`. No queremos pedir permisos de galería.

1. Creá un componente funcional con un botón principal "Elegir de la galería".
2. Al presionar el botón, ejecutá directamente `ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images })`.
3. Si el resultado no es cancelado (`!result.canceled`), mostrá la imagen seleccionada usando el componente `<Image>` nativo de React Native, y mostrá un botón secundario para "Eliminar foto" o "Cambiar foto".
4. Aplicá el diseño oscuro (dark slate) y asegurate de que la interfaz sea clara y limpia.

# Prompt 7: Ubicación Respetuosa y Aproximada (Fase 4)

Implementá la pantalla `/reporte/ubicacion.tsx` usando `expo-location`.

1. Utilizá nuestro hook `usePermiso` pasándole `Location.useForegroundPermissions()`.
2. Manejo de renderizado:
   - Si el estado no es 'concedido', renderizá el `<PermisoFallback>` (recurso="ubicación", mensaje="Usamos tu ubicación para registrar el sector exacto del edificio.").
   - Si el estado es 'bloqueado', AGREGÁ debajo del fallback un componente `<Picker>` (o un listado de botones) para elegir manualmente el sector: "Patio", "Laboratorio", "Pasillo", "Baños".
   - Si el estado es 'concedido', ejecutá `Location.getCurrentPositionAsync()` para obtener las coordenadas.
3. Uso de `parcial`: Si la prop `parcial` del hook es `true` (ubicación aproximada), mostrá un texto en pantalla que diga "Ubicación aproximada" en color amarillo o naranja de advertencia, y no muestres las coordenadas exactas. Si es `false`, mostrá las coordenadas o un marcador.

# Prompt 8: Notificaciones y Panel de Auditoría (Fase 4 y 5):

Por último, vamos a implementar las alertas en `/ajustes-app.tsx` y el panel `/permisos.tsx`.

Para `/ajustes-app.tsx`:
1. Creá una pantalla con un componente `<Switch>` etiquetado "Avisarme cuando se resuelva mi reporte".
2. Al activar el Switch, verificá la plataforma. Si es `Platform.OS === 'android'`, llamá a `Notifications.setNotificationChannelAsync('reportes', { name: 'Resolución', importance: Notifications.AndroidImportance.MAX })`.
3. Solo después de crear el canal, invocá `Notifications.requestPermissionsAsync()`. Actualizá el estado del Switch según el resultado.

Para `/permisos.tsx` (Panel de estado):
1. Importá los hooks nativos de expo-camera, expo-location y expo-notifications y pasalos por `usePermiso`.
2. Renderizá una lista (`FlatList` o `ScrollView`) que muestre el estado en vivo de los tres recursos: Cámara, Ubicación y Notificaciones.
3. Indicá en el texto la plataforma actual (`Platform.OS`).
4. Si la ubicación tiene la prop `parcial` en true, agregá un *badge* o texto secundario que diga "Precisión reducida".