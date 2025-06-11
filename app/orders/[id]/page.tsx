import { OrderDetailsPage } from '@/components/pages/order-details-page';

export default async function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailsPage orderId={id} />;
}