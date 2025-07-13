// frontend/src/form/checkbox/Checkbox.stories.tsx
/* eslint-disable no-console */

import { Bell, CheckCircle, Mail, Shield } from 'lucide-react';

import { Form, FormCheckbox, FormFooter, FormHeader, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/Checkbox',
  component: FormCheckbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Checkbox input with flexible label positioning',
      },
    },
  },
} satisfies Meta<typeof FormCheckbox>;

export default meta;

/**
 * Label positions
 */
export const LabelPositions = () => {
  const form = useForm({
    defaultValues: {
      right: false,
      left: false,
      top: false,
      bottom: false,
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('Checkbox values:', data);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormHeader
        title="Label Positions"
        description="Different label placements for checkboxes"
        icon={CheckCircle}
      />

      <div className="space-y-6">
        <FormCheckbox
          control={form.control}
          name="right"
          label="Label on the right (default)"
          side="right"
        />

        <FormCheckbox control={form.control} name="left" label="Label on the left" side="left" />

        <FormCheckbox control={form.control} name="top" label="Label on top" side="top" />

        <FormCheckbox control={form.control} name="bottom" label="Label on bottom" side="bottom" />
      </div>

      <FormFooter showReset />
    </Form>
  );
};

/**
 * With descriptions and headlines
 */
export const WithDetails = () => {
  const form = useForm({
    defaultValues: {
      terms: false,
      privacy: false,
      marketing: true,
      analytics: false,
    },
  });

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Detailed Checkboxes"
        description="Checkboxes with additional information"
        icon={Shield}
      />

      <div className="space-y-6">
        <FormCheckbox
          control={form.control}
          name="terms"
          label="I accept the terms and conditions"
          description="You must accept to continue"
          required
        />

        <FormCheckbox
          control={form.control}
          name="privacy"
          label="I have read the privacy policy"
          description="We recommend reading our privacy policy"
          showClear
        />

        <FormCheckbox
          control={form.control}
          name="marketing"
          headline="Marketing Preferences"
          label="Send me promotional emails"
          description="Get updates about new features and special offers (you can unsubscribe anytime)"
        />

        <FormCheckbox
          control={form.control}
          name="analytics"
          headline="Help Us Improve"
          label="Share anonymous usage data"
          description="Your data helps us understand how to make the product better"
          showClear
        />
      </div>

      <FormFooter />
    </Form>
  );
};

/**
 * Notification preferences
 */
export const NotificationPreferences = () => {
  const form = useForm({
    defaultValues: {
      allNotifications: true,
      email: {
        updates: true,
        security: true,
        marketing: false,
      },
      push: {
        updates: false,
        security: true,
        marketing: false,
      },
    },
  });

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Notification Settings"
        description="Choose how you want to be notified"
        icon={Bell}
      />

      <div className="space-y-6">
        <FormCheckbox
          control={form.control}
          name="allNotifications"
          label="Enable all notifications"
          description="Toggle all notification settings at once"
          side="right"
        />

        <div className="ml-6 space-y-4">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Email Notifications
            </h3>
            <div className="ml-6 space-y-3">
              <FormCheckbox control={form.control} name="email.updates" label="Product updates" />
              <FormCheckbox control={form.control} name="email.security" label="Security alerts" />
              <FormCheckbox
                control={form.control}
                name="email.marketing"
                label="Marketing emails"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Bell className="h-4 w-4" />
              Push Notifications
            </h3>
            <div className="ml-6 space-y-3">
              <FormCheckbox control={form.control} name="push.updates" label="Product updates" />
              <FormCheckbox control={form.control} name="push.security" label="Security alerts" />
              <FormCheckbox
                control={form.control}
                name="push.marketing"
                label="Marketing messages"
              />
            </div>
          </div>
        </div>
      </div>

      <FormFooter showReset submitText="Save Preferences" />
    </Form>
  );
};

/**
 * Interactive example
 */
export const InteractiveExample = () => {
  const form = useForm({
    defaultValues: {
      subscribe: false,
      frequency: 'weekly',
      topics: {
        news: true,
        tutorials: false,
        releases: true,
      },
    },
  });

  const isSubscribed = form.watch('subscribe');

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Newsletter Subscription"
        description="Customize your email preferences"
        icon={Mail}
      />

      <div className="space-y-4">
        <FormCheckbox
          control={form.control}
          name="subscribe"
          label="Subscribe to newsletter"
          description="Get the latest updates delivered to your inbox"
        />

        {isSubscribed ? (
          <div className="animate-in fade-in slide-in-from-top-2 ml-6 space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="mb-3 text-sm font-medium">Choose your topics:</p>
              <div className="space-y-2">
                <FormCheckbox control={form.control} name="topics.news" label="Company News" />
                <FormCheckbox
                  control={form.control}
                  name="topics.tutorials"
                  label="Tutorials & Guides"
                />
                <FormCheckbox
                  control={form.control}
                  name="topics.releases"
                  label="Product Releases"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <FormFooter />
    </Form>
  );
};
