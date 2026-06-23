import "./globals.css";

export const metadata = {
  title: "Local Space | Desktop File & Folder Explorer",
  description: "A premium local file and folder manager for your desktop, built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
