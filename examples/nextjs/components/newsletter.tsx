export function Newsletter() {
  return (
    <div className='bg-white max-w-lg mx-auto p-6 rounded-lg shadow-md mb-12'>
      <h2 className='text-2xl font-bold mb-4'>Subscribe to our Newsletter</h2>
      <form>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-gray-700 mb-2'>
            Email address
          </label>
          <input
            type='email'
            id='email'
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder='Enter your email'
            required
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600'>
          Subscribe
        </button>
      </form>
    </div>
  );
}
