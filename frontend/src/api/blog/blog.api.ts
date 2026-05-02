import request from '../../utils/request';

const BLOG_API_BASE_URL = (process.env.NEXT_PUBLIC_BLOG_API_URL || 'http://51.79.145.226:5000')
  .trim()
  .replace(/\/+$/, '');

const BLOG_POSTS_URL = `${BLOG_API_BASE_URL}/api/posts`;

export const getBlogAssetUrl = (assetPath?: string) => {
  if (!assetPath) return null;
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }
  return `${BLOG_API_BASE_URL}${assetPath.startsWith('/') ? '' : '/'}${assetPath}`;
};

const EMPTY_BLOG_RESPONSE = {
  data: [],
  meta: {
    pagination: {
      page: 1,
      pageSize: 10,
      pageCount: 0,
      total: 0,
    },
  },
};


const MOCK_ARTICLES = [
  {
    id: "1",
    documentId: "mock-1",
    Title: "The Ultimate Guide to Choosing Your Wedding Venue",
    Slug: "ultimate-guide-choosing-wedding-venue",
    Content: "Finding the perfect wedding venue is often the hardest and most important part of wedding planning. The venue sets the tone, dictates your guest list size, and heavily influences your budget. In this guide, we cover the top questions to ask on venue tours, from hidden fees to catering restrictions, so you can book with confidence...",
    Author: "Sarah Jenkins",
    publishedAt: "2026-03-15T10:00:00.000Z",
    CoverImage: { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
  },
  {
    id: "2",
    documentId: "mock-2",
    Title: "How to Build a Realistic Wedding Budget (And Stick to It)",
    Slug: "realistic-wedding-budget-tips",
    Content: "Money is the number one source of stress for engaged couples. But building a wedding budget doesn't have to be a nightmare. We break down the standard percentages (did you know catering usually eats up 40% of the budget?) and share proven strategies for tracking expenses without losing your mind...",
    Author: "David Chen",
    publishedAt: "2026-04-02T14:30:00.000Z",
    CoverImage: { url: "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
  },
  {
    id: "3",
    documentId: "mock-3",
    Title: "2026 Bridal Fashion: The Biggest Dress Trends",
    Slug: "2026-bridal-dress-trends",
    Content: "This year, we are seeing a massive shift away from heavy ballgowns towards sleek, minimalist silhouettes with dramatic accessories. Think pearl-encrusted veils, detachable statement sleeves, and subtle pastel hues replacing traditional stark white. Here is our roundup of the hottest bridal trends straight from the runway...",
    Author: "Emma Laurent",
    publishedAt: "2026-04-18T09:15:00.000Z",
    CoverImage: { url: "https://images.unsplash.com/photo-1594552072238-185d96a575a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
  },
  {
    id: "4",
    documentId: "mock-4",
    Title: "Questions You MUST Ask Your Wedding Photographer",
    Slug: "questions-to-ask-wedding-photographer",
    Content: "Your wedding photos are one of the few things that last long after the cake is eaten and the dress is packed away. Before you sign a contract, make sure you ask these critical questions. Do they bring backup gear? What happens if they get sick? Do you get full printing rights? Read on to find out...",
    Author: "Michael Torres",
    publishedAt: "2026-04-25T11:45:00.000Z",
    CoverImage: { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
  },
  {
    id: "5",
    documentId: "mock-5",
    Title: "10 Unique Guest Book Alternatives Your Guests Will Love",
    Slug: "unique-guest-book-alternatives",
    Content: "Traditional guest books often end up gathering dust on a shelf. Why not create something you'll actually display? From having guests sign a custom wooden puzzle to leaving an audio voicemail on a retro phone, here are 10 creative ways to capture memories from your loved ones on your big day...",
    Author: "Jessica Hall",
    publishedAt: "2026-04-28T16:20:00.000Z",
    CoverImage: { url: "https://images.unsplash.com/photo-1522061266041-382a170868a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
  },
  {
    id: "6",
    documentId: "mock-6",
    Title: "How to Keep Your Dance Floor Packed All Night",
    Slug: "how-to-keep-dance-floor-packed",
    Content: "A packed dance floor is the universal sign of a great wedding reception. But how do you ensure your guests actually get out of their seats? It comes down to flow, lighting, and trusting your DJ. We interviewed three top-rated wedding DJs to get their secrets on curating the perfect playlist...",
    Author: "Ryan DJ Smooth",
    publishedAt: "2026-05-01T13:00:00.000Z",
    CoverImage: { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
  }
];

export const fetchBlogPosts = async (page = 1, pageSize = 10) => {
  try {
    const response = await request.get(BLOG_POSTS_URL, {
      timeout: 8000,
      params: {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'sort': 'publishedAt:desc',
        'filters[Published][$eq]': true,
        'populate': 'CoverImage',
      }
    });
    
    return response.data;
  } catch (error) {
    console.warn('Blog API is unavailable. Showing mock articles instead.');
    
    // Calculate pagination for mock data
    const startIndex = (page - 1) * pageSize;
    const paginatedArticles = MOCK_ARTICLES.slice(startIndex, startIndex + pageSize);
    const total = MOCK_ARTICLES.length;
    
    return {
      data: paginatedArticles,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  }
};

export const fetchBlogPostBySlug = async (slug: string) => {
  try {
    const response = await request.get(BLOG_POSTS_URL, {
      timeout: 8000,
      params: {
        'filters[Slug][$eq]': slug,
         'populate': 'CoverImage'
      }
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    return null;
  } catch (error) {
    console.warn('Blog API is unavailable. Showing mock article instead.');
    const mockArticle = MOCK_ARTICLES.find(article => article.Slug === slug);
    return mockArticle || null;
  }
};
