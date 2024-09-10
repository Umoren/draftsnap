import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>draftsnap | Instant Image-to-Markdown Converter</title>
        <meta name="description" content="draftsnap: speed up your writing workflow with instant image-to-markdown conversion. perfect for technical writers, bloggers, and documentation specialists." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://draftsnap.vercel.app/" />
        <meta property="og:title" content="draftsnap | Instant Image-to-Markdown Converter" />
        <meta property="og:description" content="Transform your images into markdown instantly. Boost productivity for technical writers and content creators." />
        <meta property="og:image" content="https://i.imgur.com/Vj4gSA9.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://draftsnap.vercel.app/" />
        <meta property="twitter:title" content="draftsnap | Instant Image-to-Markdown Converter" />
        <meta property="twitter:description" content="Transform your images into markdown instantly. Boost productivity for technical writers and content creators." />
        <meta property="twitter:image" content="https://i.imgur.com/Vj4gSA9.png" />

        {/* Additional meta tags */}
        <meta name="application-name" content="draftsnap" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="draftsnap" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
