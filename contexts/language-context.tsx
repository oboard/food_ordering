'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.cart': 'Cart',
    'nav.orders': 'Orders',
    'nav.profile': 'Profile',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.address': 'Address',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Sign Up',
    'auth.switchToRegister': "Don't have an account? Sign up",
    'auth.switchToLogin': 'Already have an account? Sign in',
    
    // Menu
    'menu.featured': 'Featured Items',
    'menu.categories': 'Categories',
    'menu.searchPlaceholder': 'Search menu items...',
    'menu.addToCart': 'Add to Cart',
    'menu.outOfStock': 'Out of Stock',
    'menu.calories': 'calories',
    'menu.prepTime': 'Prep time',
    'menu.minutes': 'min',
    'menu.ingredients': 'Ingredients',
    'menu.allergens': 'Allergens',
    
    // Cart
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.quantity': 'Qty',
    'cart.remove': 'Remove',
    'cart.specialInstructions': 'Special Instructions',
    'cart.addInstructions': 'Add special instructions...',
    
    // Orders
    'orders.myOrders': 'My Orders',
    'orders.orderNumber': 'Order #',
    'orders.status': 'Status',
    'orders.total': 'Total',
    'orders.date': 'Date',
    'orders.items': 'items',
    'orders.viewDetails': 'View Details',
    'orders.trackOrder': 'Track Order',
    'orders.reorder': 'Reorder',
    
    // Order Status
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.preparing': 'Preparing',
    'status.ready': 'Ready',
    'status.delivered': 'Delivered',
    'status.cancelled': 'Cancelled',
    
    // Payment
    'payment.title': 'Payment',
    'payment.method': 'Payment Method',
    'payment.wechat': 'WeChat Pay',
    'payment.scanQR': 'Scan QR code to pay',
    'payment.confirmPayment': 'Confirm Payment',
    'payment.paymentSuccess': 'Payment Successful',
    'payment.paymentFailed': 'Payment Failed',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.language': 'Language',
    'profile.save': 'Save Changes',
    'profile.orderHistory': 'Order History',
    'profile.notifications': 'Notifications',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.clear': 'Clear',
    'common.apply': 'Apply',
    
    // Notifications
    'notification.orderConfirmed': 'Order Confirmed',
    'notification.orderPreparing': 'Order is Being Prepared',
    'notification.orderReady': 'Order Ready for Pickup',
    'notification.orderDelivered': 'Order Delivered',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.menu': '菜单',
    'nav.cart': '购物车',
    'nav.orders': '订单',
    'nav.profile': '个人中心',
    
    // Authentication
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.logout': '退出登录',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.fullName': '姓名',
    'auth.phone': '手机号码',
    'auth.address': '地址',
    'auth.loginButton': '登录',
    'auth.registerButton': '注册',
    'auth.switchToRegister': '没有账户？立即注册',
    'auth.switchToLogin': '已有账户？立即登录',
    
    // Menu
    'menu.featured': '推荐菜品',
    'menu.categories': '菜品分类',
    'menu.searchPlaceholder': '搜索菜品...',
    'menu.addToCart': '加入购物车',
    'menu.outOfStock': '缺货',
    'menu.calories': '卡路里',
    'menu.prepTime': '制作时间',
    'menu.minutes': '分钟',
    'menu.ingredients': '食材',
    'menu.allergens': '过敏原',
    
    // Cart
    'cart.empty': '购物车为空',
    'cart.total': '总计',
    'cart.checkout': '结账',
    'cart.quantity': '数量',
    'cart.remove': '删除',
    'cart.specialInstructions': '特殊要求',
    'cart.addInstructions': '添加特殊要求...',
    
    // Orders
    'orders.myOrders': '我的订单',
    'orders.orderNumber': '订单号',
    'orders.status': '状态',
    'orders.total': '总计',
    'orders.date': '日期',
    'orders.items': '项',
    'orders.viewDetails': '查看详情',
    'orders.trackOrder': '跟踪订单',
    'orders.reorder': '再次订购',
    
    // Order Status
    'status.pending': '待处理',
    'status.confirmed': '已确认',
    'status.preparing': '制作中',
    'status.ready': '待取餐',
    'status.delivered': '已送达',
    'status.cancelled': '已取消',
    
    // Payment
    'payment.title': '支付',
    'payment.method': '支付方式',
    'payment.wechat': '微信支付',
    'payment.scanQR': '扫描二维码支付',
    'payment.confirmPayment': '确认支付',
    'payment.paymentSuccess': '支付成功',
    'payment.paymentFailed': '支付失败',
    
    // Profile
    'profile.title': '个人中心',
    'profile.personalInfo': '个人信息',
    'profile.language': '语言',
    'profile.save': '保存更改',
    'profile.orderHistory': '历史订单',
    'profile.notifications': '通知',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.back': '返回',
    'common.close': '关闭',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.clear': '清除',
    'common.apply': '应用',
    
    // Notifications
    'notification.orderConfirmed': '订单已确认',
    'notification.orderPreparing': '订单制作中',
    'notification.orderReady': '订单已准备好',
    'notification.orderDelivered': '订单已送达',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}