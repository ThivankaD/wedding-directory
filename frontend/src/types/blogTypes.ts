export interface BlogPost {
  id?: number | string;
  _id?: string;
  documentId?: string;
  Title?: string;
  title?: string;
  Slug?: string;
  slug?: string;
  Content?: string;
  content?: string;
  excerpt?: string;
  Author?: string;
  author?: string;
  Published?: boolean;
  category?: {
    _id?: string;
    title: string;
    slug: string;
  };
  CoverImage?: {
    id?: number;
    url: string;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
  coverImage?: any;
  coverImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  body?: any;
}

export interface BlogCardProps {
  post: BlogPost;
}

export interface BlogResponse {
  data: BlogPost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  }
}