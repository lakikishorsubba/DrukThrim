import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    server: "",
  });

  const API_URL = "http://10.80.192.246:3000/signup";

  const validateForm = () => {
    let valid = true;
    setErrors({ name: "", email: "", password: "", password_confirmation: "", server: "" });

    if (name.trim().length < 2) { setErrors(prev => ({ ...prev, name: "Name must be at least 2 characters" })); valid = false; }
    if (!email.includes("@")) { setErrors(prev => ({ ...prev, email: "Please enter a valid email" })); valid = false; }
    if (password.length < 6) { setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" })); valid = false; }
    if (password !== passwordConfirmation) { setErrors(prev => ({ ...prev, password_confirmation: "Passwords do not match" })); valid = false; }

    return valid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { name, email, password, password_confirmation: passwordConfirmation } }),
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Server response not JSON:", text);
        setErrors(prev => ({ ...prev, server: "Server returned invalid response" }));
        setLoading(false);
        return;
      }

      if (res.ok) {
        router.replace("/login");
      } else if (data.errors) {
        const fieldErrors = { name: "", email: "", password: "", password_confirmation: "", server: "" };
        Object.keys(data.errors).forEach(field => {
          if (field in fieldErrors) {
            fieldErrors[field as keyof typeof fieldErrors] = data.errors[field].join("\n");
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors(prev => ({ ...prev, server: data.message || "Could not create account" }));
      }
    } catch (error) {
      console.error(error);
      setErrors(prev => ({ ...prev, server: "Server not reachable" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={t => { setName(t); setErrors(prev => ({ ...prev, name: "" })); }} />
      {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={t => { setEmail(t); setErrors(prev => ({ ...prev, email: "" })); }} />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput style={styles.passwordInput} placeholder="Password" secureTextEntry={!showPassword} value={password} onChangeText={t => { setPassword(t); setErrors(prev => ({ ...prev, password: "" })); }} />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput style={styles.passwordInput} placeholder="Confirm Password" secureTextEntry={!showPassword} value={passwordConfirmation} onChangeText={t => { setPasswordConfirmation(t); setErrors(prev => ({ ...prev, password_confirmation: "" })); }} />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      {errors.password_confirmation ? <Text style={styles.error}>{errors.password_confirmation}</Text> : null}

      {errors.server ? <Text style={styles.error}>{errors.server}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.linkUnderline}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 32, textAlign: "center" },
  input: { height: 48, borderWidth: 1, borderColor: "#ccc", borderRadius: 14, paddingHorizontal: 14, marginBottom: 6, fontSize: 16, backgroundColor: "#f8f8f8" },
  error: { color: "red", fontSize: 14, marginBottom: 10, marginLeft: 4 },
  button: { height: 48, backgroundColor: "#007bff", borderRadius: 14, justifyContent: "center", alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { marginTop: 18, fontSize: 16, color: "#444", textAlign: "center" },
  linkUnderline: { color: "#007bff", textDecorationLine: "underline", fontWeight: "600" },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 14, paddingHorizontal: 12, marginBottom: 6, backgroundColor: "#f8f8f8" },
  passwordInput: { flex: 1, height: 48, fontSize: 16, color: "#000" },
  eyeIcon: { padding: 6 },
});
