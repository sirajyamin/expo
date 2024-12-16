import { AuthLayout } from "@/components/auth/layout";
import { useSession } from "@/components/ctx";

import { GetUserTokenMutation } from "@/components/auth/queries";
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
import { Link, router } from "expo-router";
import { AlertTriangle } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
  rememberme: z.boolean().optional(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

const LoginWithLeftBackground = () => {
  const themeColors = useThemeColors();
  const [isLoading, setIsLoading] = useState(false);

  const [GetUserToken] = useMutation(GetUserTokenMutation);
  const { signIn } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const toast = useToast();
  const [validated, setValidated] = useState({
    emailValid: true,
    passwordValid: true,
  });

  const onSubmit = async (data: LoginSchemaType) => {
    console.log(data);
    setIsLoading(true);

    try {
      const { data: result } = await GetUserToken({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      if (result?.getUserToken?.success) {
        if (result?.getUserToken?.data?.isVerified) {
          signIn(result?.getUserToken?.data.token);
          toast.show({
            placement: "top",
            render: ({ id }) => (
              <Toast nativeID={id} variant="solid" className="mt-[72px]" action="success">
                <ToastTitle>{result?.getUserToken?.message || "Login successful."}</ToastTitle>
              </Toast>
            ),
          });
          router.replace("/(main)");
        } else {
          router.push(`/(auth)/verify-account/${data.email}`);
        }
      } else {
        setValidated({ emailValid: false, passwordValid: false });
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" className="mt-[72px]" action="error">
              <ToastTitle>
                {result?.getUserToken?.message || "Login failed. Please check your credentials."}
              </ToastTitle>
            </Toast>
          ),
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" className="mt-[72px]" action="error">
            <ToastTitle>{error.message || "An error occurred. Please try again."}</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <View>
      <Text className="md:text-center text-lg mb-2" style={{ color: themeColors.textPrimary }}>
        Sign in to access your parcel bookings and manage your shipments
      </Text>
      <VStack className="w-full">
        <VStack space="xl" className="w-full">
          <FormControl isInvalid={!!errors?.email || !validated.emailValid} className="w-full">
            <Controller
              defaultValue=""
              name="email"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await loginSchema.parseAsync({
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
                    placeholder="Email"
                    className="text-md"
                    placeholderTextColor={themeColors.textPrimary}
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
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.email?.message || (!validated.emailValid && "Email ID not found")}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl isInvalid={!!errors.password || !validated.passwordValid} className="w-full">
            <Controller
              defaultValue=""
              name="password"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await loginSchema.parseAsync({
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
                  className="h-16 rounded-md border border-border"
                  style={{ borderColor: themeColors.border }}
                >
                  <InputField
                    className="text-md"
                    placeholderTextColor={themeColors.textSecondary}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                  />
                  <InputSlot onPress={handleState} className="pr-3">
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.password?.message ||
                  (!validated.passwordValid && "Password was incorrect")}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          <VStack className="w-full mt-7 mb-4" space="lg">
            <TouchableOpacity
              className="rounded-xl p-6 items-center"
              style={{ backgroundColor: themeColors.button }}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader />
              ) : (
                <Text className="text-xl font-bold text-white">Sign In</Text>
              )}
            </TouchableOpacity>
          </VStack>
          <Link
            href="/(auth)/forgot-password"
            className="text-center text-lg font-medium w-full"
            style={{ color: themeColors.textPrimary }}
          >
            Forgot Password?
          </Link>

          <View className="flex-row items-center justify-center">
            <View className="flex-1 border-t" style={{ borderColor: themeColors.textSecondary }} />
            <Text className="px-2 text-lg" style={{ color: themeColors.textSecondary }}>
              or
            </Text>
            <View className="flex-1 border-t" style={{ borderColor: themeColors.textSecondary }} />
          </View>
        </VStack>
        <VStack className="w-full mt-7 mb-4" space="lg">
          <TouchableOpacity
            className="rounded-xl p-6 items-center"
            style={{ backgroundColor: themeColors.secondaryButton }}
            onPress={() => router.push(`/(auth)/signup`)}
          >
            <Text className="text-xl font-bold text-black">Create an Account</Text>
          </TouchableOpacity>
        </VStack>
      </VStack>
    </View>
  );
};

const SignIn = () => {
  const themeColors = useThemeColors();

  return (
    <View style={{ backgroundColor: themeColors.background }}>
      <MobileHeader title={"Sign In"} isHomePage={false} />
      <View>
        <AuthLayout>
          <LoginWithLeftBackground />
        </AuthLayout>
      </View>
    </View>
  );
};

export default SignIn;
