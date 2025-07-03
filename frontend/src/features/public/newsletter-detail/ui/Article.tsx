// frontend/src/features/public/newsletter-detail/ui/Article.tsx
import { ARTICLE_CATEGORY_CONFIG, type NewsletterArticle } from '@/entities/public/newsletter';

import { Avatar, AvatarFallback, AvatarImage, Badge } from '@/shared/shadcn';
import { Image } from '@/shared/ui';

type ArticleProps = {
  article: NewsletterArticle;
};

export const Article = ({ article }: ArticleProps) => {
  const categoryConfig = ARTICLE_CATEGORY_CONFIG[article.category];

  return (
    <article className="space-y-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className={`${categoryConfig.bgColor} ${categoryConfig.color} border-0`}>
            <span className="mr-1">{categoryConfig.icon}</span>
            {categoryConfig.label}
          </Badge>
          {article.teamName ? <Badge variant="outline">{article.teamName}</Badge> : null}
        </div>

        <h3 className="text-2xl font-bold">{article.title}</h3>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {article.author.avatar ? (
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
            ) : null}
            <AvatarFallback>
              {article.author.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{article.author.name}</p>
            {article.author.role ? (
              <p className="text-muted-foreground text-xs">{article.author.role}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Header Image */}
      {article.images?.find(img => img.position === 'header') ? (
        <div className="overflow-hidden rounded-lg">
          <Image
            src={article.images.find(img => img.position === 'header')?.url ?? ''}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          {article.images.find(img => img.position === 'header')?.caption ? (
            <p className="text-muted-foreground mt-2 text-center text-sm">
              {article.images.find(img => img.position === 'header')?.caption}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Content mit Inline-Bildern */}
      <div className="prose prose-lg max-w-none">
        {article.content.split('\n\n').map((paragraph, i) => (
          <div key={i}>
            <p className="mb-4">{paragraph}</p>

            {/* Inline Bilder nach jedem 2. Absatz */}
            {i % 2 === 1 &&
            article.images?.filter(img => img.position === 'inline')[Math.floor(i / 2)] ? (
              <figure className="my-6">
                <Image
                  src={
                    article.images.filter(img => img.position === 'inline')[Math.floor(i / 2)].url
                  }
                  alt=""
                  className="rounded-lg"
                />
                {article.images.filter(img => img.position === 'inline')[Math.floor(i / 2)]
                  .caption ? (
                  <figcaption className="text-muted-foreground mt-2 text-center text-sm">
                    {
                      article.images.filter(img => img.position === 'inline')[Math.floor(i / 2)]
                        .caption
                    }
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>
        ))}
      </div>

      {/* Gallery Images */}
      {article.images?.filter(img => img.position === 'gallery').length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {article.images
            .filter(img => img.position === 'gallery')
            .map((img, i) => (
              <figure key={i}>
                <Image src={img.url} alt="" className="rounded-lg" />
                {img.caption ? (
                  <figcaption className="text-muted-foreground mt-2 text-sm">
                    {img.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
        </div>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-4">
          {article.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </article>
  );
};
