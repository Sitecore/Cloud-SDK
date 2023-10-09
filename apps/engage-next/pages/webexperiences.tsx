import Link from 'next/link';

export function WebExperiences() {
  return (
    <div>
      <main>
        <h1 data-testid='webExperiencesPageTitle'>Web Experiences Page</h1>
        <h4 style={{ padding: '0 32px' }}>Out of the box templates</h4>
        <fieldset>
          <ol>
            <li>
              <Link href='/templates/alert-bar'>Alert Bar</Link>
            </li>
            <li>
              <Link href='/templates/corner-popup'>Corner Popup</Link>
            </li>
            <li>
              <Link href='/templates/email-capture-bar'>Email Capture Bar</Link>
            </li>
            <li>
              <Link href='/templates/email-capture-corner'>Email Capture Corner</Link>
            </li>
            <li>
              <Link href='/templates/notification-widget'>Notification Widget</Link>
            </li>
            <li>
              <Link href='/templates/popup-takeover'>Popup takeover</Link>
            </li>
            <li>
              <Link href='/templates/sidebar'>Sidebar</Link>
            </li>
          </ol>
        </fieldset>
      </main>
    </div>
  );
}

export default WebExperiences;
