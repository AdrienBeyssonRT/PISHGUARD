type OverviewStats = {
  organizationId: number;
  totalEmployees: number;
  totalCampaigns: number;
  runningCampaigns: number;
  lastCampaign: {
    id: number;
    name: string;
    startAt: string | null;
    endAt: string | null;
    openRate: number;
    clickRate: number;
    submitRate: number;
  } | null;
  detectionToday: {
    analyzed: number;
    safe: number;
    suspicious: number;
    phishing: number;
  };
  trendLast30Days: {
    date: string;
    analyzed: number;
    suspicious: number;
    phishing: number;
  }[];
};

async function fetchOverview(): Promise<OverviewStats> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/stats/overview`,
    {
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    throw new Error('Impossible de récupérer les statistiques');
  }

  return res.json();
}

export default async function DashboardPage() {
  const stats = await fetchOverview();

  const lastCampaign = stats.lastCampaign;
  const today = stats.detectionToday;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Vue d&apos;ensemble de la sensibilisation et de la détection
              phishing pour votre organisation.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Collaborateurs</p>
            <p className="text-2xl font-semibold">{stats.totalEmployees}</p>
            <p className="text-xs text-slate-500 mt-2">
              Suivis dans les campagnes de sensibilisation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Campagnes</p>
            <p className="text-2xl font-semibold">{stats.totalCampaigns}</p>
            <p className="text-xs text-slate-500 mt-2">
              {stats.runningCampaigns} en cours actuellement.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">
              E-mails analysés aujourd&apos;hui
            </p>
            <p className="text-2xl font-semibold">{today.analyzed}</p>
            <p className="text-xs text-slate-500 mt-2">
              {today.suspicious} suspects • {today.phishing} phishing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Risque aujourd&apos;hui</p>
            <p className="text-2xl font-semibold">
              {today.analyzed === 0
                ? '—'
                : `${Math.round(
                    ((today.suspicious + today.phishing) / today.analyzed) * 100
                  )}%`}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Part d&apos;e-mails suspects/phishing sur le trafic.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase text-slate-400 mb-1">
                  Dernière campagne
                </p>
                <p className="text-sm font-semibold">
                  {lastCampaign ? lastCampaign.name : 'Aucune campagne'}
                </p>
              </div>
            </div>

            {lastCampaign ? (
              <>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3">
                    <p className="text-slate-400">Ouvertures</p>
                    <p className="mt-1 text-lg font-semibold">
                      {Math.round(lastCampaign.openRate * 100)}%
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3">
                    <p className="text-slate-400">Clics</p>
                    <p className="mt-1 text-lg font-semibold">
                      {Math.round(lastCampaign.clickRate * 100)}%
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3">
                    <p className="text-slate-400">Soumissions</p>
                    <p className="mt-1 text-lg font-semibold">
                      {Math.round(lastCampaign.submitRate * 100)}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Objectif : réduire progressivement le taux de clic et de
                  soumission sur les campagnes de test.
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400 mt-2">
                Vous n&apos;avez pas encore lancé de campagne de sensibilisation.
                Créez-en une pour commencer à mesurer le niveau de risque.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase text-slate-400 mb-1">
                  Détection – 30 derniers jours
                </p>
                <p className="text-sm font-semibold">
                  Volume & incidents par jour
                </p>
              </div>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto pr-1 text-xs">
              {stats.trendLast30Days.map((day) => {
                const total = day.analyzed || 1;
                const ratioSuspicious = day.suspicious / total;
                const ratioPhishing = day.phishing / total;

                const barTotal = 20;
                const barsSuspicious = Math.round(barTotal * ratioSuspicious);
                const barsPhishing = Math.round(barTotal * ratioPhishing);

                return (
                  <div
                    key={day.date}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="w-20 text-slate-400">
                      {day.date.slice(5)}
                    </span>
                    <div className="flex-1 flex items-center gap-1">
                      <div className="flex gap-[1px]">
                        <span className="inline-block text-[9px] leading-none text-amber-400">
                          {'■'.repeat(barsSuspicious)}
                        </span>
                        <span className="inline-block text-[9px] leading-none text-red-500">
                          {'■'.repeat(barsPhishing)}
                        </span>
                      </div>
                    </div>
                    <span className="w-16 text-right text-slate-400">
                      {day.analyzed}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              Chaque ligne représente une journée : volume total d&apos;emails
              analysés et proportion suspect/phishing.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

