import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // field-specific error states
  const [errors, setErrors] = useState({ name: "", email: "", password: "", server: "" });

  const API_URL = "http://10.197.242.246:3000/signup";

  const validateForm = () => {
    let valid = true;
    setErrors({ name: "", email: "", password: "", server: "" });

    if (name.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: "Name must be at least 2 characters" }));
      valid = false;
    }
    if (!email.includes("@")) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email" }));
      valid = false;
    }
    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
      valid = false;
    }
    return valid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

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
        router.replace("/login");
      } else if (data.errors) {
        // map backend errors to field
        const fieldErrors = { name: "", email: "", password: "", server: "" };
        Object.keys(data.errors).forEach(field => {
          fieldErrors[field] = data.errors[field].join("\n");
        });
        setErrors(fieldErrors);
      } else {
        setErrors(prev => ({ ...prev, server: "Could not create account" }));
      }
    } catch (error) {
      setLoading(false);
      setErrors(prev => ({ ...prev, server: "Server not reachable" }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      {errors.server ? <Text style={styles.error}>{errors.server}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 6,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
  },
  error: { color: "red", fontSize: 14, marginBottom: 10, marginLeft: 4 },
  button: { height: 48, backgroundColor: "#007bff", borderRadius: 14, justifyContent: "center", alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { marginTop: 18, fontSize: 16, color: "#444", textAlign: "center" },
  linkUnderline: { color: "#007bff", textDecorationLine: "underline", fontWeight: "600" },
});
