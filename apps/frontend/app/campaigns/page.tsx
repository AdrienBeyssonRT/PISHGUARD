type Campaign = {
  id: number;
  name: string;
  status: string;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
  totalTargets: number;
  openRate: number;
  clickRate: number;
  submitRate: number;
};

async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/campaigns`,
    {
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    throw new Error('Impossible de récupérer les campagnes');
  }

  return res.json();
}

export default async function CampaignsPage() {
  const campaigns = await fetchCampaigns();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Campagnes
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Gérez vos campagnes de sensibilisation au phishing.
            </p>
          </div>
          <a
            href="/campaigns/new"
            className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 transition"
          >
            Nouvelle campagne
          </a>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="text-left py-3 px-4">Nom</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Cibles</th>
                  <th className="text-right py-3 px-4">Ouvertures</th>
                  <th className="text-right py-3 px-4">Clics</th>
                  <th className="text-right py-3 px-4">Soumissions</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Aucune campagne. Créez-en une pour commencer.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b border-slate-850/70 last:border-b-0 hover:bg-slate-900/50 transition"
                    >
                      <td className="py-3 px-4 font-medium">{campaign.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {campaign.totalTargets}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {Math.round(campaign.openRate * 100)}%
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {Math.round(campaign.clickRate * 100)}%
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {Math.round(campaign.submitRate * 100)}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`/campaigns/${campaign.id}`}
                          className="text-[11px] text-sky-400 hover:text-sky-300"
                        >
                          Voir →
                        </a>
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


