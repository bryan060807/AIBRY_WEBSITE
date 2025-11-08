import Head from "next/head";
import { siteMetadata } from "@/lib/metadata";

export default function HeadTags({
  title,
  description,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return (
    <Head>
      <title>{title || siteMetadata.title}</title>
      <meta name="description" content={description || siteMetadata.description} />
      <meta name="keywords" content={siteMetadata.keywords.join(", ")} />
      <meta property="og:title" content={title || siteMetadata.title} />
      <meta property="og:description" content={description || siteMetadata.description} />
      <meta property="og:image" content={image || siteMetadata.image} />
      <meta property="og:url" content={siteMetadata.url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteMetadata.title} />
      <meta name="twitter:description" content={description || siteMetadata.description} />
      <meta name="twitter:image" content={image || siteMetadata.image} />
    </Head>
  );
}
