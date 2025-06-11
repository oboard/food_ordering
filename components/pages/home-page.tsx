'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useCart } from '@/contexts/cart-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Star, Clock, Flame, Plus } from 'lucide-react';
import Image from 'next/image';
import { Database } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export function HomePage() {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured items
      const { data: featured, error: featuredError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_featured', true)
        .eq('is_available', true)
        .order('sort_order')
        .limit(6);

      if (featuredError) throw featuredError;
      setFeaturedItems(featured || []);

      // Fetch categories
      const { data: cats, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (catsError) throw catsError;
      setCategories(cats || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (menuItem: MenuItem) => {
    try {
      await addToCart(menuItem.id);
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
  const getCategoryName = (category: Category) => language === 'zh' ? category.name_zh : category.name_en;

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t('menu.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-full border-gray-200 focus:border-orange-500 focus:ring-orange-500"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setSearchQuery('')}
          >
            ×
          </Button>
        )}
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('menu.categories')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => router.push(`/menu?category=${category.id}`)}
            >
              <CardContent className="p-4">
                <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-orange-100 to-orange-50">
                  {category.image_url && (
                    <img
                      src={category.image_url}
                      alt={getCategoryName(category)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="font-medium text-gray-900 text-center">
                  {getCategoryName(category)}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('menu.featured')}
        </h2>
        <div className="space-y-4">
          {featuredItems.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50">
                    {item.image_url && (
                      <img
                        src={item.image_url}
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
                      <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
                        <Star className="h-3 w-3 mr-1" />
                        {t('menu.featured')}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {getItemDescription(item)}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      {item.preparation_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{item.preparation_time}{t('menu.minutes')}</span>
                        </div>
                      )}
                      {item.calories && (
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          <span>{item.calories} {t('menu.calories')}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">
                        ¥{item.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="bg-orange-600 hover:bg-orange-700 h-8 px-3"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {t('menu.addToCart')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* View All Menu Button */}
      <div className="pt-4">
        <Button
          onClick={() => router.push('/menu')}
          className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-full"
        >
          {language === 'zh' ? '查看完整菜单' : 'View Full Menu'}
        </Button>
      </div>
    </div>
  );
}