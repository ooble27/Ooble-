import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RATE_LOCK_MINUTES } from "@/lib/rates";
import { OOBLE_INTERAC_EMAIL } from "@/lib/config";
import { cn } from "@/lib/utils";

const LAST_UPDATED = "2 août 2026";

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1200px] px-6 sm:px-10 ${className}`}>{children}</div>
);

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[12px] uppercase tracking-[0.16em] text-muted-foreground">{children}</p>
);

/** Espace réservé à compléter avant publication — bien visible dans le code
    comme à l'écran, pour qu'il ne parte jamais en production par erreur. */
const Fill = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-[4px] bg-amber-100 px-1.5 py-0.5 font-mono text-[0.92em] text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
    {children}
  </span>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] leading-[1.75] text-muted-foreground">{children}</p>
);

const Ul = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc space-y-2 pl-5 text-[15px] leading-[1.75] text-muted-foreground marker:text-foreground/25">
    {children}
  </ul>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mt-7 font-display text-[16px] tracking-[-0.01em] text-foreground first:mt-0">
    {children}
  </h3>
);

/**
 * Chaque partie correspond à un bloc distinct des obligations légales
 * canadiennes en matière de lutte contre le recyclage des produits de la
 * criminalité et le financement des activités terroristes (LRPCFAT), telles
 * qu'administrées par CANAFE pour les entreprises de services monétaires
 * (EMSC) qui négocient de la monnaie virtuelle. Rien n'est générique : chaque
 * seuil, méthode et délai cité correspond à une exigence réelle du régime
 * CANAFE applicable à Ooble.
 */
const PARTS: { id: string; n: string; title: string; body: React.ReactNode }[] = [
  {
    id: "objet",
    n: "01",
    title: "Objet et acceptation",
    body: (
      <>
        <P>
          Les présentes conditions d'utilisation (les « Conditions ») régissent l'accès et
          l'utilisation de la plateforme Ooble, exploitée par{" "}
          <Fill>[raison sociale complète, ex. Ooble Technologies Inc.]</Fill>, société{" "}
          <Fill>[constituée en vertu de la loi de — province ou fédérale]</Fill>, dont le siège
          est situé à <Fill>[adresse complète]</Fill> (« Ooble », « nous »). Ooble permet
          l'achat et la vente de Tether (USDT) contre des dollars canadiens (CAD), réglés
          directement vers le portefeuille numérique ou le compte bancaire du client par virement
          Interac.
        </P>
        <P>
          En créant un compte, en soumettant un ordre ou en utilisant la plateforme de quelque
          manière que ce soit, vous acceptez d'être lié par les présentes Conditions, par notre
          politique de confidentialité et par toute directive de conformité communiquée en cours
          de relation. Si vous n'acceptez pas ces Conditions, vous ne devez pas utiliser Ooble.
        </P>
        <P>
          Ooble est une entreprise de services monétaires (EMSC) au sens de la{" "}
          <em>Loi sur le recyclage des produits de la criminalité et le financement des activités
          terroristes</em> (LRPCFAT, L.C. 2000, ch. 17) et du{" "}
          <em>Règlement sur le recyclage des produits de la criminalité et le financement des
          activités terroristes</em> (DORS/2002-184), du fait qu'elle négocie de la monnaie
          virtuelle. À ce titre, Ooble est soumise à la surveillance du Centre d'analyse des
          opérations et déclarations financières du Canada (CANAFE) et aux obligations décrites
          dans les présentes Conditions.{" "}
          <strong className="text-foreground/80">
            Statut d'inscription : la demande d'inscription d'Ooble à titre d'EMSC auprès de
            CANAFE est en cours de traitement
          </strong>{" "}
          ; le numéro d'inscription sera publié ici et sur le registre public de CANAFE dès sa
          confirmation. Ooble se conforme dès aujourd'hui à l'ensemble des obligations
          d'identification, de tenue de dossiers, de déclaration et de programme de conformité
          applicables, indépendamment de la date de confirmation de l'inscription.
        </P>
      </>
    ),
  },
  {
    id: "definitions",
    n: "02",
    title: "Définitions",
    body: (
      <Ul>
        <li><strong className="text-foreground">Client</strong> : toute personne physique ou entité qui crée un compte ou soumet un ordre sur Ooble.</li>
        <li><strong className="text-foreground">Monnaie virtuelle (MV)</strong> : au sens du Règlement, un actif numérique tel que l'USDT, échangé contre des fonds ou un autre actif numérique.</li>
        <li><strong className="text-foreground">Ordre</strong> : instruction d'achat ou de vente d'USDT contre CAD soumise par le client sur la plateforme.</li>
        <li><strong className="text-foreground">Bénéficiaire effectif</strong> : personne physique qui possède ou contrôle, directement ou indirectement, 25 % ou plus d'une entité cliente, ou qui exerce autrement un contrôle de fait sur celle-ci.</li>
        <li><strong className="text-foreground">Tiers</strong> : personne autre que le client au nom de laquelle un ordre est en réalité donné ou des fonds sont en réalité fournis.</li>
        <li><strong className="text-foreground">PPV / DOI</strong> : personne politiquement vulnérable (nationale, étrangère, ou membre de sa famille immédiate ou une personne qui lui est étroitement associée) ou dirigeant d'une organisation internationale, au sens du Règlement.</li>
      </Ul>
    ),
  },
  {
    id: "admissibilite",
    n: "03",
    title: "Admissibilité",
    body: (
      <>
        <P>Pour utiliser Ooble, vous devez :</P>
        <Ul>
          <li>avoir au moins 18 ans et la capacité juridique de contracter ;</li>
          <li>résider au Canada et détenir un compte bancaire canadien permettant l'envoi et la réception de virements Interac e-Transfer ;</li>
          <li>agir en votre propre nom, sauf déclaration explicite et vérifiée d'un tiers conformément à la partie 6 ;</li>
          <li>ne pas être une personne ou entité visée par un régime de sanctions canadien, ni agir pour le compte d'une telle personne ou entité (partie 10) ;</li>
          <li>ne pas utiliser Ooble à des fins de recyclage des produits de la criminalité, de financement des activités terroristes ou de toute autre activité illégale (partie 11).</li>
        </Ul>
        <P>
          Ooble se réserve le droit de refuser l'ouverture d'un compte, ou de suspendre un compte
          existant, à sa seule discrétion et sans préavis, notamment lorsque ces critères ne sont
          pas ou plus respectés.
        </P>
      </>
    ),
  },
  {
    id: "identification",
    n: "04",
    title: "Vérification de votre identité",
    body: (
      <>
        <P>
          En tant qu'EMSC, Ooble a l'obligation légale de vérifier l'identité de ses clients avant
          de traiter tout ordre. Cette obligation ne relève pas d'un choix commercial : elle
          découle directement du Règlement et son non-respect est passible de sanctions
          administratives contre Ooble.
        </P>

        <H3>Moment de la vérification</H3>
        <P>
          Ooble vérifie l'identité de chaque client avant l'exécution de son premier ordre, une
          seule fois, sauf renouvellement requis en cas de doute sur l'exactitude des
          renseignements détenus. Une vérification est en tout état de cause requise avant tout
          ordre impliquant la réception de 10 000 $ CAD ou plus en monnaie virtuelle, en une seule
          opération ou par cumul d'opérations liées effectuées dans une même période de 24 heures
          consécutives (la « règle des 24 heures »).
        </P>

        <H3>Méthode utilisée</H3>
        <P>
          Ooble vérifie votre identité au moyen de la méthode de la pièce d'identité avec photo
          délivrée par un gouvernement, combinée à une vérification biométrique (prise de photo de
          vous-même en temps réel, comparée au document fourni). Vous devez transmettre :
        </P>
        <Ul>
          <li>une pièce d'identité avec photo, en cours de validité, délivrée par le gouvernement fédéral, provincial, territorial ou par un gouvernement étranger équivalent ;</li>
          <li>une photo ou vidéo de vous-même prise en temps réel, permettant de confirmer que vous êtes bien le titulaire du document ;</li>
          <li>pour un compte entreprise, les documents constitutifs de l'entité et l'identité de ses administrateurs et bénéficiaires effectifs (partie 6).</li>
        </Ul>
        <P>
          Vous garantissez l'exactitude, l'exhaustivité et la mise à jour des renseignements
          fournis, et vous vous engagez à signaler sans délai tout changement (adresse, statut de
          PPV, structure de propriété d'une entité). Ooble peut exiger une nouvelle vérification à
          tout moment si elle a des motifs raisonnables de douter de l'exactitude des
          renseignements détenus.
        </P>
        <P>
          Tant que votre identité n'est pas vérifiée avec succès, Ooble ne peut exécuter aucun
          ordre en votre nom.
        </P>
      </>
    ),
  },
  {
    id: "tiers",
    n: "05",
    title: "Tiers et bénéficiaires effectifs",
    body: (
      <>
        <H3>Déterminant quant aux tiers</H3>
        <P>
          Lorsqu'un ordre requiert la tenue d'un registre d'opération importante en monnaie
          virtuelle (partie 7), Ooble doit prendre des mesures raisonnables pour déterminer si
          vous agissez au nom d'un tiers. Vous vous engagez à déclarer immédiatement et de façon
          exacte si un ordre est donné au nom, pour le compte ou au bénéfice d'une autre personne,
          et à fournir sur demande le nom, l'adresse, la date de naissance et la nature de
          l'activité principale de ce tiers. Toute déclaration inexacte ou omise à cet égard
          constitue une violation substantielle des présentes Conditions.
        </P>

        <H3>Comptes entreprise — bénéficiaires effectifs</H3>
        <P>
          Pour tout compte ouvert au nom d'une entité, Ooble doit identifier et vérifier
          l'identité de chaque personne physique détenant, directement ou indirectement, 25 % ou
          plus de l'entité, ainsi que de toute personne exerçant un contrôle de fait sur celle-ci,
          et confirmer l'exactitude du registre des administrateurs. Aucune opération ne peut être
          exécutée pour une entité tant que cette information n'a pas été obtenue et vérifiée.
        </P>
      </>
    ),
  },
  {
    id: "ppv",
    n: "06",
    title: "Personnes politiquement vulnérables",
    body: (
      <P>
        Lors de l'ouverture de votre compte et à nouveau pour tout ordre nécessitant la tenue d'un
        registre d'opération importante en monnaie virtuelle, Ooble détermine si vous êtes une
        personne politiquement vulnérable (nationale ou étrangère), un dirigeant d'une
        organisation internationale, un membre de leur famille immédiate ou une personne qui leur
        est étroitement associée. Vous vous engagez à déclarer ce statut avec exactitude. Si vous
        êtes visé, Ooble applique des mesures de diligence raisonnable renforcées, incluant
        l'obtention de renseignements sur l'origine de vos fonds et de votre patrimoine, et
        soumet votre compte à l'approbation d'un membre de la haute direction ainsi qu'à une
        surveillance renforcée et continue.
      </P>
    ),
  },
  {
    id: "declarations",
    n: "07",
    title: "Seuils, déclarations et règle de voyage",
    body: (
      <>
        <P>
          En exécutant un ordre sur Ooble, vous reconnaissez et acceptez que la plateforme est
          légalement tenue de transmettre certains renseignements à CANAFE, sans notification
          préalable au client, dans les cas suivants :
        </P>

        <H3>Opérations importantes en monnaie virtuelle (10 000 $ CAD et plus)</H3>
        <P>
          Toute réception par Ooble de 10 000 $ CAD ou plus en monnaie virtuelle, en une seule
          opération ou par cumul d'opérations liées dans une période de 24 heures consécutives,
          fait l'objet d'une déclaration d'opération importante en monnaie virtuelle (DOIMV)
          transmise à CANAFE dans les cinq jours ouvrables, ainsi que d'un registre détaillé
          conservé conformément à la partie 8.
        </P>

        <H3>Règle de voyage (transferts de 1 000 $ CAD et plus)</H3>
        <P>
          Pour tout transfert de monnaie virtuelle de 1 000 $ CAD ou plus, Ooble joint ou exige du
          destinataire les renseignements suivants : nom, adresse et numéro de compte ou de
          référence de la personne qui a demandé le transfert (expéditeur), ainsi que nom, adresse
          et numéro de compte ou de référence du bénéficiaire. Un ordre pour lequel ces
          renseignements ne peuvent être obtenus peut être retardé, suspendu ou refusé.
        </P>

        <H3>Déclaration d'opérations douteuses</H3>
        <P>
          Sans seuil minimal, Ooble transmet à CANAFE une déclaration d'opération douteuse dès
          qu'elle a des motifs raisonnables de soupçonner qu'une opération ou une tentative
          d'opération est liée à la perpétration ou à la tentative de perpétration d'une infraction
          de recyclage des produits de la criminalité ou de financement des activités terroristes.
          Conformément à la loi, Ooble n'est pas tenue d'aviser le client concerné qu'une telle
          déclaration a été faite ou envisagée, et une telle déclaration ne constitue en rien une
          accusation ni une reconnaissance d'un acte répréhensible.
        </P>

        <H3>Biens de terroristes et sanctions</H3>
        <P>
          Si Ooble a des motifs de croire que des fonds ou des actifs en sa possession
          appartiennent à une personne ou entité inscrite sur une liste de terroristes ou visée
          par un régime de sanctions canadien, elle en fait immédiatement déclaration à CANAFE et
          à la Gendarmerie royale du Canada, et gèle les actifs concernés.
        </P>
      </>
    ),
  },
  {
    id: "dossiers",
    n: "08",
    title: "Tenue de dossiers et conservation",
    body: (
      <P>
        Ooble tient et conserve, pour une durée minimale de cinq ans à compter de la date de
        l'opération ou de la fermeture du compte selon le cas, les registres suivants : registre
        d'identification du client, registre d'opération de change en monnaie virtuelle, registre
        d'opération importante en monnaie virtuelle, registre de déterminant quant aux tiers,
        registre relatif au statut de PPV/DOI le cas échéant, ainsi que toute correspondance et
        tout document ayant servi à la vérification de votre identité. Ces registres peuvent être
        communiqués à CANAFE, à un organisme de réglementation ou à une autorité judiciaire
        compétente sur demande légale, sans notification préalable au client lorsque la loi
        l'interdit ou le déconseille.
      </P>
    ),
  },
  {
    id: "conformite",
    n: "09",
    title: "Programme de conformité d'Ooble",
    body: (
      <P>
        Ooble maintient un programme de conformité écrit comprenant : la désignation d'un agent de
        conformité responsable de sa mise en œuvre ; des politiques et procédures écrites,
        maintenues à jour ; une évaluation documentée des risques de recyclage des produits de la
        criminalité et de financement des activités terroristes liés à ses produits, ses canaux de
        prestation, sa clientèle et sa zone géographique d'activité ; un programme de formation
        continue du personnel ; et un examen de l'efficacité de l'ensemble du programme réalisé au
        moins tous les deux ans par une personne interne ou externe indépendante de sa conception
        et de sa mise en œuvre. L'agent de conformité peut être joint aux coordonnées indiquées à
        la partie 21.
      </P>
    ),
  },
  {
    id: "sanctions",
    n: "10",
    title: "Sanctions économiques",
    body: (
      <P>
        Vous garantissez ne pas figurer, ni être détenu ou contrôlé par une personne figurant, sur
        une liste de personnes ou entités visées par la{" "}
        <em>Loi sur les mesures économiques spéciales</em>, la{" "}
        <em>Loi sur les Nations Unies</em>, la{" "}
        <em>Loi sur la justice pour les victimes de dirigeants étrangers corrompus</em>, le{" "}
        <em>Code criminel</em> (entités terroristes inscrites) ou tout autre régime de sanctions
        applicable au Canada. Ooble filtre systématiquement ses clients et leurs opérations à
        l'égard de ces listes et refuse ou interrompt sans délai toute relation ou opération
        associée à une correspondance positive confirmée.
      </P>
    ),
  },
  {
    id: "interdits",
    n: "11",
    title: "Utilisations interdites",
    body: (
      <Ul>
        <li>Utiliser Ooble pour recycler des produits de la criminalité ou financer des activités terroristes ;</li>
        <li>fournir de faux renseignements d'identification ou usurper l'identité d'un tiers ;</li>
        <li>structurer sciemment des opérations pour éviter les seuils de déclaration décrits à la partie 7 ;</li>
        <li>utiliser des fonds ou de la monnaie virtuelle provenant d'une activité illégale, y compris la fraude, le piratage ou l'extorsion ;</li>
        <li>agir pour le compte d'un tiers non déclaré ;</li>
        <li>contourner ou tenter de contourner un régime de sanctions canadien ou étranger applicable.</li>
      </Ul>
    ),
  },
  {
    id: "service",
    n: "12",
    title: "Fonctionnement du service",
    body: (
      <>
        <P>
          Ooble est non-custodial : la plateforme ne conserve aucun solde client et n'exploite
          aucun portefeuille interne. Chaque ordre est réglé individuellement, directement vers
          votre portefeuille numérique (achat) ou votre compte bancaire par virement Interac
          e-Transfer (vente), puis clos.
        </P>
        <P>
          Le taux affiché correspond au cours du marché USDT/CAD majoré d'une marge de 2 %, déjà
          incluse dans le prix affiché — aucun frais additionnel n'est appliqué. Ce taux est
          verrouillé pendant {RATE_LOCK_MINUTES} minutes à compter de la création de l'ordre.
          Passé ce délai sans règlement complet de votre part, Ooble peut annuler l'ordre et vous
          inviter à en créer un nouveau au taux courant.
        </P>
        <P>
          Ooble prend en charge les réseaux Tron (TRC20), Ethereum (ERC20), BNB Chain (BEP20),
          Polygon, Solana et Avalanche (C-Chain). Il vous appartient de vérifier que l'adresse de
          destination correspond exactement au réseau choisi : les transferts de monnaie virtuelle
          sont irréversibles, et Ooble ne peut ni annuler ni récupérer un envoi effectué vers une
          adresse erronée ou un réseau incompatible.
        </P>
      </>
    ),
  },
  {
    id: "refus",
    n: "13",
    title: "Refus, suspension et annulation d'ordres",
    body: (
      <P>
        Ooble peut, à sa seule discrétion et sans engager sa responsabilité, refuser d'ouvrir un
        compte, refuser ou retarder l'exécution d'un ordre, suspendre ou fermer un compte, ou
        geler des fonds en transit, notamment lorsque cela est nécessaire pour se conformer à la
        LRPCFAT, au Règlement, à un régime de sanctions, à une ordonnance judiciaire, ou lorsque
        des motifs raisonnables de soupçon existent au sens de la partie 7. Ooble n'est pas tenue
        de motiver une telle décision lorsque la loi le lui interdit.
      </P>
    ),
  },
  {
    id: "risques",
    n: "14",
    title: "Risques",
    body: (
      <Ul>
        <li>La valeur de la monnaie virtuelle est volatile et peut varier significativement entre la création et le règlement d'un ordre, au-delà de la période de verrouillage du taux ;</li>
        <li>les opérations en monnaie virtuelle inscrites sur une chaîne de blocs sont irréversibles ; une erreur d'adresse, de réseau ou de mémo entraîne une perte définitive des fonds ;</li>
        <li>Ooble n'agit à aucun moment comme dépositaire ; vous demeurez seul responsable de la sécurité de votre portefeuille et de vos clés privées ;</li>
        <li>les délais de confirmation sur la chaîne de blocs échappent au contrôle d'Ooble.</li>
      </Ul>
    ),
  },
  {
    id: "responsabilites",
    n: "15",
    title: "Vos responsabilités",
    body: (
      <P>
        Vous êtes seul responsable de l'exactitude des renseignements et adresses fournis, de la
        garde de vos identifiants de connexion, de la conformité de votre propre usage de la
        plateforme aux lois qui vous sont applicables, et du respect de vos obligations fiscales
        liées à vos opérations sur Ooble. Ooble ne fournit aucun conseil financier, fiscal ou
        juridique.
      </P>
    ),
  },
  {
    id: "limitation",
    n: "16",
    title: "Limitation de responsabilité",
    body: (
      <P>
        Dans la pleine mesure permise par la loi, Ooble ne peut être tenue responsable des pertes
        résultant d'une erreur d'adresse ou de réseau commise par le client, d'une fluctuation du
        marché après l'expiration du verrouillage du taux, d'un délai de confirmation sur une
        chaîne de blocs, d'un cas de force majeure, ou d'une mesure prise de bonne foi pour se
        conformer à la LRPCFAT, au Règlement ou à un régime de sanctions applicable.
      </P>
    ),
  },
  {
    id: "confidentialite",
    n: "17",
    title: "Confidentialité et communication aux autorités",
    body: (
      <P>
        Ooble traite vos renseignements personnels conformément à sa politique de confidentialité
        et à la <em>Loi sur la protection des renseignements personnels et les documents
        électroniques</em> (LPRPDE). Vos renseignements d'identification, vos registres
        d'opérations et toute déclaration visée à la partie 7 peuvent être communiqués à CANAFE, à
        un organisme de réglementation, à un service de police ou à une autorité judiciaire
        compétente, dans les cas et selon les modalités prévus par la loi, y compris sans
        notification préalable lorsque la loi l'exige ou le permet.
      </P>
    ),
  },
  {
    id: "modifications",
    n: "18",
    title: "Modifications des présentes Conditions",
    body: (
      <P>
        Ooble peut modifier les présentes Conditions à tout moment, notamment pour refléter une
        évolution de ses obligations réglementaires. La version en vigueur est celle publiée sur
        cette page, avec sa date de dernière mise à jour. Toute utilisation de la plateforme après
        publication d'une modification vaut acceptation de celle-ci.
      </P>
    ),
  },
  {
    id: "resiliation",
    n: "19",
    title: "Résiliation",
    body: (
      <P>
        Vous pouvez fermer votre compte à tout moment en en faisant la demande à l'adresse
        indiquée à la partie 21, sous réserve du règlement de tout ordre en cours. Ooble conserve
        les registres requis par la partie 8 pendant la durée prescrite par la loi, même après
        fermeture du compte.
      </P>
    ),
  },
  {
    id: "droit",
    n: "20",
    title: "Droit applicable et juridiction",
    body: (
      <P>
        Les présentes Conditions sont régies par les lois applicables dans{" "}
        <Fill>[province — ex. la province de Québec]</Fill> et les lois fédérales du Canada qui
        s'y appliquent. Tout litige relève de la compétence exclusive des tribunaux de{" "}
        <Fill>[province]</Fill>, sous réserve des pouvoirs d'enquête et de sanction reconnus à
        CANAFE et aux autres autorités de réglementation compétentes.
      </P>
    ),
  },
  {
    id: "contact",
    n: "21",
    title: "Coordonnées",
    body: (
      <>
        <P>
          Pour toute question relative aux présentes Conditions ou à nos obligations de
          conformité, y compris pour joindre notre agent de conformité :
        </P>
        <Ul>
          <li>Courriel — support@ooble.ca</li>
          <li>Interac e-Transfer (paiements) — {OOBLE_INTERAC_EMAIL}</li>
          <li>Adresse postale — <Fill>[adresse complète de l'entreprise]</Fill></li>
        </Ul>
      </>
    ),
  },
];

const Conditions = () => (
  <div className="ink-neutral app-type min-h-screen bg-background tracking-[-0.015em]">
    <Header />

    <main className="mx-auto max-w-[1200px] px-6 sm:px-10">
      {/* Titre */}
      <section className="pt-14 lg:pt-20">
        <Kicker>Cadre légal</Kicker>
        <h1 className="mt-5 max-w-[820px] font-display text-[2.5rem] leading-[0.98] tracking-[-0.05em] sm:text-[3.6rem] lg:text-[4.2rem]">
          Conditions
          <br />
          <span className="text-foreground/35">d'utilisation</span>
        </h1>
        <p className="mt-6 max-w-[560px] text-[15px] leading-[1.7] text-muted-foreground">
          Ooble est une entreprise de services monétaires soumise aux obligations de la Loi sur le
          recyclage des produits de la criminalité et le financement des activités terroristes,
          administrée par CANAFE. Les présentes Conditions détaillent, sans rien omettre, ce que
          cela signifie pour vous.
        </p>
        <p className="mt-4 text-[13px] text-muted-foreground/70">
          Dernière mise à jour : {LAST_UPDATED}
        </p>
      </section>

      {/* Sommaire */}
      <section className="pt-12 lg:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-y py-6 sm:grid-cols-3 lg:grid-cols-4">
          {PARTS.map((part) => (
            <a
              key={part.id}
              href={`#${part.id}`}
              className="flex items-baseline gap-2 py-1 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="text-[11px] text-foreground/30">{part.n}</span>
              {part.title}
            </a>
          ))}
        </div>
      </section>

      {/* Parties */}
      <section className="pt-4 lg:pt-6">
        {PARTS.map((part) => (
          <div key={part.id} id={part.id} className="scroll-mt-24 border-t py-9 lg:py-11">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div className="lg:sticky lg:top-8 lg:self-start">
                <span className="font-display text-[1.6rem] leading-none tracking-[-0.03em] text-foreground/25">
                  {part.n}
                </span>
                <p className="mt-2 font-display text-[1.15rem] tracking-[-0.02em]">{part.title}</p>
              </div>
              <div className="max-w-[640px] space-y-4">{part.body}</div>
            </div>
          </div>
        ))}
        <div className="border-t" />
      </section>

      {/* Aval */}
      <section className="py-16 text-center lg:py-20">
        <p className="mx-auto max-w-[480px] text-[14px] leading-[1.7] text-muted-foreground">
          Une question sur nos obligations de conformité ou sur votre dossier ?{" "}
          <Link to="/contact" className="text-foreground underline underline-offset-2">
            Écrivez à notre équipe
          </Link>
          .
        </p>
      </section>
    </main>

    <Footer />
  </div>
);

export default Conditions;
