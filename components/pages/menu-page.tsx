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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Clock, Flame, Plus, Filter } from 'lucide-react';
import { Database } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export function MenuPage() {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: cats, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (catsError) throw catsError;
      setCategories(cats || []);

      // Fetch menu items
      const { data: menuItems, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('sort_order');

      if (itemsError) throw itemsError;
      setItems(menuItems || []);
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

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      getItemName(item).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getItemDescription(item) && getItemDescription(item)!.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const groupedItems = categories.reduce((acc, category) => {
    acc[category.id] = filteredItems.filter(item => item.category_id === category.id);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t('menu.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-full border-gray-200 focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="w-full h-auto p-1 grid grid-cols-3 gap-1 bg-gray-100">
          <TabsTrigger 
            value="all" 
            className="text-xs px-2 py-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            {t('menu.all')}
          </TabsTrigger>
          {categories.slice(0, 2).map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="text-xs px-2 py-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              {getCategoryName(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Items */}
        <TabsContent value="all" className="mt-4">
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryItems = groupedItems[category.id] || [];
              if (categoryItems.length === 0) return null;

              return (
                <section key={category.id}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {getCategoryName(category)}
                  </h3>
                  <div className="space-y-3">
                    {categoryItems.map((item) => (
                      <MenuItemCard 
                        key={item.id} 
                        item={item} 
                        onAddToCart={handleAddToCart}
                        getItemName={getItemName}
                        getItemDescription={getItemDescription}
                        language={language}
                        t={t}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </TabsContent>

        {/* Category-specific tabs */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <div className="space-y-3">
              {(groupedItems[category.id] || []).map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={handleAddToCart}
                  getItemName={getItemName}
                  getItemDescription={getItemDescription}
                  language={language}
                  t={t}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  getItemName: (item: MenuItem) => string;
  getItemDescription: (item: MenuItem) => string | null;
  language: string;
  t: (key: string) => string;
}

function MenuItemCard({ 
  item, 
  onAddToCart, 
  getItemName, 
  getItemDescription, 
  language, 
  t 
}: MenuItemCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
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
              {item.is_featured && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800 text-xs">
                  {t('menu.featured')}
                </Badge>
              )}
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
                onClick={() => onAddToCart(item)}
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
  );
}