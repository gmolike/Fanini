// frontend/src/features/settings/UpdateBranding/UpdateBranding.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useBranding, useUpdateBranding } from '@/entities/settings/api';
import { brandingSchema } from '@/entities/settings/model/schemas';
import type { Branding } from '@/entities/settings';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/shared/shadcn';

export const UpdateBranding = () => {
  const { data: branding, isLoading, error } = useBranding();
  const updateBranding = useUpdateBranding();
  const [previewColors, setPreviewColors] = useState<Partial<Branding['colors']>>({});

  const form = useForm<Branding>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      colors: {
        primary: '#34687e',
        secondary: '#b94f46',
        accent: '#e8f0f4',
      },
      logo: {
        url: '/images/logo.svg',
        alt: 'Faninitiative Spandau e.V.',
      },
    },
  });

  // Form mit Daten füllen wenn geladen
  useEffect(() => {
    if (branding) {
      console.log('[UpdateBranding] Setting form data:', branding);
      form.reset(branding);
    }
  }, [branding, form]);

  const onSubmit = async (data: Branding) => {
    console.log('[UpdateBranding] Submitting:', data);
    try {
      await updateBranding.mutateAsync(data);
    } catch (error) {
      console.error('[UpdateBranding] Submit error:', error);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center p-8'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card>
        <CardContent className='p-8'>
          <p className='text-destructive'>Fehler beim Laden der Einstellungen</p>
          <pre className='mt-2 text-xs'>{error.message}</pre>
        </CardContent>
      </Card>
    );
  }

  // Main Component
  const colors = form.watch('colors') || branding?.colors;
  const displayColors = { ...colors, ...previewColors };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Einstellungen</CardTitle>
        <CardDescription>Passe die Farben und das Logo deines Vereins an</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Color Preview */}
          <div className='flex gap-4 rounded-lg border p-4'>
            <div className='space-y-2'>
              <Label>Vorschau</Label>
              <div className='flex gap-2'>
                <div
                  className='h-16 w-16 rounded-md border'
                  style={{ backgroundColor: displayColors?.primary || '#34687e' }}
                />
                <div
                  className='h-16 w-16 rounded-md border'
                  style={{ backgroundColor: displayColors?.secondary || '#b94f46' }}
                />
                {displayColors?.accent && (
                  <div
                    className='h-16 w-16 rounded-md border'
                    style={{ backgroundColor: displayColors.accent }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className='space-y-4'>
            <div>
              <Label htmlFor='primary'>Primärfarbe</Label>
              <div className='flex gap-2'>
                <Input
                  id='primary'
                  type='color'
                  className='h-10 w-20'
                  {...form.register('colors.primary')}
                  onChange={e => {
                    form.setValue('colors.primary', e.target.value);
                    setPreviewColors({ ...previewColors, primary: e.target.value });
                  }}
                />
                <Input
                  type='text'
                  className='flex-1'
                  {...form.register('colors.primary')}
                  placeholder='#34687e'
                />
              </div>
              {form.formState.errors.colors?.primary && (
                <p className='text-destructive mt-1 text-sm'>
                  {form.formState.errors.colors.primary.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='secondary'>Sekundärfarbe</Label>
              <div className='flex gap-2'>
                <Input
                  id='secondary'
                  type='color'
                  className='h-10 w-20'
                  {...form.register('colors.secondary')}
                  onChange={e => {
                    form.setValue('colors.secondary', e.target.value);
                    setPreviewColors({ ...previewColors, secondary: e.target.value });
                  }}
                />
                <Input
                  type='text'
                  className='flex-1'
                  {...form.register('colors.secondary')}
                  placeholder='#b94f46'
                />
              </div>
              {form.formState.errors.colors?.secondary && (
                <p className='text-destructive mt-1 text-sm'>
                  {form.formState.errors.colors.secondary.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='accent'>Akzentfarbe (Optional)</Label>
              <div className='flex gap-2'>
                <Input
                  id='accent'
                  type='color'
                  className='h-10 w-20'
                  {...form.register('colors.accent')}
                  onChange={e => {
                    form.setValue('colors.accent', e.target.value);
                    setPreviewColors({ ...previewColors, accent: e.target.value });
                  }}
                />
                <Input
                  type='text'
                  className='flex-1'
                  {...form.register('colors.accent')}
                  placeholder='#e8f0f4'
                />
              </div>
              {form.formState.errors.colors?.accent && (
                <p className='text-destructive mt-1 text-sm'>
                  {form.formState.errors.colors.accent.message}
                </p>
              )}
            </div>
          </div>

          {/* Logo */}
          <div className='space-y-4'>
            <div>
              <Label htmlFor='logoUrl'>Logo URL</Label>
              <Input
                id='logoUrl'
                type='url'
                placeholder='https://...'
                {...form.register('logo.url')}
              />
              {form.formState.errors.logo?.url && (
                <p className='text-destructive mt-1 text-sm'>
                  {form.formState.errors.logo.url.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='logoAlt'>Logo Alt-Text</Label>
              <Input
                id='logoAlt'
                type='text'
                placeholder='Vereinslogo...'
                {...form.register('logo.alt')}
              />
              {form.formState.errors.logo?.alt && (
                <p className='text-destructive mt-1 text-sm'>
                  {form.formState.errors.logo.alt.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={updateBranding.isPending || !form.formState.isDirty}
            className='w-full'
          >
            {updateBranding.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {updateBranding.isPending ? 'Speichern...' : 'Änderungen speichern'}
          </Button>

          {/* Success Message */}
          {updateBranding.isSuccess && !form.formState.isDirty && (
            <div className='rounded-lg bg-green-50 p-3 text-center text-sm text-green-800'>
              Einstellungen erfolgreich gespeichert!
            </div>
          )}

          {/* Error Message */}
          {updateBranding.isError && (
            <div className='rounded-lg bg-red-50 p-3 text-center text-sm text-red-800'>
              Fehler beim Speichern. Bitte versuche es erneut.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
