// frontend/src/form/select/Select.stories.tsx

/* eslint-disable no-console */

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Cloud,
  Cpu,
  Flag,
  Globe,
  Palette,
  Shield,
  Star,
  XCircle,
  Zap,
} from 'lucide-react';

import { Form, FormFooter, FormHeader, FormSelect, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/Select',
  component: FormSelect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Dropdown select with search and icons',
      },
    },
  },
} satisfies Meta<typeof FormSelect>;

export default meta;

/**
 * Basic select
 */
export const Basic = () => {
  const form = useForm({
    defaultValues: {
      country: '',
      language: 'en',
      timezone: '',
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('Select values:', data);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormHeader title="Basic Select" description="Simple dropdown selections" icon={Globe} />

      <div className="max-w-md space-y-4">
        <FormSelect
          control={form.control}
          name="country"
          label="Country"
          options={[
            { value: 'de', label: 'Germany' },
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'fr', label: 'France' },
            { value: 'es', label: 'Spain' },
            { value: 'it', label: 'Italy' },
          ]}
          placeholder="Select your country"
          required
        />

        <FormSelect
          control={form.control}
          name="language"
          label="Language"
          options={[
            { value: 'en', label: 'English' },
            { value: 'de', label: 'Deutsch' },
            { value: 'fr', label: 'Français' },
            { value: 'es', label: 'Español' },
          ]}
        />

        <FormSelect
          control={form.control}
          name="timezone"
          label="Timezone"
          options={[
            { value: 'utc', label: 'UTC' },
            { value: 'cet', label: 'Central European Time' },
            { value: 'est', label: 'Eastern Standard Time' },
            { value: 'pst', label: 'Pacific Standard Time' },
          ]}
          placeholder="Select timezone"
          description="Your local timezone"
        />
      </div>

      <FormFooter showReset submitText="Save Settings" />
    </Form>
  );
};

/**
 * With icons and descriptions
 */
export const WithIcons = () => {
  const form = useForm({
    defaultValues: {
      status: 'active',
      priority: '',
      plan: '',
    },
  });

  const statusOptions = [
    { value: 'active', label: 'Active', icon: CheckCircle },
    { value: 'inactive', label: 'Inactive', icon: XCircle },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'error', label: 'Error', icon: AlertCircle },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', description: 'Can wait', icon: Flag },
    { value: 'medium', label: 'Medium Priority', description: 'Should be done soon', icon: Flag },
    { value: 'high', label: 'High Priority', description: 'Urgent', icon: AlertCircle },
    { value: 'critical', label: 'Critical', description: 'Do immediately', icon: AlertCircle },
  ];

  const planOptions = [
    { value: 'free', label: 'Free', description: 'Basic features', icon: Star },
    { value: 'pro', label: 'Pro', description: 'Advanced features', icon: Zap },
    { value: 'team', label: 'Team', description: 'For teams', icon: Shield },
    {
      value: 'enterprise',
      label: 'Enterprise',
      description: 'Custom solutions',
      icon: Cpu,
      disabled: true,
    },
  ];

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Rich Select Options"
        description="Selects with icons and descriptions"
        icon={Star}
      />

      <div className="max-w-md space-y-4">
        <FormSelect
          control={form.control}
          name="status"
          label="Status"
          options={statusOptions}
          description="Current status of the item"
        />

        <FormSelect
          control={form.control}
          name="priority"
          label="Priority Level"
          options={priorityOptions}
          placeholder="Select priority"
        />

        <FormSelect
          control={form.control}
          name="plan"
          label="Subscription Plan"
          options={planOptions}
          placeholder="Choose a plan"
          description="Enterprise plan requires contacting sales"
        />
      </div>

      <FormFooter />
    </Form>
  );
};

/**
 * Dynamic options
 */
export const DynamicOptions = () => {
  const form = useForm({
    defaultValues: {
      category: '',
      subcategory: '',
    },
  });

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
  ];

  const subcategories: Record<string, { value: string; label: string }[]> = {
    electronics: [
      { value: 'phones', label: 'Phones' },
      { value: 'laptops', label: 'Laptops' },
      { value: 'tablets', label: 'Tablets' },
    ],
    clothing: [
      { value: 'mens', label: "Men's" },
      { value: 'womens', label: "Women's" },
      { value: 'kids', label: 'Kids' },
    ],
    books: [
      { value: 'fiction', label: 'Fiction' },
      { value: 'nonfiction', label: 'Non-Fiction' },
      { value: 'educational', label: 'Educational' },
    ],
  };

  const selectedCategory = form.watch('category');
  const currentSubcategories = subcategories[selectedCategory] ?? [];

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Dynamic Select"
        description="Second select depends on first"
        icon={Cloud}
      />

      <div className="max-w-md space-y-4">
        <FormSelect
          control={form.control}
          name="category"
          label="Category"
          options={categories}
          placeholder="Select a category"
          required
        />

        <FormSelect
          control={form.control}
          name="subcategory"
          label="Subcategory"
          options={currentSubcategories}
          placeholder={selectedCategory ? 'Select a subcategory' : 'Select a category first'}
          disabled={!selectedCategory}
          showClear
        />
      </div>

      <FormFooter showReset />
    </Form>
  );
};

/**
 * Large dataset
 */
export const LargeDataset = () => {
  const form = useForm({
    defaultValues: {
      color: '',
      number: '',
    },
  });

  // Generate color options
  const colorOptions = [
    { value: '#ff0000', label: 'Red', icon: Palette },
    { value: '#00ff00', label: 'Green', icon: Palette },
    { value: '#0000ff', label: 'Blue', icon: Palette },
    { value: '#ffff00', label: 'Yellow', icon: Palette },
    { value: '#ff00ff', label: 'Magenta', icon: Palette },
    { value: '#00ffff', label: 'Cyan', icon: Palette },
    { value: '#ff8800', label: 'Orange', icon: Palette },
    { value: '#8800ff', label: 'Purple', icon: Palette },
  ];

  // Generate number options
  const numberOptions = Array.from({ length: 100 }, (_, i) => ({
    value: String(i + 1),
    label: `Number ${String(i + 1)}`,
    description: i % 10 === 0 ? 'Milestone' : undefined,
  }));

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Large Datasets"
        description="Select with many options and search"
        icon={Cpu}
      />

      <div className="max-w-md space-y-4">
        <FormSelect
          control={form.control}
          name="color"
          label="Favorite Color"
          options={colorOptions}
          placeholder="Search colors..."
        />

        <FormSelect
          control={form.control}
          name="number"
          label="Lucky Number"
          options={numberOptions}
          placeholder="Search numbers..."
          description="Select from 1 to 100"
        />
      </div>

      <FormFooter />
    </Form>
  );
};
