import type { Metadata } from 'next';
import { GuideView } from '@/components/Guide';

export const metadata: Metadata = {
  title: 'Study guide',
  description: 'Beginner, intermediate and advanced DSA levels with LeetCode, Codeforces, CSES and AtCoder problems, company-style question sets, and a season plan to placements.',
};

export default function GuidePage() {
  return <GuideView />;
}
