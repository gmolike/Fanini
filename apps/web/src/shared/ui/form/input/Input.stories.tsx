/* eslint-disable max-lines */
/* eslint-disable sonarjs/concise-regex */
/* eslint-disable no-console */
// frontend/src/form/input/Input.stories.tsx
import { useState } from 'react';

import {
  CreditCard,
  DollarSign,
  Eye,
  EyeOff,
  Globe,
  Hash,
  Link2,
  Lock,
  Mail,
  Palette,
  Phone,
  Search,
  User,
} from 'lucide-react';
import { z } from 'zod';

import { Form, FormActionButton, FormFooter, FormHeader, FormInput, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/Input',
  component: FormInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Versatile input component with multiple types and features',
      },
    },
  },
} satisfies Meta<typeof FormInput>;

export default meta;

/**
 * All input types
 */
export const Types = () => {
  const form = useForm({
    defaultValues: {
      text: '',
      email: '',
      password: '',
      number: '',
      tel: '',
      url: '',
      search: '',
      color: '#3b82f6',
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('Input values:', data);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormHeader title="Input Types" description="All supported HTML5 input types" />

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          control={form.control}
          name="text"
          label="Text"
          placeholder="Enter text..."
          startIcon={User}
          showClear
        />

        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          startIcon={Mail}
        />

        <FormInput
          control={form.control}
          name="number"
          label="Number"
          type="number"
          min={0}
          max={100}
          step={5}
          placeholder="0-100"
          startIcon={Hash}
        />

        <FormInput
          control={form.control}
          name="tel"
          label="Phone"
          type="tel"
          placeholder="+49 123 456789"
          startIcon={Phone}
        />

        <FormInput
          control={form.control}
          name="url"
          label="Website"
          type="url"
          placeholder="https://example.com"
          startIcon={Link2}
        />

        <FormInput
          control={form.control}
          name="search"
          label="Search"
          type="search"
          placeholder="Search..."
          startIcon={Search}
          showClear
        />

        <FormInput
          control={form.control}
          name="color"
          label="Color"
          type="color"
          startIcon={Palette}
        />
      </div>

      <FormFooter showReset submitText="Save All" />
    </Form>
  );
};

/**
 * Password with visibility toggle
 */
export const PasswordToggle = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('Password submitted', data);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <div className="max-w-md space-y-4">
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter password"
          startIcon={Lock}
          endIcon={showPassword ? EyeOff : Eye}
          description="Must be at least 8 characters"
        />

        <FormInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm password"
          startIcon={Lock}
        />

        <FormActionButton
          control={form.control}
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          variant="ghost"
          size="sm"
        >
          {showPassword ? 'Hide' : 'Show'} Passwords
        </FormActionButton>

        <FormFooter submitText="Set Password" />
      </div>
    </Form>
  );
};

/**
 * With validation
 */
export const Validation = () => {
  const schema = z.object({
    username: z
      .string()
      .min(3, 'At least 3 characters')
      .max(20, 'At most 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores'),
    email: z.string().email('Invalid email address'),
    age: z.string().refine(val => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 18 && num <= 100;
    }, 'Age must be between 18 and 100'),
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log('Valid data:', data);
  };

  return (
    <Form
      schema={schema}
      defaultValues={{ username: '', email: '', age: '' }}
      onSubmit={handleSubmit}
      mode="onChange"
    >
      {form => (
        <div className="max-w-md space-y-4">
          <FormHeader
            title="Live Validation"
            description="Form validates as you type"
            variant="minimal"
          />

          <FormInput
            control={form.control}
            name="username"
            label="Username"
            placeholder="john_doe"
            description="3-20 characters, alphanumeric + underscore"
            required
          />

          <FormInput
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
          />

          <FormInput
            control={form.control}
            name="age"
            label="Age"
            type="number"
            placeholder="18-100"
            description="Must be 18 or older"
            required
          />

          <FormFooter submitText="Submit" />
        </div>
      )}
    </Form>
  );
};

/**
 * With different icon configurations
 */
export const IconVariations = () => {
  const form = useForm({
    defaultValues: {
      card: '',
      amount: '',
      website: '',
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('Submitted:', data);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <div className="max-w-md space-y-4">
        <FormHeader title="Icon Variations" description="Different icon sizes and positions" />

        <FormInput
          control={form.control}
          name="card"
          label="Credit Card"
          placeholder="1234 5678 9012 3456"
          startIcon={CreditCard}
          iconSize="default"
        />

        <FormInput
          control={form.control}
          name="amount"
          label="Amount (EUR)"
          type="number"
          placeholder="0.00"
          startIcon={DollarSign}
          step="0.01"
        />

        <FormInput
          control={form.control}
          name="website"
          label="Website"
          type="url"
          placeholder="https://example.com"
          startIcon={Globe}
          endIcon={Link2}
        />

        <FormFooter />
      </div>
    </Form>
  );
};
/**
 * With descriptions and helper text
 */
export const WithDescriptions = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      apiKey: '',
    },
  });

  return (
    <Form form={form} onSubmit={console.log}>
      <div className="max-w-md space-y-4">
        <FormInput
          control={form.control}
          name="email"
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          description="We'll never share your email with anyone else."
          startIcon={Mail}
        />

        <FormInput
          control={form.control}
          name="apiKey"
          label="API Key"
          placeholder="sk_live_..."
          description="Your secret API key. Keep this safe!"
          startIcon={Lock}
          showClear
        />

        <FormFooter />
      </div>
    </Form>
  );
};
