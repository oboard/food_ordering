'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useCart } from '@/contexts/cart-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Clock, 
  Flame, 
  Plus, 
  Minus,
  Star,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Database } from '@/lib/supabase';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

export function MenuItemDetailsPage({ menuItemId }: { menuItemId: string }) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchMenuItem();
  }, [menuItemId]);

  const fetchMenuItem = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', menuItemId)
        .single();

      if (error) throw error;
      setMenuItem(data);
    } catch (error) {
      console.error('Error fetching menu item:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!menuItem) return;

    try {
      await addToCart(menuItem.id, quantity);
      toast.success(
        language === 'zh' 
          ? `${menuItem.name_zh} 已添加到购物车` 
          : `${menuItem.name_en} added to cart`
      );
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const getItemName = (item: MenuItem) => language === 'zh' ? item.name_zh : item.name_en;
  const getItemDescription = (item: MenuItem) => language === 'zh' ? item.description_zh : item.description_en;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">
            {getItemName(menuItem)}
          </h1>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-50">
        {menuItem.image_url ? (
          <img
            src={menuItem.image_url}
            alt={getItemName(menuItem)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {t('menu.noImage')}
          </div>
        )}
        {menuItem.is_featured && (
          <Badge 
            variant="secondary" 
            className="absolute top-4 right-4 bg-orange-100 text-orange-800"
          >
            <Star className="h-3 w-3 mr-1" />
            {t('menu.featured')}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Title and Price */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getItemName(menuItem)}
          </h2>
          <p className="text-3xl font-bold text-orange-600">
            ¥{menuItem.price.toFixed(2)}
          </p>
        </div>

        {/* Description */}
        {getItemDescription(menuItem) && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {t('menu.description')}
            </h3>
            <p className="text-sm text-gray-600">
              {getItemDescription(menuItem)}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-3">
          {menuItem.preparation_time && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{menuItem.preparation_time} {t('menu.minutes')}</span>
            </div>
          )}
          {menuItem.calories && (
            <div className="flex items-center text-sm text-gray-600">
              <Flame className="h-4 w-4 mr-2" />
              <span>{menuItem.calories} {t('menu.calories')}</span>
            </div>
          )}
        </div>

        {/* Ingredients */}
        {menuItem.ingredients_zh && menuItem.ingredients_zh.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {t('menu.ingredients')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {menuItem.ingredients_zh.map((ingredient, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-gray-100 text-gray-800"
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Allergens */}
        {menuItem.allergens && menuItem.allergens.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {t('menu.allergens')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {menuItem.allergens.map((allergen, index) => (
                <Badge 
                  key={index} 
                  variant="destructive"
                  className="bg-red-100 text-red-800"
                >
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('menu.addToCart')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 