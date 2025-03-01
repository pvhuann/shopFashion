import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider, UserButton } from "@clerk/nextjs";

import LeftSideBar from "@/components/layout/LeftSideBar";
import "../globals.css";
import ToastProvider from "@/lib/ToastProvider";
import { Input } from "@/components/ui/input";
import {  BellDot } from "lucide-react";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", '500', '600', '700'],
})

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
        <body className={poppins.className}>
          <div className="flex max-lg:flex-col text-grey-1">
            <LeftSideBar />
            {/* <TopSideBar /> */}
            <div className="flex-1">
              <div className="flex justify-between items-center border-b-[1px] h-[100px] py-2 px-10 ">
                <div>
                  <Input className="max-w-[400px]" />
                </div>
                <div className="flex gap-4 items-center">
                  <BellDot size={36} className="rounded-full p-2 cursor-pointer hover:bg-blue-50 hover:text-blue-700 " />
                  <UserButton />
                </div>
                {/* <hr /> */}
              </div>
              <div className="p-6">
                {children}
              </div>
            </div>
          </div>
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
