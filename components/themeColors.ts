import { useColorScheme } from "react-native";
import { useMemo } from "react";

const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return useMemo(
    () => ({
      background: isDarkMode ? "#0E151C" : "#EBEBEB",
      container: isDarkMode ? "#191E26" : "#FFFFFF",
      secondaryContainer: isDarkMode ? "#2D3645" : "#C9C9C9",
      primary: "#2CA7D9",
      icon: isDarkMode ? "#B3E4F1" : "#2BA7DE", // Default icon color
      accent: isDarkMode ? "#1E749A" : "#E3F4FB",
      textPrimary: isDarkMode ? "#FFFFFF" : "#000000",
      textSecondary: isDarkMode ? "#E0E0E0" : "#383838",
      text: isDarkMode ? "#D10003" : "#D10003",
      button: isDarkMode ? "#38AAD9" : "#2A9FCF",
      arrowBackButton: isDarkMode ? "#2D3645" : "#E0E0E0",
      buttonText: "#FFFFFF",
      secondaryButton: "#CBEAF0",
      border: isDarkMode ? "#D1D1D1" : "#000000",
      switchTrackActive: isDarkMode ? "#00d8ec" : "#225a9a",
      switchTrackInactive: isDarkMode ? "#225a9a" : "#00d8ec",
      switchThumbActive: isDarkMode ? "#00aaec" : "#223c9a",
      switchThumbInactive: isDarkMode ? "#223c9a" : "#00aaec",
      pending: isDarkMode ? "#F4B400" : "#F4A100", // Bright yellow-orange
      paid: isDarkMode ? "#007BFF" : "#0056B3", // Blue for paid
      rejected: isDarkMode ? "#E63946" : "#C82333", // Vibrant red for rejected
      completed: isDarkMode ? "#28A745" : "#218838", // Green for success
      all: isDarkMode ? "#38AAD9" : "#2A9FCF",
      iconStatus: isDarkMode ? "#E8E8E8" : "#F0F0F0",
    }),
    [isDarkMode],
  );
};

export default useThemeColors;
