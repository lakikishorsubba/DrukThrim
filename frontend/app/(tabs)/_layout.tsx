import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#70B2B2",
        tabBarInactiveTintColor: "#99A0B0",
        tabBarStyle: {
          backgroundColor: "#D6F4ED",
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
          borderTopWidth: 0.5,
          borderTopColor: "#dcdcdc",
        },
        headerStyle: {
          backgroundColor: "#70B2B2",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "DrukThrim",
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          headerTitle: "About DrukThrim",
          tabBarLabel: "About",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "information-circle" : "information-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="+not-found"
        options={{
          headerTitle: "Not Found",
          tabBarLabel: "404",
          tabBarIcon: ({ color }) => <Ionicons name="alert-circle-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
