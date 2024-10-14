'use server';

import { signIn } from '@/auth.js';

export async function googleSignIn() {
  await signIn('google');
}
