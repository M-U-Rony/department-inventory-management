import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Computer-lab"
};

export default function SignInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
