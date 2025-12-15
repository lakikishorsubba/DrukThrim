import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      return setError("Please fill all fields");
    }

    setLoading(true);
    try {
      const res = await fetch("http://10.197.242.246:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email, password } }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        const token = res.headers.get("Authorization")?.split(" ").pop();
        if (token) {
          await SecureStore.setItemAsync("jwt_token", token);
        }
        router.replace("/(tabs)");
      } else {
        setError(data.status?.message || "Invalid email or password");
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
      setError("Server not reachable");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      {/* Toggle to Register */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => router.push("/signup")}>
               <Text style={styles.link}>
                 Not yet registered? <Text style={styles.linkUnderline}>Register</Text>
               </Text>
             </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
  },
  error: {
    color: "red",
    marginBottom: 12,
    fontSize: 14,
    marginLeft: 4,
  },
  button: {
    height: 48,
    backgroundColor: "#007bff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  toggleContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 16,
    color: "#444",
  },
  toggleLink: {
    color: "#007bff",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  link: { marginTop: 18, fontSize: 16, color: "#444", textAlign: "center" },
  linkUnderline: { color: "#007bff", textDecorationLine: "underline", fontWeight: "600" },
});
