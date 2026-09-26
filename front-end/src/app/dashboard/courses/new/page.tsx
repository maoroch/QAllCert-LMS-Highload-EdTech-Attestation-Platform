'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { createCourse } from '../../../../store/courses/coursesSlice';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { useTranslation } from '../../../../lib/i18n/useTranslation';

export default function CreateCoursePage() {
  const dispatch = useAppDispatch();
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { isLoading, error } = useAppSelector((state) => state.courses);
  const router = useRouter();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Wait for auth to hydrate before checking role
  if (authLoading || user === null) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (user.role !== 'teacher') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">{t('courses', 'accessDenied')}</h2>
        <p className="mt-2 text-slate-600">{t('courses', 'onlyTeachers')}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(createCourse({ title, description }));
    if (createCourse.fulfilled.match(result)) {
      router.push('/dashboard/courses');
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {t('courses', 'createNewCourse')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t('courses', 'createCourseDesc')}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-2xl p-6 sm:p-8 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Input
          label={t('courses', 'courseTitle')}
          type="text"
          placeholder={t('courses', 'courseTitlePlaceholder')}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('courses', 'courseDescLabel')}
          </label>
          <textarea
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px]"
            placeholder={t('courses', 'courseDescPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/dashboard/courses')}
          >
            {t('common', 'cancel')}
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {t('courses', 'createCourse')}
          </Button>
        </div>
      </form>
    </div>
  );
}