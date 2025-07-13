// frontend/src/widgets/public/faq/ui/Widget.tsx
import { useState } from 'react';

import { motion } from 'framer-motion';
import { HelpCircle, Search } from 'lucide-react';

import { FaqAccordion } from '@/features/public/faq-list';

import { FAQ_CATEGORY_CONFIG, useFaqList } from '@/entities/public/faq';

import { Badge, Input } from '@/shared/shadcn';
import { AnimatedValue, GlassCard, LoadingState } from '@/shared/ui';

export const FaqWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const faqQuery = useFaqList();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-fanini-blue)]/5 via-transparent to-[var(--color-fanini-red)]/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-blue)]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-red)]/10 blur-3xl delay-1000" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mb-6 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-5"
          >
            <HelpCircle className="h-12 w-12 text-white" />
          </motion.div>

          <AnimatedValue delay={0.2}>
            <h1 className="mb-4 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              FAQ & Hilfe
            </h1>
          </AnimatedValue>

          <AnimatedValue delay={0.3}>
            <p className="mx-auto max-w-2xl text-xl text-[var(--color-muted-foreground)]">
              Antworten auf die häufigsten Fragen rund um die Faninitiative
            </p>
          </AnimatedValue>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-20">
        <LoadingState query={faqQuery}>
          {response => {
            const filteredItems = response.data.filter(item => {
              const matchesSearch =
                item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesCategory = !selectedCategory || item.category === selectedCategory;
              return matchesSearch && matchesCategory;
            });

            return (
              <>
                {/* Search & Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <GlassCard className="p-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                        <Input
                          placeholder="Frage durchsuchen..."
                          value={searchTerm}
                          onChange={e => {
                            setSearchTerm(e.target.value);
                          }}
                          className="pl-10"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={selectedCategory === null ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedCategory(null);
                          }}
                        >
                          Alle Kategorien
                        </Badge>
                        {Object.entries(FAQ_CATEGORY_CONFIG).map(([key, config]) => (
                          <Badge
                            key={key}
                            variant={selectedCategory === key ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedCategory(key === selectedCategory ? null : key);
                            }}
                          >
                            <span className="mr-1">{config.icon}</span>
                            {config.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* FAQ List */}
                <FaqAccordion items={filteredItems} selectedCategory={selectedCategory} />
              </>
            );
          }}
        </LoadingState>
      </div>
    </div>
  );
};
