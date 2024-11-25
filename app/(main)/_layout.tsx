import { Redirect, Stack } from "expo-router";
import React from "react";

import { useSession } from "@/hooks/ctx";
import { Text } from "react-native";

export default function TabLayout() {
   const { session, isLoading } = useSession();

   if (isLoading) {
      return <Text>Loading...</Text>;
   }

   if (!session) {
      return <Redirect href="/sign-in" />;
   }

   return (
      <Stack>
         <Stack.Screen name="index" options={{ headerShown: false }} />
         <Stack.Screen name="calculator" options={{ headerShown: false }} />
         <Stack.Screen name="rates" options={{ headerShown: false }} />
      </Stack>
   );
}
