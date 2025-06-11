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
    'nav.appName': 'Food Ordering',
    'nav.language': 'EN',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.fullName': 'Full Name',
    'auth.fullNamePlaceholder': 'Enter your full name',
    'auth.phone': 'Phone Number',
    'auth.phonePlaceholder': 'Enter your phone number',
    'auth.address': 'Address',
    'auth.addressPlaceholder': 'Enter your address',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Sign Up',
    'auth.switchToRegister': "Don't have an account? Sign up",
    'auth.switchToLogin': 'Already have an account? Sign in',
    'auth.welcome': 'Welcome Back',
    'auth.welcomeSubtitle': 'Login or register to start ordering',
    'auth.loginSuccess': 'Login successful',
    'auth.registerSuccess': 'Registration successful',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.passwordTooShort': 'Password must be at least 6 characters',
    'auth.notSet': 'Not set',
    
    // Menu
    'menu.featured': 'Featured Items',
    'menu.categories': 'Categories',
    'menu.searchPlaceholder': 'Search menu items...',
    'menu.searching': 'Searching...',
    'menu.searchResults': 'Search Results',
    'menu.noResults': 'No items found',
    'menu.addToCart': 'Add to Cart',
    'menu.outOfStock': 'Out of Stock',
    'menu.calories': 'calories',
    'menu.prepTime': 'Prep time',
    'menu.minutes': 'min',
    'menu.ingredients': 'Ingredients',
    'menu.allergens': 'Allergens',
    'menu.all': 'All',
    'menu.viewFullMenu': 'View Full Menu',
    'menu.description': 'Description',
    'menu.noImage': 'No Image Available',
    'menu.preparationTime': 'Preparation Time',
    'menu.quantity': 'Quantity',
    
    // Cart
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.quantity': 'Qty',
    'cart.remove': 'Remove',
    'cart.specialInstructions': 'Special Instructions',
    'cart.addInstructions': 'Add special instructions...',
    'cart.subtotal': 'Subtotal',
    'cart.deliveryFee': 'Delivery Fee',
    'cart.free': 'Free',
    'cart.browseMenu': 'Browse our menu to add some delicious items!',
    'cart.loginRequired': 'Please Login First',
    'cart.loginToView': 'Login to view your cart',
    
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
    'orders.noOrders': 'No Orders Yet',
    'orders.startOrdering': 'Start ordering some delicious food!',
    'orders.loginRequired': 'Please Login First',
    'orders.loginToView': 'Login to view your order history',
    'orders.deliverTo': 'Deliver to: ',
    
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
    'payment.wechatQR': 'WeChat Payment QR',
    'payment.scanWeChat': 'Scan with WeChat to pay',
    'payment.scanWeChatDescription': 'Open WeChat and scan the QR code to complete payment',
    'payment.securePayment': 'Secure mobile payment',
    
    // Checkout
    'checkout.deliveryInfo': 'Delivery Information',
    'checkout.deliveryAddress': 'Delivery Address',
    'checkout.addressPlaceholder': 'Enter detailed address',
    'checkout.phone': 'Phone Number',
    'checkout.phonePlaceholder': 'Enter phone number',
    'checkout.orderDetails': 'Order Details',
    'checkout.subtotal': 'Subtotal',
    'checkout.deliveryFee': 'Delivery Fee',
    'checkout.free': 'Free',
    'checkout.placingOrder': 'Placing Order...',
    'checkout.placeOrder': 'Place Order',
    'checkout.fillDeliveryInfo': 'Please fill in delivery address and phone',
    'checkout.orderCreated': 'Order created successfully',
    'checkout.importFromProfile': 'Import from Profile',
    'checkout.profileImported': 'Information imported from profile',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.language': 'Language',
    'profile.save': 'Save Changes',
    'profile.orderHistory': 'Order History',
    'profile.notifications': 'Notifications',
    'profile.settings': 'Settings',
    'profile.helpSupport': 'Help & Support',
    'profile.logoutSuccess': 'Signed out successfully',
    'profile.loginRequired': 'Please Login First',
    'profile.loginToView': 'Login to view your profile',
    
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
    'nav.appName': '美食订餐',
    'nav.language': '中',
    
    // Authentication
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.logout': '退出登录',
    'auth.email': '邮箱',
    'auth.emailPlaceholder': '请输入邮箱',
    'auth.password': '密码',
    'auth.passwordPlaceholder': '请输入密码',
    'auth.confirmPassword': '确认密码',
    'auth.confirmPasswordPlaceholder': '请确认密码',
    'auth.fullName': '姓名',
    'auth.fullNamePlaceholder': '请输入姓名',
    'auth.phone': '手机号码',
    'auth.phonePlaceholder': '请输入手机号',
    'auth.address': '地址',
    'auth.addressPlaceholder': '请输入地址',
    'auth.loginButton': '登录',
    'auth.registerButton': '注册',
    'auth.switchToRegister': '没有账户？立即注册',
    'auth.switchToLogin': '已有账户？立即登录',
    'auth.welcome': '欢迎回来',
    'auth.welcomeSubtitle': '登录或注册开始订餐',
    'auth.loginSuccess': '登录成功',
    'auth.registerSuccess': '注册成功',
    'auth.passwordMismatch': '密码不匹配',
    'auth.passwordTooShort': '密码至少6位',
    'auth.notSet': '未设置',
    
    // Menu
    'menu.featured': '推荐菜品',
    'menu.categories': '菜品分类',
    'menu.searchPlaceholder': '搜索菜品...',
    'menu.searching': '搜索中...',
    'menu.searchResults': '搜索结果',
    'menu.noResults': '未找到相关菜品',
    'menu.addToCart': '加入购物车',
    'menu.outOfStock': '缺货',
    'menu.calories': '卡路里',
    'menu.prepTime': '制作时间',
    'menu.minutes': '分钟',
    'menu.ingredients': '食材',
    'menu.allergens': '过敏原',
    'menu.all': '全部',
    'menu.viewFullMenu': '查看完整菜单',
    'menu.description': '菜品描述',
    'menu.noImage': '暂无图片',
    'menu.preparationTime': '制作时间',
    'menu.quantity': '数量',
    
    // Cart
    'cart.empty': '购物车为空',
    'cart.total': '总计',
    'cart.checkout': '结账',
    'cart.quantity': '数量',
    'cart.remove': '删除',
    'cart.specialInstructions': '特殊要求',
    'cart.addInstructions': '添加特殊要求...',
    'cart.subtotal': '小计',
    'cart.deliveryFee': '配送费',
    'cart.free': '免费',
    'cart.browseMenu': '去菜单看看有什么好吃的吧！',
    'cart.loginRequired': '请先登录',
    'cart.loginToView': '登录后即可查看购物车',
    
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
    'orders.noOrders': '暂无订单',
    'orders.startOrdering': '快去点些美食吧！',
    'orders.loginRequired': '请先登录',
    'orders.loginToView': '登录后即可查看订单历史',
    'orders.deliverTo': '配送至：',
    
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
    'payment.wechatQR': '微信收款码',
    'payment.scanWeChat': '请使用微信扫码支付',
    'payment.scanWeChatDescription': '打开微信，扫描二维码完成支付',
    'payment.securePayment': '安全便捷的移动支付',
    
    // Checkout
    'checkout.deliveryInfo': '配送信息',
    'checkout.deliveryAddress': '配送地址',
    'checkout.addressPlaceholder': '请输入详细地址',
    'checkout.phone': '联系电话',
    'checkout.phonePlaceholder': '请输入手机号码',
    'checkout.orderDetails': '订单详情',
    'checkout.subtotal': '小计',
    'checkout.deliveryFee': '配送费',
    'checkout.free': '免费',
    'checkout.placingOrder': '提交中...',
    'checkout.placeOrder': '提交订单',
    'checkout.fillDeliveryInfo': '请填写配送地址和电话',
    'checkout.orderCreated': '订单创建成功',
    'checkout.importFromProfile': '从个人资料导入',
    'checkout.profileImported': '已从个人资料导入信息',
    
    // Profile
    'profile.title': '个人中心',
    'profile.personalInfo': '个人信息',
    'profile.language': '语言',
    'profile.save': '保存更改',
    'profile.orderHistory': '历史订单',
    'profile.notifications': '通知',
    'profile.settings': '设置',
    'profile.helpSupport': '帮助与支持',
    'profile.logoutSuccess': '已退出登录',
    'profile.loginRequired': '请先登录',
    'profile.loginToView': '登录后即可查看个人资料',
    
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
  const [language, setLanguage] = useState<Language>('zh');

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