import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Codex — TBSM',
  description: 'Dictionary of references, slang, and cultural terms used by Seedhe Maut.',
};

export default function CodexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
