// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { IdentityData, identity } from '@sitecore-cloudsdk/events/browser';
import { getParamsFromUrl } from '../utils/getParamsFromUrl';

export default function Identity() {
  const handleSubmit = (eventTrigger: React.FormEvent<HTMLFormElement>) => {
    eventTrigger.preventDefault();

    interface FormData {
      city: HTMLInputElement;
      country: HTMLInputElement;
      email: HTMLInputElement;
      firstname: HTMLInputElement;
      gender: HTMLInputElement;
      lastname: HTMLInputElement;
      mobile: HTMLInputElement;
      phone: HTMLInputElement;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      postal_code: HTMLInputElement;
      state: HTMLInputElement;
      street: HTMLInputElement;
      title: HTMLInputElement;
      dob: HTMLInputElement;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expiry_date: HTMLInputElement;
    }

    const formData = eventTrigger.target as HTMLFormElement & FormData;

    // Get data from the form.
    const data: IdentityData = {
      channel: 'WEB',
      city: formData.city.value,
      country: formData.country.value,
      currency: 'EUR',
      email: formData.email.value,
      firstName: formData.firstname.value,
      gender: formData.gender.value,
      identifiers: [
        {
          id: formData.email.value,
          provider: 'email'
        }
      ],
      language: 'EN',
      lastName: formData.lastname.value,
      mobile: formData.mobile.value,
      phone: formData.phone.value,
      postalCode: formData.postal_code.value,
      state: formData.state.value,
      street: formData.street.value ? [formData.street.value] : [],
      title: formData.title.value
    };

    if (formData.dob.value !== '') {
      data.dob = formData.dob.value;
    }

    if (formData.expiry_date.value !== '') {
      data.identifiers[0].expiryDate = formData.expiry_date.value;
    }
    const identityData = { ...data, banana: null };
    identity(identityData);
  };

  const sendIdentityWithEmptyExt = () => {
    const identityData: IdentityData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test@test.com',
      identifiers: [{ id: 'test', provider: 'email' }],
      language: 'EN',
      extensionData: {}
    };

    identity(identityData);
  };

  const sendIdentityWithoutExtObject = () => {
    const identityData: IdentityData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test@test.com',
      identifiers: [{ id: 'test', provider: 'email' }],
      language: 'EN'
    };

    identity(identityData);
  };

  const sendIdentityWithExtObject = () => {
    const eventAttributes = new URLSearchParams(window.location.search);
    const extensionDataNested = JSON.parse(eventAttributes.get('nested') || '') || {};

    eventAttributes.delete('nested');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extensionDataExt: any = {};
    if (extensionDataNested && Object.keys(extensionDataNested).length)
      extensionDataExt.nested = { ...extensionDataNested };

    eventAttributes.forEach((value, key) => {
      extensionDataExt[key as keyof typeof extensionDataExt] = value;
    });

    const identityData: IdentityData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test@test.com',
      identifiers: [{ id: 'test', provider: 'email' }],
      language: 'EN',
      extensionData: extensionDataExt
    };

    identity(identityData);
  };

  const sendRequestToNextApi = () => {
    const email = getParamsFromUrl('email') ?? 'test@test.com';
    fetch(`/api/identity-event?email=${email}`);
  };

  return (
    <div>
      <h1 data-testid='identityEventPageTitle'>Send Identity Event Page</h1>

      <div
        style={{
          border: '1px solid black',
          marginLeft: '15px',
          padding: 20,
          width: 400
        }}>
        {/* We pass the event to the handleSubmit() function on submit. */}
        <form
          data-testid='identity-form'
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            id='email'
            data-testid='email'
            name='email'
          />
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            id='title'
            data-testid='title'
            name='title'
          />
          <label htmlFor='firstname'>First Name</label>
          <input
            type='text'
            id='firstname'
            data-testid='firstname'
            name='firstname'
          />
          <label htmlFor='lastname'>Last Name</label>
          <input
            type='text'
            id='lastname'
            data-testid='lastname'
            name='lastname'
          />

          <label htmlFor='gender'>Gender</label>
          <select
            id='gender'
            data-testid='gender'
            name='gender'>
            <option value=''> </option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
          <br></br>

          <label htmlFor='dob'>Date of Birth</label>
          <input
            type='text'
            id='dob'
            data-testid='dob'
            name='dob'
          />

          <label htmlFor='mobile'>Mobile</label>
          <input
            type='tel'
            id='mobile'
            data-testid='mobile'
            name='mobile'
          />

          <label htmlFor='phone'>Phone</label>
          <input
            type='tel'
            id='phone'
            data-testid='phone'
            name='phone'
          />

          <label htmlFor='street'>Street Name</label>
          <input
            type='text'
            id='street'
            data-testid='street'
            name='street'
          />

          <label htmlFor='city'>City Name</label>
          <input
            type='text'
            id='city'
            data-testid='city'
            name='city'
          />

          <label htmlFor='state'>State Name</label>
          <input
            type='text'
            id='state'
            data-testid='state'
            name='state'
          />

          <label htmlFor='country'>Country Name</label>
          <select
            id='country'
            data-testid='country'
            name='country'>
            <option value=''> </option>
            <option value='GR'>Greece</option>
          </select>

          <label htmlFor='postal_code'>Postal Code</label>
          <input
            type='text'
            id='postal_code'
            data-testid='postal_code'
            name='postal_code'
          />

          <label htmlFor='expiry_date'>Expiry Date</label>
          <input
            type='text'
            id='expiry_date'
            data-testid='expiry_date'
            name='expiry_date'
          />

          <button
            type='submit'
            data-testid='sendIdentityEvent'>
            Submit
          </button>
        </form>
        <button
          data-testid='sendIdentityWithEmptyExt'
          onClick={sendIdentityWithEmptyExt}>
          Send Identity with empty ext
        </button>
        <button
          data-testid='sendIdentityWithoutExtObject'
          onClick={sendIdentityWithoutExtObject}>
          Send Identity without ext object
        </button>
        <button
          data-testid='sendIdentityWithExtObject'
          onClick={sendIdentityWithExtObject}>
          Send Identity with ext object
        </button>
        <button
          type='button'
          data-testid='sendEventFromServer'
          onClick={sendRequestToNextApi}>
          Send Identity from server via API route
        </button>
      </div>
    </div>
  );
}
