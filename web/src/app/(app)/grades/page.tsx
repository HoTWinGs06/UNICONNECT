'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Enrollment, Course } from '@/lib/supabase/types';

type EnrollmentWithCourse = Enrollment & { course: Course };

export default function GradesPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [gpa, setGpa] = useState<number>(0);
  const [creditsEarned, setCreditsEarned] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch enrollments with courses
    const { data: enrollmentData } = await supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false });

    if (enrollmentData) setEnrollments(enrollmentData as EnrollmentWithCourse[]);

    // Calculate GPA
    const { data: gpaData } = await supabase.rpc('calculate_gpa', {
      target_user_id: user.id,
    });
    if (gpaData !== null) setGpa(Number(gpaData));

    // Get credits earned
    const { data: creditsData } = await supabase.rpc('get_credits_earned', {
      target_user_id: user.id,
    });
    if (creditsData !== null) setCreditsEarned(Number(creditsData));

    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalCreditsRequired = 120;
  const progressPercent = Math.min(
    (creditsEarned / totalCreditsRequired) * 100,
    100
  );

  function gradeColor(grade: string | null) {
    if (!grade) return 'text-on-surface-variant';
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-success';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-primary';
    if (['C+', 'C', 'C-'].includes(grade)) return 'text-warning';
    return 'text-error';
  }

  function statusBadge(status: string) {
    switch (status) {
      case 'active':
        return 'bg-primary/10 text-primary';
      case 'completed':
        return 'bg-success/10 text-success';
      case 'dropped':
        return 'bg-on-surface-variant/10 text-on-surface-variant';
      case 'failed':
        return 'bg-error/10 text-error';
      default:
        return '';
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-on-background mb-6">Academics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* GPA */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">
                grade
              </span>
            </div>
            <p className="text-label-md text-on-surface-variant">GPA</p>
          </div>
          <p className="text-3xl font-bold text-on-surface">
            {gpa.toFixed(2)}
          </p>
          <p className="text-label-sm text-on-surface-variant mt-1">
            out of 4.00
          </p>
        </div>

        {/* Credits */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-success text-[20px]">
                school
              </span>
            </div>
            <p className="text-label-md text-on-surface-variant">Credits Earned</p>
          </div>
          <p className="text-3xl font-bold text-on-surface">{creditsEarned}</p>
          <p className="text-label-sm text-on-surface-variant mt-1">
            of {totalCreditsRequired} required
          </p>
        </div>

        {/* Progress */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-warning text-[20px]">
                trending_up
              </span>
            </div>
            <p className="text-label-md text-on-surface-variant">Progress</p>
          </div>
          <p className="text-3xl font-bold text-on-surface">
            {Math.round(progressPercent)}%
          </p>
          <div className="w-full h-2 bg-surface-container rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Courses List */}
      <h2 className="text-lg font-semibold text-on-background mb-4">Courses</h2>
      <div className="space-y-3">
        {enrollments.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-2 block opacity-30">
              menu_book
            </span>
            <p className="font-medium">No courses yet</p>
            <p className="text-body-sm">Enroll in courses to track your grades</p>
          </div>
        ) : (
          enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 flex items-center gap-4 hover-lift"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary-container font-bold text-sm shrink-0">
                {enrollment.course?.code?.split(' ')[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-on-surface truncate">
                  {enrollment.course?.name}
                </p>
                <p className="text-label-sm text-on-surface-variant">
                  {enrollment.course?.code} • {enrollment.course?.credits} credits • {enrollment.course?.semester}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-sm px-2.5 py-0.5 rounded-full font-bold ${statusBadge(enrollment.status)}`}>
                  {enrollment.status}
                </span>
                {enrollment.grade && (
                  <span className={`text-xl font-bold ${gradeColor(enrollment.grade)}`}>
                    {enrollment.grade}
                  </span>
                )}
                {enrollment.percentage !== null && enrollment.percentage !== undefined && (
                  <span className="text-sm text-on-surface-variant">
                    {enrollment.percentage}%
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
