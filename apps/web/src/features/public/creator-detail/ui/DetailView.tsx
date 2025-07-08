// features/public/creator-detail/ui/DetailView.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe } from 'lucide-react';

import type { Creator } from '@/entities/public/creator';

import { Button } from '@/shared/shadcn';
import { AnimatedValue, GlassCard } from '@/shared/ui';
import { socialIcons } from '@/shared/ui/icons/socialIcons';

type DetailViewProps = {
  creator: Creator;
};

export const DetailView = ({ creator }: DetailViewProps) => {
  // Social Links vorbereiten
  type SocialLink = {
    name: string;
    href: string;
    icon: string;
    color: string;
  };

  const creatorSocialLinks: SocialLink[] = [
    creator.instagram
      ? {
          name: 'instagram',
          href: `https://instagram.com/${creator.instagram}`,
          icon: socialIcons.instagram.path,
          color: socialIcons.instagram.color,
        }
      : null,
    creator.twitter
      ? {
          name: 'x',
          href: `https://x.com/${creator.twitter}`,
          icon: socialIcons.x.path,
          color: socialIcons.x.color,
        }
      : null,
  ].filter((link): link is SocialLink => Boolean(link));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden bg-gradient-to-br from-purple-500/20 to-amber-500/20">
        {creator.profileImage ? (
          <img
            src={creator.profileImage}
            alt={creator.artistName}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="relative z-10 container mx-auto flex h-full items-end px-4 pb-12">
          <div>
            <h1 className="mb-2 text-5xl font-bold text-white">{creator.artistName}</h1>
            {creator.realName ? <p className="text-xl text-white/80">{creator.realName}</p> : null}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" size="sm" asChild>
            <Link to="/kreativ">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Übersicht
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8">
              <h2 className="mb-4 text-2xl font-bold">Über mich</h2>
              <p className="whitespace-pre-line text-[var(--color-muted-foreground)]">
                {creator.description}
              </p>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <GlassCard className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Statistiken</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted-foreground)]">Werke</span>
                  <AnimatedValue value={creator.stats.worksCount} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted-foreground)]">Aufrufe</span>
                  <AnimatedValue value={creator.stats.viewsCount} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted-foreground)]">Likes</span>
                  <AnimatedValue value={creator.stats.likesCount} />
                </div>
              </div>
            </GlassCard>

            {/* Social Links */}
            {creatorSocialLinks.length > 0 || creator.website ? (
              <GlassCard className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Links</h3>

                {/* Website Link */}
                {creator.website ? (
                  <a
                    href={creator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 flex items-center gap-3 rounded-lg bg-[var(--color-background)] p-3 transition-all hover:bg-[var(--color-fanini-blue)]/10"
                  >
                    <Globe className="h-5 w-5 text-[var(--color-muted-foreground)]" />
                    <span className="text-sm font-medium">Website besuchen</span>
                  </a>
                ) : null}

                {/* Social Media Icons */}
                {creatorSocialLinks.length > 0 && (
                  <div className="flex gap-3">
                    {creatorSocialLinks.map(social => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-background)] transition-all hover:bg-[var(--color-fanini-blue)]"
                        aria-label={social.name}
                      >
                        <svg
                          className="h-5 w-5 fill-[var(--color-muted-foreground)] transition-colors group-hover:fill-white"
                          viewBox="0 0 24 24"
                        >
                          <path d={social.icon} />
                        </svg>
                      </a>
                    ))}
                  </div>
                )}
              </GlassCard>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
