'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WhatsAppBotPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070d09]">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );
}
