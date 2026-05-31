"use client";

import { useForm } from "react-hook-form";
import { useSignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
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
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/lib/clerk-custom-auth/schemas/signInSchema";

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
 
  const { signIn } = useSignIn();
  const { isLoaded } = useAuth();
  const { setActive } = useClerk();
  const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.password({
        emailAddress: data.email,
        password: data.password,
      });
        if (signIn.status === "complete") {
            await setActive({ session: signIn.createdSessionId });
            router.push("/dashboard");
        }else{
            setAuthError("Sign in failed. Please check your credentials and try again.");
        }
    } catch (error: any) {
      console.error("Error during sign up:", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An unexpected error occurred during sign up.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };


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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          
          </div>

         

          {/* Terms */}
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-gray-600">
                By signing in, you agree to our Terms of Service and Privacy
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
            {isSubmitting
              ? "Signing in..."
              : "Sign In"}
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
            href="/sign-up"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
