import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

export default function Profile() {
  const router = useRouter();

  // Direct IP of your Rails backend
  const API_URL = "http://10.197.242.246:3000";

  // Hardcoded token for testing (replace with real token if needed)
  const TOKEN = "YOUR_JWT_TOKEN_HERE";

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (res.ok) {
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
      {/* User Info */}
      <View style={styles.userInfo}>
        <Ionicons name="person-circle" size={80} color="#000" />
        <Text style={styles.userName}>Tashi Dorji</Text>
        <Text style={styles.userEmail}>tashi.dorji@example.bt</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 40,
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 8,
  },
  userEmail: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#ff4d4d",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
