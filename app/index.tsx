import { useSession } from "@/components/ctx";
import Loader from "@/components/loader";
import useThemeColors from "@/components/themeColors";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import NetInfo from "@react-native-community/netinfo";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { WifiOff } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const stories = [
  { id: 1, image: require("@/assets/story/image.jpeg") },
  { id: 2, image: require("@/assets/story/image2.jpeg") },
  { id: 3, image: require("@/assets/story/image3.jpeg") },
  { id: 4, image: require("@/assets/story/image4.jpeg") },
];

const STORY_DURATION = 5000;

export default function InstagramStoryScreen() {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    progressBarContainer: {
      position: "absolute",
      top: 50,
      flexDirection: "row",
      width: "90%",
      height: 5,
      alignSelf: "center",
    },
    progressBarBackground: {
      flex: 1,
      height: 7,
      backgroundColor: "white",
      marginHorizontal: 2,
      borderRadius: 5,
      opacity: 0.6,
    },
    progressBar: {
      height: 7,
      borderRadius: 5,
      backgroundColor: "black",
    },
    leftTouchableArea: {
      position: "absolute",
      left: 0,
      width: "50%",
      height: "100%",
    },
    rightTouchableArea: {
      position: "absolute",
      right: 0,
      width: "50%",
      height: "100%",
    },
  });

  const { session, isLoading } = useSession();
  const [isConnected, setIsConnected] = useState(true);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    const checkConnectivity = () => {
      NetInfo.fetch().then((state) => {
        setIsConnected(state.isConnected);
      });
    };

    checkConnectivity();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    startProgress();

    return () => {
      progress.value = 0;
    };
  }, [currentStoryIndex]);

  const startProgress = () => {
    progress.value = withTiming(
      1,
      {
        duration: STORY_DURATION,
        easing: Easing.linear,
      },
      (isFinished) => {
        if (isFinished) {
          runOnJS(handleNextStory)();
        }
      },
    );
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prevIndex) => prevIndex + 1);
      progress.value = 0;
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prevIndex) => prevIndex - 1);
      progress.value = 0;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  if (isLoading || !isConnected) {
    return <Loader />;
  }

  return (
    <>
      <GestureHandlerRootView>
        <PanGestureHandler
          onGestureEvent={(e) => {
            if (e.nativeEvent.translationX > 0) {
              handlePreviousStory();
            } else if (e.nativeEvent.translationX < 0) {
              handleNextStory();
            }
          }}
        >
          <View style={styles.container}>
            <Image source={stories[currentStoryIndex].image} style={styles.image} />

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              {stories.map((_, index) => {
                const isCompleted = index < currentStoryIndex;
                const isActive = index === currentStoryIndex;

                return (
                  <View key={index} style={styles.progressBarBackground}>
                    {isCompleted && <View style={[styles.progressBar, { width: "100%" }]} />}
                    {isActive && <Animated.View style={[styles.progressBar, animatedStyle]} />}
                  </View>
                );
              })}
            </View>

            <TouchableWithoutFeedback onPress={handlePreviousStory}>
              <View style={styles.leftTouchableArea} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={handleNextStory}>
              <View style={styles.rightTouchableArea} />
            </TouchableWithoutFeedback>
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>

      <BlurView intensity={600} tint="light">
        <Box className="absolute bottom-10 w-full h-20 px-5">
          <Box className="flex-1 flex-row justify-between  items-center">
            <Box
              className="w-full h-full absolute rounded-full bg-white border border-white"
              style={{
                opacity: 0.5, // For transparency
                // add backdrop filter

                backgroundColor: "rgba(0, 0, 0, 0.5)", // Light white background with transparency
              }}
            />
            <Box className="flex-row items-center gap-4">
              <Text className="text-white font-bold text-lg ml-4">Continue</Text>
              <Icon as={ArrowRightIcon} size="lg" />
            </Box>
            <Button
              variant="outline"
              onPress={() => router.push(session ? "/(main)" : "/(auth)/splash-screen")}
              className="w-auto bg-blue-900 m-1 h-[4.5rem] rounded-full"
            >
              <Text className="text-white font-bold text-lg">Get Started</Text>
            </Button>
          </Box>
        </Box>
      </BlurView>
    </>
  );
}
