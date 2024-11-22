import { Metadata } from 'next';
import Image from "next/image";
import { Link } from "next-view-transitions";
import { format } from "date-fns";
import { strapiImage } from "@/lib/strapi/strapiImage";
import DynamicZoneManager from "@/components/dynamic-zone/manager";
import { Article } from "@/types/types";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

import { generateMetadataObject } from '@/lib/shared/metadata';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { locale: string, slug: string };
}): Promise<Metadata> {
  const pageData = await fetchContentType("articles", `filters[slug]=${params?.slug}&filters[locale][$eq]=${params.locale}&populate=seo.metaImage`, true)

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function singleArticlePage({ params }: { params: { slug: string, locale: string } }) {
  const article = await fetchContentType("articles", `filters[slug]=${params?.slug}&filters[locale][$eq]=${params.locale}`, true)

  if (!article) {
    notFound();
  }

  return (
    <>
      <div className="w-full mx-auto">
        {article.image ? (
          <Image
            src={strapiImage(article.image.url)}
            height="800"
            width="800"
            className="h-40 md:h-96 w-full aspect-square object-cover rounded-3xl [mask-image:radial-gradient(circle,white,transparent)]"
            alt={article.title}
          />
        ) : (
          <div className="h-40 md:h-96 w-full aspect-squace rounded-3xl shadow-derek bg-neutral-900 flex items-center justify-center">
            {/* <Logo /> */}
          </div>
        )}
      </div>
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <article className="pb-8 pt-8">
            <div className="flex gap-4 flex-wrap ">
              {article.categories?.map((category, idx) => (
                <p
                  key={`category-${idx}`}
                  className="text-xs font-bold text-muted px-2 py-1 rounded-full bg-neutral-800 capitalize"
                >
                  {category.name}
                </p>
              ))}
            </div>
            <header className="flex flex-col">
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-neutral-200 sm:text-5xl ">
                {article.title}
              </h1>
            </header>
            <div className="mt-8 prose prose-sm prose-invert">
              <BlocksRenderer content={article.content} />
            </div>
            <div className="flex space-x-2 items-center pt-12 border-t border-neutral-800 mt-12">
              <div className="flex space-x-2 items-center ">
                {/* <Image
                  src={article.authorAvatar}
                  alt={article.author}
                  width={20}
                  height={20}
                  className="rounded-full h-5 w-5"
                />
                <p className="text-sm font-normal text-muted">
                  {article.author}
                </p> */}
              </div>
              <div className="h-5 rounded-lg w-0.5 bg-neutral-700" />
              <time
                dateTime={article.publishedAt}
                className="flex items-center text-base "
              >
                <span className="text-muted text-sm">
                  {format(new Date(article.publishedAt), "MMMM dd, yyyy")}
                </span>
              </time>
            </div>
          </article>
        </div>
      </div>
      {article?.dynamic_zone && (<DynamicZoneManager dynamicZone={article?.dynamic_zone} locale={params.locale} />)}      
    </>
  );
}