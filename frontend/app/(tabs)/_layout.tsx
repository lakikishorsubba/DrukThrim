import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000", // active tab text in black
        tabBarInactiveTintColor: "#999", // inactive tab text in gray
        tabBarStyle: {
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
          borderTopWidth: 0.5,
          borderTopColor: "#dcdcdc",
        },
        headerTintColor: "#000", // header text in black
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
        name="search"
        options={{
          headerTitle: "Search",
          tabBarLabel: "Search",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerTitle: "Notifications",
          tabBarLabel: "Notifications",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
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
