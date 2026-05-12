import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientWrapper } from "@/components/layout/ClientWrapper";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IKF Outreach",
  description: "Intelligent strategic outreach and client relationship management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-blue-500/30`}>
        <Toaster position="top-right" richColors closeButton />
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
