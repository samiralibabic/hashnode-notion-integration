export type ArticleData = {
  idOrSlug: string;
  title: string;
  content: {
    markdown: string;
    html: string;
    text: string;
  };
  status: 'Draft' | 'Published';
};
