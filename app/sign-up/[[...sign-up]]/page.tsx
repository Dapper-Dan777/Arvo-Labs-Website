'use client';

import { use } from 'react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage({
  params,
  searchParams,
}: {
  params: Promise<{ 'sign-up': string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Unwrap params and searchParams using React.use()
  use(params);
  use(searchParams);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <SignUp 
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
}

