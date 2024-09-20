export function Footer() {
  return (
    <footer className='text-slate-500 py-6'>
      <nav className='flex justify-center space-x-4'>
        <a
          href='#home'
          className='hover:underline'>
          My account
        </a>
        <a
          href='#about'
          className='hover:underline'>
          Cart
        </a>
        <a
          href='#about'
          className='hover:underline'>
          Privacy
        </a>
        <a
          href='#about'
          className='hover:underline'>
          Terms
        </a>
      </nav>
      <div className='text-center mt-2'>
        Sitecore Cloud SDK Next.js Example – Sitecore &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
}
