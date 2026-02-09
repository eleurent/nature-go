'use client';

import { useEffect } from 'react';

export function useHtmlBackground(variant: 'default' | '2') {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (variant === '2') {
      html.classList.add('bg-variant-2');
      body.classList.add('bg-variant-2');
    }
    return () => {
      html.classList.remove('bg-variant-2');
      body.classList.remove('bg-variant-2');
    };
  }, [variant]);
}

