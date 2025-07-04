// features/public/organization-detail/ui/Hero.tsx
import { motion } from 'framer-motion';
import { Calendar, Mail, Sparkles, Users } from 'lucide-react';

import { type Gremium, GREMIUM_CONFIG } from '@/entities/public/organization';

import { Badge } from '@/shared/shadcn';
import { AnimatedNumber, Image } from '@/shared/ui';

type DetailHeroProps = {
  gremium: Gremium;
};

export const DetailHero = ({ gremium }: DetailHeroProps) => {
  const config = GREMIUM_CONFIG[gremium.type];

  return (
    <div className="relative min-h-[60vh] overflow-hidden">
      {/* Background Image with Parallax */}
      {gremium.headerImage ? (
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={gremium.headerImage}
            alt={gremium.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      ) : null}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex min-h-[60vh] items-end pb-12">
          <div className="max-w-4xl space-y-6">
            {/* Type Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                className="px-4 py-2 text-lg text-white"
                style={{ background: `linear-gradient(to right, ${config.gradient})` }}
              >
                <span className="mr-2">{config.icon}</span>
                {config.label}
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-white md:text-7xl"
            >
              {gremium.name}
            </motion.h1>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Users className="h-5 w-5 text-white" />
                <span className="text-lg font-medium text-white">
                  <AnimatedNumber value={gremium.stats.memberCount} /> Mitglieder
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-white" />
                <span className="text-lg font-medium text-white">
                  Seit {new Date(gremium.establishedDate).getFullYear()}
                </span>
              </div>
              {gremium.stats.projectsCompleted ? (
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-white" />
                  <span className="text-lg font-medium text-white">
                    <AnimatedNumber value={gremium.stats.projectsCompleted} /> Projekte
                  </span>
                </div>
              ) : null}
            </motion.div>

            {/* Contact */}
            {gremium.contactEmail ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-white/80"
              >
                <Mail className="h-5 w-5" />
                <a href={`mailto:${gremium.contactEmail}`} className="hover:text-white">
                  {gremium.contactEmail}
                </a>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
