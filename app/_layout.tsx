import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import "react-native-reanimated";
import { SessionProvider } from "@/hooks/ctx";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
   uri: "http://localhost:8000/graphql",
   cache: new InMemoryCache(),
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
   const [loaded] = useFonts({
      SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
   });

   useEffect(() => {
      if (loaded) {
         SplashScreen.hideAsync();
      }
   }, [loaded]);

   if (!loaded) {
      return null;
   }

   return (
      <GluestackUIProvider mode="light">
         <ApolloProvider client={client}>
            <SessionProvider>
               <Stack>
                  <Stack.Screen
                     name="(main)"
                     options={{ headerShown: false }}
                  />
                  <Stack.Screen
                     name="sign-in"
                     options={{
                        presentation: "modal",
                     }}
                  />
                  <Stack.Screen name="+not-found" />
               </Stack>
            </SessionProvider>
         </ApolloProvider>
      </GluestackUIProvider>
   );
}
