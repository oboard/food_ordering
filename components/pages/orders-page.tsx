'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  Package, 
  Truck,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib/supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'] & {
  menu_item: Database['public']['Tables']['menu_items']['Row'];
};

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export function OrdersPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'ready':
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <Truck className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return t(`status.${status}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'zh' 
      ? date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('en-US') + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getItemName = (item: OrderItem) => 
    language === 'zh' ? item.menu_item.name_zh : item.menu_item.name_en;

  if (!user) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {t('orders.loginRequired')}
        </h2>
        <p className="text-gray-500 mb-4">
          {t('orders.loginToView')}
        </p>
        <Button onClick={() => router.push('/auth')} className="bg-orange-600 hover:bg-orange-700">
          {t('auth.login')}
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {t('orders.noOrders')}
        </h2>
        <p className="text-gray-500 mb-4">
          {t('orders.startOrdering')}
        </p>
        <Button onClick={() => router.push('/menu')} className="bg-orange-600 hover:bg-orange-700">
          {t('nav.menu')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          {t('orders.myOrders')}
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchOrders}
          className="p-2"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-900">
                    {t('orders.orderNumber')}{order.order_number}
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Order Items */}
              <div className="space-y-2 mb-3">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {getItemName(item)} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ¥{item.total_price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-3" />

              {/* Order Summary */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">
                  {order.order_items.length} {t('orders.items')}
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {t('orders.total')}: ¥{order.total_amount.toFixed(2)}
                </span>
              </div>

              {/* Delivery Address */}
              {order.delivery_address && (
                <p className="text-xs text-gray-500 mb-3">
                  {t('orders.deliverTo')}{order.delivery_address}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  {t('orders.viewDetails')}
                </Button>
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    {t('orders.trackOrder')}
                  </Button>
                )}
                {order.status === 'delivered' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs bg-orange-50 text-orange-600 hover:bg-orange-100"
                  >
                    {t('orders.reorder')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}