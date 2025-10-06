import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../context/userContext";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "http://127.0.0.1:8000/api/studenten";

export default function MijnBronnenScreen({ navigation }) {
  const { user } = useAuth();
  const studentId = user?.id;

  const [bronnen, setBronnen] = useState([]);
  const [loading, setLoading] = useState(false);

  // Haal eigen bronnen op
  const loadBronnen = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/mijn_bronnen/${studentId}`);
      if (!res.ok) throw new Error("Kon mijn bronnen niet ophalen");
      const data = await res.json();
      setBronnen(
        data.map((item) => ({
          id: item[0],
          bron_titel: item[1],
          bron_tekst: item[2],
          datum_aangemaakt: item[5],
          beoordeeld: item[6],
        }))
      );
    } catch (err) {
      Alert.alert("Fout", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) loadBronnen();
  }, [studentId]);

  // Verwijder één bron
  const handleDelete = async (bronId) => {
    console.log(`DELETE naar ${BASE_URL}/mijn_bronnen/${studentId}/${bronId}`);
    try {
      const res = await fetch(
        `${BASE_URL}/mijn_bronnen/${studentId}/${bronId}`,
        { method: "DELETE" }
      );
      console.log("DELETE status:", res.status);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      // Werk lijst lokaal bij
      setBronnen((prev) => prev.filter((b) => b.id !== bronId));
    } catch (err) {
      console.warn(err);
      Alert.alert("Fout", "Kon bron niet verwijderen");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#e60038" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bronnen}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Geen bronnen gevonden.</Text>
        )}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() =>
                navigation.navigate("BronDetail", { id: item.id })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.bron_titel}</Text>
                <Text style={styles.meta}>
                  {item.datum_aangemaakt.split(" ")[0]} •{" "}
                  {item.beoordeeld ? "Beoordeeld" : "Niet beoordeeld"}
                </Text>
                <Text numberOfLines={2} style={styles.text}>
                  {item.bron_tekst}
                </Text>
              </View>


              {/*wijzigen knop*/}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("bronWijzigen", { id: item.id })}
              >
                <Ionicons name="pencil-outline" size={20} color="#fff" />
                <Text style={styles.editText}>Wijzigen</Text>
              </TouchableOpacity>


            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.deleteText}>Verwijder</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  editButton: {

  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  meta: { fontSize: 12, color: "#999", marginBottom: 6 },
  text: { fontSize: 14, color: "#666", flexShrink: 1 },
  deleteButton: {
    backgroundColor: "#e60038",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  deleteText: { color: "#fff", fontSize: 14, marginLeft: 6 },
  emptyText: { textAlign: "center", marginTop: 40, color: "#999" },
});