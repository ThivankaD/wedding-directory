import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Wedding Blog Article | Say I Do",
      description: "Read wedding tips and inspiration on Say I Do.",
    };
  }

  let imageUrl: string | undefined = post.coverImageUrl;
  if (!imageUrl && post.coverImage) {
    try {
      imageUrl = urlForImage(post.coverImage)?.width(1200).height(630).url();
    } catch {
      imageUrl = undefined;
    }
  }

  const title = post.title || "Wedding Article";
  const description =
    post.excerpt ||
    "Expert tips, vendor spotlights, and wedding planning advice from Say I Do.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Say I Do`,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : ["Say I Do Editorial"],
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: "/images/hero.webp",
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Say I Do`,
      description,
      images: imageUrl ? [imageUrl] : ["/images/hero.webp"],
    },
  };
}

export default function BlogPostLayout({ children }: Props) {
  return <>{children}</>;
}
