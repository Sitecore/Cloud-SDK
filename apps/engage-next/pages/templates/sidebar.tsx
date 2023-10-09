import TemplatesHeader from '../../components/TemplatesHeader';

export default function Sidebar() {
  return (
    <main style={{ padding: 32 }}>
      <TemplatesHeader
        prev='/templates/popup-takeover'
        next='/templates/alert-bar'
      />
      <h4>7. Sidebar</h4>
    </main>
  );
}
