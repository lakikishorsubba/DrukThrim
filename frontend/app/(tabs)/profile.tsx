import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";

export default function Profile() {
  const router = useRouter();
  const API_URL = "http://10.197.242.246:3000";

  const handleLogout = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch(`${API_URL}/logout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await SecureStore.deleteItemAsync("jwt_token");
        Alert.alert("Success", "Logged out successfully!");
        router.replace("/login");
      } else {
        Alert.alert("Error", "Could not log out.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Server not reachable.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Card */}
      <View style={styles.card}>
        <Ionicons name="person-circle" size={80} color="#007bff" />
        <Text style={styles.userName}>Tashi Dorji</Text>
        <Text style={styles.userEmail}>tashi.dorji@example.bt</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16, backgroundColor: "#f0f2f5" },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  userName: { fontSize: 22, fontWeight: "600", marginTop: 12 },
  userEmail: { fontSize: 16, color: "#555", marginTop: 4, marginBottom: 20 },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
