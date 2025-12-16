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
import { Ionicons } from "@expo/vector-icons"; 

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // field-specific error states
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    server: "",
  });

  const API_URL = "http://10.197.242.246:3000/signup";

  const validateForm = () => {
    let valid = true;
    setErrors({ name: "", email: "", password: "", password_confirmation: "", server: "" });

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
    if (password !== passwordConfirmation) {
      setErrors(prev => ({ ...prev, password_confirmation: "Passwords do not match" }));
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
        body: JSON.stringify({
          user: { name, email, password, password_confirmation: passwordConfirmation },
        }),
      });
      
      // Safe JSON parsing to prevent 'Unexpected character: <' error
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();  
    } else {
    const text = await res.text();
    console.error("Server response is not JSON:", text);
    setErrors(prev => ({ ...prev, server: "Server returned invalid response" }));
    setLoading(false);
    return;
  }

      setLoading(false);

      if (res.ok) {
        router.replace("/login");
      } else if (data.errors) {
        // Map backend errors to fields
        const fieldErrors = { name: "", email: "", password: "", password_confirmation: "", server: "" };
        Object.keys(data.errors).forEach(field => {
          if (field in fieldErrors) {
            fieldErrors[field as keyof typeof fieldErrors] = data.errors[field].join("\n");
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors(prev => ({ ...prev, server: data.status?.message || "Could not create account" }));
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
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
        onChangeText={text => {
          setName(text);
          setErrors(prev => ({ ...prev, name: "" }));
        }}
      />
      {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={text => {
          setEmail(text);
          setErrors(prev => ({ ...prev, email: "" }));
        }}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

     
      <View style={styles.passwordContainer}> {/* 🔹 added container */}
        <TextInput
          style={styles.passwordInput}  // 🔹 different style for container adjustment
          placeholder="Password"
          secureTextEntry={!showPassword} // 🔹 toggle visibility
          value={password}
          onChangeText={text => {
            setPassword(text);
            setErrors(prev => ({ ...prev, password: "" }));
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(prev => !prev)} // 🔹 toggle state
          style={styles.eyeIcon}
        >
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      {/* Confirm Password field */}
      <View style={styles.passwordContainer}> {/* 🔹 added container */}
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword} // 🔹 toggle visibility
          value={passwordConfirmation}
          onChangeText={text => {
            setPasswordConfirmation(text);
            setErrors(prev => ({ ...prev, password_confirmation: "" }));
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(prev => !prev)} // 🔹 toggle state
          style={styles.eyeIcon}
        >
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      {errors.password_confirmation ? <Text style={styles.error}>{errors.password_confirmation}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
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

// Styles remain unchanged
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


  passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 14,
  paddingHorizontal: 12,
  marginBottom: 6,
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

});
