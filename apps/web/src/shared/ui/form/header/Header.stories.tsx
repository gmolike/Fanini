// frontend/src/form/header/Header.stories.tsx

import {
  Download,
  Edit,
  FileText,
  Plus,
  Save,
  Settings,
  Share2,
  Shield,
  Star,
  Trash2,
  User,
  Zap,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage, Badge, Button } from '@/shared/shadcn';

import { FormHeader } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/Header',
  component: FormHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Form header with flexible layout options',
      },
    },
  },
} satisfies Meta<typeof FormHeader>;

export default meta;

/**
 * Header variants
 */
export const Variants = () => {
  return (
    <div className="space-y-8">
      <FormHeader
        title="Default Header"
        description="This is the default header layout with an icon"
        icon={FileText}
      />

      <FormHeader
        title="Centered Header"
        description="This header is centered with all content aligned to the middle"
        variant="centered"
        icon={Star}
      />

      <FormHeader
        title="Minimal Header"
        description="Compact header variant for smaller forms or tight spaces"
        variant="minimal"
        icon={Settings}
      />
    </div>
  );
};

/**
 * With additional elements
 */
export const WithElements = () => {
  return (
    <div className="space-y-8">
      <FormHeader
        title="With Subtitle"
        subtitle="Additional context information"
        description="Headers can have a subtitle between the title and description for extra hierarchy"
        icon={FileText}
      />

      <FormHeader
        title="With Badge"
        description="Add status indicators or labels to your headers"
        icon={Shield}
        badge={<Badge variant="secondary">PRO</Badge>}
      />

      <FormHeader
        title="With Multiple Badges"
        description="You can combine multiple badges for complex status"
        icon={Zap}
        badge={
          <div className="flex gap-2">
            <Badge>New</Badge>
            <Badge variant="secondary">Beta</Badge>
            <Badge variant="outline">v2.0</Badge>
          </div>
        }
      />

      <FormHeader
        title="With Custom Avatar"
        description="Use custom elements like avatars instead of icons"
        avatar={
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        }
      />
    </div>
  );
};

/**
 * With actions
 */
export const WithActions = () => {
  return (
    <div className="space-y-8">
      <FormHeader
        title="Single Action"
        description="Headers can include action buttons"
        icon={Settings}
        actions={
          <Button size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        }
      />

      <FormHeader
        title="Multiple Actions"
        description="Combine multiple actions for more functionality"
        icon={FileText}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        }
      />

      <FormHeader
        title="Icon-Only Actions"
        description="Use icon buttons for a cleaner look"
        icon={Edit}
        actions={
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        }
      />
    </div>
  );
};

/**
 * Complex descriptions
 */
export const ComplexDescriptions = () => {
  return (
    <div className="space-y-8">
      <FormHeader
        title="Rich Description"
        description={
          <div className="space-y-2">
            <p>Headers support complex descriptions with multiple elements:</p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Bullet points for better readability</li>
              <li>Multiple paragraphs of content</li>
              <li>
                Even{' '}
                <a href="https://example.com" className="text-primary hover:underline">
                  interactive links
                </a>
              </li>
            </ul>
          </div>
        }
        icon={FileText}
      />

      <FormHeader
        title="With Code Examples"
        description={
          <div className="space-y-2">
            <p>You can include code snippets in descriptions:</p>
            <code className="bg-muted block rounded p-2 text-sm">npm install @shadcn/ui</code>
            <p className="text-sm">Then import the components you need.</p>
          </div>
        }
        icon={Settings}
      />

      <FormHeader
        title="With Warning"
        description={
          <div className="rounded-lg bg-yellow-50 p-3 text-sm dark:bg-yellow-950">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">⚠️ Important Note</p>
            <p className="text-yellow-700 dark:text-yellow-300">
              This action cannot be undone. Please proceed with caution.
            </p>
          </div>
        }
        icon={Shield}
      />
    </div>
  );
};

/**
 * Complete examples
 */
export const CompleteExamples = () => {
  return (
    <div className="space-y-8">
      <FormHeader
        title="User Profile Settings"
        subtitle="Manage your account"
        description="Update your personal information and preferences"
        icon={User}
        badge={<Badge variant="secondary">Verified</Badge>}
        actions={
          <Button size="sm" variant="outline">
            View Public Profile
          </Button>
        }
      />

      <FormHeader
        title="Create New Project"
        description={
          <div className="space-y-2">
            <p>Set up a new project with your preferred configuration.</p>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Templates available
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                Git integration ready
              </span>
            </div>
          </div>
        }
        variant="centered"
        icon={Plus}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Use Template
            </Button>
            <Button size="sm">Start from Scratch</Button>
          </div>
        }
      />

      <FormHeader
        title="API Configuration"
        subtitle="v2.3.1"
        description="Configure your API endpoints and authentication"
        variant="minimal"
        icon={Zap}
        badge={
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              Connected
            </Badge>
            <Badge variant="secondary">Rate limit: 1000/hour</Badge>
          </div>
        }
      />
    </div>
  );
};
