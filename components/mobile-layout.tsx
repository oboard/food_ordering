'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Menu, 
  ShoppingCart, 
  User, 
  ClipboardList,
  Globe,
  LogOut
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { getItemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const cartItemCount = getItemCount();

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.menu'), href: '/menu', icon: Menu },
    { name: t('nav.cart'), href: '/cart', icon: ShoppingCart, badge: cartItemCount },
    { name: t('nav.orders'), href: '/orders', icon: ClipboardList },
    { name: t('nav.profile'), href: '/profile', icon: User },
  ];

  const handleNavigation = (href: string) => {
    if (!user && (href === '/cart' || href === '/orders' || href === '/profile')) {
      router.push('/auth');
      return;
    }
    router.push(href);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            {t('nav.appName')}
          </h1>
          <div className="flex items-center gap-2">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="p-2"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={item.name}
                variant="ghost"
                className={`flex flex-col items-center justify-center h-16 relative ${
                  isActive 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 mb-1" />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="relative text-[10px] font-bold text-white">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}