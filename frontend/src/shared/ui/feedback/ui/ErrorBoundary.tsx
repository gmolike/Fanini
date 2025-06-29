import * as React from 'react';

import { AlertCircle } from 'lucide-react';

import { Button } from '@/shared/shadcn';

import type { ErrorBoundaryProps } from '../model/types';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Komponente
 * @description Fängt JavaScript Fehler in der Komponentenstruktur
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback;

      if (Fallback) {
        return <Fallback error={this.state.error} reset={this.reset} />;
      }

      return (
        <div className='flex min-h-[400px] flex-col items-center justify-center p-8'>
          <AlertCircle className='text-destructive mb-4 h-12 w-12' />
          <h2 className='mb-2 text-lg font-semibold'>Ein Fehler ist aufgetreten</h2>
          <p className='text-muted-foreground mb-4 text-sm'>{this.state.error.message}</p>
          <Button onClick={this.reset} variant='outline'>
            Erneut versuchen
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
