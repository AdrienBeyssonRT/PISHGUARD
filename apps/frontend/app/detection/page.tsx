type DetectionStats = {
  analyzed: number;
  safe: number;
  suspicious: number;
  phishing: number;
};

type DetectionEvent = {
  id: number;
  recipientEmail: string;
  subject: string;
  score: number;
  verdict: string;
  createdAt: string;
};

async function fetchStats(): Promise<DetectionStats> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/detection/stats?range=today`,
    {
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    return { analyzed: 0, safe: 0, suspicious: 0, phishing: 0 };
  }

  return res.json();
}

async function fetchEvents(): Promise<{ items: DetectionEvent[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/detection/events?limit=50`,
    {
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    return { items: [] };
  }

  return res.json();
}

export default async function DetectionPage() {
  const [stats, eventsData] = await Promise.all([fetchStats(), fetchEvents()]);
  const events = eventsData.items;

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'PHISHING':
        return 'text-red-400';
      case 'SUSPICIOUS':
        return 'text-amber-400';
      default:
        return 'text-emerald-400';
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'PHISHING':
        return 'bg-red-500/10 border-red-500/40 text-red-300';
      case 'SUSPICIOUS':
        return 'bg-amber-500/10 border-amber-500/40 text-amber-300';
      default:
        return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300';
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Détection en temps réel
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Analyse des emails entrants et détection des tentatives de phishing.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Analysés aujourd&apos;hui</p>
            <p className="text-2xl font-semibold">{stats.analyzed}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Sûrs</p>
            <p className="text-2xl font-semibold text-emerald-400">{stats.safe}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Suspects</p>
            <p className="text-2xl font-semibold text-amber-400">{stats.suspicious}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Phishing</p>
            <p className="text-2xl font-semibold text-red-400">{stats.phishing}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold mb-4">Événements récents</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="text-left py-3 px-4">Date/Heure</th>
                  <th className="text-left py-3 px-4">Destinataire</th>
                  <th className="text-left py-3 px-4">Sujet</th>
                  <th className="text-right py-3 px-4">Score</th>
                  <th className="text-right py-3 px-4">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Aucun événement détecté aujourd&apos;hui.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-slate-850/70 last:border-b-0 hover:bg-slate-900/50 transition"
                    >
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(event.createdAt).toLocaleString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {event.recipientEmail}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{event.subject}</td>
                      <td className={`py-3 px-4 text-right font-medium ${getVerdictColor(event.verdict)}`}>
                        {event.score}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase ${getVerdictBadge(event.verdict)}`}
                        >
                          {event.verdict}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

