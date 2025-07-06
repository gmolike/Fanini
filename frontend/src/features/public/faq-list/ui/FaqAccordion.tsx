// frontend/src/features/public/faq-list/ui/FaqAccordion.tsx
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Eye } from 'lucide-react';

import { FAQ_CATEGORY_CONFIG, type FaqItem } from '@/entities/public/faq';

import { Badge } from '@/shared/shadcn';
import { GlassCard } from '@/shared/ui';

type FaqAccordionProps = {
  items: FaqItem[];
  selectedCategory: string | null;
};

export const FaqAccordion = ({ items, selectedCategory }: FaqAccordionProps) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  return (
    <div className="space-y-4">
      {filteredItems.map((item, index) => {
        const isOpen = openItems.has(item.id);
        const categoryConfig = FAQ_CATEGORY_CONFIG[item.category];

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className="overflow-hidden">
              <button
                onClick={() => {
                  toggleItem(item.id);
                }}
                className="w-full p-6 text-left transition-colors hover:bg-[var(--color-muted)]/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <span className="mr-1">{categoryConfig.icon}</span>
                        {categoryConfig.label}
                      </Badge>
                      {item.isPopular ? (
                        <Badge variant="default" className="text-xs">
                          Beliebt
                        </Badge>
                      ) : null}
                    </div>
                    <h3 className="pr-4 text-lg font-medium">{item.question}</h3>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-5 w-5 text-[var(--color-muted-foreground)]" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-t px-6 py-4">
                      <div className="prose prose-sm max-w-none">
                        {item.answer.split('\n').map((paragraph, i) => (
                          <p key={`${item.id}-paragraph-${String(i)}`} className="mb-2">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {item.views} Aufrufe
                        </span>
                        <span>
                          Aktualisiert: {new Date(item.updatedAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
};
