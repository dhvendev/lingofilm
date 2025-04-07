import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getUser } from "@/services/axiosMethods";
import { cookies } from "next/headers";
import { UserProvider } from "@/context/userContext";
import { ThemeProvider } from "@/components/themeProvider"
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LingoFilm | Платформа для обучения английскому языку просмотром любимых фильмов и сериалов созданная с любовью",
  description: "Онлайн платформа для обучения английскому языку просмотром любимых фильмов и сериалов с двоенными субтитрами или другими различными настройками.",
};



export default async function RootLayout({ children }) {
  const cookiesStore = await cookies();
  const sessionId = cookiesStore.get("session_id")?.value;
  const user = await getUser(sessionId);
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider initialUser={user}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <main className="w-full md:w-[80vw] flex flex-col items-center mx-auto">
              <Header />
            </main>
            {children}
            <footer className="w-[100vw] md:w-[80vw] lg:w-[80vw] xl:w-[80vw] flex flex-row justify-between pb-20 pt-10 mt-20 border-t-2 border-t-gray-900 mx-auto">
              <Footer />
            </footer>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
