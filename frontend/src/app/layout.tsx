import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "riftApply — University Admissions Platform",
  description: "Apply to top universities in 30+ countries through riftApply — verified agents, one platform, zero confusion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
