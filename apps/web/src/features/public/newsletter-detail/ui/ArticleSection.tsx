// frontend/src/features/public/newsletter-detail/ui/ArticleSection.tsx
import { motion } from 'framer-motion';
import { ChevronRight, User } from 'lucide-react';

import { ARTICLE_CATEGORY_CONFIG, type NewsletterArticle } from '@/entities/public/newsletter';

import { Avatar, AvatarFallback, AvatarImage, Badge } from '@/shared/shadcn';
import { GlassCard, HoverCard, Image } from '@/shared/ui';

type ArticleSectionProps = {
  article: NewsletterArticle;
};

export const ArticleSection = ({ article }: ArticleSectionProps) => {
  const categoryConfig = ARTICLE_CATEGORY_CONFIG[article.category];
  const headerImage = article.images?.find(img => img.position === 'header');
  const galleryImages = article.images?.filter(img => img.position === 'gallery') ?? [];

  return (
    <div id={`article-${article.id}`} className="mb-16 scroll-mt-24">
      <HoverCard>
        <GlassCard className="overflow-hidden">
          {/* Category Header */}
          <div className={`h-2 bg-gradient-to-r ${categoryConfig.gradient}`} />

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm">
                  <span className="mr-1">{categoryConfig.icon}</span>
                  {categoryConfig.label}
                </Badge>
                {article.teamName ? (
                  <>
                    <ChevronRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                    <span className="font-medium">{article.teamName}</span>
                  </>
                ) : null}
              </div>

              <h2 className="text-3xl font-bold">{article.title}</h2>

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {article.author.avatar ? (
                    <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{article.author.name}</p>
                  {article.author.role ? (
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {article.author.role}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-6 text-lg font-medium text-[var(--color-muted-foreground)]"
            >
              {article.excerpt}
            </motion.p>

            {/* Header Image */}
            {headerImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-6 overflow-hidden rounded-lg"
              >
                <Image src={headerImage.url} alt={article.title} className="w-full" />
              </motion.div>
            ) : null}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              {article.content.split('\n\n').map(paragraph => (
                <p key={paragraph.slice(0, 32)} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 grid gap-4 md:grid-cols-2"
              >
                {galleryImages.map(img => (
                  <div key={img.url} className="overflow-hidden rounded-lg">
                    <Image
                      src={img.url}
                      alt={img.caption ?? ''}
                      className="w-full transition-transform hover:scale-105"
                    />
                    {img.caption ? (
                      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                        {img.caption}
                      </p>
                    ) : null}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {article.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </motion.div>
            ) : null}
          </div>
        </GlassCard>
      </HoverCard>
    </div>
  );
};
