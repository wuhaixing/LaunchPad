import React from 'react'

import { Inter } from 'next/font/google';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { CartProvider } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { ViewTransitions } from 'next-view-transitions';
import fetchContentType from '@/lib/strapi/fetchContentType';

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700", "800", "900"],
});


export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {

    const pageData = await fetchContentType('global', `filters[locale][$eq]=${locale}`, true);
    //console.dir(pageData,{depth:7});
    return (
        <html lang={locale}>
            <ViewTransitions>
                <CartProvider>
                    <body
                        className={cn(
                            inter.className,
                            "bg-charcoal antialiased h-full w-full"
                        )}
                    >
                        <Navbar data={pageData.navbar} locale={locale} />
                        {children}
                        <Footer data={pageData.footer} locale={locale} />
                    </body>
                </CartProvider>
            </ViewTransitions>
        </html>
    );
}