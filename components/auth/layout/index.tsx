import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { useSession } from "@/components/ctx";
import { Text } from "@/components/ui/text";
import { Redirect } from "expo-router";
import useThemeColors from "@/components/themeColors";
type AuthLayoutProps = {
   children: React.ReactNode;
};

export const AuthLayout = (props: AuthLayoutProps) => {
   const { session, isLoading } = useSession();
   const themeColors = useThemeColors();

   if (isLoading) {
      return <Text>Loading...</Text>;
   }

   if (session) {
      return <Redirect href="/(main)" />;
   }

   return (
      <SafeAreaView className="w-full h-full">
         <ScrollView
            className="w-full h-full"
            contentContainerStyle={{ flexGrow: 1 }}
         >
            <HStack className="w-full h-full bg-background-0 flex-grow justify-center">
               <VStack className="md:items-center md:justify-center flex-1 w-full  p-9 md:gap-10 gap-16 md:m-auto md:w-1/2 h-full">
                  {props.children}
               </VStack>
            </HStack>
         </ScrollView>
      </SafeAreaView>
   );
};
