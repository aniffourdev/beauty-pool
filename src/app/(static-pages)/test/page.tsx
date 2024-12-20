// app/page.tsx
"use client";
import { signIn, signOut, useSession, SessionProvider } from 'next-auth/react';

export default function Home() {
  return (
    <SessionProvider>
      <SessionComponent />
    </SessionProvider>
  );
}

function SessionComponent() {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      ) : (
        <div>
          <p>Welcome, {session.user?.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
    </div>
  );
}
