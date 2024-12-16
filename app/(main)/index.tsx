import { Button } from "@/components/ui/button";
import React, { useState } from "react";

import Points from "@/components/dropbox-points/points";
import GuidesCarousel from "@/components/guides";
import MobileHeader from "@/components/header";
import useThemeColors from "@/components/themeColors";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Href, useRouter } from "expo-router";
import { CalculatorIcon, FileText, MapPinIcon } from "lucide-react-native";
import { ScrollView } from "react-native";

const Home = () => {
  const themeColors = useThemeColors();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
      }}
    >
      <MobileHeader title={"Home"} isHomePage={true} />
       
      </Box>
    </ScrollView>
  );
};

export default Home;
