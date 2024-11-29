import React from 'react'

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { generateMetadataObject } from '@/lib/shared/metadata';

import { cn } from '@/lib/utils';
import { ViewTransitions } from 'next-view-transitions';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { AmbientColor } from "@/components/decorations/ambient-color";
import { Divider } from "./_components/divider";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { OAuths } from "./_components/oauths";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700", "800", "900"],
});

// Default Global SEO for pages without them
export async function generateMetadata({
    params,
}: {
    params: { locale: string; slug: string };
}): Promise<Metadata> {
    const pageData = await fetchContentType(
        'global',
        `&filters[locale][$eq]=${params.locale}&populate=seo.metaImage`,
        true
    );

    const seo = pageData?.seo;
    const metadata = generateMetadataObject(seo);
    return metadata;
}

export default async function AuthLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {

    const pageData = await fetchContentType('global', `filters[locale][$eq]=${locale}`, true);
    //console.dir(pageData,{depth:7});
    const logo =pageData.navbar.logo;
    return (        
        <ViewTransitions>
            <div className={cn(
                            inter.className,
                            "bg-charcoal antialiased h-full w-full"
                        )}>
                <AmbientColor />
                <Container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
                    <Logo locale={locale} image={logo?.image} company={logo?.company}/>
                    {children}
                    <Divider />
                    <OAuths />
                </Container>  
            </div>                      
        </ViewTransitions>        
    );
}