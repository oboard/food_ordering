'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useCart } from '@/contexts/cart-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { Database } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MenuItemCard } from '@/components/menu-item-card';

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
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const searchItems = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true)
          .or(`name_en.ilike.%${searchQuery}%,name_zh.ilike.%${searchQuery}%,description_en.ilike.%${searchQuery}%,description_zh.ilike.%${searchQuery}%`)
          .order('sort_order');

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('Error searching items:', error);
        toast.error(t('common.error'));
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchItems, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, t]);

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

  const handleAddToCart = async (id: string) => {
    try {
      await addToCart(id);
      const item = featuredItems.find(item => item.id === id) || searchResults.find(item => item.id === id);
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

      {/* Search Results */}
      {searchQuery && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isSearching ? t('menu.searching') : t('menu.searchResults')}
          </h2>
          {isSearching ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={handleAddToCart}
                  getItemName={getItemName}
                  getItemDescription={getItemDescription}
                  language={language}
                  t={t}
                  showFeatured={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t('menu.noResults')}
            </div>
          )}
        </section>
      )}

      {/* Categories */}
      {!searchQuery && (
        <>
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

          {/* View All Menu Button */}
          <div className="pt-4">
            <Button
              onClick={() => router.push('/menu')}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-full"
            >
              {t('menu.viewFullMenu')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}