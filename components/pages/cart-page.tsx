'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function CartPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { items, loading, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const router = useRouter();
  const [specialInstructions, setSpecialInstructions] = useState('');

  const getItemName = (item: any) => language === 'zh' ? item.menu_item.name_zh : item.menu_item.name_en;

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    toast.success(t('common.success'));
  };

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth');
      return;
    }
    router.push('/checkout');
  };

  if (!user) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {t('cart.loginRequired')}
        </h2>
        <p className="text-gray-500 mb-4">
          {t('cart.loginToView')}
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
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {t('cart.empty')}
        </h2>
        <p className="text-gray-500 mb-4">
          {t('cart.browseMenu')}
        </p>
        <Button onClick={() => router.push('/menu')} className="bg-orange-600 hover:bg-orange-700">
          {t('nav.menu')}
        </Button>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Cart Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50">
                  {item.menu_item.image_url && (
                    <img
                      src={item.menu_item.image_url}
                      alt={getItemName(item)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">
                      {getItemName(item)}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">
                      ¥{(item.menu_item.price * item.quantity).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0 rounded-full"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {item.special_instructions && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {t('cart.specialInstructions')}: {item.special_instructions}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Special Instructions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">
            {t('cart.specialInstructions')}
          </h3>
          <Textarea
            placeholder={t('cart.addInstructions')}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {t('cart.subtotal')}
              </span>
              <span>¥{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {t('cart.deliveryFee')}
              </span>
              <span className="text-green-600">
                {t('cart.free')}
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

      {/* Checkout Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t">
        <Button
          onClick={handleCheckout}
          className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-full text-lg font-semibold"
        >
          {t('cart.checkout')} - ¥{totalPrice.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}