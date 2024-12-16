import { AuthLayout } from "@/components/auth/layout";
import { VerifyEmailMutation } from "@/components/auth/queries";
import { useSession } from "@/components/ctx";
import MobileHeader from "@/components/header";
import Loader from "@/components/loader";
import useThemeColors from "@/components/themeColors";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const verifyAccountSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
});

type verifyAccountSchemaType = z.infer<typeof verifyAccountSchema>;

const VerifyAccountScreen = () => {
  const themeColors = useThemeColors();
  const { email } = useLocalSearchParams();
  const { signIn } = useSession();
  const [VerifyEmail] = useMutation(VerifyEmailMutation);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<verifyAccountSchemaType>({
    resolver: zodResolver(verifyAccountSchema),
  });
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: verifyAccountSchemaType) => {
    setIsLoading(true);
    try {
      const { data: result } = await VerifyEmail({
        variables: {
          email: email as string,
          otp: data.otp,
        },
      });
      console.log(result);
      if (result?.verifyEmail?.success) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast
              nativeID={id}
              variant="solid"
              className="mt-[72px]"
              action="success"
            >
              <ToastTitle>
                {result?.verifyEmail?.message ||
                  "Account verified successfully."}
              </ToastTitle>
            </Toast>
          ),
        });
        signIn(result?.verifyEmail?.data);
        router.replace("/(main)");
      } else {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast
              nativeID={id}
              variant="solid"
              className="mt-[72px]"
              action="error"
            >
              <ToastTitle>
                {result?.verifyEmail?.message || "Account verification failed."}
              </ToastTitle>
            </Toast>
          ),
        });
      }
    } catch (err: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast
            nativeID={id}
            variant="solid"
            className="mt-[72px]"
            action="error"
          >
            <ToastTitle>
              {err.message || "An error occurred. Please try again."}
            </ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };
  const router = useRouter();
  return (
    <VStack className="w-full" space="md">
      <Text
        className="md:text-center text-lg mb-4"
        style={{ color: "#EBEBEB" }}
      >
        Enter the OTP sent to your email to verify your account.
      </Text>
      <VStack space="xl" className="w-full">
        <FormControl isInvalid={!!errors?.otp} className="w-full">
          <Controller
            defaultValue=""
            name="otp"
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await verifyAccountSchema.parseAsync({ otp: value });
                  return true;
                } catch (error: any) {
                  return error.message;
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="h-16 rounded-lg border border-border"
                style={{ borderColor: themeColors.border }}
              >
                <InputField
                  placeholder="Enter OTP"
                  className="text-md"
                  placeholderTextColor={themeColors.textPrimary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon as={AlertTriangle} />
            <FormControlErrorText>{errors?.otp?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <VStack className="mt-2 w-full">
          <TouchableOpacity
            className="rounded-xl px-3 py-3 items-center"
            style={{ backgroundColor: themeColors.button }}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader />
              </>
            ) : (
              <>
                <Text className="text-xl font-bold text-white">Sign Up</Text>
              </>
            )}
          </TouchableOpacity>
        </VStack>
      </VStack>
    </VStack>
  );
};

const VerifyAccount = () => {
  const themeColors = useThemeColors();

  return (
    <View style={{ backgroundColor: themeColors.background }}>
      <MobileHeader title={"Verify Account"} isHomePage={false} />
      <View>
        <AuthLayout>
          <VerifyAccountScreen />
        </AuthLayout>
      </View>
    </View>
  );
};

export default VerifyAccount;
