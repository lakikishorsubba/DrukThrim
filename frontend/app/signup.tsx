import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://10.197.242.246:3000/signup";

  const validateForm = () => {
    if (name.length < 2) return "Name must be at least 2 characters";
    if (!email.includes("@")) return "Invalid email format";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSignup = async () => {
    const err = validateForm();
    if (err) return Alert.alert("Error", err);

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { name, email, password } }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        Alert.alert("Success", "Account created successfully!");
        router.replace("/login");
      } else {
        Alert.alert("Signup Failed", data.status?.message || "Could not create account");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Server not reachable");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 32, textAlign: "center" },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  button: {
    height: 48,
    backgroundColor: "#007bff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { marginTop: 18, fontSize: 16, color: "#007bff", textAlign: "center" },
});
