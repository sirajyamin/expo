import React, { useState, useRef } from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ImageSourcePropType,
  ScrollView,
} from "react-native";
import useThemeColors from "@/components/themeColors";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const guideSteps = [
  {
    id: "1",
    number: "Step 1",
    image: require("../assets/images/Home.jpeg"),
    subheading: "Home Page User Guide",
    keyFeaturesOverview: {
      title: "Key Features Overview",
      items: [
        {
          feature: "Calculate",
          description: "1. Opens the Rates Calculator to help you estimate shipping costs.",
        },
        {
          feature: "Dropbox",
          description:
            "2. Displays nearby Dropbox Locations on a map, making it easy to find the best drop-off points.",
        },
        {
          feature: "Guides",
          description: "2. Read The guides to see how to use the application step by step.",
        },
      ],
    },
    howToUseDropbox: {
      title: "How to Use Dropbox Locations",
      steps: [
        {
          step: "Select City",
          description: "4. Select City for finding nearby dropbox points..",
        },
        {
          step: "Interactive Map",
          description: "5. A map will load showing all nearby Dropbox locations marked with pins.",
        },
        {
          step: "View Dropbox Details",
          description:
            "6. Tap a Marker: Tapping any marker on the map opens a popup displaying detailed information about that Dropbox.",
        },
      ],
    },
    navigationTips: {
      title: "General Navigation Tips",
      tips: [
        {
          tip: "Return to the Home Page",
          description:
            "1. If you're ever lost, simply tap the home icon in the header to return to the Home Page.",
        },
        {
          tip: "Navigation Between Features",
          description:
            "2. Use the Tabs buttons to seamlessly switch between the Bookings, Create Booking, Calculator and Settings Route.",
        },
      ],
    },
  },
  // {
  //   id: "2",
  //   number: "Step 2",
  //   image: require("../assets/images/gradient.jpg"),
  //   subheading: "How to Use the Booking Page",
  //   keyFeaturesOverview: {
  //     title: "Key Features Overview",
  //     items: [
  //       {
  //         feature: "View Bookings",
  //         description:
  //           "1. Your recent bookings will load automatically. If you see a spinning icon, wait for the bookings to load.",
  //       },
  //       {
  //         feature: "Search for a Booking",
  //         description:
  //           "2. Type your Tracking ID in the search bar at the top to find a specific booking.",
  //       },
  //       {
  //         feature: "Scan Barcode",
  //         description:
  //           "3. Tap the Barcode Icon to scan a tracking ID for quick access to booking details.",
  //       },
  //       {
  //         feature: "Booking Status",
  //         description:
  //           "4. Each booking shows a Tracking ID and Payment Status ('Paid' or 'Pending').",
  //       },
  //     ],
  //   },
  //   howToUseBookingPage: {
  //     title: "How to Use the Booking Page",
  //     steps: [
  //       {
  //         step: "Open the Booking Page",
  //         description:
  //           "1. Go to the 'Bookings' section from the main menu to open the Booking Page.",
  //       },
  //       {
  //         step: "View Your Bookings",
  //         description:
  //           "2. Your recent bookings will load automatically. If you see a spinning icon, wait for the bookings to load.",
  //       },
  //       {
  //         step: "Search for a Booking",
  //         description:
  //           "3. Type your Tracking ID in the search bar at the top to find a specific booking or tap the Barcode Icon to scan a tracking ID.",
  //       },
  //       {
  //         step: "Check Your Booking List",
  //         description:
  //           "4. Each booking shows a Tracking ID and Payment Status ('Paid' or 'Pending'). Tap the Tracking ID to view more details.",
  //       },
  //     ],
  //   },
  //   navigationTips: {
  //     title: "General Navigation Tips",
  //     tips: [
  //       {
  //         tip: "No Bookings Found?",
  //         description:
  //           "1. If no bookings appear, you’ll see: 'No recent shipping records found.' Double-check your ID or clear the search bar to try again.",
  //       },
  //       {
  //         tip: "Navigate Away from the Page",
  //         description:
  //           "2. Use the back button or the home icon to leave the page and return to the main menu.",
  //       },
  //     ],
  //   },
  // },
];

const { width } = Dimensions.get("window");
const carouselWidth = width * 1;

const GuidesCarousel: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewImage, setViewImage] = useState(false);
  const flatListRef = useRef(null);
  const themeColors = useThemeColors();

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const visibleWidth = event.nativeEvent.layoutMeasurement.width;
    const isAtEnd = contentOffsetX + visibleWidth >= contentWidth;

    const index = Math.round(contentOffsetX / carouselWidth);
    setActiveIndex(index);

    if (isAtEnd) {
      setExpandedIndex(0);
      setViewImage(false);
    } else {
      setTimeout(() => setExpandedIndex(null), 200);
    }
  };

  const renderItem = ({ item, index }: any) => (
    <View key={item.id}>
      <Box
        className="rounded-xl p-4 mx-4"
        style={{
          backgroundColor: themeColors.container,
          width: carouselWidth - 32,
          marginBottom: expandedIndex === index ? 20 : 10,
        }}
      >
        <HStack className="items-center justify-between mb-3">
          <Text className="font-bold text-xl" style={{ color: themeColors.textPrimary }}>
            {item.number}
          </Text>
          <Text className="text-sm font-semibold" style={{ color: themeColors.textSecondary }}>
            {item.subheading}
          </Text>
        </HStack>

        <TouchableOpacity activeOpacity={0.9} onPress={() => setViewImage(!viewImage)}>
          <View style={{ position: "relative" }}>
            <Image
              source={item.image}
              style={{
                width: "100%",
                height: viewImage ? 750 : 420,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
            {!viewImage && (
              <View
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -70 }, { translateY: -50 }],
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                }}
              >
                <Text className="text-gray-800">Click to view image</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleExpand(index)}
          className="mt-5 mx-auto w-full py-3 px-4 rounded-xl"
          style={{ backgroundColor: themeColors.secondaryButton }}
        >
          <Text className="text-black text-center text-md font-bold">
            {expandedIndex === index ? "Tap to Close" : "Tap to Expand"}
          </Text>
        </TouchableOpacity>

        {expandedIndex === index && (
          <VStack className="mt-4">
            {/* Key Features Overview */}
            {item.keyFeaturesOverview?.title && (
              <>
                <Text className="text-xl font-bold mb-2">{item.keyFeaturesOverview.title}</Text>
                {item.keyFeaturesOverview.items.map((feature: any, idx: any) => (
                  <VStack key={idx} className="mb-4">
                    <Text className="font-semibold">{feature.feature}</Text>
                    <Text>{feature.description}</Text>
                  </VStack>
                ))}
              </>
            )}

            {/* Additional sections here */}
          </VStack>
        )}
      </Box>
    </View>
  );

  const renderDots = () => (
    <HStack className="justify-center">
      {guideSteps.map((_, index) => (
        <View
          key={index}
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            margin: 5,
            backgroundColor:
              activeIndex === index ? themeColors.button : themeColors.secondaryButton,
          }}
        />
      ))}
    </HStack>
  );

  return (
    <VStack style={{ width: carouselWidth, alignSelf: "center" }}>
      <FlatList
        ref={flatListRef}
        data={guideSteps}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={carouselWidth}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        getItemLayout={(data, index) => ({
          length: carouselWidth,
          offset: carouselWidth * index,
          index,
        })}
      />

      {renderDots()}
    </VStack>
  );
};

export default GuidesCarousel;
