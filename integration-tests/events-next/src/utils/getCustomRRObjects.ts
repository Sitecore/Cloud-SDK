import { cookies } from 'next/headers';

export function getCustomRRObjects() {
  const cookiesList = cookies();

  const cookieValue = cookiesList
    .getAll()
    .map((cookie) => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join('; ');

  const request = {
    headers: {
      cookie: cookieValue
    }
  };

  const response = {
    // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
    setHeader: (_: string, __: string) => {}
  };

  return { request, response };
}
