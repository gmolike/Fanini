import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useBranding, useUpdateBranding } from '@/entities/settings';
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

  // Debug
  console.log('[UpdateBranding] State:', { branding, isLoading, error });

  const form = useForm<Branding>({
    resolver: zodResolver(brandingSchema),
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

  if (error) {
    return (
      <Card>
        <CardContent className='p-8'>
          <p className='text-destructive'>Fehler beim Laden der Einstellungen</p>
          <pre className='mt-2 text-xs'>{JSON.stringify(error, null, 2)}</pre>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !branding) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center p-8'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </CardContent>
      </Card>
    );
  }

  const colors = form.watch('colors') || branding.colors;
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
                />
                <Input
                  type='text'
                  className='flex-1'
                  {...form.register('colors.secondary')}
                  placeholder='#b94f46'
                />
              </div>
            </div>

            <div>
              <Label htmlFor='accent'>Akzentfarbe (Optional)</Label>
              <div className='flex gap-2'>
                <Input
                  id='accent'
                  type='color'
                  className='h-10 w-20'
                  {...form.register('colors.accent')}
                />
                <Input
                  type='text'
                  className='flex-1'
                  {...form.register('colors.accent')}
                  placeholder='#e8f0f4'
                />
              </div>
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
            </div>
          </div>

          <Button type='submit' disabled={updateBranding.isPending} className='w-full'>
            {updateBranding.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Speichern
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
