// frontend/src/features/public/newsletter-detail/ui/NavigationBar.tsx
import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import { ARTICLE_CATEGORY_CONFIG, type Newsletter } from '@/entities/public/newsletter';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/shadcn';

type NavigationBarProps = {
  newsletter: Newsletter;
};

export const NavigationBar = ({ newsletter }: NavigationBarProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);

      // Find active section
      const sections = newsletter.articles.map(a => ({
        id: a.id,
        element: document.getElementById(`article-${a.id}`),
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [newsletter.articles]);

  const scrollToArticle = (articleId: string) => {
    document.getElementById(`article-${articleId}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: isSticky ? 0 : -100 }}
      className="fixed top-0 right-0 left-0 z-50 border-b bg-white/80 backdrop-blur-lg dark:bg-black/80"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-4">
          {newsletter.articles.map(article => {
            const config = ARTICLE_CATEGORY_CONFIG[article.category];
            const isActive = activeSection === article.id;

            return (
              <Button
                key={article.id}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  scrollToArticle(article.id);
                }}
                className={cn(
                  'flex-shrink-0',
                  isActive &&
                    'bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]'
                )}
              >
                <span className="mr-1">{config.icon}</span>
                {article.title}
              </Button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
