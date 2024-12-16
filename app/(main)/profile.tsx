import { GetCurrentLoggedInUserQuery } from "@/components/auth/queries";
import { useSession } from "@/components/ctx";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useQuery } from "@apollo/client";
import { Appearance, Text } from "react-native";

import MobileHeader from "@/components/header";
import Loader from "@/components/loader";
import useThemeColors from "@/components/themeColors";
import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Switch } from "@/components/ui/switch";
import { VStack } from "@/components/ui/vstack";
import { useColorScheme } from "@/components/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import { GetAllBookings } from "@/queries/BookingQueries/queries";
import { ButtonSpinner } from "@/components/ui/button";

const MainContent = () => {
  const { session, signOut } = useSession();
  const colorScheme = useColorScheme();
  const themeColors = useThemeColors();
  const [Loading, setLoading] = useState(true);
  const { data, loading } = useQuery(GetCurrentLoggedInUserQuery, {
    context: {
      headers: {
        token: session,
      },
    },
  });

  const { data: bookings } = useQuery(GetAllBookings, {
    context: {
      headers: {
        token: session || "",
      },
    },
    fetchPolicy: "network-only",
    onCompleted: () => {
      setLoading(false);
    },
    onError: () => setLoading(false),
  });

  const bookingStats = {
    total: bookings?.getAllBookings?.data?.length || 0,
    pending:
      bookings?.getAllBookings?.data?.filter((booking) => booking.payment_status === "pending")
        ?.length || 0,
    completed:
      bookings?.getAllBookings?.data?.filter((booking) => booking.payment_status === "completed")
        ?.length || 0,
    paid:
      bookings?.getAllBookings?.data?.filter((booking) => booking.payment_status === "paid")
        ?.length || 0,
    rejected:
      bookings?.getAllBookings?.data?.filter((booking) => booking.payment_status === "rejected")
        ?.length || 0,
  };

  return (
    <VStack
      className="h-full w-full mb-8 md:mb-0"
      style={{
        backgroundColor: themeColors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 160,
          flexGrow: 1,
        }}
      >
        <VStack className="h-full w-full pb-0 p-2" space="2xl">
          {loading && <Loader />}
          {!loading && (
            <>
              {/* Profile Header */}
              <Box className="relative w-full h-[250px] items-center">
                <Box
                  className="absolute md:mt-14 mt-6 w-full rounded-[20px] p-4"
                  style={{
                    backgroundColor: themeColors.container,
                  }}
                >
                  <VStack space="lg" className="items-center">
                    <Avatar size="2xl" className="bg-primary-600">
                      <AvatarImage
                        alt="Profile Image"
                        // height="100%"
                        // width="100%"
                        source={{
                          uri: "https://avatar.iran.liara.run/public/boy",
                        }}
                      />
                      <AvatarBadge />
                    </Avatar>
                    <VStack className="gap-1 w-full items-center">
                      <Text
                        className="font-roboto text-xl"
                        style={{
                          color: themeColors.textPrimary,
                        }}
                      >
                        {`${data?.getCurrentLoggedInUser?.data?.first_name} ${data?.getCurrentLoggedInUser?.data?.last_name}`}
                      </Text>
                      <Text
                        className="font-roboto text-sm"
                        style={{
                          color: themeColors.textSecondary,
                        }}
                      >
                        {data?.getCurrentLoggedInUser?.data?.email}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              </Box>

              <HStack
                className="px-4 py-6 rounded-[20px] justify-between"
                style={{
                  backgroundColor: themeColors.container,
                }}
              >
                {Loading && (
                  <Box className="flex-1 items-center">
                    <Loader />
                  </Box>
                )}

                {!Loading && (
                  <>
                    <VStack className="items-center" style={{ flex: 1 }}>
                      <Text
                        className="text-2xl font-bold"
                        style={{ color: themeColors.textPrimary }}
                      >
                        {bookingStats.total}
                      </Text>
                      <Text className="text-sm" style={{ color: themeColors.textSecondary }}>
                        Total Bookings
                      </Text>
                    </VStack>
                    <VStack className="items-center" style={{ flex: 1 }}>
                      <Text className="text-2xl font-bold" style={{ color: themeColors.pending }}>
                        {bookingStats.pending}
                      </Text>
                      <Text className="text-sm" style={{ color: themeColors.textSecondary }}>
                        Pending
                      </Text>
                    </VStack>
                    <VStack className="items-center" style={{ flex: 1 }}>
                      <Text className="text-2xl font-bold" style={{ color: themeColors.completed }}>
                        {bookingStats.completed}
                      </Text>
                      <Text className="text-sm" style={{ color: themeColors.textSecondary }}>
                        Completed
                      </Text>
                    </VStack>
                  </>
                )}
              </HStack>

              <HStack
                className="px-4 py-6 rounded-[20px] justify-between mb-4"
                style={{
                  backgroundColor: themeColors.container,
                }}
              >
                {Loading && (
                  <Box className="flex-1 items-center">
                    <Loader />
                  </Box>
                )}

                {!Loading && (
                  <>
                    <VStack className="items-center" style={{ flex: 1 }}>
                      <Text className="text-2xl font-bold" style={{ color: themeColors.paid }}>
                        {bookingStats.paid}
                      </Text>
                      <Text className="text-sm" style={{ color: themeColors.textSecondary }}>
                        Paid Bookings
                      </Text>
                    </VStack>
                    <VStack className="items-center" style={{ flex: 1 }}>
                      <Text className="text-2xl font-bold" style={{ color: themeColors.rejected }}>
                        {bookingStats.rejected}
                      </Text>
                      <Text className="text-sm" style={{ color: themeColors.textSecondary }}>
                        Rejected
                      </Text>
                    </VStack>
                  </>
                )}
              </HStack>
            </>
          )}

          {/* Existing Theme Switch */}
          <HStack
            className="px-4 border-b-0 py-3 rounded-[20px] items-center justify-between"
            style={{
              backgroundColor: themeColors.container,
            }}
            space="md"
          >
            <HStack className="items-center w-full gap-10" space="sm">
              <Box className="w-12 h-12 items-center justify-center p-2">
                <Ionicons
                  name={colorScheme === "dark" ? "moon" : "sunny"}
                  size={24}
                  color={colorScheme === "dark" ? "#7F7F7F" : "#FFF200"}
                />
              </Box>
              <Text
                className="text-lg mr-auto"
                style={{
                  color: themeColors.textPrimary,
                }}
              >
                Theme
              </Text>
              <Switch
                value={colorScheme === "dark"}
                trackColor={{
                  true: themeColors.switchTrackActive,
                  false: themeColors.switchTrackInactive,
                }}
                thumbColor={
                  colorScheme === "dark"
                    ? themeColors.switchThumbActive
                    : themeColors.switchThumbInactive
                }
                onValueChange={() => {
                  if (colorScheme === "dark") {
                    Appearance.setColorScheme("light");
                  } else {
                    Appearance.setColorScheme("dark");
                  }
                }}
              />
            </HStack>
          </HStack>

          {/* Existing Sign Out */}
          <HStack
            className="px-4 border-b-0 py-3 rounded-[20px] items-center justify-between"
            style={{
              backgroundColor: themeColors.container,
            }}
            space="md"
          >
            <Pressable
              onPress={() => {
                signOut();
                router.push("/(auth)/signin");
              }}
              className="w-full"
            >
              <HStack className="items-center w-full gap-10" space="sm">
                <Box className="w-12 h-12 items-center justify-center p-2">
                  <Ionicons name="log-out" size={24} color={themeColors.icon} />
                </Box>
                <Text
                  className="text-lg"
                  style={{
                    color: themeColors.textPrimary,
                  }}
                >
                  Sign Out
                </Text>
              </HStack>
            </Pressable>
          </HStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export default function Home() {
  const themeColors = useThemeColors();

  return (
    <SafeAreaView
      className="h-full w-full"
      style={{
        backgroundColor: themeColors.background,
      }}
    >
      <MobileHeader title="Settings" isHomePage={false} />
      <MainContent />
    </SafeAreaView>
  );
}
