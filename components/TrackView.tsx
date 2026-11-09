'use client';
import { useEffect } from 'react';
import { track } from '@/lib/analytics';
export default function TrackView({ category, tool }: { category: string; tool: string }) {
  useEffect(() => { track('tool_view', category, tool); }, [category, tool]);
  return null;
}
