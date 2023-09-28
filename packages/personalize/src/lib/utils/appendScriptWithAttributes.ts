// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export function appendScriptWithAttributes(attributes: IScriptAttributes) {
  const sdkScriptElement = document.createElement('script');

  sdkScriptElement.type = 'text/javascript';
  sdkScriptElement.src = attributes.src;
  sdkScriptElement.async = attributes.async;

  document.head.appendChild(sdkScriptElement);
}

interface IScriptAttributes {
  async: boolean;
  src: string;
}
