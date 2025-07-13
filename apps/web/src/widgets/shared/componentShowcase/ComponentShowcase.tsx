// frontend/src/widgets/shared/componentShowcase/ComponentShowcase.tsx
import { useState } from 'react';

import { Code2, Copy, Eye } from 'lucide-react';

import { cn } from '@/shared/lib';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn';

type ComponentShowcaseProps = {
  title: string;
  description?: string;
  component: React.ReactNode;
  code: string;
  className?: string;
};

/**
 * Component Showcase
 * @description Zeigt eine Komponente mit Code-Beispiel und Live-Preview
 */
export const ComponentShowcase = ({
  title,
  description,
  component,
  code,
  className,
}: ComponentShowcaseProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="bg-background rounded-lg border p-6">{component}</div>
          </TabsContent>

          <TabsContent value="code" className="relative mt-4">
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 z-10"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <pre className="bg-muted overflow-x-auto rounded-lg p-4">
              <code className="text-sm">{code}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
