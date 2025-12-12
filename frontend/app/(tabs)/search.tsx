import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");

  return (
    <View style={styles.container}>

      {/* FIXED SEARCH BAR */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search projects, budgets, dzongkhags..."
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* SCROLLABLE CONTENT BELOW */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 50 }}>

        {/* SECTION: Trending */}
        <Text style={styles.sectionTitle}>Trending Searches</Text>
        <View style={styles.chipContainer}>
          <Text style={styles.chip}>Road Maintenance</Text>
          <Text style={styles.chip}>Gewog Budget 2025</Text>
          <Text style={styles.chip}>School Renovation</Text>
          <Text style={styles.chip}>Irrigation Projects</Text>
        </View>

        {/* SECTION: Recent Searches */}
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>Water Supply Project</Text>
          <Text style={styles.listItem}>Agriculture Funds</Text>
          <Text style={styles.listItem}>Health Equipment</Text>
        </View>

        {/* SECTION: Suggested Categories */}
        <Text style={styles.sectionTitle}>📂 Categories</Text>
        <View style={styles.cardGrid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Roads</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Education</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Health</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Agriculture</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tourism</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /** FIXED SEARCH BAR */
  searchBarContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    elevation: 3,
    zIndex: 10,
  },

  searchInput: {
    height: 42,        // shorter height
    borderRadius: 16,  // rounded
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
  },

  /** SCROLLABLE AREA */
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  /** Chips */
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    color: "#003f8c",
    fontWeight: "500",
  },

  /** List items */
  list: {
    marginTop: 5,
  },

  listItem: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  /** Category Cards */
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },

  card: {
    width: "47%",
    backgroundColor: "#f2f2f2",
    paddingVertical: 20,
    borderRadius: 14,
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
