import type { Metadata } from 'next';
import { PracticeHub } from '@/components/PracticeHub';

export const metadata: Metadata = {
  title: 'Practice',
  description: 'Hands-on DSA drills: name the technique, move the pointers, run binary search, check brackets, walk trees and graphs, and fill DP tables yourself.',
};

export default function PracticePage() {
  return <PracticeHub />;
}
