import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bloom E-Commerce Template",
  description:
    "Discover a wide selection of trendy clothes, shoes and accessories on Bloom E-Commerce. Enjoy fast delivery and free returns. Shop now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}  antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
