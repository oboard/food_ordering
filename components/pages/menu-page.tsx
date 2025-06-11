'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useCart } from '@/contexts/cart-context';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Database } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { MenuItemCard } from '@/components/menu-item-card';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

function MenuContent() {
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

  const handleAddToCart = async (id: string) => {
    try {
      await addToCart(id);
      const item = items.find(item => item.id === id);
      if (item) {
        toast.success(
          language === 'zh' 
            ? `${item.name_zh} 已添加到购物车` 
            : `${item.name_en} added to cart`
        );
      }
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const getItemName = (item: MenuItem) => language === 'zh' ? item.name_zh : item.name_en;
  const getItemDescription = (item: MenuItem) => language === 'zh' ? (item.description_zh || '') : (item.description_en || '');
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

  const renderMenuItemCard = (item: MenuItem) => (
    <MenuItemCard 
      key={item.id} 
      item={item} 
      onAddToCart={handleAddToCart}
      getItemName={getItemName}
      getItemDescription={getItemDescription}
      language={language}
      t={t}
    />
  );

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
                    {categoryItems.map(renderMenuItemCard)}
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
              {(groupedItems[category.id] || []).map(renderMenuItemCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export function MenuPage() {
  return (
    <Suspense fallback={
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}