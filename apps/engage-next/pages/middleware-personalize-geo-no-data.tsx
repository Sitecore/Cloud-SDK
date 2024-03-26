// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { PersonalizeGeo } from '../components/PersonalizeGeo';

export default function MiddlewarePersonalizeGeoOmit() {
  return (
    <PersonalizeGeo 
      pageTitle="Middleware Personalize Geo No Data" 
      buttonText='Request Personalize from Middleware With Geo No Data'
    />
  );
}

