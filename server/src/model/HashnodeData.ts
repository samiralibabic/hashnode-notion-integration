interface Post {
  id: string;
  slug: string;
}

export interface PostsResponse {
  posts: Post[];
  nextBatch: string | boolean;
}

export interface HashnodeQueryOptions {
  id?: string;
  slug?: string;
}