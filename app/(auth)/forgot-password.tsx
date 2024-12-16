import { AuthLayout } from "@/components/auth/layout";
import { ForgotPasswordMutation } from "@/components/auth/queries";
import MobileHeader from "@/components/header";
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
import { useRouter } from "expo-router";
import { AlertTriangle } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordScreen = () => {
  const themeColors = useThemeColors();
  const [ForgotPassword] = useMutation(ForgotPasswordMutation);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const showToast = (message, type) => {
    if (message && type) {
      toast.show({
        placement: "top",
        duration: 3500,
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" className="mt-[72px]" action={type}>
            <ToastTitle>{message}</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setLoading(true);
    try {
      const { data: responseData } = await ForgotPassword({
        variables: { email: data.email },
      });

      if (responseData?.forgotPassword?.success) {
        showToast(
          responseData?.forgotPassword?.message || "OTP Sent Successfully.",
          responseData?.forgotPassword?.message === "OTP Sent Successfully."
            ? "success"
            : "warning"
        );
        router.push(`/(auth)/reset/${data.email}`);
      } else {
        showToast(
          responseData?.forgotPassword?.message || "Something Went Wrong.",
          "error"
        );
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Something Went Wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack className="w-full" space="md">
      <Text
        className="md:text-center text-lg mb-4"
        style={{ color: themeColors.textPrimary }}
      >
        Please enter your registered email address to receive an OTP.
      </Text>
      <VStack space="xl" className="w-full">
        <FormControl isInvalid={!!errors?.email} className="w-full">
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="h-16 rounded-lg border border-border"
                style={{ borderColor: themeColors.border }}
              >
                <InputField
                  placeholder="Email"
                  className="text-md"
                  placeholderTextColor={themeColors.textPrimary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="done"
                />
              </Input>
            )}
          />
          {errors?.email && (
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors.email.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <TouchableOpacity
          className="rounded-xl px-3 py-4 items-center"
          style={{ backgroundColor: themeColors.button }}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text className="text-xl font-bold text-white">Send OTP</Text>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
};

const ForgotPassword = () => {
  const themeColors = useThemeColors();

  return (
    <View style={{ backgroundColor: themeColors.background, flex: 1 }}>
      <MobileHeader title={"Forgot Password"} isHomePage={false} />
      <AuthLayout>
        <ForgotPasswordScreen />
      </AuthLayout>
    </View>
  );
};

export default ForgotPassword;
