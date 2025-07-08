// frontend/src/form/multiSelect/MultiSelect.stories.tsx

/* eslint-disable no-console */

import {
  AtSign,
  Bookmark,
  Code,
  Flag,
  Globe,
  Hash,
  Heart,
  Shield,
  Star,
  Tag,
  Users,
  Zap,
} from 'lucide-react';

import { Form, FormActionButton, FormFooter, FormHeader, FormMultiSelect, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/MultiSelect',
  component: FormMultiSelect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Multiple selection dropdown with limits',
      },
    },
  },
} satisfies Meta<typeof FormMultiSelect>;

export default meta;

/**
 * Basic multi-select
 */
export const Basic = () => {
  const form = useForm({
    defaultValues: {
      tags: [],
      categories: ['general'],
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('MultiSelect values:', data);
  };

  const tagOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'enhancement', label: 'Enhancement' },
  ];

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'technical', label: 'Technical' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Support' },
  ];

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormHeader
        title="Basic Multi-Select"
        description="Select multiple options from the list"
        icon={Tag}
      />

      <div className="max-w-md space-y-4">
        <FormMultiSelect
          control={form.control}
          name="tags"
          label="Tags"
          options={tagOptions}
          placeholder="Select tags..."
        />

        <FormMultiSelect
          control={form.control}
          name="categories"
          label="Categories"
          options={categoryOptions}
          placeholder="Select categories..."
          description="You can select multiple categories"
        />
      </div>

      <FormFooter showReset submitText="Save Selection" />
    </Form>
  );
};

/**
 * With limits and icons
 */
export const WithLimits = () => {
  const form = useForm({
    defaultValues: {
      skills: ['react'],
      interests: [],
      team: [],
    },
  });

  const skillOptions = [
    { value: 'react', label: 'React', icon: Code },
    { value: 'vue', label: 'Vue', icon: Code },
    { value: 'angular', label: 'Angular', icon: Code },
    { value: 'svelte', label: 'Svelte', icon: Code },
    { value: 'nextjs', label: 'Next.js', icon: Code },
    { value: 'remix', label: 'Remix', icon: Code },
  ];

  const interestOptions = [
    { value: 'coding', label: 'Coding', icon: Code },
    { value: 'design', label: 'Design', icon: Star },
    { value: 'music', label: 'Music', icon: Heart },
    { value: 'sports', label: 'Sports', icon: Flag },
    { value: 'reading', label: 'Reading', icon: Bookmark },
  ];

  const teamOptions = [
    { value: 'john', label: 'John Doe', icon: Users },
    { value: 'jane', label: 'Jane Smith', icon: Users },
    { value: 'bob', label: 'Bob Johnson', icon: Users },
    { value: 'alice', label: 'Alice Brown', icon: Users },
    { value: 'charlie', label: 'Charlie Davis', icon: Users },
  ];

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Limited Selection"
        description="Multi-select with maximum selection limits"
        icon={Shield}
      />

      <div className="max-w-md space-y-4">
        <FormMultiSelect
          control={form.control}
          name="skills"
          label="Skills (Max 3)"
          options={skillOptions}
          max={3}
          description="Select up to 3 skills"
          showCount
          required
        />

        <FormMultiSelect
          control={form.control}
          name="interests"
          label="Interests (Max 2)"
          options={interestOptions}
          max={2}
          placeholder="Select your interests..."
          showCount
        />

        <FormMultiSelect
          control={form.control}
          name="team"
          label="Team Members (Max 4)"
          options={teamOptions}
          max={4}
          placeholder="Add team members..."
          description="Select up to 4 team members"
        />
      </div>

      <FormFooter />
    </Form>
  );
};

/**
 * Large dataset with search
 */
export const LargeDataset = () => {
  const form = useForm({
    defaultValues: {
      hashtags: [],
      mentions: [],
    },
  });

  // Generate hashtag options
  const hashtagOptions = Array.from({ length: 50 }, (_, i) => ({
    value: `tag${String(i)}`,
    label: `#hashtag${String(i + 1)}`,
    icon: Hash,
  }));

  // Generate mention options
  const mentionOptions = Array.from({ length: 30 }, (_, i) => ({
    value: `user${String(i)}`,
    label: `@user${String(i + 1)}`,
    icon: AtSign,
    description: `User ${String(i + 1)}`,
  }));

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Large Datasets"
        description="Multi-select with many options"
        icon={Globe}
      />

      <div className="max-w-md space-y-4">
        <FormMultiSelect
          control={form.control}
          name="hashtags"
          label="Hashtags"
          options={hashtagOptions}
          placeholder="Search and select hashtags..."
          description="Search through 50 hashtags"
          showCount
        />

        <FormMultiSelect
          control={form.control}
          name="mentions"
          label="Mentions"
          options={mentionOptions}
          placeholder="Search and select users..."
          max={10}
          showCount
        />
      </div>

      <FormFooter showReset />
    </Form>
  );
};

/**
 * Dynamic filtering example
 */
export const DynamicFiltering = () => {
  const form = useForm({
    defaultValues: {
      selectedFeatures: [],
      plan: 'free',
    },
  });

  const allFeatures = [
    { value: 'basic-1', label: 'Basic Feature 1', tier: 'free' },
    { value: 'basic-2', label: 'Basic Feature 2', tier: 'free' },
    { value: 'basic-3', label: 'Basic Feature 3', tier: 'free' },
    { value: 'pro-1', label: 'Pro Feature 1', tier: 'pro', icon: Zap },
    { value: 'pro-2', label: 'Pro Feature 2', tier: 'pro', icon: Zap },
    { value: 'pro-3', label: 'Pro Feature 3', tier: 'pro', icon: Zap },
    { value: 'enterprise-1', label: 'Enterprise Feature 1', tier: 'enterprise', icon: Shield },
    { value: 'enterprise-2', label: 'Enterprise Feature 2', tier: 'enterprise', icon: Shield },
  ];

  const currentPlan = form.watch('plan');

  const availableFeatures = allFeatures.map(feature => ({
    ...feature,
    disabled:
      (currentPlan === 'free' && feature.tier !== 'free') ||
      (currentPlan === 'pro' && feature.tier === 'enterprise'),
  }));

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Dynamic Filtering"
        description="Options change based on selection"
        icon={Zap}
      />

      <div className="max-w-md space-y-4">
        <div className="flex gap-2">
          <FormActionButton
            control={form.control}
            onClick={() => {
              form.setValue('plan', 'free');
            }}
            variant={currentPlan === 'free' ? 'default' : 'outline'}
            size="sm"
          >
            Free Plan
          </FormActionButton>
          <FormActionButton
            control={form.control}
            onClick={() => {
              form.setValue('plan', 'pro');
            }}
            variant={currentPlan === 'pro' ? 'default' : 'outline'}
            size="sm"
          >
            Pro Plan
          </FormActionButton>
          <FormActionButton
            control={form.control}
            onClick={() => {
              form.setValue('plan', 'enterprise');
            }}
            variant={currentPlan === 'enterprise' ? 'default' : 'outline'}
            size="sm"
          >
            Enterprise
          </FormActionButton>
        </div>

        <FormMultiSelect
          control={form.control}
          name="selectedFeatures"
          label="Available Features"
          options={availableFeatures}
          placeholder="Select features..."
          description={`Features available in ${currentPlan} plan`}
          showClearAll
        />

        <div className="bg-muted rounded-lg p-4 text-sm">
          <p className="font-medium">Plan: {currentPlan}</p>
          <p>Selected: {form.watch('selectedFeatures').length} features</p>
        </div>
      </div>

      <FormFooter />
    </Form>
  );
};
