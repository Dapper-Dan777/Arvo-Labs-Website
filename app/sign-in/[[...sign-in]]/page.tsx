'use client';

import { use } from 'react';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ 'sign-in': string[] }>;
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
      <SignIn 
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}

