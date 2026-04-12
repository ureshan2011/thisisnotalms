import { ListChecks } from 'lucide-react';
import Layout, { PageHeader } from '../../components/layout/Layout';

export default function EventLog() {
  return (
    <Layout>
      <PageHeader
        title="Event Log"
        subtitle="Event logging has been disabled to reduce Firebase usage."
      />

      <div className="overflow-hidden rounded-3xl" style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(139,92,246,0.10)' }}>
        <div className="p-14 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
          <ListChecks size={20} />
          Event log storage and database reads are disabled.
        </div>
      </div>
    </Layout>
  );
}
