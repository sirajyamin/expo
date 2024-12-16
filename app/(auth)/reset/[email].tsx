import { AuthLayout } from "@/components/auth/layout";
import { ResetPasswordMutation } from "@/components/auth/queries";
import MobileHeader from "@/components/header";
import Loader from "@/components/loader";
import useThemeColors from "@/components/themeColors";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
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

const createPasswordSchema = z.object({
  otp: z
    .string()
    .min(6, "Please enter a valid OTP.")
    .max(6, "OTP must be 6 digits."),
  password: z
    .string()
    .min(6, "Must be at least 8 characters in length")
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character"
    ),
  confirmpassword: z
    .string()
    .min(6, "Must be at least 8 characters in length")
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character"
    ),
});

type CreatePasswordSchemaType = z.infer<typeof createPasswordSchema>;

const CreatePasswordWithLeftBackground = () => {
  const themeColors = useThemeColors();
  const { email } = useLocalSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ResetPassword] = useMutation(ResetPasswordMutation);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasswordSchemaType>({
    resolver: zodResolver(createPasswordSchema),
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: CreatePasswordSchemaType) => {
    setLoading(true);
    const otp = data.otp;
    try {
      if (!otp || otp.length < 6) throw new Error("Please enter a valid OTP.");

      const { data: resetData } = await ResetPassword({
        variables: {
          email: email,
          otp: otp,
          password: data.password,
          confirm_password: data.confirmpassword,
        },
      });

      if (resetData?.resetPassword?.success) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast
                nativeID={id}
                variant="solid"
                className="mt-[72px]"
                action="success"
              >
                <ToastTitle>
                  {resetData?.resetPassword?.message ||
                    "Password reset successfully."}
                </ToastTitle>
              </Toast>
            );
          },
        });
        router.replace("/signin");
      } else {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast
                nativeID={id}
                variant="solid"
                className="mt-[72px]"
                action="error"
              >
                <ToastTitle>
                  {resetData?.resetPassword?.message ||
                    "Error While Resetting Password."}
                </ToastTitle>
              </Toast>
            );
          },
        });
      }
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast
              nativeID={id}
              variant="solid"
              className="mt-[72px]"
              action="error"
            >
              <ToastTitle>
                {error.message || "Something Went wrong!."}
              </ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack className="w-full" space="md">
      <Text
        className="md:text-center text-lg mb-8"
        style={{ color: themeColors.textPrimary }}
      >
        Please create a new password for your account.
      </Text>

      {/* OTP Input */}
      <VStack className="w-full">
        <FormControl isInvalid={!!errors.otp}>
          <Controller
            name="otp"
            control={control}
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
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              OTP is {errors?.otp?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Password Input */}
        <FormControl isInvalid={!!errors.password}>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="h-16 rounded-lg border border-border mt-12"
                style={{ borderColor: themeColors.border }}
              >
                <InputField
                  placeholder="New Password"
                  className="text-md"
                  placeholderTextColor={themeColors.textPrimary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  type={showPassword ? "text" : "password"}
                />
                <InputSlot
                  onPress={() => setShowPassword(!showPassword)}
                  className="pr-3"
                >
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              New Password is {errors?.password?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Confirm Password Input */}
        <FormControl isInvalid={!!errors.confirmpassword}>
          <Controller
            name="confirmpassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="h-16 rounded-lg border border-border mt-4"
                style={{ borderColor: themeColors.border }}
              >
                <InputField
                  placeholder="Confirm Password"
                  className="text-md"
                  placeholderTextColor={themeColors.textPrimary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <InputSlot
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="pr-3"
                >
                  <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              Confirm Password is{errors?.confirmpassword?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </VStack>

      {/* Submit Button */}
      <VStack className="mt-7 w-full">
        <TouchableOpacity
          className="rounded-xl px-3 py-3 items-center"
          style={{ backgroundColor: themeColors.button }}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <Text className="text-xl font-bold text-white">
                Update Password
              </Text>
            </>
          )}
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
};

const ResetPassword = () => {
  const themeColors = useThemeColors();
  return (
    <View style={{ backgroundColor: themeColors.background }}>
      <MobileHeader title={"Reset Password"} isHomePage={false} />
      <View>
        <AuthLayout>
          <CreatePasswordWithLeftBackground />
        </AuthLayout>
      </View>
    </View>
  );
};

export default ResetPassword;
