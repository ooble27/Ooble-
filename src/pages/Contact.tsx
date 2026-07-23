import { useState } from "react";
import { Mail, Clock, MessageSquare, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ContactArt } from "@/components/illustrations";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-[13px] font-medium text-muted-foreground">{label}</span>
    {children}
  </label>
);

const inputCls =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-foreground/40";

const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="app-type min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-[1120px] px-6 sm:px-8">
        <section className="grid items-start gap-10 pb-16 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:pt-16">
          {/* Colonne info + illustration */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Contact
            </span>
            <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.2rem]">
              Parlons-<span className="text-primary">en.</span>
            </h1>
            <p className="mt-4 max-w-md text-[16px] font-light leading-relaxed text-muted-foreground">
              Une question sur un ordre, un gros volume, la conformité ? Écrivez-nous — on répond vite.
            </p>

            <div className="mt-8 space-y-3">
              {[
                { icon: Mail, title: "E-mail", value: "support@ooble.ca" },
                { icon: Clock, title: "Délai de réponse", value: "Sous quelques heures, 7 j/7" },
                { icon: MessageSquare, title: "Langues", value: "Français · English" },
              ].map(({ icon: Icon, title, value }) => (
                <div key={title} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="text-[12px] text-muted-foreground">{title}</p>
                    <p className="text-[14px] font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <ContactArt className="mt-6 hidden w-full max-w-[380px] lg:block" />
          </div>

          {/* Formulaire */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Check className="h-7 w-7" />
                </span>
                <h2 className="mt-4 font-display text-[20px] font-semibold">Message envoyé</h2>
                <p className="mt-1 max-w-xs text-[14px] font-light text-muted-foreground">
                  Merci ! Nous revenons vers vous très vite à l'adresse indiquée.
                </p>
                <Button variant="secondary" shape="rounded" className="mt-6" onClick={() => setSent(false)}>
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nom"><input required className={inputCls} placeholder="Votre nom" /></Field>
                  <Field label="E-mail"><input required type="email" className={inputCls} placeholder="vous@exemple.ca" /></Field>
                </div>
                <Field label="Sujet">
                  <select className={inputCls} defaultValue="">
                    <option value="" disabled>Choisir un sujet</option>
                    <option>Achat / Vente</option>
                    <option>Suivi d'un ordre</option>
                    <option>Gros volume (OTC)</option>
                    <option>Conformité / KYC</option>
                    <option>Autre</option>
                  </select>
                </Field>
                <Field label="Message">
                  <textarea required rows={5} className={`${inputCls} resize-none`} placeholder="Comment pouvons-nous aider ?" />
                </Field>
                <Button type="submit" variant="primary" shape="rounded" size="lg" className="w-full">
                  Envoyer le message <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-center text-[12px] font-light text-muted-foreground">
                  Ou écrivez directement à <Link to="/faq" className="text-foreground underline">la FAQ</Link> pour une réponse immédiate.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
