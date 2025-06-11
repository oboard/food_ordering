import { OrderDetailsPage } from '@/components/pages/order-details-page';


export default function OrderDetails({ params }: { params: { id: string } }) {
  return <OrderDetailsPage orderId={params.id} />;
}