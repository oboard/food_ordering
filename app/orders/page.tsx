'use client';

import { MobileLayout } from '@/components/mobile-layout';
import { OrdersPage } from '@/components/pages/orders-page';

export default function Orders() {
  return (
    <MobileLayout>
      <OrdersPage />
    </MobileLayout>
  );
}