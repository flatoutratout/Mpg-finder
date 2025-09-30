// components/SEO.js
import Head from 'next/head';

export default function SEO({
  title = "MyWebsite",
  description = "Beautiful, modern Next.js website.",
  url = "https://www.mywebsite.com",
  image = "https://www.mywebsite.com/og-image.jpg",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Next.js, website, Tailwind CSS, modern design" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon & canonical */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": url,
          "name": title,
          "description": description,
        })
      }} />
    </Head>
  );
}
