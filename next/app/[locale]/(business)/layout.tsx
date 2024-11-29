import React from 'react'

import { Inter } from 'next/font/google';

import { CartProvider } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { ViewTransitions } from 'next-view-transitions';
import fetchContentType from '@/lib/strapi/fetchContentType';
import BusinessSidebar from './_ui/business-sidebar';
import { auth } from '../(auth)/auth';
import { redirect } from 'next/navigation';

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
    // extracting data from usesession as session
    const session = await auth();
    if (!session?.user) {
        console.error("No user Logged In yet.");
        redirect("/sign-in");
    }

    const me = session.user;
    //console.dir(me,{depth:3});
    const pageData = await fetchContentType('global', `filters[locale][$eq]=${locale}`, true);
    //console.dir(pageData,{depth:7});
    
    
    return (
        <html lang={locale}>
            <ViewTransitions>
                <CartProvider>
                    <body
                        className={cn(
                            inter.className,
                            "flex antialiased h-screen overflow-hidden bg-charcoal"
                        )}
                    >
                        <div
                            className={cn(
                                "m-2 rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                                "h-[screen]" // for your use case, use `h-screen` instead of `h-[60vh]`
                            )}
                            >
                            <BusinessSidebar me={me}/>
                            {children}
                        </div>
                    </body>
                </CartProvider>
            </ViewTransitions>
        </html>
    );
}