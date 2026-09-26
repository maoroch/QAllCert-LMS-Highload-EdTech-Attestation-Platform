import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "../components/providers/ReduxProvider";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://qallcert.kz"),
    title: "QAllCert — Аккредиттелген педагогикалық біліктілікті арттыру курстары",
    description: "Педагогтарды аттестаттауға арналған 80-86 сағаттық ресми аккредиттелген онлайн курстар (CAAAE № 25/20КА0003, БСН 250240001104). QR-кодты ресми сертификат.",
    alternates: {
        canonical: "https://qallcert.kz/kk",
        languages: {
            "kk-KZ": "https://qallcert.kz/kk",
            "ru-KZ": "https://qallcert.kz/ru",
            "en-US": "https://qallcert.kz/en",
            "x-default": "https://qallcert.kz/kk",
        },
    },
    openGraph: {
        title: "QAllCert — Аккредиттелген педагогикалық біліктілікті арттыру курстары",
        description: "Педагогтарды аттестаттауға арналған 80-86 сағаттық ресми курстар. Институционалдық аккредитация CAAAE № 25/20КА0003.",
        url: "https://qallcert.kz",
        siteName: "QAllCert",
        locale: "kk_KZ",
        type: "website",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headerList = await headers();
    const locale = headerList.get("x-locale") || "kk";

    return (
        <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 ">
                <ReduxProvider>{children}</ReduxProvider>
            </body>
        </html>
    );
}
