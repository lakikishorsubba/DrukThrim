import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      {/* Dashboard Summary */}
      <View style={styles.summaryContainer}>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Budget</Text>
            <Text style={styles.cardValue}>Nu 53.0M</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Ongoing</Text>
            <Text style={styles.cardValue}>2 Projects</Text>
          </View>
        </View>
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Completed</Text>
            <Text style={styles.cardValue}>1 Project</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Utilization</Text>
            <Text style={styles.cardValue}>31%</Text>
          </View>
        </View>
      </View>

      {/* Projects List */}
      <View style={styles.projectContainer}>
        <Text style={styles.sectionTitle}>All Projects</Text>

        {/* Project Card Example */}
        <View style={styles.projectCard}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectTitle}>Thimphu General Hospital Renovation</Text>
            <Text style={styles.badgeOngoing}>Ongoing</Text>
            <Text style={styles.badgeHealth}>Health</Text>
          </View>
          <Text style={styles.projectInfo}>📍 Thimphu | 2025</Text>
          <View style={styles.budgetBar}>
            <View style={[styles.budgetSpent, { width: "57%" }]} />
          </View>
          <Text style={styles.projectBudget}>Spent: Nu 8.50M / Total Budget: Nu 15.00M</Text>
        </View>

        <View style={styles.projectCard}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectTitle}>Paro Primary School Construction</Text>
            <Text style={styles.badgeOngoing}>Ongoing</Text>
            <Text style={styles.badgeEducation}>Education</Text>
          </View>
          <Text style={styles.projectInfo}>📍 Paro | 2025</Text>
          <View style={styles.budgetBar}>
            <View style={[styles.budgetSpent, { width: "38%" }]} />
          </View>
          <Text style={styles.projectBudget}>Spent: Nu 3.20M / Total Budget: Nu 8.50M</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6F4ED",
  },
  summaryContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    color: "#fff",
  },
  cardsRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#70B2B2",
    padding: 16,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 8,
  },
  cardLabel: {
    color: "#fff",
    fontSize: 14,
  },
  cardValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  projectContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#70B2B2",
  },
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 4,
  },
  projectTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#70B2B2",
    flex: 1,
  },
  badgeOngoing: {
    backgroundColor: "#DDEBF7",
    color: "#1C4587",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },
  badgeHealth: {
    backgroundColor: "#FDE2E2",
    color: "#C10000",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },
  badgeEducation: {
    backgroundColor: "#E6F0FF",
    color: "#0047B3",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },
  projectInfo: {
    fontSize: 12,
    color: "#99A0B0",
    marginBottom: 4,
  },
  budgetBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 4,
  },
  budgetSpent: {
    height: 6,
    backgroundColor: "#70B2B2",
  },
  projectBudget: {
    fontSize: 12,
    color: "#70B2B2",
  },
});
