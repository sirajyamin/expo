import { useSession } from "@/components/ctx";
import { Text } from "@/components/ui/text";
import useThemeColors from "@/components/themeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";
import Loader from "@/components/loader";
import { Box } from "@/components/ui/box";

export default function TabLayout() {
  const themeColors = useThemeColors();
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <Box className="flex w-full h-full items-center justify-center">
        <Loader />
      </Box>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/splash-screen" />;
  }

  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor: themeColors.background,
      }}
      screenOptions={{
        tabBarActiveTintColor: themeColors.button,
        tabBarInactiveTintColor: themeColors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.container,
          borderTopWidth: 0,
          height: 70,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Index",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="home" size={28} color={color} />
            ) : (
              <Ionicons name="home-outline" size={28} color={color} />
            ),
          tabBarItemStyle: {
            borderTopLeftRadius: 30,
            backgroundColor: themeColors.container,
          },
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="cube" size={28} color={color} />
            ) : (
              <Ionicons name="cube-outline" size={28} color={color} />
            ),
          tabBarItemStyle: {
            backgroundColor: themeColors.container,
          },
        }}
      />

      <Tabs.Screen
        name="create-booking/[id]"
        options={{
          title: "Create Booking",
          href: {
            pathname: "/create-booking/[id]",
            params: {
              id: "create",
            },
          },
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="add" size={33} color={color} />
            ) : (
              <Ionicons name="add-outline" size={33} color={color} />
            ),
          tabBarItemStyle: {
            backgroundColor: themeColors.container,
          },
        }}
      />

      <Tabs.Screen
        name="rates"
        options={{
          title: "Rates",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="calculator" size={28} color={color} />
            ) : (
              <Ionicons name="calculator-outline" size={28} color={color} />
            ),
          tabBarItemStyle: {
            backgroundColor: themeColors.container,
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="person-sharp" size={28} color={color} />
            ) : (
              <Ionicons name="person-sharp" size={28} color={color} />
            ),
          tabBarItemStyle: {
            borderTopRightRadius: 30,
            backgroundColor: themeColors.container,
          },
        }}
      />
    </Tabs>
  );
}
