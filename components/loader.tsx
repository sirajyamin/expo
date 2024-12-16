import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import useThemeColors from "./themeColors";

const Loader = () => {
  const opacity1 = useSharedValue(1);
  const opacity2 = useSharedValue(0.5);
  const opacity3 = useSharedValue(0);

  const themeColor = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    dot: {
      width: 8,
      height: 8,
      marginHorizontal: 8,
      borderRadius: 4,
      backgroundColor: themeColor.textPrimary,
    },
  });
  React.useEffect(() => {
    // Create a repeating opacity animation for each dot
    opacity1.value = withRepeat(withTiming(0, { duration: 800, easing: Easing.ease }), -1, true);
    opacity2.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.ease }), -1, true);
    opacity3.value = withRepeat(withTiming(0.5, { duration: 800, easing: Easing.ease }), -1, true);
  }, []);

  // Animated styles for each dot
  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: opacity3.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, animatedStyle1]} />
      <Animated.View style={[styles.dot, animatedStyle2]} />
      <Animated.View style={[styles.dot, animatedStyle3]} />
    </View>
  );
};

export default Loader;
