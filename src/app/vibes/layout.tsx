import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vibe Matcher — TBSM',
  description: 'Find Seedhe Maut songs by vibe and mood.',
};

export default function VibesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
