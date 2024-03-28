// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { useState } from 'react';
import { event } from '@sitecore-cloudsdk/events/browser';

export function CustomEvent() {
  let eventData = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'customevent',
  };

  const [type, setType] = useState('');
  const [ext, setExt] = useState('');
  const [topLevelAttributes, setTopLevelAttributes] = useState('');
  const [numberOfExtAttr, setNumberOfExtAttr] = useState('');

  let extensionData: Record<`key${string}`, string> = {};

  const getExtObject = (ext: string, numberofAttr: string) => {
    for (let i = 0; i <= +numberofAttr - 1; i++) {
      extensionData[`key${i}`] = `value${i}`;
    }
    if (ext) extensionData = { ...extensionData, ...JSON.parse(ext) };

    return extensionData;
  };

  const sendEvent = () => {
    if (topLevelAttributes) eventData = { ...eventData, ...JSON.parse(topLevelAttributes) };
    extensionData = getExtObject(ext, numberOfExtAttr);

    event({ ...eventData, type, extensionData });
  };

  const sendRequestToNextApi = () => {
    fetch(`/api/custom-event`);
  };
  return (
    <div>
      <h1 data-testid='customEventPageTitle'>Custom Event Page</h1>
      <label htmlFor='type'>type:</label>
      <input
        type='text'
        id='type'
        data-testid='type'
        name='type'
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <p></p>
      <label htmlFor='topLevelAttributes'>topLevelAttributes (json):</label>
      <input
        type='text'
        id='topLevelAttributes'
        data-testid='topLevelAttributes'
        name='topLevelAttributes'
        value={topLevelAttributes}
        onChange={(e) => setTopLevelAttributes(e.target.value)}
      />
      <p></p>
      <label htmlFor='ext'> ext (json):</label>
      <input
        type='text'
        id='ext'
        data-testid='ext'
        name='ext'
        value={ext}
        onChange={(e) => setExt(e.target.value)}
      />
      <p></p>
      <label htmlFor='numberOfExtAttr'> generate multiple ext attributes:</label>
      <input
        type='text'
        id='numberOfExtAttr'
        data-testid='numberOfExtAttr'
        name='numberOfExtAttr'
        value={numberOfExtAttr}
        onChange={(e) => setNumberOfExtAttr(e.target.value)}
      />
      <p></p>
      <div>
        <button
          data-testid='sendEvent'
          onClick={sendEvent}>
          Send Event
        </button>
        <button
          data-testid='sendEventFromServer'
          onClick={sendRequestToNextApi}>
          Send Event from server
        </button>
      </div>
    </div>
  );
}

export default CustomEvent;
