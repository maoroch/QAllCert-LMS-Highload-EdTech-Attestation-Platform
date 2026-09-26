'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { useTranslation } from '../../../lib/i18n/useTranslation';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import apiClient from '../../../lib/api/client';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get('/profile');
        if (data.full_name) setFullName(data.full_name);
        if (data.bio) setBio(data.bio);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await apiClient.patch('/profile', {
        full_name: fullName,
        bio: bio
      });
      setMessage(t('profilePage', 'success'));
    } catch (err) {
      setMessage(t('profilePage', 'error'));
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className=" space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">
          {t('profilePage', 'title')}
        </h1>
        <p className="mt-2 text-sm text-slate-600 ">
          {t('profilePage', 'subtitle')}
        </p>
      </header>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-2xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="flex items-center gap-x-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <Button variant="outline" size="sm">{t('profilePage', 'changeAvatar')}</Button>
              <p className="mt-2 text-xs leading-5 text-slate-500 ">
                {t('profilePage', 'avatarHint')}
              </p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md text-sm ${message === t('profilePage', 'success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <form className=" space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Input
                  label={t('profilePage', 'emailLabel')}
                  type="email"
                  value={user.email}
                  disabled
                />
              </div>

              <div className="sm:col-span-3">
                <Input
                  label={t('profilePage', 'roleLabel')}
                  type="text"
                  value={t('profilePage', user.role === 'teacher' ? 'roleTeacher' : 'roleStudent')}
                  disabled
                />
              </div>

              <div className="sm:col-span-full">
                <Input
                  label={t('profilePage', 'fullName')}
                  type="text"
                  placeholder={t('profilePage', 'fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {user.role === 'teacher' && (
                <div className="sm:col-span-full">
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">
                    {t('profilePage', 'bio')}
                  </label>
                  <textarea
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    placeholder={t('profilePage', 'bioPlaceholder')}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-x-4 pt-4 border-t border-slate-200 ">
              <Button type="submit" variant="primary" isLoading={isSaving}>
                {t('profilePage', 'saveChanges')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
