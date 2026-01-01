import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  TextInput, // <-- added
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const API_URL = "http://10.80.192.246:3000";

  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar_url?: string | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  // NEW: state for editing name
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  /*Fetch current user*/
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt_token");
        if (!token) return router.replace("/login");

        const res = await fetch(`${API_URL}/users/current_user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setNameInput(data.name); // <-- initialize input
        } else {
          Alert.alert("Error", "Failed to load user info");
        }
      } catch (e) {
        Alert.alert("Error", "Server not reachable");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  /* Pick image */
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  /* Upload avatar */
  const uploadAvatar = async (uri: string) => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (!token) return router.replace("/login");

      const formData = new FormData();
      formData.append("avatar", {
        uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      const res = await fetch(`${API_URL}/users/profile/avatar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUser((prev) => prev && { ...prev, avatar_url: data.avatar_url });
        Alert.alert("Success", "Profile picture updated");
      } else {
        Alert.alert("Error", "Upload failed");
      }
    } catch (e) {
      Alert.alert("Error", "Server not reachable");
    }
  };

  // NEW: update name API
  const updateName = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (!token) return router.replace("/login");

      const res = await fetch(`${API_URL}/users/profile/name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nameInput }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser((prev) => prev && { ...prev, name: data.name });
        setEditingName(false);
        Alert.alert("Success", "Name updated");
      } else {
        Alert.alert("Error", "Failed to update name");
      }
    } catch (e) {
      Alert.alert("Error", "Server not reachable");
    }
  };

  /* Logout */
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        {/* CLICKABLE AVATAR */}
        <TouchableOpacity onPress={pickImage}>
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={90} color="#007bff" />
          )}
        </TouchableOpacity>

        {/* EDITABLE NAME */}

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
          {editingName ? (
            <>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                style={styles.editNameInput}
                autoFocus
              />
              <TouchableOpacity
                onPress={updateName}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Text style={styles.userName}>{user?.name}</Text>
            </TouchableOpacity>
  )}
</View>

        <Text style={styles.userEmail}>{user?.email}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f2f5" },
  card: { width: "90%", backgroundColor: "#fff", borderRadius: 16, padding: 24, alignItems: "center", elevation: 5 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  userName: { fontSize: 22, fontWeight: "600", marginTop: 12 },
  editNameInput: { fontSize: 22, fontWeight: "600", borderBottomWidth: 1, borderColor: "#007bff", marginTop: 12, width: 200, textAlign: "center" }, // <-- new
  userEmail: { fontSize: 16, color: "#555", marginBottom: 20 },
  logoutButton: { flexDirection: "row", backgroundColor: "#ff4d4d", padding: 12, borderRadius: 12, alignItems: "center", gap: 8 },
  logoutText: { color: "#fff", fontWeight: "600" },

  saveButton: {
  marginLeft: 9,
  backgroundColor: "#239e21",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 8,
},
saveButtonText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 14,
}
});
