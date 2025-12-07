import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="w-full border-b border-slate-800">
        <div className="mx-auto max-w-6xl flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-500 flex items-center justify-center text-sm font-bold">
              PG
            </div>
            <span className="font-semibold tracking-tight">PhishGuard</span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <a href="#features" className="hover:text-slate-50 transition">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-slate-50 transition">Tarifs</a>
            <a href="#how-it-works" className="hover:text-slate-50 transition">Comment ça marche</a>

            <div className="h-6 w-px bg-slate-700" />

            <Link
              href="/login"
              className="text-slate-200 hover:text-slate-50 text-sm"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm rounded-full border border-sky-500 px-4 py-1.5 hover:bg-sky-500 hover:text-slate-950 transition"
            >
              Essai gratuit
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/50 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Phishing Simulator + Détection temps réel
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              Protégez vos équipes du phishing
              <span className="block text-sky-400">en moins de 5 minutes.</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-xl">
              PhishGuard combine simulations de phishing et analyse en temps réel de vos emails
              pour sensibiliser vos collaborateurs et bloquer les tentatives suspectes,
              sans installation complexe.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400 transition"
              >
                Démarrer l&apos;essai gratuit
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-2.5 text-sm text-slate-200 hover:bg-slate-900 transition"
              >
                Voir comment ça marche
              </a>
            </div>

            <div className="flex items-center gap-4 pt-4 text-xs text-slate-400">
              <span>Essai 14 jours • Sans carte bancaire</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>Hébergement UE • RGPD by design</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-4 h-24 w-24 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute bottom-0 -left-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950/70 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Campagne de sensibilisation
                  </p>
                  <p className="text-sm font-semibold">Phishing – Avril 2025</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300">
                  Risque moyen : -32%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3">
                  <p className="text-slate-400">Ouvertures</p>
                  <p className="mt-1 text-lg font-semibold">76%</p>
                  <p className="mt-1 text-[11px] text-emerald-300">+8 pts vs dernière campagne</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3">
                  <p className="text-slate-400">Clics</p>
                  <p className="mt-1 text-lg font-semibold text-amber-300">18%</p>
                  <p className="mt-1 text-[11px] text-amber-300">En baisse, continuez !</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3">
                  <p className="text-slate-400">Soumissions</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-300">2%</p>
                  <p className="mt-1 text-[11px] text-emerald-300">Objectif presque atteint</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
                <p className="mb-2 text-slate-300 font-medium">Détection en temps réel</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      142 emails analysés aujourd&apos;hui
                    </span>
                    <span className="text-slate-400">100% livré</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      6 e-mails suspects
                    </span>
                    <span className="text-slate-400">3 signalés par les employés</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      1 tentative de phishing bloquée
                    </span>
                    <span className="text-slate-400">Aucune compromission</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-950 border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-3 text-sm">
          <div>
            <h2 className="text-base font-semibold mb-2">Simulations réalistes</h2>
            <p className="text-slate-300">
              Créez en quelques clics des campagnes de phishing contrôlées pour tester
              et sensibiliser vos équipes en continu.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold mb-2">Détection en temps réel</h2>
            <p className="text-slate-300">
              Analyse des emails entrants, score de risque, alertes aux utilisateurs
              et rapports pour vos responsables.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold mb-2">Pensé pour les PME</h2>
            <p className="text-slate-300">
              Tarifs transparents, interface simple, intégration avec Google Workspace
              et Microsoft 365 en quelques minutes.
            </p>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="border-t border-slate-800 bg-slate-950 py-12"
      >
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-semibold mb-6">Tarifs simples et transparents</h2>
          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs uppercase text-slate-400 mb-1">Starter</p>
              <p className="text-2xl font-semibold mb-1">Gratuit</p>
              <p className="text-slate-300 mb-4">Pour tester en interne.</p>
              <ul className="space-y-1.5 text-slate-300 mb-4">
                <li>• Jusqu&apos;à 10 collaborateurs</li>
                <li>• 1 campagne / mois</li>
                <li>• Détection limitée</li>
              </ul>
              <Link
                href="/register"
                className="inline-flex rounded-full border border-slate-700 px-4 py-2 text-xs hover:bg-slate-900"
              >
                Commencer
              </Link>
            </div>

            <div className="rounded-3xl border border-sky-500 bg-slate-900/90 p-5 relative overflow-hidden">
              <span className="absolute right-3 top-3 rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] text-sky-200">
                Le plus populaire
              </span>
              <p className="text-xs uppercase text-slate-400 mb-1">Pro</p>
              <p className="text-2xl font-semibold mb-1">79 € / mois</p>
              <p className="text-slate-300 mb-4">Pour sécuriser toute votre PME.</p>
              <ul className="space-y-1.5 text-slate-300 mb-4">
                <li>• Jusqu&apos;à 200 collaborateurs</li>
                <li>• Campagnes illimitées</li>
                <li>• Détection temps réel Gmail / O365</li>
                <li>• Rapports PDF et export</li>
              </ul>
              <Link
                href="/register"
                className="inline-flex rounded-full bg-sky-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400"
              >
                Essai gratuit 14 jours
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs uppercase text-slate-400 mb-1">Entreprise</p>
              <p className="text-2xl font-semibold mb-1">Sur mesure</p>
              <p className="text-slate-300 mb-4">Pour les structures exigeantes.</p>
              <ul className="space-y-1.5 text-slate-300 mb-4">
                <li>• +200 collaborateurs</li>
                <li>• Onboarding dédié</li>
                <li>• Support prioritaire</li>
                <li>• Intégrations avancées</li>
              </ul>
              <a
                href="mailto:contact@phishguard.io"
                className="inline-flex rounded-full border border-slate-700 px-4 py-2 text-xs hover:bg-slate-900"
              >
                Parler à un expert
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PhishGuard. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Mentions légales</a>
            <a href="#" className="hover:text-slate-300">Politique de confidentialité</a>
          </div>
        </div>
      </footer>
    </main>
  );
}


