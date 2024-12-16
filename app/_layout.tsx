import { SessionProvider } from "@/components/ctx";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/components/useColorScheme";
import { createApolloClient } from "@/lib/apolloclient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../global.css";

import { ApolloProvider } from "@apollo/client";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <GluestackUIProvider mode={(colorScheme ?? "light") as "light" | "dark"}>
      <ApolloProvider client={createApolloClient}>
        <SessionProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              statusBarStyle: colorScheme === "dark" ? "light" : "dark",
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(main)" />
            <Stack.Screen name="(auth)/splash-screen" />
            <Stack.Screen name="(auth)/signin" />
            <Stack.Screen name="(auth)/signup" />
            <Stack.Screen name="(auth)/forgot-password" />
            <Stack.Screen name="(auth)/reset/[email]" />
            <Stack.Screen name="(auth)/verify-account/[email]" />
          </Stack>
        </SessionProvider>
      </ApolloProvider>
      {/* </ThemeProvider> */}
    </GluestackUIProvider>
  );
}
