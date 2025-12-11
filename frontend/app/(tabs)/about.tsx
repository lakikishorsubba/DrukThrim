import { Text, View, StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <View
      style={styles.container}
    >
      <Text>this is about section</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D6F4ED",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});