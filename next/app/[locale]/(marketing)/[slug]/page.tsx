import { Metadata } from 'next';

import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const pageData = await fetchContentType(
    'pages',
    `filters[slug][$eq]=${params.slug}&filters[locale][$eq]=${params.locale}&populate=seo.metaImage`,
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function Page({ params }: { params: { locale: string, slug: string } }) {
  try {
    const pageData = await fetchContentType(
      'pages',
      `filters[slug][$eq]=${params.slug}&filters[locale][$eq]=${params.locale}`,
      true
    );
  
    return (
      <PageContent pageData={pageData} />
    );
  } catch(error) { //The only error throwed by fetchContentType is Failed to fetch data.
    console.error('PageDataError', error);
    notFound();
  }  
}