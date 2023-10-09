// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { useEvents } from '../context/events';

export function FormEvent() {
  const events = useEvents();

  const getParamsFromUrl = (parameter: string) => {
    return new URLSearchParams(window.location.search).get(parameter);
  };

  const sendEvent = async () => {
    const formId = getParamsFromUrl('formId') ?? '';
    const interactionType = getParamsFromUrl('interactionType') as unknown as 'VIEWED' | 'SUBMITTED';
    const pointOfSale = getParamsFromUrl('pointOfSale') || undefined;

    await events?.form(formId, interactionType, pointOfSale);
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

export default FormEvent;
