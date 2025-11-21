"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SigninForm from "../../ui/signinform";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signInSchema } from "../../lib/validation/auth";
import type { ZodIssue } from "zod";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ZodIssue[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationResult = signInSchema.safeParse({ username, password });

    if (!validationResult.success) {

      setErrors(validationResult.error.issues);

      setIsSubmitting(false); 
      return;
    }

    const res = await signIn("credentials", {
      username: validationResult.data.username,
      password: validationResult.data.password,
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Signed in successfully!");
      router.push("/");
    }

    if (res?.error) {
      toast.error("Invalid credentials. Please try again.");
      setPassword("");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6">
      <Toaster />
      <SigninForm
        setUsername={setUsername}
        setPassword={setPassword}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        username={username}
        password={password}
        errors={errors}
      />
    </div>
  );
}
