import { AuthLayout } from "@/components/auth/layout";
import { CreateUserMutation } from "@/components/auth/queries";
import MobileHeader from "@/components/header";
import Loader from "@/components/loader";
import useThemeColors from "@/components/themeColors";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { CheckIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AlertTriangle } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email(),
  password: z
    .string()
    .min(6, "Must be at least 8 characters in length")
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character"),
  confirmpassword: z
    .string()
    .min(6, "Must be at least 8 characters in length")
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character"),
  rememberme: z.boolean().optional(),
});
type SignUpSchemaType = z.infer<typeof signUpSchema>;

const SignUpWithLeftBackground = () => {
  const themeColors = useThemeColors();
  const [CreateUser] = useMutation(CreateUserMutation);
  const [isLoading, setIsLoading] = useState(false);
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
    reset,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    setIsLoading(true);
    try {
      const { data: result } = await CreateUser({
        variables: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          confirm_password: data.confirmpassword,
        },
      });

      if (result?.createUser?.success) {
        showToast(result?.createUser?.message, "success");

        router.push(`/(auth)/verify-account/${data.email}`);
      } else {
        showToast(result?.createUser?.message, "error");
      }
    } catch (error: any) {
      showToast(error.message, "error");

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  const handleConfirmPwState = () => {
    setShowConfirmPassword((showState) => {
      return !showState;
    });
  };
  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };
  const router = useRouter();
  return (
    <View className="w-full h-full">
      <VStack className="w-full" space="md">
        <Text className="md:text-center text-lg" style={{ color: themeColors.textPrimary }}>
          Sign up to easily book, track, and manage your parcels.
        </Text>
        <VStack className="mt-1">
          <VStack space="xl" className="w-full">
            <FormControl isInvalid={!!errors.first_name}>
              <Controller
                name="first_name"
                defaultValue=""
                control={control}
                rules={{
                  required: "First name is required",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className="h-16 rounded-lg  border border-border"
                    style={{ borderColor: themeColors.border }}
                  >
                    <InputField
                      className="text-md"
                      placeholderTextColor={themeColors.textSecondary}
                      placeholder="First Name"
                      type="text"
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
                <FormControlErrorIcon size="xs" as={AlertTriangle} />
                <FormControlErrorText size="sm">{errors?.first_name?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.last_name}>
              <Controller
                name="last_name"
                defaultValue=""
                control={control}
                rules={{
                  required: "Last name is required",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className="h-16 rounded-lg  border border-border"
                    style={{ borderColor: themeColors.border }}
                  >
                    <InputField
                      className="text-md"
                      placeholderTextColor={themeColors.textSecondary}
                      placeholder="Last Name"
                      type="text"
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
                <FormControlErrorIcon size="xs" as={AlertTriangle} />
                <FormControlErrorText size="sm">{errors?.last_name?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <Controller
                name="email"
                defaultValue=""
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signUpSchema.parseAsync({
                        email: value,
                      });
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
                      className="text-md"
                      placeholderTextColor={themeColors.textSecondary}
                      placeholder="Email"
                      type="text"
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
                <FormControlErrorIcon size="xs" as={AlertTriangle} />
                <FormControlErrorText size="sm">{errors?.email?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <Controller
                defaultValue=""
                name="password"
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signUpSchema.parseAsync({
                        password: value,
                      });
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
                      className="text-md"
                      placeholderTextColor={themeColors.textSecondary}
                      placeholder="Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                      type={showPassword ? "text" : "password"}
                    />
                    <InputSlot onPress={handleState} className="pr-3">
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="xs" as={AlertTriangle} />
                <FormControlErrorText size="sm">{errors?.password?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.confirmpassword}>
              <Controller
                defaultValue=""
                name="confirmpassword"
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signUpSchema.parseAsync({
                        password: value,
                      });
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
                      className="text-md"
                      placeholderTextColor={themeColors.textSecondary}
                      placeholder="Confirm Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                      type={showConfirmPassword ? "text" : "password"}
                    />

                    <InputSlot onPress={handleConfirmPwState} className="pr-3">
                      <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="xs" as={AlertTriangle} />
                <FormControlErrorText size="sm">
                  {errors?.confirmpassword?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Controller
              name="rememberme"
              defaultValue={false}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  size="md"
                  value="Remember me"
                  isChecked={value}
                  onChange={onChange}
                  aria-label="Remember me"
                >
                  <CheckboxIndicator
                    className="border border-border"
                    style={{ borderColor: themeColors.border }}
                  >
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>I accept the Terms of Use & Privacy Policy</CheckboxLabel>
                </Checkbox>
              )}
            />
          </VStack>

          <VStack className="w-full mt-5 mb-2" space="sm">
            <TouchableOpacity
              className="rounded-xl p-5 items-center"
              style={{ backgroundColor: themeColors.primary }}
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
          <View className="flex-row items-center justify-center">
            <View className="flex-1 border-t" style={{ borderColor: themeColors.textSecondary }} />
            <Text className="px-2 text-lg">or</Text>
            <View className="flex-1 border-t" style={{ borderColor: themeColors.textSecondary }} />
          </View>
          <VStack className="w-full mt-2" space="md">
            <TouchableOpacity
              className="rounded-xl p-4 items-center"
              style={{ backgroundColor: themeColors.secondaryButton }}
              onPress={() => router.push(`/(auth)/signin`)}
            >
              <Text className="text-xl font-bold text-black">Log in</Text>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </VStack>
    </View>
  );
};

const SignUp = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <MobileHeader title={"Sign Up"} isHomePage={false} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 8,
          flexGrow: 1,
        }}
      >
        <View>
          <AuthLayout>
            <SignUpWithLeftBackground />
          </AuthLayout>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
