// frontend/src/form/datePicker/DatePicker.stories.tsx

/* eslint-disable no-console */

import { addDays, endOfYear, startOfYear } from 'date-fns';
import { Cake, Calendar, CalendarDays, Clock } from 'lucide-react';

import { Form, FormActionButton, FormDatePicker, FormFooter, FormHeader, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/DatePicker',
  component: FormDatePicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Date selection with calendar and manual input',
      },
    },
  },
} satisfies Meta<typeof FormDatePicker>;

export default meta;

/**
 * Basic date picker
 */
export const Basic = () => {
  const form = useForm({
    defaultValues: {
      date: '',
      appointment: '',
      deadline: new Date().toISOString(),
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('DatePicker values:', data);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormHeader
        title="Basic Date Picker"
        description="Select dates with calendar interface"
        icon={Calendar}
      />

      <div className="max-w-md space-y-4">
        <FormDatePicker
          control={form.control}
          name="date"
          label="Select Date"
          placeholder="Pick a date"
        />

        <FormDatePicker
          control={form.control}
          name="appointment"
          label="Appointment Date"
          placeholder="Schedule appointment"
          description="Choose your preferred date"
        />

        <FormDatePicker
          control={form.control}
          name="deadline"
          label="Project Deadline"
          placeholder="Set deadline"
          required
        />
      </div>

      <FormFooter showReset submitText="Save Dates" />
    </Form>
  );
};

/**
 * With date constraints
 */
export const WithConstraints = () => {
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const thisYearStart = startOfYear(today);
  const thisYearEnd = endOfYear(today);

  const form = useForm({
    defaultValues: {
      futureOnly: '',
      pastOnly: '',
      thisWeek: '',
      thisYear: '',
    },
  });

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Date Constraints"
        description="Date pickers with min/max limits"
        icon={CalendarDays}
      />

      <div className="max-w-md space-y-4">
        <FormDatePicker
          control={form.control}
          name="futureOnly"
          label="Future Dates Only"
          min={today}
          placeholder="Select future date"
          description="Can only select today or later"
        />

        <FormDatePicker
          control={form.control}
          name="pastOnly"
          label="Past Dates Only"
          max={today}
          placeholder="Select past date"
          description="Can only select today or earlier"
        />

        <FormDatePicker
          control={form.control}
          name="thisWeek"
          label="This Week Only"
          min={today}
          max={nextWeek}
          placeholder="Select within 7 days"
          description={`Between ${today.toLocaleDateString()} and ${nextWeek.toLocaleDateString()}`}
        />

        <FormDatePicker
          control={form.control}
          name="thisYear"
          label="This Year Only"
          min={thisYearStart}
          max={thisYearEnd}
          placeholder="Select date in current year"
        />
      </div>

      <FormFooter showReset />
    </Form>
  );
};

/**
 * Different formats and locales
 */
export const Formats = () => {
  const form = useForm({
    defaultValues: {
      default: '',
      american: '',
      iso: '',
      long: '',
    },
  });

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader title="Date Formats" description="Different date format options" icon={Clock} />

      <div className="max-w-md space-y-4">
        <FormDatePicker
          control={form.control}
          name="default"
          label="Default Format (dd.MM.yyyy)"
          dateFormat="dd.MM.yyyy"
          placeholder="31.12.2024"
        />

        <FormDatePicker
          control={form.control}
          name="american"
          label="American Format (MM/dd/yyyy)"
          dateFormat="MM/dd/yyyy"
          placeholder="12/31/2024"
        />

        <FormDatePicker
          control={form.control}
          name="iso"
          label="ISO Format (yyyy-MM-dd)"
          dateFormat="yyyy-MM-dd"
          placeholder="2024-12-31"
        />

        <FormDatePicker
          control={form.control}
          name="long"
          label="Long Format"
          dateFormat="EEEE, MMMM do, yyyy"
          placeholder="Monday, December 31st, 2024"
        />
      </div>

      <FormFooter />
    </Form>
  );
};

/**
 * Interactive example
 */
export const Interactive = () => {
  const form = useForm({
    defaultValues: {
      birthDate: '',
      eventDate: '',
      reminderDate: '',
    },
  });

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const birthDate = form.watch('birthDate');
  const age = calculateAge(birthDate);

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Interactive Date Picker"
        description="Date pickers with dynamic behavior"
        icon={Cake}
      />

      <div className="max-w-md space-y-4">
        <FormDatePicker
          control={form.control}
          name="birthDate"
          label="Birth Date"
          max={new Date()}
          placeholder="Select your birth date"
          description="Used to calculate your age"
          required
        />

        {age !== null && (
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm">
              You are <span className="font-bold">{age}</span> years old
            </p>
          </div>
        )}

        <FormDatePicker
          control={form.control}
          name="eventDate"
          label="Event Date"
          min={new Date()}
          placeholder="When is the event?"
          allowInput={false}
          description="Manual input disabled - use calendar only"
        />

        <FormDatePicker
          control={form.control}
          name="reminderDate"
          label="Set Reminder"
          min={new Date()}
          placeholder="Remind me on..."
          showClear
        />

        <div className="flex gap-2">
          <FormActionButton
            control={form.control}
            onClick={() => {
              const tomorrow = addDays(new Date(), 1);
              form.setValue('reminderDate', tomorrow.toISOString());
            }}
            variant="outline"
            size="sm"
          >
            Tomorrow
          </FormActionButton>
          <FormActionButton
            control={form.control}
            onClick={() => {
              const nextWeek = addDays(new Date(), 7);
              form.setValue('reminderDate', nextWeek.toISOString());
            }}
            variant="outline"
            size="sm"
          >
            Next Week
          </FormActionButton>
          <FormActionButton
            control={form.control}
            onClick={() => {
              const nextMonth = addDays(new Date(), 30);
              form.setValue('reminderDate', nextMonth.toISOString());
            }}
            variant="outline"
            size="sm"
          >
            Next Month
          </FormActionButton>
        </div>
      </div>

      <FormFooter showReset />
    </Form>
  );
};
