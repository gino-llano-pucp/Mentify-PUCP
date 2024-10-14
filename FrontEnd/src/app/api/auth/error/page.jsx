'use client';

import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';

const Error = {
  Configuration: 'Configuration',
  AccessDenied: 'AccessDenied',
  Verification: 'Verification',
  Default: 'Default'
};

const errorMap = {
  [Error.Configuration]: (
    <p>
      There is a problem with the server configuration. Please check if your options are correct. Unique error
      code: <code className='p-1 text-xs rounded-sm bg-slate-100'>Configuration</code>
    </p>
  ),
  [Error.AccessDenied]: (
    <p>
      Access has been denied. This usually occurs when access is restricted through the signIn or redirect
      callback. Unique error code: <code className='p-1 text-xs rounded-sm bg-slate-100'>AccessDenied</code>
    </p>
  ),
  [Error.Verification]: (
    <p>
      There was an issue with the verification process. This could be related to an expired or used token.
      Unique error code: <code className='p-1 text-xs rounded-sm bg-slate-100'>Verification</code>
    </p>
  ),
  [Error.Default]: (
    <p>
      An unknown error occurred. Please contact support if this error persists. Unique error code:{' '}
      <code className='p-1 text-xs rounded-sm bg-slate-100'>Default</code>
    </p>
  )
};

export default function AuthErrorPage() {
  const search = useSearchParams();
  const error = search.get('error');

  redirect(`/login?error=${error}`);

  // por si falla la redireccion
  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <div className='block max-w-sm p-6 text-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
        <h5 className='flex flex-row items-center justify-center gap-2 mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Something went wrong
        </h5>
        <div className='font-normal text-gray-700 dark:text-gray-400'>
          {errorMap[error] || errorMap[Error.Default]} {/* Display appropriate error message */}
        </div>
      </div>
    </div>
  );
}
