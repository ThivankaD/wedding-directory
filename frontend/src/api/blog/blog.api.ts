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
    console.warn('Blog API is unavailable. Showing empty blog list.');
    return {
      ...EMPTY_BLOG_RESPONSE,
      meta: {
        pagination: {
          ...EMPTY_BLOG_RESPONSE.meta.pagination,
          page,
          pageSize,
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
    console.warn('Blog API is unavailable. Unable to load blog post.');
    return null;
  }
};
