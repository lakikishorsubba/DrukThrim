import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

/* 🔧 CONFIG */
const API_URL = "http://10.80.192.246:3000/v1/posts";
const PROFILE_URL = "http://10.80.192.246:3000/v1/profile";

/* =======================
   🧩 TYPES
======================= */
type ImageType = { id?: number; url?: string; uri?: string };
type UserType = {
  id: number;
  name?: string;
  avatar_url?: string | null;
};
type PostType = {
  id: number;
  title?: string;
  description?: string;
  created_at: string;
  user?: UserType;
  images?: ImageType[];
};

/* =======================
   📱 FEED SCREEN
======================= */
export default function FeedScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImages, setNewImages] = useState<ImageType[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  /* =======================
     FETCH CURRENT USER PROFILE
  ======================= */
  const fetchProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (!token) return router.replace("/login");

      const res = await fetch(PROFILE_URL, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) return console.warn("Failed to fetch profile");

      const data: UserType = await res.json();
      setCurrentUser(data);
    } catch (e) {
      console.error("Profile fetch error:", e);
    }
  };

  /* =======================
     FETCH FEED
  ======================= */
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (!token) return router.replace("/login");

      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) return Alert.alert("Error fetching feed");

      const data: PostType[] = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
      Alert.alert("Error fetching feed", String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchFeed();
  }, []);

  /* =======================
     PICK IMAGES
  ======================= */
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission required");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) setNewImages((prev) => [...prev, ...result.assets]);
  };

  /* =======================
     SUBMIT NEW POST
  ======================= */
  const submitPost = async () => {
    if (!newTitle && !newDescription && newImages.length === 0)
      return Alert.alert("Please add title, text, or images");

    setSubmitting(true);
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (!token) return router.replace("/login");

      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("description", newDescription);

      newImages.forEach((img, idx) =>
        formData.append("images[]", { uri: img.uri, name: `image_${idx}.jpg`, type: "image/jpeg" } as any)
      );

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: formData,
      });

      if (res.ok) {
        Alert.alert("Post created!");
        setModalVisible(false);
        setNewTitle("");
        setNewDescription("");
        setNewImages([]);
        fetchFeed();
      } else {
        const err = await res.text();
        Alert.alert("Error creating post", err);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error creating post", String(e));
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================
     RENDER POST
  ======================= */
  const renderPost: React.ComponentProps<typeof FlatList<PostType>>["renderItem"] = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        {item.user?.avatar_url ? (
          <Image source={{ uri: item.user.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitials}>
              {item.user?.name
                ? item.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "U"}
            </Text>
          </View>
        )}
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.username}>{item.user?.name || `User #${item.user?.id}`}</Text>
          <Text style={styles.time}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>
      </View>

      {item.title && <Text style={styles.postTitle}>{item.title}</Text>}
      {item.description && <Text style={styles.postText}>{item.description}</Text>}

      {item.images?.length > 0 && (
        <FlatList<ImageType>
          data={item.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(img, idx) => (img.id?.toString() || idx.toString())}
          renderItem={({ item }) => <Image source={{ uri: item.url }} style={styles.postImage} />}
          style={{ marginVertical: 8 }}
        />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>👍 Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>↪️ Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F2F5" }}>
      {/* Create Post Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create Post</Text>
          <TextInput placeholder="Title (optional)" value={newTitle} onChangeText={setNewTitle} style={styles.input} />
          <TextInput
            placeholder="What's on your mind?"
            value={newDescription}
            onChangeText={setNewDescription}
            style={[styles.input, { height: 100 }]}
            multiline
          />

          <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
            <Text style={styles.pickButtonText}>📷 Pick Images</Text>
          </TouchableOpacity>

          <View style={styles.previewImages}>
            {newImages.map((img, idx) => (
              <Image key={idx} source={{ uri: img.uri }} style={styles.previewImage} />
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={submitPost} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Post</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* Feed */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList<PostType>
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          ListHeaderComponent={
            <TouchableOpacity style={styles.createBox} onPress={() => setModalVisible(true)}>
              {currentUser?.avatar_url ? (
                <Image source={{ uri: currentUser.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar} />
              )}
              <Text style={styles.placeholderText}>What's on your mind?</Text>
            </TouchableOpacity>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

/* =======================
   🎨 STYLES
======================= */
const styles = StyleSheet.create({
  createBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, margin: 12, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#DDD" },
  avatarPlaceholder: { backgroundColor: "#AAA", justifyContent: "center", alignItems: "center" },
  avatarInitials: { color: "#fff", fontWeight: "700" },
  placeholderText: { color: "#999", marginLeft: 12, fontSize: 14 },
  postCard: { backgroundColor: "#fff", marginHorizontal: 12, marginVertical: 6, borderRadius: 12, padding: 12, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  username: { fontWeight: "600", fontSize: 14 },
  time: { fontSize: 12, color: "#888" },
  postTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4, color: "#000" },
  postText: { fontSize: 14, color: "#050505", marginBottom: 6 },
  postImage: { width: 280, height: 200, borderRadius: 12, marginRight: 8, backgroundColor: "#eee" },
  postActions: { flexDirection: "row", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: "#E5E5EA", marginTop: 8, paddingTop: 6 },
  actionButton: { flex: 1, alignItems: "center", paddingVertical: 6 },
  actionText: { color: "#555", fontWeight: "600" },
  modalContainer: { padding: 16, paddingTop: 40, backgroundColor: "#F0F2F5", flexGrow: 1 },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },
  pickButton: { backgroundColor: "#1C4587", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  pickButtonText: { color: "#fff", fontWeight: "600" },
  previewImages: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  previewImage: { width: 80, height: 80, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  submitButton: { backgroundColor: "#28A745", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  submitButtonText: { color: "#fff", fontWeight: "700" },
  cancelButton: { alignItems: "center", marginBottom: 20 },
  cancelButtonText: { color: "#555", fontWeight: "600" },
});
