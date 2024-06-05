import { form } from '@sitecore-cloudsdk/events/browser';

export default function FormEvent() {
  const getParamsFromUrl = (parameter: string) => {
    return new URLSearchParams(window.location.search).get(parameter);
  };

  const sendEvent = async () => {
    const formId = getParamsFromUrl('formId') ?? '';
    const interactionType = getParamsFromUrl('interactionType') as unknown as 'VIEWED' | 'SUBMITTED';

    await form(formId, interactionType);
  };

  return (
    <div>
      <h1 data-testid='formEventPageTitle'>Send form event</h1>
      <button
        data-testid='sendFormEvent'
        onClick={sendEvent}>
        Send form event
      </button>
    </div>
  );
}
