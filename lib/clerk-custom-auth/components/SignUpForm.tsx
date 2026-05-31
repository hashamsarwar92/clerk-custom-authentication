import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import {
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

//Zod schemas
import { signUpSchema } from "../schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificatonError, setVerificationError] = useState<string | null>(
    null,
  );
  const { signUp } = useSignUp();
  // const { setActive } = useClerk();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log("Starting sign up process with data:", data);
    if (!signUp) return;
    setIsSubmitting(true);
    setAuthError(null);

    console.log("Creating user with email:", data.email);

    try {
      console.log("Attempting to create user...");
      const { error } = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      console.log("Sign up response received:", { error });

      if (error) {
        setAuthError(
          error.message ?? "An unexpected error occurred during sign up.",
        );
        console.error("Error during sign up:", error);
        return;
      }
      console.log("User created successfully, sending verification code...");
      await signUp.verifications.sendEmailCode();
      setVerifying(true);
      console.log("Verification code sent, waiting for user to verify...");
    } catch (error: any) {
      console.error("Error during sign up:", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An unexpected error occurred during sign up.",
      );
      console.log("Error details:", error);
    } finally {
      setIsSubmitting(false);
      console.log("Sign up process completed");
    }
  };

  const handleVerficationSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    console.log("Starting verification process");
    e.preventDefault();
    if (!signUp) return;
    setIsSubmitting(true);
    setAuthError(null);
    console.log("Verifying code:", verificationCode);

    try {
      console.log("Attempting to verify email code");
      await signUp.verifications.verifyEmailCode({ code: verificationCode });
      if (signUp.status === "complete") {
        // ✅ v7: use signUp.finalize() instead of setActive()
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/dashboard");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      } else {
        setVerificationError("Verification failed. Please try again.");
      }
      console.log("Verification process completed");
    } catch (error: any) {
      console.error("Error during verification:", error);
      setVerificationError(
        error.errors?.[0]?.message ||
          "An unexpected error occurred during verification.",
      );
    } finally {
      setIsSubmitting(false);
      console.log("Verification process finalized");
    }
  };

  if (verifying) {
    return (
      <div className="w-full max-w-md mx-auto border border-gray-200 bg-gray-50 shadow-xl rounded-2xl">
        {/* Header */}
        <div className="flex flex-col gap-1 items-center pb-2 pt-6 px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          <p className="text-gray-500 text-center">
            We've sent a verification code to your email
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Body */}
        <div className="py-6 px-6">
          {/* Error */}
          {verificatonError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
              <p>{verificatonError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerficationSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="verificationCode"
                className="text-sm font-medium text-gray-900"
              >
                Verification Code
              </label>

              <input
                id="verificationCode"
                type="text"
                placeholder="Enter the 6-digit code"
                autoFocus
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive a code?{" "}
              <button
                onClick={async () => {
                  if (signUp) {
                    await signUp.verifications.sendEmailCode();
                  }
                }}
                type="button"
                className="text-blue-600 hover:underline font-medium"
              >
                Resend code
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto border border-gray-200 bg-gray-50 shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex flex-col gap-1 items-center pb-2 pt-6 px-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Your Account
        </h1>
        <p className="text-gray-500 text-center">
          Sign up to start managing your images securely
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Body */}
      <div className="py-6 px-6">
        {/* Error */}
        {authError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{authError}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("VALIDATION ERRORS:", errors);
          })}
        >
          <div id="clerk-captcha" />
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-900"
            >
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-900"
            >
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="passwordConfirmation"
              className="text-sm font-medium text-gray-900"
            >
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

              <input
                id="passwordConfirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("passwordConfirmation")}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>

            {errors.passwordConfirmation && (
              <p className="text-sm text-red-600">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-gray-600">
                By signing up, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Footer */}
      <div className="flex justify-center py-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
