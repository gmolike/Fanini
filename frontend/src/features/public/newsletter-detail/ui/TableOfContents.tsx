// frontend/src/features/public/newsletter-detail/ui/TableOfContents.tsx
import { ARTICLE_CATEGORY_CONFIG, type NewsletterArticle } from '@/entities/public/newsletter';

type TableOfContentsProps = {
  articles: NewsletterArticle[];
};

export const TableOfContents = ({ articles }: TableOfContentsProps) => {
  const scrollToArticle = (articleId: string) => {
    document.getElementById(`article-${articleId}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-muted/50 rounded-lg p-6">
      <h2 className="mb-4 text-lg font-semibold">In dieser Ausgabe</h2>
      <ul className="space-y-2">
        {articles.map(article => {
          const categoryConfig = ARTICLE_CATEGORY_CONFIG[article.category];
          return (
            <li key={article.id}>
              <button
                onClick={() => {
                  scrollToArticle(article.id);
                }}
                className="hover:bg-muted flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors"
              >
                <span className={`text-lg ${categoryConfig.color}`}>{categoryConfig.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{article.title}</p>
                  <p className="text-muted-foreground text-sm">
                    von {article.author.name}
                    {article.teamName ? ` - ${article.teamName}` : null}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
