import { useRouter } from "expo-router";
import { Pressable, View, Image, useColorScheme } from "react-native";
import { ArrowLeftIcon, ChevronLeft, StepBackIcon } from "lucide-react-native";
import { HStack } from "./ui/hstack";
import useThemeColors from "./themeColors";
import { Text } from "./ui/text";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type MobileHeaderProps = {
  title: string;
  isHomePage: boolean;
};

function MobileHeader({ title, isHomePage }: MobileHeaderProps) {
  const themeColors = useThemeColors();
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <View className="w-full mx-auto">
      <HStack
        className="h-[100px] px-3 items-center justify-between"
        style={{
          backgroundColor: themeColors.container,
        }}
      >
        <HStack className="items-center pt-10 gap-6">
          {!isHomePage && (
            <Pressable
              onPress={router.back}
              className="w-8 h-8 items-center justify-center rounded-full p-5 ml-3"
              style={{
                backgroundColor: themeColors.arrowBackButton,
              }}
            >
              <ArrowLeftIcon color={themeColors.textSecondary} size={18} />
            </Pressable>
          )}

          {isHomePage ? (
            <HStack className="items-center gap-2">
              <Image
                source={require("../assets/images/adaptive-icon2.png")}
                style={{
                  width: 80,
                  height: 80,
                  tintColor: colorScheme === "dark" ? "white" : undefined,
                }}
                className="rounded-full"
              />
              <HStack className="flex-row items-center">
                <Text className="text-2xl font-semibold">Global Parcel Service</Text>
              </HStack>
            </HStack>
          ) : (
            <Text
              className="text-2xl font-semibold"
              style={{
                color: themeColors.textPrimary,
              }}
            >
              {title}
            </Text>
          )}
        </HStack>
      </HStack>
    </View>
  );
}

export default MobileHeader;
