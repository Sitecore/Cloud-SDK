'use client';

import { useCart } from '../context/Cart';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/Auth';

export function Header() {
  const { isLoggedIn, logout } = useAuth();

  const cart = useCart();
  const router = useRouter();
  const accountDialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      router.push(`/search?q=${query}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className='shadow-sm'>
      <dialog
        ref={accountDialogRef}
        className='p-14 rounded-xl'>
        Please sign in to continue.
        <button
          onClick={() => accountDialogRef.current?.close()}
          className='absolute top-3 right-4 text-3xl text-red-500'>
          &times;
        </button>
      </dialog>
      <header className='container mx-auto flex justify-between items-center p-4'>
        <div>
          <Link href='/'>
            <Image
              src='https://delivery-sitecore.sitecorecontenthub.cloud/api/public/content/logo-sitecore?t=sc42h'
              alt='Logo'
              height={29}
              width={150}
              priority
            />
          </Link>
        </div>
        <div className='flex gap-x-4'>
          <div className='relative w-[15rem]'>
            <input
              id='search'
              onKeyDown={handleKeyDown}
              onChange={(e) => setQuery(e.target.value)}
              type='text'
              className='border border-gray-300 rounded-xl px-3 py-2 w-full'
              placeholder='Search'
            />
            <svg
              className='absolute top-2 right-3 text-gray-400'
              xmlns='http://www.w3.org/2000/svg'
              width='25'
              height='25'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='#2c3e50'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path
                stroke='none'
                d='M0 0h24v24H0z'
                fill='none'
              />
              <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
              <path d='M21 21l-6 -6' />
            </svg>
          </div>

          <nav>
            <ul className='flex space-x-4 items-center'>
              {isLoggedIn ? (
                <>
                  <li>
                    <button
                      onClick={handleLogout}
                      className='flex hover:bg-slate-50 rounded-xl px-3 py-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='25'
                        height='25'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'>
                        <path
                          stroke='none'
                          d='M0 0h24v24H0z'
                          fill='none'
                        />
                        <path d='M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2' />
                        <path d='M15 12h-12l3 -3' />
                        <path d='M6 15l-3 -3' />
                      </svg>
                      &nbsp; Sign out
                    </button>
                  </li>
                  <div className='text-slate-200'>/</div>
                  <li>
                    <button
                      onClick={() => cart.openSidebar()}
                      className='flex hover:bg-slate-50 rounded-xl px-3 py-2'>
                      {cart.calculateTotalItems() > 0 && (
                        <span className='bg-red-600 ml-1 mr-3 text-white text-xs my-auto w-5 h-5 flex items-center justify-center rounded-full'>
                          {cart.calculateTotalItems()}
                        </span>
                      )}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='25'
                        height='25'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='#2c3e50'
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'>
                        <path
                          stroke='none'
                          d='M0 0h24v24H0z'
                          fill='none'
                        />
                        <path d='M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
                        <path d='M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
                        <path d='M17 17h-11v-14h-2' />
                        <path d='M6 5l14 1l-1 7h-13' />
                      </svg>{' '}
                      &nbsp; Cart
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={() => router.push('/login')}
                    className='flex hover:bg-slate-50 rounded-xl px-3 py-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='25'
                      height='25'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='#2c3e50'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'>
                      <path
                        stroke='none'
                        d='M0 0h24v24H0z'
                        fill='none'
                      />
                      <path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0' />
                      <path d='M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2' />
                    </svg>{' '}
                    &nbsp; Sign in
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
