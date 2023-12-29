import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Market",
  description:
    "A digital market to sell digital assets like icons, logos and many more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} h-full relative font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="relative flex flex-col min-h-[calc(100svh-4rem)]">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
