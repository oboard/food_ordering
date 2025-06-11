'use client';

import { MobileLayout } from '@/components/mobile-layout';
import { ProfilePage } from '@/components/pages/profile-page';

export default function Profile() {
  return (
    <MobileLayout>
      <ProfilePage />
    </MobileLayout>
  );
}