import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons"; // 🔹 Added for eye icon

interface FieldErrors {
  email: string;
  password: string;
  general?: string;
}

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({ email: "", password: "" });

  const [showPassword, setShowPassword] = useState(false); // 🔹 Added state for password toggle

  const handleLogin = async () => {
    setErrors({ email: "", password: "" });

    if (!email || !password) {
      setErrors({
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://10.80.192.246:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ user: { email, password } }),
      });

      let data: any;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Server returned non-JSON response:", text);
        setErrors(prev => ({ ...prev, general: "Server returned invalid response" }));
        setLoading(false);
        return;
      }

      setLoading(false);

      if (res.ok) {
        const token = res.headers.get("Authorization")?.split(" ").pop();
        if (token) {
          await SecureStore.setItemAsync("jwt_token", token);
        }
        router.replace("/(tabs)");
      } else if (data.errors) {
        const fieldErrors: FieldErrors = { email: "", password: "" };
        Object.keys(data.errors).forEach(key => {
          if (key in fieldErrors) {
            fieldErrors[key as keyof FieldErrors] = data.errors[key].join("\n");
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({
          email: "",
          password: "",
          general: data.message || "Invalid email or password",
        });
      }
    } catch (e) {
      setLoading(false);
      console.error("Network error:", e);
      setErrors({ email: "", password: "", general: "Server not reachable" });
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
        onChangeText={text => {
          setEmail(text);
          setErrors(prev => ({ ...prev, email: "" }));
        }}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      {/* 🔹 Password input with toggle */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword} // 🔹 toggle
          value={password}
          onChangeText={text => {
            setPassword(text);
            setErrors(prev => ({ ...prev, password: "" }));
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      {errors.general ? <Text style={styles.error}>{errors.general}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

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
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30, textAlign: "center" },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
  },
  error: { color: "red", fontSize: 14, marginBottom: 12, marginLeft: 4 },

  /* 🔹 Password container & input */
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#f8f8f8",
  },
  passwordInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    padding: 6,
  },

  button: {
    height: 48,
    backgroundColor: "#007bff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  toggleContainer: { marginTop: 16, alignItems: "center" },
  link: { marginTop: 18, fontSize: 16, color: "#444", textAlign: "center" },
  linkUnderline: { color: "#007bff", textDecorationLine: "underline", fontWeight: "600" },
});
