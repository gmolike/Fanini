// frontend/src/form/footer/Footer.stories.tsx

/* eslint-disable no-console */

import { useState } from 'react';

import { z } from 'zod';

import { Form, FormFooter, FormHeader, FormInput, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/Footer',
  component: FormFooter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Form footer with submit, reset, and cancel buttons',
      },
    },
  },
} satisfies Meta<typeof FormFooter>;

export default meta;

/**
 * Footer variations
 */
export const Variations = () => {
  const form = useForm({
    defaultValues: { example: '' },
  });

  return (
    <div className="space-y-8">
      <Form form={form} onSubmit={console.log}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">Default Footer</h3>
          <FormFooter />
        </div>
      </Form>

      <Form form={form} onSubmit={console.log}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">With All Buttons</h3>
          <FormFooter
            showReset
            showCancel
            submitText="Save Changes"
            cancelText="Discard"
            resetText="Reset Form"
          />
        </div>
      </Form>

      <Form form={form} onSubmit={console.log}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">Custom Text</h3>
          <FormFooter submitText="Create Account" showCancel cancelText="Go Back" />
        </div>
      </Form>

      <Form form={form} onSubmit={console.log}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">Reset Without Text</h3>
          <FormFooter showReset showResetText={false} />
        </div>
      </Form>
    </div>
  );
};

/**
 * With messages
 */
export const WithMessages = () => {
  const form = useForm({
    defaultValues: { email: '' },
  });

  return (
    <div className="space-y-8">
      <Form form={form} onSubmit={console.log}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">With Error Message</h3>
          <FormInput control={form.control} name="email" label="Email" placeholder="Enter email" />
          <FormFooter
            error="Failed to save changes. Please check your connection and try again."
            showCancel
          />
        </div>
      </Form>

      <Form form={form} onSubmit={console.log}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">With Success Message</h3>
          <FormInput control={form.control} name="email" label="Email" placeholder="Enter email" />
          <FormFooter success="Your changes have been saved successfully!" />
        </div>
      </Form>

      <Form form={form} onSubmit={console.log}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">With Both Messages</h3>
          <FormInput control={form.control} name="email" label="Email" placeholder="Enter email" />
          <FormFooter error="Network error occurred" success="Data saved locally" showReset />
        </div>
      </Form>
    </div>
  );
};

/**
 * Interactive example
 */
export const Interactive = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // eslint-disable-next-line sonarjs/pseudo-random
          if (Math.random() > 0.5) {
            resolve(data);
          } else {
            reject(new Error('Random API failure'));
          }
        }, 1500);
      });

      setSuccess('Form submitted successfully!');
      console.log('Submitted:', data);
    } catch (err) {
      setError('Failed to submit form. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form schema={schema} defaultValues={{ name: '', email: '' }} onSubmit={handleSubmit}>
      {form => (
        <div className="max-w-md">
          <FormHeader
            title="Interactive Footer"
            description="Try submitting the form to see different states"
          />

          <FormInput
            control={form.control}
            name="name"
            label="Name"
            placeholder="John Doe"
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

          <FormFooter
            showReset
            showCancel
            error={error}
            success={success}
            onReset={() => {
              setError('');
              setSuccess('');
            }}
          />

          <div className="bg-muted mt-4 rounded-lg p-3 text-sm">
            <p>Form State:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>Submitting: {isSubmitting ? 'Yes' : 'No'}</li>
              <li>Valid: {form.formState.isValid ? 'Yes' : 'No'}</li>
              <li>Dirty: {form.formState.isDirty ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      )}
    </Form>
  );
};

/**
 * Custom handlers
 */
export const CustomHandlers = () => {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const form = useForm({
    defaultValues: {
      field1: '',
      field2: '',
    },
  });

  return (
    <Form
      form={form}
      onSubmit={data => {
        addLog(`Submitted: ${JSON.stringify(data)}`);
      }}
    >
      <div className="max-w-md">
        <FormHeader title="Custom Handlers" description="Footer with custom button behaviors" />

        <FormInput control={form.control} name="field1" label="Field 1" placeholder="Enter value" />

        <FormInput control={form.control} name="field2" label="Field 2" placeholder="Enter value" />

        <FormFooter
          showReset
          showCancel
          onReset={() => {
            addLog('Custom reset handler called');
            // Additional custom logic
          }}
          onCancel={() => {
            addLog('Custom cancel handler called');
            // Custom navigation or modal
            if (form.formState.isDirty) {
              // eslint-disable-next-line no-alert
              const confirmed = window.confirm('You have unsaved changes. Are you sure?');
              if (confirmed) {
                addLog('Navigation confirmed');
              } else {
                addLog('Navigation cancelled');
              }
            }
          }}
          submitText="Process"
        />

        <div className="bg-muted mt-4 rounded-lg p-3">
          <p className="mb-2 text-sm font-medium">Event Log:</p>
          <div className="max-h-32 space-y-1 overflow-auto font-mono text-xs">
            {log.length > 0 ? (
              log.map(entry => <div key={entry}>{entry}</div>)
            ) : (
              <p className="text-muted-foreground">No events yet</p>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
};

/**
 * Different layouts
 */
export const Layouts = () => {
  const form = useForm({
    defaultValues: { test: '' },
  });

  return (
    <div className="space-y-8">
      <Form form={form} onSubmit={console.log}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">Sticky Footer</h3>
          <div className="h-[200px] overflow-auto">
            <div className="space-y-4 pb-20">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="bg-muted rounded p-3">
                  Content block {i + 1}
                </div>
              ))}
            </div>
          </div>
          <FormFooter className="bg-background sticky bottom-0 mt-4 border-t pt-4" showCancel />
        </div>
      </Form>

      <Form form={form} onSubmit={console.log}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium">Inline Footer</h3>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <FormInput
                control={form.control}
                name="test"
                label="Quick Input"
                placeholder="Type and submit"
              />
            </div>
            <FormFooter className="border-t-0 pt-0" />
          </div>
        </div>
      </Form>
    </div>
  );
};
