import { useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import PermisoFallback from "../../components/PermisoFallback";
import { usePermiso } from "../../hooks/usePermiso";

export default function EscanearAulaScreen() {
  const router = useRouter();
  const permisoCamara = useCameraPermissions();
  const { estado, pedir, abrirAjustes } = usePermiso(permisoCamara);
  const [codigoAula, setCodigoAula] = useState("");

  const enviarCodigo = () => {
    const codigo = codigoAula.trim();
    if (codigo.length > 0) {
      router.navigate({
        pathname: "/reporte/nuevo",
        params: { qr: codigo },
      });
    }
  };

  if (estado !== "concedido") {
    return (
      <PermisoFallback
        titulo="Escaneo de aula opcional"
        mensaje="Usamos tu cámara para leer el QR del aula. También podés continuar ingresando el código manualmente."
        estado={estado}
        onPedir={pedir}
        onAbrirAjustes={abrirAjustes}
        campoAlternativo={{
          autoCapitalize: "characters",
          label: "Ingresar código de aula manualmente",
          placeholder: "Ej.: AULA-101",
          value: codigoAula,
          onChangeText: setCodigoAula,
          onSubmitEditing: enviarCodigo,
        }}
        accionAlternativaDeshabilitada={codigoAula.trim().length === 0}
        onAccionAlternativa={enviarCodigo}
        textoAccionAlternativa="Usar código"
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) =>
          router.navigate({
            pathname: "/reporte/nuevo",
            params: { qr: data },
          })
        }
        style={styles.camera}
      />
      <View style={styles.scanHint}>
        <Text style={styles.text}>Escaneá el código QR del aula</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E293B",
  },
  camera: {
    flex: 1,
  },
  scanHint: {
    alignItems: "center",
    backgroundColor: "#1E293B",
    gap: 8,
    padding: 20,
  },
  text: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
});
