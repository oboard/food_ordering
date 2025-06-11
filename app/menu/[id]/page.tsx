import { MenuItemDetailsPage } from '@/components/pages/menu-item-details-page';

export default async function MenuItemDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MenuItemDetailsPage menuItemId={id} />;
} 