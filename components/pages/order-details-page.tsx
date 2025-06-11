'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  menu_item: {
    id: string;
    name_en: string;
    name_zh: string;
    price: number;
    image_url: string | null;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions: string | null;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: string;
  delivery_address: string;
  phone: string;
  special_instructions: string | null;
  payment_method: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

export function OrderDetailsPage({ orderId }: { orderId: string }) {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    fetchOrderDetails();
  }, [user, orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (
              id,
              name_en,
              name_zh,
              price,
              image_url
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'ready':
        return <AlertCircle className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">
          {t('orders.orderNumber')}{order.order_number}
        </h1>
      </div>

      {/* Order Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-medium">{t(`status.${order.status}`)}</span>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {t(`status.${order.status}`)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('checkout.deliveryInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">{t('checkout.deliveryAddress')}</p>
              <p className="text-sm font-medium">{order.delivery_address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">{t('checkout.phone')}</p>
              <p className="text-sm font-medium">{order.phone}</p>
            </div>
          </div>
          {order.special_instructions && (
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">{t('cart.specialInstructions')}</p>
                <p className="text-sm font-medium">{order.special_instructions}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('checkout.orderDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {item.menu_item.image_url && (
                  <img
                    src={item.menu_item.image_url}
                    alt={language === 'zh' ? item.menu_item.name_zh : item.menu_item.name_en}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm">
                    {language === 'zh' ? item.menu_item.name_zh : item.menu_item.name_en}
                  </h3>
                  <span className="text-sm font-medium">
                    ¥{item.total_price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>¥{item.unit_price.toFixed(2)} × {item.quantity}</span>
                  {item.special_instructions && (
                    <span className="text-xs text-gray-400">
                      {item.special_instructions}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('checkout.subtotal')}</span>
              <span>¥{order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('checkout.deliveryFee')}</span>
              <span className="text-green-600">{t('checkout.free')}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>{t('cart.total')}</span>
              <span className="text-orange-600">¥{order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Actions */}
      {order.status === 'delivered' && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`/orders/${order.id}/reorder`)}
          >
            {t('orders.reorder')}
          </Button>
        </div>
      )}
    </div>
  );
} 