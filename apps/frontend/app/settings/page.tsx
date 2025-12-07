export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        <header>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Paramètres
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gérez les paramètres de votre organisation.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold mb-4">Organisation</h2>
          <p className="text-slate-400 text-sm">
            Les paramètres d&apos;organisation seront disponibles prochainement.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold mb-4">Employés</h2>
          <a
            href="/settings/employees"
            className="text-sm text-sky-400 hover:text-sky-300"
          >
            Gérer les employés →
          </a>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold mb-4">Intégrations</h2>
          <p className="text-slate-400 text-sm">
            Les intégrations Gmail/Microsoft 365 seront disponibles prochainement.
          </p>
        </section>
      </div>
    </main>
  );
}


