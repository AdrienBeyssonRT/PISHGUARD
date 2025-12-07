type CampaignDetail = {
  id: number;
  name: string;
  status: string;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
  updatedAt: string;
  templateName: string;
  stats: {
    totalTargets: number;
    sent: number;
    opened: number;
    clicked: number;
    submitted: number;
    openRate: number;
    clickRate: number;
    submitRate: number;
  };
};

async function fetchCampaign(id: string): Promise<CampaignDetail> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/campaigns/${id}`,
    {
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    throw new Error('Campagne non trouvée');
  }

  return res.json();
}

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const campaign = await fetchCampaign(params.id);
  const stats = campaign.stats;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {campaign.name}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Template: {campaign.templateName}
            </p>
          </div>
          <a
            href="/campaigns"
            className="text-sm text-slate-400 hover:text-slate-300"
          >
            ← Retour aux campagnes
          </a>
        </header>

        <section className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Envoyés</p>
            <p className="text-2xl font-semibold">{stats.sent}</p>
            <p className="text-xs text-slate-500 mt-2">
              sur {stats.totalTargets} cibles
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Ouvertures</p>
            <p className="text-2xl font-semibold">
              {Math.round(stats.openRate * 100)}%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {stats.opened} emails
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Clics</p>
            <p className="text-2xl font-semibold">
              {Math.round(stats.clickRate * 100)}%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {stats.clicked} emails
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400 mb-1">Soumissions</p>
            <p className="text-2xl font-semibold">
              {Math.round(stats.submitRate * 100)}%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {stats.submitted} emails
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold mb-4">Détails de la campagne</h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <p className="text-slate-400 mb-1">Statut</p>
              <p className="font-medium">{campaign.status}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Date de début</p>
              <p className="font-medium">
                {campaign.startAt
                  ? new Date(campaign.startAt).toLocaleDateString('fr-FR')
                  : 'Non définie'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Date de fin</p>
              <p className="font-medium">
                {campaign.endAt
                  ? new Date(campaign.endAt).toLocaleDateString('fr-FR')
                  : 'Non définie'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Créée le</p>
              <p className="font-medium">
                {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


