import { AuthLayout } from "@/components/auth/layout";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

const SplashScreenWithLeftBackground = () => {
   return (
      <VStack
         className="w-full max-w-[440px] items-center h-full justify-center"
         space="lg"
      >
         <Image
            source={require("@/assets/images/adaptive-icon.png")}
            className="w-full h-[350px]  "
            resizeMode="contain"
            alt="Adaptive icon"
         />

         <VStack className="w-full" space="lg">
            <TouchableOpacity
               className="rounded-xl p-5 items-center"
               style={{ backgroundColor: "#2CA7D9" }}
               onPress={() => {
                  router.push("/(auth)/signin");
               }}
            >
               <Text className="text-xl font-bold text-white">Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
               className="rounded-xl p-5 items-center"
               style={{ backgroundColor: "#2CA7D9" }}
               onPress={() => {
                  router.push("/(auth)/signup");
               }}
            >
               <Text className="text-xl font-bold text-white">Sign Up</Text>
            </TouchableOpacity>
         </VStack>
      </VStack>
   );
};

const SplashScreen = () => {
   return (
      <AuthLayout>
         <SplashScreenWithLeftBackground />
      </AuthLayout>
   );
};

export default SplashScreen;
