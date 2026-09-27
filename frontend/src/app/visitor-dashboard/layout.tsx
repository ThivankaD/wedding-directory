import { Metadata } from "next";
import VisitorOnboardingGuard from "@/components/auth/VisitorOnboardingGuard";

export const metadata: Metadata = {
  title: "Wedding Dashboard",
  description: "Manage your wedding planning, vendors, checklist, and budget on Say I Do.",
};

export default function VisitorDashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VisitorOnboardingGuard>{children}</VisitorOnboardingGuard>;
}
