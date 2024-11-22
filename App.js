import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Switch, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [formData, setFormData] = useState({
    horaRecebimento: "",
    formaAcionamento: "",
    horarioSaida: "",
    horarioNoLocal: "",
    horarioSaidaLocal: "",
    horarioChegadaDestino: "",
    horarioRetornoQuartel: "",
    hodometroSaida: "",
    hodometroLocal: "",
    apoio: "",
    nomeApoio: "",
    matriculaApoio: "",
    veiculoEnvolvido: false,
    veiculo1: {
      modelo: "",
      cor: "",
      placa: "",
      estado: "",
      nomeCondutor: "",
      rgCpf: "",
      orgaoExpedidor: "",
    },
    veiculo2: {
      modelo: "",
      cor: "",
      placa: "",
      estado: "",
      nomeCondutor: "",
      rgCpf: "",
      orgaoExpedidor: "",
    },
  });

  const [savedOccurrences, setSavedOccurrences] = useState([]);

  // Atualiza os campos do formulário
  const handleInputChange = (key, value, veiculo = null) => {
    if (veiculo) {
      setFormData((prev) => ({
        ...prev,
        [veiculo]: {
          ...prev[veiculo],
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Salva os dados localmente
  const saveOccurrence = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@ocorrencias");
      const currentData = storedData ? JSON.parse(storedData) : [];
      const newData = [...currentData, formData];

      await AsyncStorage.setItem("@ocorrencias", JSON.stringify(newData));
      setSavedOccurrences(newData);
      Alert.alert("Sucesso", "Ocorrência salva com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a ocorrência.");
    }
  };

  // Carrega as ocorrências salvas ao iniciar
  const loadOccurrences = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@ocorrencias");
      if (storedData) {
        setSavedOccurrences(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Erro ao carregar as ocorrências:", error);
    }
  };

  // Carrega ocorrências salvas quando o app é iniciado
  React.useEffect(() => {
    loadOccurrences();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ocorrências</Text>

      {/* Formulário principal */}
      <Button
        title="Lançar Ocorrência"
        onPress={() => {
          setFormData({
            ...formData,
            veiculoEnvolvido: false,
            veiculo1: { modelo: "", cor: "", placa: "", estado: "", nomeCondutor: "", rgCpf: "", orgaoExpedidor: "" },
            veiculo2: { modelo: "", cor: "", placa: "", estado: "", nomeCondutor: "", rgCpf: "", orgaoExpedidor: "" },
          });
        }}
      />

      <View style={styles.form}>
        {[
          { label: "Hora do recebimento", key: "horaRecebimento" },
          { label: "Forma de acionamento", key: "formaAcionamento" },
          { label: "Horário de saída", key: "horarioSaida" },
          { label: "Horário no local", key: "horarioNoLocal" },
          { label: "Horário saída do local", key: "horarioSaidaLocal" },
          { label: "Horário chegada destino", key: "horarioChegadaDestino" },
          { label: "Horário retorno quartel", key: "horarioRetornoQuartel" },
          { label: "Hodômetro saída", key: "hodometroSaida" },
          { label: "Hodômetro local", key: "hodometroLocal" },
          { label: "Apoio", key: "apoio" },
          { label: "Nome do apoio", key: "nomeApoio" },
          { label: "Matrícula do apoio", key: "matriculaApoio" },
        ].map((item) => (
          <View key={item.key} style={styles.inputGroup}>
            <Text>{item.label}</Text>
            <TextInput
              style={styles.input}
              value={formData[item.key]}
              onChangeText={(text) => handleInputChange(item.key, text)}
            />
          </View>
        ))}

        {/* Veículo envolvido */}
        <View style={styles.inputGroup}>
          <Text>Veículo envolvido?</Text>
          <Switch
            value={formData.veiculoEnvolvido}
            onValueChange={(value) => handleInputChange("veiculoEnvolvido", value)}
          />
        </View>

        {formData.veiculoEnvolvido && ["veiculo1", "veiculo2"].map((veiculo) => (
          <View key={veiculo}>
            <Text style={styles.subTitle}>{veiculo === "veiculo1" ? "Veículo 1" : "Veículo 2"}</Text>
            {[
              { label: "Modelo", key: "modelo" },
              { label: "Cor predominante", key: "cor" },
              { label: "Placa", key: "placa" },
              { label: "Estado", key: "estado" },
              { label: "Nome do condutor", key: "nomeCondutor" },
              { label: "RG/CPF", key: "rgCpf" },
              { label: "Órgão expedidor", key: "orgaoExpedidor" },
            ].map((item) => (
              <View key={item.key} style={styles.inputGroup}>
                <Text>{item.label}</Text>
                <TextInput
                  style={styles.input}
                  value={formData[veiculo][item.key]}
                  onChangeText={(text) => handleInputChange(item.key, text, veiculo)}
                />
              </View>
            ))}
          </View>
        ))}

        {/* Botão salvar */}
        <Button title="Salvar Ocorrência" onPress={saveOccurrence} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
