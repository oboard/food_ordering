'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Bell,
  Shield,
  HelpCircle,
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  preferred_language: string | null;
}

export function ProfilePage() {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName || null,
          phone: phone || null,
          address: address || null,
          preferred_language: language,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(t('common.success'));
      setEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success(t('profile.logoutSuccess'));
    router.push('/');
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'zh' : 'en';
    setLanguage(newLanguage);
  };

  if (!user) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <User className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {t('profile.loginRequired')}
        </h2>
        <p className="text-gray-500 mb-4">
          {t('profile.loginToView')}
        </p>
        <Button onClick={() => router.push('/auth')} className="bg-orange-600 hover:bg-orange-700">
          {t('auth.login')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">
        {t('profile.title')}
      </h1>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-orange-100 text-orange-600 text-xl">
                {fullName ? fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {fullName || user.email}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              {editing ? t('common.cancel') : t('common.edit')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('profile.personalInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t('auth.fullName')}</Label>
            {editing ? (
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('auth.fullNamePlaceholder')}
              />
            ) : (
              <p className="text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-md">
                {fullName || t('auth.notSet')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <div className="flex items-center gap-2 text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-md">
              <Mail className="h-4 w-4 text-gray-400" />
              {user.email}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('auth.phone')}</Label>
            {editing ? (
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('auth.phonePlaceholder')}
              />
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-md">
                <Phone className="h-4 w-4 text-gray-400" />
                {phone || t('auth.notSet')}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('auth.address')}</Label>
            {editing ? (
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('auth.addressPlaceholder')}
                className="min-h-[80px]"
              />
            ) : (
              <div className="flex items-start gap-2 text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-md">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{address || t('auth.notSet')}</span>
              </div>
            )}
          </div>

          {editing && (
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {saving ? t('common.loading') : t('profile.save')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setFullName(profile?.full_name || '');
                  setPhone(profile?.phone || '');
                  setAddress(profile?.address || '');
                }}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('profile.settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{t('profile.language')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {t('nav.language')}
              </span>
              <Switch
                checked={language === 'zh'}
                onCheckedChange={toggleLanguage}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{t('profile.notifications')}</span>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-4"
          onClick={() => router.push('/orders')}
        >
          <Shield className="h-5 w-5 mr-3 text-gray-400" />
          {t('profile.orderHistory')}
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-4"
        >
          <HelpCircle className="h-5 w-5 mr-3 text-gray-400" />
          {t('profile.helpSupport')}
        </Button>

        <Separator className="my-4" />

        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          {t('auth.logout')}
        </Button>
      </div>
    </div>
  );
}