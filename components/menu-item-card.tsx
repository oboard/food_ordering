'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib/supabase';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (id: string) => Promise<void>;
  getItemName: (item: MenuItem) => string;
  getItemDescription: (item: MenuItem) => string;
  language: string;
  t: (key: string) => string;
  showFeatured?: boolean;
}

export function MenuItemCard({
  item,
  onAddToCart,
  getItemName,
  getItemDescription,
  language,
  t,
  showFeatured = true,
}: MenuItemCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/menu/${item.id}`);
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={getItemName(item)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400">
            {t('menu.noImage')}
          </div>
        )}
        {showFeatured && item.is_featured && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-orange-100 text-orange-800"
          >
            <Star className="h-3 w-3 mr-1" />
            {t('menu.featured')}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900">
            {getItemName(item)}
          </h3>
          <p className="font-bold text-orange-600">
            ¥{item.price.toFixed(2)}
          </p>
        </div>
        {getItemDescription(item) && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {getItemDescription(item)}
          </p>
        )}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item.id);
          }}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('menu.addToCart')}
        </Button>
      </CardContent>
    </Card>
  );
} 