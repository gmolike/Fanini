// frontend/src/form/dateRange/DateRange.stories.tsx
/* eslint-disable no-console */

import { addDays, addMonths, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { CalendarClock, CalendarRange, Hotel, Plane } from 'lucide-react';

import { Form, FormActionButton, FormDateRange, FormFooter, FormHeader, useForm } from '../index';

import type { Meta } from '@storybook/react';

const meta = {
  title: 'form/DateRange',
  component: FormDateRange,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Date range selection with two connected date pickers',
      },
    },
  },
} satisfies Meta<typeof FormDateRange>;

export default meta;

/**
 * Basic date range
 */
export const Basic = () => {
  const form = useForm({
    defaultValues: {
      startDate: '',
      endDate: '',
      projectStart: '',
      projectEnd: '',
    },
  });

  const handleSubmit = (data: typeof form.formState.defaultValues) => {
    console.log('DateRange values:', data);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormHeader
        title="Basic Date Range"
        description="Select start and end dates"
        icon={CalendarRange}
      />

      <div className="space-y-6">
        <FormDateRange
          control={form.control}
          startName="startDate"
          endName="endDate"
          label="Date Range"
        />

        <FormDateRange
          control={form.control}
          startName="projectStart"
          endName="projectEnd"
          label="Project Timeline"
          description="Select project start and end dates"
          required
        />
      </div>

      <FormFooter showReset submitText="Save Dates" />
    </Form>
  );
};

/**
 * With custom labels and constraints
 */
export const CustomLabels = () => {
  const today = new Date();
  const nextYear = addMonths(today, 12);

  const form = useForm({
    defaultValues: {
      checkIn: '',
      checkOut: '',
      departureDate: '',
      returnDate: '',
      startWork: '',
      endWork: '',
    },
  });

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Custom Labels"
        description="Date ranges with specific use cases"
        icon={Hotel}
      />

      <div className="space-y-6">
        <FormDateRange
          control={form.control}
          startName="checkIn"
          endName="checkOut"
          label="Hotel Booking"
          startLabel="Check-in"
          endLabel="Check-out"
          minDate={today}
          description="Check-in must be today or later"
        />

        <FormDateRange
          control={form.control}
          startName="departureDate"
          endName="returnDate"
          label="Travel Dates"
          startLabel="Departure"
          endLabel="Return"
          minDate={today}
          maxDate={nextYear}
        />

        <FormDateRange
          control={form.control}
          startName="startWork"
          endName="endWork"
          label="Employment Period"
          startLabel="Start Date"
          endLabel="End Date (Optional)"
          description="Leave end date empty for current employment"
        />
      </div>

      <FormFooter showReset />
    </Form>
  );
};

/**
 * With presets
 */
export const WithPresets = () => {
  const form = useForm({
    defaultValues: {
      reportStart: '',
      reportEnd: '',
    },
  });

  const setDateRange = (start: Date, end: Date) => {
    form.setValue('reportStart', start.toISOString());
    form.setValue('reportEnd', end.toISOString());
  };

  const today = new Date();

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader
        title="Date Range Presets"
        description="Quick date range selection"
        icon={CalendarClock}
      />

      <div className="space-y-4">
        <FormDateRange
          control={form.control}
          startName="reportStart"
          endName="reportEnd"
          label="Report Period"
          dateFormat="yyyy-MM-dd"
        />

        <div className="flex flex-wrap gap-2">
          <FormActionButton
            control={form.control}
            onClick={() => {
              const start = startOfWeek(today);
              const end = endOfWeek(today);
              setDateRange(start, end);
            }}
            variant="outline"
            size="sm"
          >
            This Week
          </FormActionButton>

          <FormActionButton
            control={form.control}
            onClick={() => {
              const start = startOfWeek(addDays(today, -7));
              const end = endOfWeek(addDays(today, -7));
              setDateRange(start, end);
            }}
            variant="outline"
            size="sm"
          >
            Last Week
          </FormActionButton>

          <FormActionButton
            control={form.control}
            onClick={() => {
              const start = startOfMonth(today);
              const end = endOfMonth(today);
              setDateRange(start, end);
            }}
            variant="outline"
            size="sm"
          >
            This Month
          </FormActionButton>

          <FormActionButton
            control={form.control}
            onClick={() => {
              const start = startOfMonth(addMonths(today, -1));
              const end = endOfMonth(addMonths(today, -1));
              setDateRange(start, end);
            }}
            variant="outline"
            size="sm"
          >
            Last Month
          </FormActionButton>

          <FormActionButton
            control={form.control}
            onClick={() => {
              const start = addDays(today, -30);
              setDateRange(start, today);
            }}
            variant="outline"
            size="sm"
          >
            Last 30 Days
          </FormActionButton>

          <FormActionButton
            control={form.control}
            onClick={() => {
              const start = addDays(today, -90);
              setDateRange(start, today);
            }}
            variant="outline"
            size="sm"
          >
            Last 90 Days
          </FormActionButton>
        </div>

        <div className="bg-muted rounded-lg p-4 text-sm">
          {form.watch('reportStart') && form.watch('reportEnd') ? (
            <>
              <p>Selected range:</p>
              <p className="font-mono">
                {new Date(form.watch('reportStart')).toLocaleDateString()} -{' '}
                {new Date(form.watch('reportEnd')).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">No range selected</p>
          )}
        </div>
      </div>

      <FormFooter />
    </Form>
  );
};

/**
 * Vacation planner
 */
export const VacationPlanner = () => {
  const form = useForm({
    defaultValues: {
      vacationStart: '',
      vacationEnd: '',
      blackoutStart: '',
      blackoutEnd: '',
    },
  });

  const vacationStart = form.watch('vacationStart');
  const vacationEnd = form.watch('vacationEnd');

  const calculateDays = () => {
    if (!vacationStart || !vacationEnd) return 0;
    const start = new Date(vacationStart);
    const end = new Date(vacationEnd);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const vacationDays = calculateDays();

  return (
    <Form form={form} onSubmit={console.log}>
      <FormHeader title="Vacation Planner" description="Plan your time off" icon={Plane} />

      <div className="space-y-6">
        <FormDateRange
          control={form.control}
          startName="vacationStart"
          endName="vacationEnd"
          label="Vacation Dates"
          startLabel="First Day"
          endLabel="Last Day"
          minDate={new Date()}
          description="Select your vacation period"
          required
        />

        {vacationDays > 0 &&
          (() => {
            let vacationMessage = '';
            if (vacationDays > 14) {
              vacationMessage = "That's a nice long break!";
            } else if (vacationDays > 7) {
              vacationMessage = 'Perfect for a good rest!';
            } else {
              vacationMessage = 'Short but sweet!';
            }
            return (
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                <p className="text-sm font-medium">Vacation Summary</p>
                <p className="text-2xl font-bold">{vacationDays} days</p>
                <p className="text-muted-foreground text-sm">{vacationMessage}</p>
              </div>
            );
          })()}

        <FormDateRange
          control={form.control}
          startName="blackoutStart"
          endName="blackoutEnd"
          label="Blackout Dates (Optional)"
          startLabel="From"
          endLabel="To"
          description="Dates when vacation cannot be taken"
        />
      </div>

      <FormFooter showReset submitText="Request Vacation" />
    </Form>
  );
};
