'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { QrCode, Smartphone, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const totalPrice = getTotalPrice();

  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-6);
    return `ORD${dateStr}${timeStr}`;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!deliveryAddress.trim() || !phone.trim()) {
      toast.error(t('checkout.fillDeliveryInfo'));
      return;
    }

    setLoading(true);

    try {
      const orderNumber = generateOrderNumber();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: totalPrice,
          delivery_address: deliveryAddress,
          phone: phone,
          special_instructions: specialInstructions || null,
          status: 'pending',
          payment_method: 'wechat',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.menu_item.price,
        total_price: item.menu_item.price * item.quantity,
        special_instructions: item.special_instructions,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and show payment
      await clearCart();
      setShowPayment(true);
      
      toast.success(t('checkout.orderCreated'));
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    toast.success(t('payment.paymentSuccess'));
    router.push('/orders');
  };

  if (showPayment) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPayment(false)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            {t('payment.title')}
          </h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">
              {t('payment.wechat')}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {t('payment.scanQR')}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            {/* WeChat QR Code */}
            <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <QrCode className="h-32 w-32 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-500">
                  {t('payment.wechatQR')}
                </p>
                <div className="mt-2 p-2 bg-green-100 rounded">
                  <p className="text-lg font-bold text-green-800">
                    ¥{totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Smartphone className="h-5 w-5" />
                <span className="text-sm">
                  {t('payment.scanWeChat')}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {t('payment.scanWeChatDescription')}
              </p>
            </div>

            <Button
              onClick={handlePaymentComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {t('payment.confirmPayment')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">
        {t('cart.checkout')}
      </h1>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('checkout.deliveryInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('checkout.deliveryAddress')} *
            </label>
            <Textarea
              placeholder={t('checkout.addressPlaceholder')}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('checkout.phone')} *
            </label>
            <Input
              type="tel"
              placeholder={t('checkout.phonePlaceholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('cart.specialInstructions')}
            </label>
            <Textarea
              placeholder={t('cart.addInstructions')}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('checkout.orderDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => {
            const itemName = language === 'zh' ? item.menu_item.name_zh : item.menu_item.name_en;
            return (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-sm font-medium">{itemName}</span>
                  <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <span className="text-sm font-medium">
                  ¥{(item.menu_item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('payment.method')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
            <QrCode className="h-6 w-6 text-green-600" />
            <div>
              <span className="font-medium text-green-800">{t('payment.wechat')}</span>
              <p className="text-sm text-green-600">
                {t('payment.securePayment')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {t('checkout.subtotal')}
              </span>
              <span>¥{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {t('checkout.deliveryFee')}
              </span>
              <span className="text-green-600">
                {t('checkout.free')}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>{t('cart.total')}</span>
              <span className="text-orange-600">¥{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Place Order Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t">
        <Button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-full text-lg font-semibold"
        >
          {loading 
            ? t('checkout.placingOrder')
            : t('checkout.placeOrder')
          }
        </Button>
      </div>
    </div>
  );
}