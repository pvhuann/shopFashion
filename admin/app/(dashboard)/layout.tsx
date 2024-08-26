import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import LeftSideBar from "@/components/layout/LeftSideBar";
import TopSideBar from "@/components/layout/TopSideBar";
import "../globals.css";
import ToastProvider from "@/lib/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Dashboard next application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterMultiSessionSingleSignOutUrl={'/sign-in'}>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex max-lg:flex-col text-grey-1">
            <LeftSideBar />
            <TopSideBar />
            <div className="flex-1">
              {children}
            </div>
          </div>
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
