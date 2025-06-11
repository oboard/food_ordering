'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Flame, Clock } from 'lucide-react';
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
        <Card onClick={handleCardClick} className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
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
                            {showFeatured && item.is_featured && (
                                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800 text-xs">
                                    <Star className="h-3 w-3 mr-1" />
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(item.id);
                                }}
                                className="bg-orange-600 hover:bg-orange-700 h-8 px-3"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                {t('menu.addToCart')}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>)
    //   return (
    //     <Card 
    //       className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    //       onClick={handleCardClick}
    //     >
    //       <div className="relative aspect-square">
    //         {item.image_url ? (
    //           <img
    //             src={item.image_url}
    //             alt={getItemName(item)}
    //             className="w-full h-full object-cover"
    //           />
    //         ) : (
    //           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400">
    //             {t('menu.noImage')}
    //           </div>
    //         )}
    //         {showFeatured && item.is_featured && (
    //           <Badge 
    //             variant="secondary" 
    //             className="absolute top-2 right-2 bg-orange-100 text-orange-800"
    //           >
    //             <Star className="h-3 w-3 mr-1" />
    //             {t('menu.featured')}
    //           </Badge>
    //         )}
    //       </div>
    //       <CardContent className="p-4">
    //         <div className="flex justify-between items-start mb-2">
    //           <h3 className="font-medium text-gray-900">
    //             {getItemName(item)}
    //           </h3>
    //           <p className="font-bold text-orange-600">
    //             ¥{item.price.toFixed(2)}
    //           </p>
    //         </div>
    //         {getItemDescription(item) && (
    //           <p className="text-sm text-gray-600 mb-4 line-clamp-2">
    //             {getItemDescription(item)}
    //           </p>
    //         )}
    //         <Button
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             onAddToCart(item.id);
    //           }}
    //           className="w-full bg-orange-600 hover:bg-orange-700"
    //         >
    //           <Plus className="h-4 w-4 mr-2" />
    //           {t('menu.addToCart')}
    //         </Button>
    //       </CardContent>
    //     </Card>
    //   );
} 