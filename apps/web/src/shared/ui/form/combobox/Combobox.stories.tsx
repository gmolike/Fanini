// frontend/src/form/combobox/Combobox.stories.tsx
/* eslint-disable max-lines */
/* eslint-disable no-console */

import { useState } from 'react';

import { Cloud, Code, Cpu, Database, Globe, HardDrive, Package, Search } from 'lucide-react';

import { Form, FormCombobox, FormFooter, FormHeader, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/Combobox',
  component: FormCombobox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Searchable dropdown with autocomplete',
      },
    },
  },
} satisfies Meta<typeof FormCombobox>;

export default meta;

/**
 * Basic combobox
 */
export const Basic = () => {
  const form = useForm({
    defaultValues: {
      framework: '',
      database: '',
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('Combobox values:', data);
  };

  const frameworkOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'remix', label: 'Remix' },
    { value: 'astro', label: 'Astro' },
  ];

  const databaseOptions = [
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'redis', label: 'Redis' },
    { value: 'sqlite', label: 'SQLite' },
  ];

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormHeader
        title="Basic Combobox"
        description="Type to search through options"
        icon={Search}
      />

      <div className="max-w-md space-y-4">
        <FormCombobox
          control={form.control}
          name="framework"
          label="Framework"
          options={frameworkOptions}
          placeholder="Select framework..."
          searchPlaceholder="Search frameworks..."
        />

        <FormCombobox
          control={form.control}
          name="database"
          label="Database"
          options={databaseOptions}
          placeholder="Select database..."
          searchPlaceholder="Search databases..."
          description="Choose your preferred database"
        />
      </div>

      <FormFooter showReset submitText="Save Selection" />
    </Form>
  );
};

/**
 * With icons and descriptions
 */
export const RichOptions = () => {
  const form = useForm({
    defaultValues: {
      service: '',
      deployment: '',
    },
  });

  const serviceOptions = [
    {
      value: 'web',
      label: 'Web Service',
      description: 'HTTP-based service',
      icon: Globe,
    },
    {
      value: 'api',
      label: 'API Service',
      description: 'RESTful or GraphQL API',
      icon: Code,
    },
    {
      value: 'database',
      label: 'Database',
      description: 'Managed database instance',
      icon: Database,
    },
    {
      value: 'storage',
      label: 'Storage',
      description: 'Object or file storage',
      icon: HardDrive,
    },
    {
      value: 'compute',
      label: 'Compute',
      description: 'Virtual machines or containers',
      icon: Cpu,
    },
  ];

  const deploymentOptions = [
    {
      value: 'vercel',
      label: 'Vercel',
      description: 'Deploy with zero config',
      icon: Cloud,
    },
    {
      value: 'netlify',
      label: 'Netlify',
      description: 'Modern web development',
      icon: Cloud,
    },
    {
      value: 'aws',
      label: 'AWS',
      description: 'Amazon Web Services',
      icon: Cloud,
    },
    {
      value: 'gcp',
      label: 'Google Cloud',
      description: 'Google Cloud Platform',
      icon: Cloud,
    },
    {
      value: 'azure',
      label: 'Azure',
      description: 'Microsoft Azure',
      icon: Cloud,
    },
  ];

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Rich Options"
        description="Combobox with icons and descriptions"
        icon={Package}
      />

      <div className="max-w-md space-y-4">
        <FormCombobox
          control={form.control}
          name="service"
          label="Service Type"
          options={serviceOptions}
          placeholder="Choose service type..."
          required
        />

        <FormCombobox
          control={form.control}
          name="deployment"
          label="Deployment Platform"
          options={deploymentOptions}
          placeholder="Select deployment platform..."
        />
      </div>

      <FormFooter />
    </Form>
  );
};

/**
 * Async search with loading
 */
export const AsyncSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<
    { value: string; label: string; description?: string }[]
  >([]);
  const [projectOptions, setProjectOptions] = useState<
    { value: string; label: string; description?: string }[]
  >([]);

  const form = useForm({
    defaultValues: {
      user: '',
      project: '',
    },
  });

  // Simulate user search
  const handleUserSearch = async (search: string) => {
    if (!search) {
      setUserOptions([]);
      return;
    }

    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUsers = [
      { value: `${search}-1`, label: `${search} Johnson`, description: 'Senior Developer' },
      { value: `${search}-2`, label: `${search} Smith`, description: 'Product Manager' },
      { value: `${search}-3`, label: `${search} Williams`, description: 'Designer' },
      { value: `${search}-4`, label: `${search} Brown`, description: 'DevOps Engineer' },
    ];

    setUserOptions(mockUsers);
    setIsLoading(false);
  };

  // Simulate project search
  const handleProjectSearch = async (search: string) => {
    if (!search) {
      setProjectOptions([]);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const mockProjects = Array.from({ length: 5 }, (_, i) => ({
      value: `project-${search}-${String(i)}`,
      label: `Project ${search} ${String(i + 1)}`,
      description: `Last updated ${String(i + 1)} days ago`,
    }));

    setProjectOptions(mockProjects);
    setIsLoading(false);
  };

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader title="Async Search" description="Search with loading states" icon={Search} />

      <div className="max-w-md space-y-4">
        <FormCombobox
          control={form.control}
          name="user"
          label="Search Users"
          options={userOptions}
          onSearchChange={handleUserSearch}
          loading={isLoading}
          placeholder="Select user..."
          searchPlaceholder="Type to search users..."
          emptyText="Type at least 1 character to search"
          debounceDelay={300}
        />

        <FormCombobox
          control={form.control}
          name="project"
          label="Search Projects"
          options={projectOptions}
          onSearchChange={handleProjectSearch}
          loading={isLoading}
          placeholder="Select project..."
          searchPlaceholder="Type to search projects..."
          emptyText="Start typing to search projects"
          debounceDelay={500}
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
      country: '',
      city: '',
    },
  });

  // Generate countries
  const countryOptions = [
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Canada',
    'Australia',
    'Japan',
    'China',
    'India',
    'Brazil',
    'Mexico',
    'Russia',
    'South Korea',
    'Netherlands',
    'Switzerland',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Belgium',
    'Austria',
    'Poland',
    'Portugal',
    'Greece',
    'Czech Republic',
    'Hungary',
    'Romania',
    'Bulgaria',
    'Croatia',
  ].map(country => ({
    value: country.toLowerCase().replace(/\s+/g, '-'),
    label: country,
    icon: Globe,
  }));

  // Generate cities
  const cityOptions = Array.from({ length: 100 }, (_, i) => ({
    value: `city-${String(i)}`,
    label: `City ${String(i + 1)}`,
    // eslint-disable-next-line sonarjs/pseudo-random
    description: `Population: ${String(Math.floor(Math.random() * 1000000))}`,
  }));

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader title="Large Datasets" description="Combobox with many options" icon={Globe} />

      <div className="max-w-md space-y-4">
        <FormCombobox
          control={form.control}
          name="country"
          label="Country"
          options={countryOptions}
          placeholder="Search countries..."
          searchPlaceholder="Type country name..."
        />

        <FormCombobox
          control={form.control}
          name="city"
          label="City (100 options)"
          options={cityOptions}
          placeholder="Search cities..."
          searchPlaceholder="Filter cities..."
          description="Search through 100 cities"
        />
      </div>

      <FormFooter />
    </Form>
  );
};
