'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/Auth';
import { identity } from '@sitecore-cloudsdk/events/browser';

export default function LoginPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy credentials
    const dummyUsername = 'sitecore';
    const dummyPassword = 'sitecore123';

    if (username === dummyUsername && password === dummyPassword) {
      // send an identity event
      await identity({
        language: 'EN',
        currency: 'EUR',
        channel: 'WEB',
        email: 'test@test.com',
        identifiers: [{ id: '1236783', provider: 'email' }]
      });

      login();
      router.push('/');
    } else {
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded shadow-md'>
        <h1 className='mb-6 text-2xl font-bold text-center'>Login</h1>
        <form
          onSubmit={handleLogin}
          className='space-y-4'>
          <div>
            <label
              htmlFor='username'
              className='block mb-2 text-sm font-medium text-gray-700'>
              Username
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='sitecore'
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block mb-2 text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='sitecore123'
            />
          </div>
          {error && <p className='text-sm text-red-500'>{error}</p>}
          <button
            type='submit'
            className='w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
