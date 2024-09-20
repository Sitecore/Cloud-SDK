import { identity } from '@sitecore-cloudsdk/events/browser';
import { FormEvent, useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resetMessages = () => {
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 3000);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await identity({ email, identifiers: [{ provider: 'email', id: email }] });

      if (!response) {
        throw new Error('Something went wrong. Please try again later.');
      }

      setSuccessMessage('You have successfully subscribed to our newsletter.');
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
      else setErrorMessage(error as string);
    } finally {
      setEmail('');
      setIsLoading(false);
      resetMessages();
    }
  };

  return (
    <div className='bg-white max-w-lg mx-auto p-6 rounded-lg shadow-md mb-12'>
      <h2 className='text-2xl font-bold mb-4'>Subscribe to our Newsletter</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-gray-700 mb-2'>
            Email address
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder='Enter your email'
            required
            disabled={isLoading}
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 '
          disabled={isLoading}>
          Subscribe
        </button>
        {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
        {successMessage && <p className='text-green-500 mt-2'>{successMessage}</p>}
      </form>
    </div>
  );
}
