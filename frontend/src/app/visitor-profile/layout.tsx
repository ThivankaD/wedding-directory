import { Metadata } from "next";
import VisitorOnboardingGuard from "@/components/auth/VisitorOnboardingGuard";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and update your couple profile and wedding information on Say I Do.",
};

export default function VisitorProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VisitorOnboardingGuard>{children}</VisitorOnboardingGuard>;
}
