import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock, Handshake, Mail, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ContactArt } from "@/components/illustrations";

const facts = [
  { icon: Mail, k: "Courriel", v: "support@ooble.ca" },
  { icon: Clock, k: "Délai de réponse", v: "Sous quelques heures, 7 j/7" },
  { icon: MessageSquare, k: "Langues", v: "Français · English" },
  { icon: Handshake, k: "Gros volumes", v: "Desk OTC dédié" },
];

const subjects = [
  "Achat / Vente",
  "Suivi d'un ordre",
  "Gros volume (OTC)",
  "Conformité / KYC",
  "Autre",
];

const fieldCls =
  "w-full rounded-xl border border-border bg-card px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-foreground/40";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-2 block text-[13px] text-muted-foreground">{label}</span>
    {children}
  </label>
);

const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="ink-neutral app-type min-h-screen bg-background tracking-[-0.015em]">
      <Header />

      <main className="mx-auto max-w-[1200px] px-6 sm:px-10">
        {/* Titre */}
        <section className="grid items-center gap-10 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
          <div>
            <p className="text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
              Contact
            </p>
            <h1 className="mt-5 font-display text-[2.7rem] leading-[0.98] tracking-[-0.05em] sm:text-[3.8rem] lg:text-[4.5rem]">
              Écrivez-nous.
              <br />
              <span className="text-foreground/35">On répond vite.</span>
            </h1>
          </div>
          <ContactArt className="mx-auto hidden w-full max-w-[360px] lg:block" aria-hidden />
        </section>

        {/* Coordonnées */}
        <section className="pt-14 lg:pt-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ icon: Icon, k, v }) => (
              <div key={k} className="flex items-start gap-4 border-t py-6 pr-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] text-muted-foreground">{k}</p>
                  <p className="mt-1 font-display text-[15px] tracking-[-0.02em]">{v}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Formulaire */}
        <section className="pt-16 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-[1.9rem] leading-[1.06] tracking-[-0.04em] sm:text-[2.4rem]">
                Une question ?
              </h2>
              <p className="mt-5 max-w-[340px] text-[15px] leading-[1.6] text-muted-foreground">
                Un ordre en cours, un gros volume, la conformité — dites-nous ce
                dont vous avez besoin.
              </p>
              <p className="mt-6 text-[14px] text-muted-foreground">
                Réponse plus rapide ?{" "}
                <Link to="/faq" className="text-foreground underline underline-offset-2">
                  Consultez la FAQ
                </Link>
                .
              </p>
            </div>

            <div className="border-t pt-8">
              {sent ? (
                <div className="py-10 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background">
                    <Check className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-6 font-display text-[1.4rem] tracking-[-0.03em]">
                    Message envoyé
                  </h3>
                  <p className="mx-auto mt-3 max-w-[320px] text-[15px] leading-[1.6] text-muted-foreground">
                    Merci. Nous revenons vers vous très vite à l'adresse indiquée.
                  </p>
                  <Button
                    variant="secondary"
                    shape="rounded"
                    size="lg"
                    className="mt-8 text-[16px]"
                    onClick={() => setSent(false)}
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Nom">
                      <input required className={fieldCls} placeholder="Votre nom" />
                    </Field>
                    <Field label="Courriel">
                      <input required type="email" className={fieldCls} placeholder="vous@exemple.ca" />
                    </Field>
                  </div>
                  <Field label="Sujet">
                    <select className={fieldCls} defaultValue="">
                      <option value="" disabled>
                        Choisir un sujet
                      </option>
                      {subjects.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Message">
                    <textarea
                      required
                      rows={6}
                      className={`${fieldCls} resize-none`}
                      placeholder="Comment pouvons-nous aider ?"
                    />
                  </Field>
                  <Button
                    type="submit"
                    variant="appSolid"
                    shape="rounded"
                    size="lg"
                    className="w-full text-[16px]"
                  >
                    Envoyer le message <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>

        <div className="pt-16" />
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
