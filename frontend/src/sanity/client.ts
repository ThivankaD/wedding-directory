import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, isSanityConfigured } from "./env";

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  author?: string;
  category?: {
    title: string;
    slug: string;
  };
  coverImage?: any;
  coverImageUrl?: string;
  publishedAt: string;
  excerpt?: string;
  body?: any;
  content?: string;
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

// GROQ Queries
export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  author,
  "category": category->{
    title,
    "slug": slug.current
  },
  coverImage,
  "coverImageUrl": coverImage.asset->url,
  publishedAt,
  excerpt
}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  author,
  "category": category->{
    title,
    "slug": slug.current
  },
  coverImage,
  "coverImageUrl": coverImage.asset->url,
  publishedAt,
  excerpt,
  body
}`;

export const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description
}`;

export async function getBlogPosts(categorySlug?: string): Promise<SanityPost[]> {
  if (isSanityConfigured && client) {
    try {
      const posts = await client.fetch<SanityPost[]>(
        POSTS_QUERY,
        {},
        {
          next: { revalidate: 60, tags: ["posts"] },
        }
      );
      if (posts && posts.length > 0) {
        if (!categorySlug || categorySlug === "all") return posts;
        return posts.filter((p) => p.category?.slug === categorySlug);
      }
    } catch (err) {
      console.warn("Sanity fetch failed:", err);
    }
  }

  return [];
}

export async function getBlogPostBySlug(slug: string): Promise<SanityPost | null> {
  if (isSanityConfigured && client) {
    try {
      const post = await client.fetch<SanityPost | null>(
        POST_BY_SLUG_QUERY,
        { slug },
        { next: { revalidate: 60, tags: [`post-${slug}`] } }
      );
      if (post) return post;
    } catch (err) {
      console.warn(`Sanity fetch for slug ${slug} failed:`, err);
    }
  }

  return null;
}

export async function getBlogCategories(): Promise<SanityCategory[]> {
  if (isSanityConfigured && client) {
    try {
      const categories = await client.fetch<SanityCategory[]>(
        CATEGORIES_QUERY,
        {},
        {
          next: { revalidate: 300, tags: ["categories"] },
        }
      );
      if (categories && categories.length > 0) {
        return [{ _id: "cat-all", title: "All", slug: "all" }, ...categories];
      }
    } catch (err) {
      console.warn("Sanity category fetch failed:", err);
    }
  }

  return [{ _id: "cat-all", title: "All", slug: "all" }];
}
