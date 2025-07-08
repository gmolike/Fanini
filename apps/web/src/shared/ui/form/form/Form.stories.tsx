/* eslint-disable no-console */
/* eslint-disable sonarjs/concise-regex */
// frontend/src/form/form/Form.stories.tsx
import { User } from 'lucide-react';
import { z } from 'zod';

import { Form, FormFooter, FormHeader, FormInput, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/Form',
  component: Form,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Base form component with validation support',
      },
    },
  },
} satisfies Meta<typeof Form>;

export default meta;

/**
 * Basic form with internal state
 */
export const Basic = () => {
  const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log('Form submitted:', data);
  };

  return (
    <Form schema={schema} defaultValues={{ email: '', password: '' }} onSubmit={handleSubmit}>
      {form => (
        <>
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
            name="password"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            required
          />
          <FormFooter submitText="Sign In" />
        </>
      )}
    </Form>
  );
};

/**
 * Form with external control
 */
export const ExternalControl = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('External form submitted:', data);
  };

  const handleReset = () => {
    form.reset({ name: 'John Doe', email: 'john@example.com' });
  };

  return (
    <div className="space-y-4">
      <Form form={form} onSubmit={handleSubmit}>
        <FormHeader
          title="External Control Example"
          description="Form instance created outside"
          icon={User}
        />

        <FormInput control={form.control} name="name" label="Name" placeholder="Enter your name" />

        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <FormFooter form={form} showReset showCancel />
      </Form>

      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-4 py-2"
        >
          Set Default Values
        </button>
        <button
          onClick={() => {
            console.log('Current values:', form.getValues());
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
        >
          Log Current Values
        </button>
      </div>
    </div>
  );
};

/**
 * Different validation modes
 */
export const ValidationModes = () => {
  const schema = z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
    email: z.string().email('Please enter a valid email'),
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log('Valid data:', data);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-4 text-lg font-semibold">onChange Mode</h3>
        <Form
          schema={schema}
          defaultValues={{ username: '', email: '' }}
          onSubmit={handleSubmit}
          mode="onChange"
        >
          {form => (
            <>
              <FormInput
                control={form.control}
                name="username"
                label="Username"
                placeholder="Validates as you type"
                description="Min 3 chars, alphanumeric + underscore"
              />
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Validates as you type"
              />
              <FormFooter />
            </>
          )}
        </Form>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">onBlur Mode</h3>
        <Form
          schema={schema}
          defaultValues={{ username: '', email: '' }}
          onSubmit={handleSubmit}
          mode="onBlur"
        >
          {form => (
            <>
              <FormInput
                control={form.control}
                name="username"
                label="Username"
                placeholder="Validates on blur"
                description="Min 3 chars, alphanumeric + underscore"
              />
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Validates on blur"
              />
              <FormFooter />
            </>
          )}
        </Form>
      </div>
    </div>
  );
};
