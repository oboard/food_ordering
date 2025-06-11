'use client';

import { MobileLayout } from '@/components/mobile-layout';
import { AuthPage } from '@/components/pages/auth-page';

export default function Auth() {
  return (
    <MobileLayout>
      <AuthPage />
    </MobileLayout>
  );
}