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

// Curated Fallback Articles (with 100% active, verified high-resolution images)
export const FALLBACK_POSTS: SanityPost[] = [
  {
    _id: "mock-1",
    title: "The Ultimate Guide to Choosing Your Wedding Venue",
    slug: "ultimate-guide-choosing-wedding-venue",
    author: "Sarah Jenkins",
    category: { title: "Venues", slug: "venues" },
    publishedAt: "2026-03-15T10:00:00.000Z",
    excerpt:
      "Finding the perfect wedding venue sets the tone, dictates your guest list size, and heavily influences your budget. Here are the top questions to ask on venue tours.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    content: `Finding the perfect wedding venue is often the most important milestone in wedding planning. The venue sets the tone for the entire celebration, dictates your guest count, and influences almost 40% of your overall wedding budget.

## 1. Determine Your Guest Count First
Before booking a single tour, draft an honest guest list with your partner. Falling in love with a 100-capacity intimate glasshouse when your families expect 250 guests is a recipe for heartbreak.

## 2. Inquire About Hidden Fees & Vendor Restrictions
Many venues have exclusive supplier lists for catering, DJ, and lighting. Always ask:
- Is service tax and cleaning included in the base rental fee?
- Can we bring our own licensed wedding coordinator?
- What is the venue curfew and music decibel limit?

## 3. Plan for Weather Contingencies
If you're dreaming of an outdoor ceremony on Sri Lanka's southern coast or central highlands, ensure the venue has a seamless indoor backup that you love just as much.`,
  },
  {
    _id: "mock-2",
    title: "How to Build a Realistic Wedding Budget (And Stick to It)",
    slug: "realistic-wedding-budget-tips",
    author: "David Chen",
    category: { title: "Budgeting", slug: "budgeting" },
    publishedAt: "2026-04-02T14:30:00.000Z",
    excerpt:
      "Money is a leading source of wedding planning stress. We break down the standard percentages and share proven strategies for tracking expenses effortlessly.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?auto=format&fit=crop&w=1200&q=80",
    content: `Building a wedding budget does not have to be an overwhelming mathematical nightmare. With a clear percentage breakdown and the right tools, you can stay in complete control of your finances.

### Recommended Wedding Budget Breakdown
- **Venue & Catering**: 40% - 45%
- **Photography & Videography**: 12% - 15%
- **Attire & Beauty**: 8% - 10%
- **Music & Entertainment**: 7% - 10%
- **Flowers & Decor**: 8% - 12%
- **Contingency Cushion**: 5% (Always keep a buffer for unexpected extras!)

### Top Money-Saving Tips
1. **Prioritize Your Top 3**: Choose the three aspects that matter most to you as a couple (e.g. food, photography, live music) and allocate comfortably there, while trimming on areas you care less about.
2. **Use Say I Do's Built-In Budgeter**: Track paid deposits, pending balances, and invoice due dates in real-time on your couple dashboard.`,
  },
  {
    _id: "mock-3",
    title: "2026 Bridal Fashion: The Biggest Dress & Styling Trends",
    slug: "2026-bridal-dress-trends",
    author: "Emma Laurent",
    category: { title: "Bridal Fashion", slug: "bridal-fashion" },
    publishedAt: "2026-04-18T09:15:00.000Z",
    excerpt:
      "This year, we are seeing a shift toward sleek minimalist silhouettes, statement detachable sleeves, and pearl-encrusted cathedral veils.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1200&q=80",
    content: `Runways and modern bridal ateliers in 2026 are celebrating effortless luxury, textural contrasts, and functional versatility.

## 1. Transformative Second Looks (Detachable Elements)
Brides are loving outfits that adapt seamlessly between ceremony and party:
- Detachable organza sleeves and overskirts.
- Transitioning from an elegant structured gown for the ceremony to a chic satin mini or tailored bridal jumpsuit for dancing.

## 2. Pearl Accents & Sculptural Veils
Subtle pearlescent embellishments on veils, gloves, and shoe straps add timeless dimension without feeling heavy or dated.

## 3. Natural Textures & Sustainable Silks
Lightweight crepe, breathable habotai silk, and organic lace are replacing stiff synthetic ballgowns, perfect for warm-weather tropical ceremonies.`,
  },
  {
    _id: "mock-4",
    title: "Questions You MUST Ask Your Wedding Photographer",
    slug: "questions-to-ask-wedding-photographer",
    author: "Michael Torres",
    category: { title: "Photography", slug: "photography" },
    publishedAt: "2026-04-25T11:45:00.000Z",
    excerpt:
      "Your wedding photos last long after the flowers wilt and the cake is eaten. Before signing a contract, ask these critical questions.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    content: `Your wedding photographer will be by your side for 10 to 14 hours on your most emotional day. You need someone who is not only a master of light, but also someone whose presence puts you at ease.

### Must-Ask Interview Questions
1. **How do you handle low-light receptions?** (Ask to see a complete full gallery from an evening wedding, not just curated highlights in golden-hour sunlight).
2. **What backup gear do you bring on the day?** (Cameras, lenses, dual SD card slots).
3. **What is your turnaround time and delivery format?** (Ensure sneak peeks within 72 hours and high-resolution digital rights are specified in the written agreement).`,
  },
  {
    _id: "mock-5",
    title: "10 Unique Guest Book Alternatives Your Guests Will Love",
    slug: "unique-guest-book-alternatives",
    author: "Jessica Hall",
    category: { title: "Planning Tips", slug: "planning-tips" },
    publishedAt: "2026-04-28T16:20:00.000Z",
    excerpt:
      "Traditional guest books often end up gathering dust on a shelf. Here are creative ways to capture heartfelt memories from your loved ones.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1522061266041-382a170868a6?auto=format&fit=crop&w=1200&q=80",
    content: `Why settle for signatures in a blank book when you can create a keepsake you'll display in your home every day?

- **The Audio Voicemail Guestbook**: Guests pick up a vintage rotary telephone and leave spoken messages, laughter, and advice.
- **Custom Wooden Jigsaw Puzzle**: Every guest signs the back of a puzzle piece that you assemble and frame.
- **Polaroid Photo Wall with Metallic Markers**: Guests snap an instant portrait, paste it into an album, and leave a personal note.`,
  },
  {
    _id: "mock-6",
    title: "How to Keep Your Dance Floor Packed All Night Long",
    slug: "how-to-keep-dance-floor-packed",
    author: "Ryan Silva",
    category: { title: "Entertainment", slug: "entertainment" },
    publishedAt: "2026-05-01T13:00:00.000Z",
    excerpt:
      "A packed dance floor is the mark of an unforgettable celebration. Here are secret tips from top-rated wedding DJs.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    content: `Energy is contagious. If the couple is on the dance floor having the time of their lives, everyone else will be too.

### Key Ingredients for a Packed Dance Floor
- **Keep the Bar & Dance Floor Close**: If guests have to walk to another room for drinks, the energy disperses.
- **Provide Late-Night Snacks**: Mini kottu, sliders, or churros around 11 PM give guests a second wind.
- **Trust Your DJ**: Give them a "Must Play" and a "Do Not Play" list of 10 songs each, but allow them the freedom to read the crowd's energy.`,
  },
];

export const FALLBACK_CATEGORIES: SanityCategory[] = [
  { _id: "cat-1", title: "All", slug: "all", description: "All wedding articles" },
  { _id: "cat-2", title: "Venues", slug: "venues", description: "Venue selection guides" },
  { _id: "cat-3", title: "Budgeting", slug: "budgeting", description: "Financial planning tips" },
  { _id: "cat-4", title: "Bridal Fashion", slug: "bridal-fashion", description: "Trends, dresses, and styling" },
  { _id: "cat-5", title: "Photography", slug: "photography", description: "Photo & video advice" },
  { _id: "cat-6", title: "Planning Tips", slug: "planning-tips", description: "Checklists and advice" },
  { _id: "cat-7", title: "Entertainment", slug: "entertainment", description: "Music and reception fun" },
];

export async function getBlogPosts(categorySlug?: string): Promise<SanityPost[]> {
  if (isSanityConfigured && client) {
    try {
      const posts = await client.fetch<SanityPost[]>(POSTS_QUERY, {}, {
        next: { revalidate: 60, tags: ["posts"] },
      });
      if (posts && posts.length > 0) {
        if (!categorySlug || categorySlug === "all") return posts;
        return posts.filter((p) => p.category?.slug === categorySlug);
      }
    } catch (err) {
      console.warn("Sanity fetch failed. Falling back to local wedding posts:", err);
    }
  }

  if (!categorySlug || categorySlug === "all") {
    return FALLBACK_POSTS;
  }
  return FALLBACK_POSTS.filter((p) => p.category?.slug === categorySlug);
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
      console.warn(`Sanity fetch for slug ${slug} failed. Falling back to local data:`, err);
    }
  }

  return FALLBACK_POSTS.find((p) => p.slug === slug) || null;
}

export async function getBlogCategories(): Promise<SanityCategory[]> {
  if (isSanityConfigured && client) {
    try {
      const categories = await client.fetch<SanityCategory[]>(CATEGORIES_QUERY, {}, {
        next: { revalidate: 300, tags: ["categories"] },
      });
      if (categories && categories.length > 0) {
        return [{ _id: "cat-all", title: "All", slug: "all" }, ...categories];
      }
    } catch (err) {
      console.warn("Sanity category fetch failed. Falling back to local categories:", err);
    }
  }

  return FALLBACK_CATEGORIES;
}
