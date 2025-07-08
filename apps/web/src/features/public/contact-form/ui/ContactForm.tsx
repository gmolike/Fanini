// frontend/src/features/public/contact-form/ui/ContactForm.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

import { GlassCard } from '@/shared/ui';
import {
  Form,
  FormCheckbox,
  FormFooter,
  FormHeader,
  FormInput,
  FormSelect,
  FormTextArea,
} from '@/shared/ui/form';

import {
  COMMITTEE_OPTIONS,
  getRecipientConfig,
  RECIPIENT_TYPE_CONFIG,
  RECIPIENT_TYPE_OPTIONS,
  TEAM_OPTIONS,
} from '../model/types';
import { useController } from '../model/useController';

export const ContactForm = () => {
  const { form, recipientType, selectedTeam, selectedCommittee, isSubmitting, handleSubmit } =
    useController();

  const recipientConfig = RECIPIENT_TYPE_CONFIG[recipientType];
  const showDetailedDescription = recipientConfig.requiresDetail;

  // Get selected recipient info for display
  const selectedRecipient = getRecipientConfig(recipientType, selectedTeam ?? selectedCommittee);

  const showTeamSelect = recipientType === 'team';
  const showCommitteeSelect = recipientType === 'committee';

  return (
    <GlassCard className="mx-auto max-w-2xl pr-6 pl-6">
      <Form form={form} onSubmit={handleSubmit}>
        <FormHeader
          title="Kontaktiere uns"
          description="Wir freuen uns auf deine Nachricht"
          icon={Mail}
          variant="centered"
        />

        {/* Personal Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            control={form.control}
            name="firstName"
            label="Vorname"
            placeholder="Max"
            required
          />

          <FormInput
            control={form.control}
            name="lastName"
            label="Nachname"
            placeholder="Mustermann"
            required
          />

          <FormInput
            control={form.control}
            name="email"
            label="E-Mail"
            type="email"
            placeholder="max@example.com"
            startIcon={Mail}
            required
          />

          <FormInput
            control={form.control}
            name="phone"
            label="Telefon (optional)"
            type="tel"
            placeholder="+49 123 456789"
            startIcon={Phone}
          />
        </div>

        {/* Recipient Selection */}
        <FormSelect
          control={form.control}
          name="recipientType"
          label="An wen richtet sich deine Anfrage?"
          options={[...RECIPIENT_TYPE_OPTIONS]}
          required
        />
        {/* Show selected recipient info */}
        {selectedRecipient ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-muted/50 rounded-lg p-4"
          >
            <p className="flex items-center gap-2 text-sm font-medium">
              <selectedRecipient.icon className="h-4 w-4" />
              Deine Anfrage geht an: {selectedRecipient.label}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{selectedRecipient.description}</p>
          </motion.div>
        ) : null}

        {/* Conditional Team/Committee Selection */}
        <AnimatePresence mode="wait">
          {showTeamSelect ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormSelect
                control={form.control}
                name="selectedTeam"
                label="Wähle ein Team"
                options={[...TEAM_OPTIONS]}
                placeholder="Team auswählen..."
                required
              />
            </motion.div>
          ) : null}

          {showCommitteeSelect ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormSelect
                control={form.control}
                name="selectedCommittee"
                label="Wähle ein Gremium"
                options={[...COMMITTEE_OPTIONS]}
                placeholder="Gremium auswählen..."
                required
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Message Fields */}
        <FormInput
          control={form.control}
          name="subject"
          label="Betreff"
          placeholder="Worum geht es?"
          required
        />

        <FormTextArea
          control={form.control}
          name="message"
          label="Nachricht"
          placeholder="Deine Nachricht an uns..."
          rows={5}
          required
          showCount
          maxLength={1000}
        />

        {/* Conditional Detailed Description with dynamic validation */}
        <AnimatePresence>
          {showDetailedDescription ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormTextArea
                control={form.control}
                name="detailedDescription"
                label="Detaillierte Beschreibung"
                description={`Bitte beschreibe dein Anliegen genauer (min. ${String(recipientConfig.minDetailLength)} Zeichen)`}
                placeholder="Erkläre uns dein Anliegen im Detail..."
                rows={4}
                required
                showCount
                maxLength={500}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Privacy Consent */}
        <FormCheckbox
          control={form.control}
          name="privacyConsent"
          label="Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu"
          required
        />

        <FormFooter
          submitText={isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
          showReset
          resetText="Formular zurücksetzen"
        />
      </Form>
    </GlassCard>
  );
};
