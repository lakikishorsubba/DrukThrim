import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function NotFoundScreen(){
  return (
    <>
     <View
      style={styles.container}>
      <Text>opps! not foundsssss</Text>
      <Link href={"/"}  style={styles.button}> 
      Go back to Home Screen
      </Link>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
  }
});