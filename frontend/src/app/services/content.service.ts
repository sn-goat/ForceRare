import { Injectable } from '@angular/core';

export interface HeroContent {
  title: string;
  tagline: string;
  cta: string;
  secondaryCta: string;
}

export interface AboutPreviewContent {
  heading: string;
  body: string;
  cta: string;
}

export interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

export interface StatsContent {
  heading: string;
  subheading: string;
  items: StatItem[];
}

export interface MissionContent {
  heading: string;
  body: string;
  bullets: string[];
  cta: string;
}

export interface CtaContent {
  heading: string;
  subtext: string;
  buttonLabel: string;
}

export interface PartnersPreviewContent {
  heading: string;
  subtext: string;
  cta: string;
}

export interface HomeContent {
  hero: HeroContent;
  about: AboutPreviewContent;
  stats: StatsContent;
  mission: MissionContent;
  cta: CtaContent;
  partners: PartnersPreviewContent;
}

export interface NavLink {
  label: string;
  route: string;
  fragment?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FounderInfo {
  name: string;
  role: string;
  shortBio: string;
  fullBio: string;
}

export interface PartnerInfo {
  name: string;
  fullName: string;
  shortDescription: string;
  fullDescription: string[];
  missions: string[];
  partnershipNote: string;
  websiteUrl: string;
  websiteLabel: string;
}

export interface PageHeroContent {
  title: string;
  subtitle: string;
}

export interface LogoStoryExplanation {
  title: string;
  body: string;
}

export interface NotreHistoireContent {
  hero: PageHeroContent;
  intro: { lead: string; paragraphs: string[] };
  whatIs: { heading: string; paragraphs: string[] };
  howStarted: { heading: string; paragraphs: string[] };
  logoStory: {
    heading: string;
    creatorLead: string;
    creatorParagraphs: string[];
    explanationHeading: string;
    explanations: LogoStoryExplanation[];
  };
  pillars: { heading: string; items: string[] };
  whyDifferent: {
    heading: string;
    paragraphs: string[];
    list: string[];
    accent: string;
  };
  vision: {
    heading: string;
    cards: string[];
    closing: string;
    closingBold: string;
  };
  websiteStory: {
    heading: string;
    paragraphs: string[];
  };
}

export interface AmbitionCard {
  title: string;
  items: string[];
}

export interface NotreMissionContent {
  hero: PageHeroContent;
  mission: {
    heading: string;
    paragraphs: string[];
    bullets: string[];
    accent: string;
  };
  ambitions: {
    heading: string;
    intro: string;
    cards: AmbitionCard[];
    closing: string;
  };
  ambassador: {
    heading: string;
    paragraphs: string[];
    roles: string[];
    cta: string;
  };
}

export interface NotreEquipeContent {
  hero: PageHeroContent;
  intro: { lead: string; paragraphs: string[] };
  foundersHeading: string;
  ambassador: {
    heading: string;
    body: string;
    cta: string;
  };
}

export interface NosPartenairesContent {
  hero: PageHeroContent;
  intro: { lead: string; paragraphs: string[] };
  integrity: {
    heading: string;
    items: string[];
    body: string;
  };
}

export interface BenefitCard {
  title: string;
  description: string;
}

export interface CollabForm {
  number: string;
  title: string;
  description: string;
}

export interface CollaborerContent {
  hero: PageHeroContent;
  intro: string;
  benefits: { heading: string; intro: string; cards: BenefitCard[] };
  forms: { heading: string; items: CollabForm[] };
  cta: {
    heading: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
}

export interface NousJoindreContent {
  hero: PageHeroContent;
  formHeading: string;
  successMessage: string;
  subjectOptions: string[];
  labels: {
    name: string;
    email: string;
    subject: string;
    customSubject: string;
    message: string;
    submit: string;
  };
  placeholders: {
    name: string;
    email: string;
    subject: string;
    customSubject: string;
    message: string;
  };
  sidebar: {
    coordTitle: string;
    emailLabel: string;
    email: string;
    socialTitle: string;
    topicsTitle: string;
    topics: string[];
  };
}

export interface ImpactCard {
  number: string;
  title: string;
  description: string;
}

export interface OtherWay {
  title: string;
  description: string;
}

export interface FaireUnDonContent {
  hero: PageHeroContent;
  main: {
    heading: string;
    paragraphs: string[];
    cta: string;
    note: string;
  };
  impact: {
    title: string;
    cards: ImpactCard[];
  };
  otherWays: {
    heading: string;
    items: OtherWay[];
  };
}

export interface FooterContent {
  tagline: string;
  copyright: string;
  navTitle: string;
  socialTitle: string;
  socialLinks: { label: string; url: string; icon: string }[];
}

@Injectable({ providedIn: 'root' })
export class ContentService {

  readonly donateUrl =
    'https://www.zeffy.com/donation-form/au-dela-du-terrain';

  getNavLinks(): NavLink[] {
    return [
      { label: 'Accueil', route: '/' },
      { label: 'Notre histoire', route: '/notre-histoire' },
      { label: 'Notre mission', route: '/notre-mission' },
      { label: 'Notre équipe', route: '/notre-equipe' },
      { label: 'Événements', route: '/evenements'},
      { label: 'Partenaires', route: '/nos-partenaires' },
      { label: 'Collaborer', route: '/collaborer' },
      { label: 'Nous joindre', route: '/nous-joindre' },
    ];
  }

  getFounders(): FounderInfo[] {
    return [
      {
        name: 'Noah Gravel',
        role: 'Cofondateur',
        shortBio:
          'Étudiant-athlète du Rouge et Or, joueur de football à l\'Université Laval. Étudie la physiothérapie.',
        fullBio:
          'Étudiant-athlète du Rouge et Or et joueur de football au sein de l\'équipe de l\'Université Laval. Noah étudie la physiothérapie tout en poursuivant sa carrière sportive, et il est animé par une vision forte\u00a0: utiliser la plateforme du sport universitaire afin de mobiliser la communauté pour un impact social significatif.',
      },
      {
        name: 'Jade Marquis',
        role: 'Cofondatrice',
        shortBio:
          'Étudiante en médecine à l\'Université Laval, membre de l\'équipe de volleyball du Rouge et Or.',
        fullBio:
          'Étudiante en médecine à l\'Université Laval et membre de l\'équipe de volleyball du Rouge et Or, Jade combine son engagement académique et sportif avec un profond désir d\'agir pour les causes qui touchent les familles. Sa formation en santé et sa passion pour l\'impact social ajoutent une dimension humaine et médicale précieuse au mouvement Force Rare.',
      },
      {
        name: 'Valery Feliz Accolley',
        role: 'Cofondateur — Stratégie',
        shortBio:
          'Joueur de football avec les Carabins de l\'Université de Montréal. Contribue à l\'organisation et à la planification.',
        fullBio:
          'Joueur de football avec les Carabins de l\'Université de Montréal, Valery occupe un rôle stratégique au sein de l\'équipe Force Rare. Grâce à son sens tactique, sa discipline sportive et sa rigueur, Valery contribue activement à l\'organisation, la planification et le développement du projet.',
      },
      {
        name: 'Dylan Sea',
        role: 'Cofondateur — Création de contenu',
        shortBio:
          'Responsable de la création de contenu. Produit les vidéos, témoignages et contenu visuel.',
        fullBio:
          'Cofondateur et responsable de la création de contenu, Dylan assure toute la dimension médiatique du projet. Il produit les vidéos, les témoignages et l\'ensemble du contenu visuel qui permettent à Force Rare de toucher les cœurs et d\'atteindre un public élargi.',
      },
      {
        name: 'Sergile Nyouvop',
        role: 'Responsable de la technologie',
        shortBio:
          'Étudiant en génie informatique à Polytechnique et joueur de football des Carabins. Conçoit la partie technique du site.',
        fullBio:
          'Derrière notre site web, Sergile Nyouvop met son expertise en génie informatique au service du collectif. Étudiant à Polytechnique et joueur de football des Carabins, il a su concevoir la partie technique du site avec la même discipline et lucidité que le sport lui a apprises. Membre actif de la communauté étudiante de cybersécurité, il incarne cette alliance rare entre excellence et humilité.',
      },
      {
        name: 'Chris-Noah Adjoka',
        role: 'Co-responsable de la technologie',
        shortBio:
          'Étudiant en mathématiques et informatique à l\'Université de Montréal. Participe à donner forme et cohérence au site web.',
        fullBio:
          'Étudiant en mathématiques et informatique à l\'Université de Montréal, Chris-Noah Adjoka participe à donner forme et cohérence au site web. Réfléchi, attentif aux autres et toujours prêt à proposer des pistes nouvelles, il contribue à façonner une expérience claire et accueillante pour tous ceux qui découvrent Force Rare.',
      },
      {
        name: 'Louis Vincent',
        role: 'Responsable des partenariats et du développement',
        shortBio:
          'Étudiant en finance à l\'Université Laval et ancien joueur de football universitaire. Développe les partenariats et le réseau de Force Rare.',
        fullBio:
          'Étudiant en finance à l\'Université Laval et actif dans le domaine des services financiers, Louis apporte à Force Rare une rigueur et une discipline forgées par son parcours d\'ancien joueur de football universitaire. Au sein de l\'équipe, Louis joue un rôle clé dans le développement du projet. Il contribue activement à la recherche de partenariats et à l\'expansion du réseau de Force Rare, afin d\'augmenter sa portée et de maximiser son impact auprès de la communauté.',
      },
    ];
  }

  getPartners(): PartnerInfo[] {
    return [
      {
        name: 'RQMO',
        fullName: 'Le Regroupement québécois des maladies orphelines (RQMO)',
        shortDescription:
          'Regroupement québécois des maladies orphelines — défense des droits et représentation des personnes atteintes de maladies rares.',
        fullDescription: [
          'Le RQMO joue un rôle central dans la défense des droits et la représentation des personnes atteintes de maladies rares au Québec. En tant qu\'organisme de référence, le RQMO agit comme voix collective des patients et des familles.',
          'La collaboration entre Force Rare et le RQMO repose sur une vision commune\u00a0: rendre visibles des réalités trop souvent ignorées. Ce partenariat assure que notre mobilisation sportive est connectée à une compréhension rigoureuse et documentée des défis vécus par les familles.',
        ],
        missions: [
          'Sensibiliser les décideurs publics',
          'Améliorer l\'accès aux soins et aux traitements',
          'Favoriser la reconnaissance des maladies rares dans les politiques publiques',
          'Soutenir les familles dans leurs démarches',
        ],
        partnershipNote: '',
        websiteUrl: 'https://rqmo.org',
        websiteLabel: 'Visiter rqmo.org',
      },
      {
        name: 'Fonds Mille-Pattes',
        fullName: 'Le Fonds Mille-Pattes',
        shortDescription:
          'Soutien aux enfants atteints de maladies rares et à leurs familles.',
        fullDescription: [
          'Le Fonds Mille-Pattes soutient les enfants atteints de maladies rares ainsi que leurs familles, notamment dans les sphères du soutien financier, de l\'accompagnement et de l\'amélioration de la qualité de vie.',
          'Ce partenariat reflète notre volonté de travailler avec des acteurs déjà engagés, compétents et crédibles, afin d\'amplifier l\'impact plutôt que de le disperser.',
        ],
        missions: [
          'Soutenir des projets concrets pour les enfants touchés',
          'Alléger certaines pressions financières vécues par les familles',
          'Contribuer à des initiatives liées au bien-être et à l\'accompagnement',
        ],
        partnershipNote: '',
        websiteUrl: 'https://fondsmillepattes.com',
        websiteLabel: 'Visiter fondsmillepattes.com',
      },
      {
        name: 'CHUL',
        fullName: 'Le Centre hospitalier universitaire de Québec — CHUL',
        shortDescription:
          'Centre hospitalier universitaire de Québec — soins pédiatriques spécialisés et recherche médicale.',
        fullDescription: [
          'Le CHUL est un acteur majeur dans le domaine des soins pédiatriques spécialisés et de la recherche médicale au Québec.',
          'En collaborant avec le CHUL, Force Rare s\'ancre directement dans l\'écosystème médical et scientifique québécois. Ce partenariat incarne notre volonté d\'allier mobilisation communautaire et excellence médicale.',
        ],
        missions: [
          'La prise en charge médicale d\'enfants atteints de maladies rares',
          'Le développement de protocoles spécialisés',
          'La recherche clinique et scientifique',
          'L\'innovation en matière de soins pédiatriques',
        ],
        partnershipNote: '',
        websiteUrl: 'https://fondationduchudequebec.ca',
        websiteLabel: 'Visiter fondationduchudequebec.ca',
      },
      {
        name: 'NovaStim',
        fullName: 'Le laboratoire NovaStim — Cyril Schneider',
        shortDescription:
          'Laboratoire de neurosciences de la réadaptation dirigé par Cyril Schneider, chercheur de renommée internationale à l\'Université Laval.',
        fullDescription: [
          'Force Rare est fier d\'annoncer un partenariat officiel avec le laboratoire NovaStim, dirigé par Cyril Schneider, professeur à l\'Université Laval et chercheur de renommée internationale.',
          'Visionnaire, innovateur et leader en neurosciences de la réadaptation, le Dr Schneider repousse les limites de la science avec des travaux de pointe en neurostimulation, transformant concrètement la vie de nombreux patients.',
          'Ses travaux s\'inscrivent dans un réseau de collaboration internationale, contribuant à faire avancer la science à l\'échelle mondiale et à positionner le Québec comme un véritable pôle d\'excellence en recherche en réadaptation.',
          'Ses recherches ne restent pas sur papier\u00a0: elles redonnent du mouvement, diminuent la douleur et redonnent espoir. Avec NovaStim, Force Rare s\'entoure d\'une expertise exceptionnelle pour connecter la science de haut niveau à la réalité humaine.',
          'Force Rare devient ainsi bien plus qu\'un projet de sensibilisation\u00a0: c\'est une plateforme qui unit science, communauté et action pour transformer la réalité des maladies rares au Québec. Un partenariat qui change des vies. Force Rare x NovaStim\u00a0!',
        ],
        missions: [
          'Recherche de pointe en neurostimulation',
          'Réadaptation et amélioration de la qualité de vie des patients',
          'Collaboration internationale en neurosciences',
          'Positionnement du Québec comme pôle d\'excellence en recherche en réadaptation',
        ],
        partnershipNote: '',
        websiteUrl: 'https://www.facebook.com/NovaStimLab/',
        websiteLabel: 'Visiter leur page Facebook',
      },
    ];
  }

  getHome(): HomeContent {
    return {
      hero: {
        title: 'FORCE RARE',
        tagline: 'Au-delà du terrain',
        cta: 'Faire un don',
        secondaryCta: 'En savoir plus',
      },
      about: {
        heading: 'Qu\'est-ce que Force Rare?',
        body: 'Force Rare est un mouvement porté par des athlètes universitaires qui mobilise la communauté sportive pour soutenir les enfants atteints de maladies rares au Québec. Nous croyons que le sport est plus qu\'une performance — c\'est une plateforme d\'influence, de leadership et de solidarité.',
        cta: 'En savoir plus',
      },
      stats: {
        heading: 'Notre impact',
        subheading: 'Force Rare en un coup d\'œil',
        items: [
          { value: 4, label: 'Partenaires officiels' },
          { value: 4, label: 'Fondateurs engagés' },
          { value: 1, label: 'Événement phare à venir', suffix: 'er' },
        ],
      },
      mission: {
        heading: 'Notre mission envers les familles',
        body: 'Notre mission est d\'apporter du soutien, de la visibilité et de l\'espoir aux familles touchées par les maladies rares.',
        bullets: [
          'Sensibiliser la population aux maladies rares',
          'Mobiliser des ressources financières pour soutenir les familles et la recherche',
          'Créer des moments de solidarité et de reconnaissance',
          'Amplifier la voix des familles et des chercheurs',
        ],
        cta: 'En savoir plus',
      },
      cta: {
        heading: 'Rejoignez le mouvement',
        subtext: 'Chaque don, chaque partage, chaque geste compte. Ensemble, allons au-delà du terrain.',
        buttonLabel: 'Faire un don',
      },
      partners: {
        heading: 'Nos partenaires',
        subtext: 'Force Rare se développe en collaboration avec des organisations reconnues qui partagent notre engagement.',
        cta: 'Voir tous les partenaires',
      },
    };
  }

  getFooter(): FooterContent {
    return {
      tagline: 'Au-delà du terrain — Pour les enfants atteints de maladies rares.',
      copyright: `© ${new Date().getFullYear()} Force Rare. Tous droits réservés.`,
      navTitle: 'Navigation',
      socialTitle: 'Suivez-nous',
      socialLinks: [
        { label: 'Instagram', url: 'https://www.instagram.com/force.rare', icon: 'instagram' },
        { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61577886373634', icon: 'facebook' },
        { label: 'Youtube', url: 'https://www.youtube.com/@Force_rare', icon: 'youtube' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/company/force-rare/', icon: 'linkedin' },
      ],
    };
  }

  getFaq(): FaqItem[] {
    return [
      {
        question: 'Qu\'est-ce qu\'une maladie rare\u00a0?',
        answer: 'Une maladie rare est une maladie qui touche un nombre très limité de personnes par rapport à la population générale. Au Québec, on estime que les maladies rares affectent collectivement des centaines de milliers de personnes et leurs familles.',
      },
      {
        question: 'Comment puis-je faire un don à Force Rare\u00a0?',
        answer: 'Vous pouvez faire un don sécurisé via notre page Zeffy en cliquant sur le bouton « Faire un don ». L\'intégralité des fonds est dirigée vers nos partenaires reconnus.',
      },
      {
        question: 'Où vont les fonds amassés par Force Rare\u00a0?',
        answer: 'Les fonds sont dirigés vers nos partenaires officiels\u00a0: le RQMO, le Fonds Mille-Pattes et le CHUL, qui œuvrent directement auprès des familles et des enfants touchés par les maladies rares.',
      },
      {
        question: 'Comment puis-je devenir ambassadeur Force Rare\u00a0?',
        answer: 'Si vous êtes un athlète universitaire souhaitant porter la mission Force Rare au sein de votre équipe, contactez-nous via notre page Nous joindre. Nous recherchons des ambassadeurs dans chaque équipe sportive universitaire.',
      },
      {
        question: 'Force Rare est-il un organisme de bienfaisance enregistré\u00a0?',
        answer: 'Force Rare est un mouvement philanthropique porté par des étudiants-athlètes. Nous collaborons avec des organismes reconnus et enregistrés, dont le RQMO et le Fonds Mille-Pattes, pour assurer la transparence et la crédibilité de notre action.',
      },
      {
        question: 'Comment mon entreprise peut-elle collaborer avec Force Rare\u00a0?',
        answer: 'Nous offrons plusieurs formes de collaboration\u00a0: partenariats financiers, match de dons, visibilité événementielle et mobilisation interne. Visitez notre page Collaborer ou contactez-nous directement.',
      },
    ];
  }

  getNotreHistoire(): NotreHistoireContent {
    return {
      hero: {
        title: 'Notre histoire',
        subtitle: 'Le parcours de Force Rare, de l\'idée au mouvement.',
      },
      intro: {
        lead: 'Force Rare est un projet social et philanthropique né d\'une volonté simple mais puissante\u00a0: utiliser la force du sport, de la communauté et de l\'engagement humain pour soutenir les personnes et les familles touchées par des maladies rares.',
        paragraphs: [
          'Derrière Force Rare, il y a la conviction que la solidarité peut aller bien au-delà du terrain, et que chaque action collective peut avoir un impact réel, durable et porteur de sens.',
          'Le projet a été créé à la suite de rencontres humaines marquantes et d\'un constat clair\u00a0: les maladies rares sont trop souvent invisibles, mal comprises et insuffisamment soutenues, malgré les défis immenses qu\'elles imposent aux familles au quotidien. Force Rare est donc né pour donner une voix à ces réalités, pour sensibiliser le public et pour mobiliser des ressources concrètes afin d\'aider ceux qui en ont le plus besoin.',
        ],
      },
      whatIs: {
        heading: '1. Qu\'est-ce que Force Rare\u00a0?',
        paragraphs: [
          'Force Rare est un mouvement porté par des athlètes universitaires qui mobilise la communauté sportive pour soutenir les enfants atteints de maladies rares au Québec.',
          'Nous croyons que le sport est plus qu\'une performance. C\'est une plateforme d\'influence, de leadership et de solidarité. Force Rare transforme cette visibilité en impact concret en sensibilisant le public aux réalités des maladies rares et en mobilisant des fonds pour soutenir les familles et la recherche.',
          'Notre approche est simple\u00a0: unir la puissance du sport, l\'engagement des étudiants et la force de la communauté pour créer un élan durable. Chaque événement, chaque campagne et chaque partenariat vise un objectif clair\u00a0: faire une différence réelle et mesurable dans la vie des familles touchées.',
          'Force Rare n\'est pas seulement un événement. C\'est une initiative appelée à devenir une tradition annuelle, ancrée dans les universités du Québec et, à terme, à travers le Canada.',
        ],
      },
      howStarted: {
        heading: '2. Comment tout a commencé',
        paragraphs: [
          'Force Rare est né d\'un désir profond de donner un sens plus grand à la visibilité du sport universitaire. Inspiré par des modèles nord-américains où les athlètes utilisent leur plateforme pour soutenir des causes sociales, le projet a été fondé avec la volonté de créer un mouvement structuré, crédible et durable au Québec.',
          'L\'idée a émergé d\'une réflexion simple\u00a0: comment utiliser l\'influence des équipes sportives universitaires pour soutenir les enfants atteints de maladies rares, une réalité souvent invisible et pourtant extrêmement présente\u00a0?',
          'Ce qui a commencé comme une initiative portée par quelques athlètes engagés s\'est rapidement transformé en un projet structuré, soutenu par des partenaires institutionnels, des fondations et des membres de la communauté universitaire.',
          'Dès le départ, l\'objectif n\'était pas seulement d\'organiser un événement ponctuel, mais de bâtir une plateforme philanthropique pérenne, avec une vision à long terme.',
        ],
      },
      logoStory: {
        heading: 'L\'histoire de notre logo',
        creatorLead: 'Force Rare vous présente Cloé St-Gelais, créatrice du logo Force Rare.',
        creatorParagraphs: [
          'Cloé est une étudiante en architecture à l\'Université Laval ainsi qu\'une étudiante-athlète engagée au sein de l\'équipe de volleyball du Rouge et Or.',
          'Depuis sa jeune enfance, elle est animée par la création et le dessin, particulièrement à travers des projets réalisés avec ses mains. Son parcours en architecture lui a permis d\'explorer et de maîtriser de nouveaux médias numériques, incluant les logiciels de dessin vectoriel. Ce qu\'elle aime le plus dans le design graphique, c\'est de conceptualiser des idées pour ensuite leur donner une identité visuelle forte, porteuse de sens et de valeurs.',
          'Grâce à son sens artistique et à sa capacité de traduire une mission en symbole visuel, Cloé a offert à Force Rare un logo qui incarne l\'authenticité, la sensibilité humaine et la force du collectif. Son engagement sportif nourrit aussi sa discipline et sa vision du travail d\'équipe, des qualités qu\'elle met au service des projets qui rassemblent.',
        ],
        explanationHeading: 'Explication du logo',
        explanations: [
          {
            title: 'Reconnaissance aux familles',
            body: 'Le logo met au centre une silhouette familiale, représentant l\'unité, la force et le soutien collectif. Cela reflète la mission première de Force Rare\u00a0: avancer ensemble, comme famille et comme communauté, afin de créer un impact réel dans la vie des personnes touchées par les maladies rares.',
          },
          {
            title: 'Que veut dire «\u00a0Au-delà du terrain\u00a0»\u00a0?',
            body: '«\u00a0Au-delà du terrain\u00a0» signifie que notre contribution dépasse le sport. Ce n\'est pas seulement ce que nous accomplissons dans le jeu, mais surtout ce que nous faisons dans la vie\u00a0: soutenir, sensibiliser, donner de la visibilité et faire une différence concrète pour les enfants malades et leurs familles.',
          },
          {
            title: 'Pourquoi le nom Force Rare\u00a0?',
            body: 'Force Rare symbolise la puissance des causes peu connues, mais essentielles. Les maladies rares sont souvent invisibilisées, alors qu\'elles sont bien réelles et méritent d\'être vues, reconnues et soutenues. Le nom reflète aussi la force unique des enfants, des familles et de toutes les personnes touchées par ces réalités.',
          },
          {
            title: 'Reconnaissance aux étudiant-athlètes',
            body: 'Les silhouettes levées ainsi que les icônes multisports au bas du logo rendent hommage aux étudiant-athlètes du Rouge et Or. Elles représentent leur engagement, leur discipline et leur rôle clé dans le rayonnement de la cause, bien au-delà de la performance sportive.',
          },
        ],
      },
      pillars: {
        heading: 'Les piliers de notre succès',
        items: [
          'Une mission claire et porteuse de sens',
          'Des partenariats solides et transparents',
          'Une mobilisation sincère des communautés sportives et universitaires',
          'Une communication forte, axée sur l\'émotion, la vérité et l\'impact réel',
          'Une gouvernance responsable, axée sur l\'intégrité et la confiance',
        ],
      },
      whyDifferent: {
        heading: 'Pourquoi Force Rare est différent',
        paragraphs: [
          'Force Rare se distingue par son modèle athlétique structuré et sa vision à long terme.',
          'Nous ne sommes pas une initiative spontanée et éphémère. Nous développons\u00a0:',
        ],
        list: [
          'Une gouvernance claire',
          'Une vision stratégique annuelle',
          'Une transparence financière',
          'Une identité forte et cohérente',
        ],
        accent: 'Nous croyons que l\'impact social mérite la même rigueur que la performance sportive.',
      },
      vision: {
        heading: 'Notre vision du futur',
        cards: [
          'Nous imaginons un Québec où les maladies rares ne sont plus invisibles.',
          'Un Québec où les athlètes universitaires utilisent leur voix pour des causes plus grandes qu\'eux-mêmes.',
          'Un Québec où la solidarité devient une tradition annuelle, attendue et reconnue.',
        ],
        closing: 'Force Rare n\'est qu\'au début de son histoire.',
        closingBold: 'bâtir quelque chose qui dépasse une génération',
      },
      websiteStory: {
        heading: 'L\'histoire de notre site web',
        paragraphs: [
          'Le site web de Force Rare est né d\'une amitié et d\'une confiance partagée. Avant d\'être une collaboration numérique, c\'est la rencontre de coéquipiers, unis par l\'envie d\'avoir un impact réel. Il a été façonné entre deux séances d\'entraînement, quelques soirs de semaine et grâce à beaucoup de passion. De la première ligne de code jusqu\'au lancement, tout a été créé avec soin, par deux étudiants engagés et animés par le même objectif\u00a0: offrir à Force Rare une présence numérique à l\'image du projet.',
          'Sergile Nyouvop et Chris-Noah Adjoka n\'y ont pas seulement écrit du code. Porté par la vision de Force Rare et par sa cause, ce site reflète autant leur sérieux que leur humanité. Ils ont pris le temps de comprendre l\'histoire, les valeurs et les besoins du mouvement pour les traduire en une plateforme qui lui correspond. Leur travail bénévole, souvent réalisé dans l\'ombre, permet aujourd\'hui à Force Rare de raconter son histoire, de mobiliser une communauté et de soutenir des familles à travers un outil numérique solide et évolutif.',
          'Au quotidien, ils continuent d\'ajuster le site pour lui permettre d\'évoluer au rythme du projet. Leur implication rappelle que derrière chaque page, chaque fonctionnalité et chaque détail se trouvent des personnes qui croient profondément en ce que Force Rare représente\u00a0: des personnes qui ont choisi de mettre leurs compétences au service des autres.',
        ],
      },
    };
  }

  getNotreMission(): NotreMissionContent {
    return {
      hero: {
        title: 'Notre mission',
        subtitle: 'Apporter du soutien, de la visibilité et de l\'espoir aux familles touchées par les maladies rares.',
      },
      mission: {
        heading: 'Notre mission envers les familles',
        paragraphs: [
          'Notre mission est d\'apporter du soutien, de la visibilité et de l\'espoir aux familles touchées par les maladies rares.',
          'Nous comprenons que derrière chaque diagnostic se trouvent des parents, des frères et sœurs, des défis financiers, des réalités médicales complexes et une charge émotionnelle immense. Force Rare s\'engage à\u00a0:',
        ],
        bullets: [
          'Sensibiliser la population aux maladies rares',
          'Mobiliser des ressources financières pour soutenir les initiatives liées aux familles et à la recherche',
          'Créer des moments de solidarité et de reconnaissance',
          'Amplifier la voix des familles et des chercheurs',
        ],
        accent: 'Notre engagement est guidé par le respect, l\'écoute et la transparence. Les familles ne sont pas un symbole pour nous. Elles sont au cœur de notre mission.',
      },
      ambitions: {
        heading: 'Nos ambitions',
        intro: 'Force Rare vise à devenir la plateforme philanthropique de référence portée par les athlètes universitaires au Québec.',
        cards: [
          {
            title: 'Court terme',
            items: [
              'Organiser un événement phare annuel de grande envergure',
              'Structurer un réseau d\'ambassadeurs dans plusieurs universités',
              'Augmenter significativement les fonds remis à nos partenaires',
            ],
          },
          {
            title: 'Moyen terme',
            items: [
              'Étendre le modèle à d\'autres universités québécoises',
              'Développer des partenariats corporatifs majeurs',
              'Mettre en place un modèle de match de dons structuré',
            ],
          },
          {
            title: 'Long terme',
            items: [
              'Faire de Force Rare une tradition institutionnalisée',
              'Créer un impact provincial mesurable',
              'Contribuer à changer la conversation autour des maladies rares au Québec',
            ],
          },
        ],
        closing: 'Nous ne cherchons pas seulement à amasser des fonds. Nous cherchons à bâtir un mouvement durable.',
      },
      ambassador: {
        heading: 'Un ambassadeur dans chaque équipe',
        paragraphs: [
          'Au cœur de notre modèle se trouve une ambition structurante\u00a0: avoir un ambassadeur Force Rare dans chaque équipe sportive universitaire.',
          'Nous croyons que l\'impact réel et durable passe par la proximité et l\'engagement continu. Intégrer un ambassadeur officiel au sein de chaque équipe sportive permet de créer un réseau de leaders qui portent activement la mission Force Rare toute l\'année.',
        ],
        roles: [
          'Sensibiliser leurs coéquipiers et compétiteurs à la cause des maladies rares',
          'Encourager la participation de leurs équipes aux campagnes et activités Force Rare',
          'Renforcer le lien entre Force Rare et les différentes communautés sportives',
          'Contribuer à ancrer une culture de solidarité sociale au sein du sport universitaire',
        ],
        cta: 'Devenir ambassadeur',
      },
    };
  }

  getNotreEquipe(): NotreEquipeContent {
    return {
      hero: {
        title: 'Notre équipe',
        subtitle: 'Les athlètes universitaires engagés derrière Force Rare.',
      },
      intro: {
        lead: 'Force Rare a été cofondé par des étudiants-athlètes passionnés, convaincus que le sport peut servir de levier pour un impact social significatif.',
        paragraphs: [
          'Autour de ce noyau fondateur gravite une équipe de collaborateurs, bénévoles, partenaires institutionnels et ambassadeurs universitaires. Ensemble, ils forment un écosystème engagé où chaque rôle est clair\u00a0: mobilisation, logistique, communications, partenariats, visibilité médiatique et gouvernance.',
          'Force Rare se développe avec une structure réfléchie, un souci d\'intégrité et une volonté de professionnalisme alignée avec les standards des grandes organisations philanthropiques.',
        ],
      },
      foundersHeading: 'Les fondateurs et l\'équipe',
      ambassador: {
        heading: 'Un ambassadeur dans chaque équipe',
        body: 'Nous croyons que l\'impact réel et durable passe par la proximité et l\'engagement continu. Intégrer un ambassadeur officiel au sein de chaque équipe sportive permet de créer un réseau de leaders qui portent activement la mission Force Rare toute l\'année.',
        cta: 'Devenez ambassadeur',
      },
    };
  }

  getNosPartenaires(): NosPartenairesContent {
    return {
      hero: {
        title: 'Nos partenaires',
        subtitle: 'Des collaborations fondées sur l\'intégrité, la transparence et l\'impact.',
      },
      intro: {
        lead: 'Force Rare se développe en collaboration avec des organisations reconnues qui partagent notre engagement envers les familles touchées par les maladies rares.',
        paragraphs: [
          'Ces partenariats ne sont pas symboliques\u00a0: ils sont structurants, stratégiques et essentiels à la crédibilité et à l\'impact de notre mouvement. Nous croyons que pour créer un changement durable, il faut s\'entourer d\'acteurs solides, ancrés dans le milieu médical, communautaire et scientifique.',
        ],
      },
      integrity: {
        heading: 'Une collaboration fondée sur l\'intégrité',
        items: ['Transparence', 'Clarté des objectifs', 'Responsabilité financière', 'Impact mesurable'],
        body: 'Nous croyons qu\'un mouvement crédible repose sur des alliances solides. C\'est pourquoi nous nous entourons d\'organisations reconnues qui partagent notre exigence de rigueur et notre engagement envers les familles.',
      },
    };
  }

  getCollaborer(): CollaborerContent {
    return {
      hero: {
        title: 'Collaborer avec Force Rare',
        subtitle: 'Associez votre organisation à une initiative crédible, structurée et portée par une nouvelle génération de leaders.',
      },
      intro: 'Force Rare offre aux entreprises l\'opportunité de s\'associer à une initiative crédible, structurée et portée par une nouvelle génération de leaders universitaires.',
      benefits: {
        heading: 'Pourquoi collaborer avec nous',
        intro: 'En collaborant avec Force Rare, votre organisation\u00a0:',
        cards: [
          { title: 'Impact concret', description: 'Contribue concrètement au soutien des familles touchées par les maladies rares.' },
          { title: 'Visibilité stratégique', description: 'Bénéficie d\'une visibilité auprès d\'un public universitaire et sportif engagé.' },
          { title: 'Cause mobilisatrice', description: 'S\'associe à une cause humaine forte et mobilisatrice.' },
          { title: 'Responsabilité sociale', description: 'Intègre une initiative alignée avec les valeurs d\'engagement social et de responsabilité corporative.' },
        ],
      },
      forms: {
        heading: 'Formes de collaboration',
        items: [
          { number: '01', title: 'Partenariats financiers', description: 'Soutenez notre mission par un engagement financier structuré et transparent.' },
          { number: '02', title: 'Match de dons', description: 'Doublez l\'impact des donateurs en jumelant chaque don reçu.' },
          { number: '03', title: 'Visibilité événementielle', description: 'Associez votre marque à nos événements et campagnes médiatiques.' },
          { number: '04', title: 'Implication interne', description: 'Mobilisez vos employés autour d\'une cause fédératrice et humaine.' },
        ],
      },
      cta: {
        heading: 'Prêt à collaborer\u00a0?',
        body: 'Notre équipe s\'engage à offrir une communication claire, des rapports d\'impact et une reconnaissance professionnelle adaptée aux standards corporatifs.',
        primaryCta: 'Nous joindre',
        secondaryCta: 'Faire un don',
      },
    };
  }

  getNousJoindre(): NousJoindreContent {
    return {
      hero: {
        title: 'Nous joindre',
        subtitle: 'Une question, une idée de collaboration ou un intérêt pour devenir ambassadeur? Contactez-nous.',
      },
      formHeading: 'Envoyez-nous un message',
      successMessage: 'Merci pour votre message! Nous vous répondrons dans les plus brefs délais.',
      subjectOptions: [
        'Question générale',
        'Partenariat / Collaboration',
        'Don / Financement',
        'Bénévolat / Ambassadeur',
        'Médias / Presse',
        'Autre',
      ],
      labels: {
        name: 'Nom complet',
        email: 'Courriel',
        subject: 'Sujet',
        customSubject: 'Précisez le sujet',
        message: 'Message',
        submit: 'Envoyer',
      },
      placeholders: {
        name: 'Votre nom',
        email: 'votre@courriel.com',
        subject: 'Sélectionnez un sujet',
        customSubject: 'Décrivez brièvement votre demande',
        message: 'Votre message...',
      },
      sidebar: {
        coordTitle: 'Coordonnées',
        emailLabel: 'Courriel',
        email: 'faq.force.rare@gmail.com',
        socialTitle: 'Réseaux sociaux',
        topicsTitle: 'Sujets fréquents',
        topics: [
          'Devenir ambassadeur',
          'Partenariat corporatif',
          'Bénévolat',
          'Médias et presse',
          'Autre demande',
        ],
      },
    };
  }

  getFaireUnDon(): FaireUnDonContent {
    return {
      hero: {
        title: 'Faire un don',
        subtitle: 'Chaque geste compte. Soutenez les familles touchées par les maladies rares.',
      },
      main: {
        heading: 'Votre don fait la différence',
        paragraphs: [
          'Chaque don, peu importe sa taille, contribue directement au soutien des enfants et des familles touchées par les maladies rares au Québec. Vos contributions sont dirigées vers nos partenaires reconnus\u00a0: le RQMO, le Fonds Mille-Pattes et le CHUL.',
          'Force Rare s\'engage à une transparence totale dans la gestion des fonds. Chaque dollar est orienté vers des initiatives concrètes\u00a0: soutien financier aux familles, sensibilisation publique et recherche médicale.',
        ],
        cta: 'Faire un don via Zeffy',
        note: 'Plateforme de don sécurisée — 100% des fonds vont à la cause.',
      },
      impact: {
        title: 'Votre impact',
        cards: [
          { number: '01', title: 'Soutien direct', description: 'Aide financière aux familles d\'enfants atteints de maladies rares.' },
          { number: '02', title: 'Recherche', description: 'Contribution à la recherche médicale via le CHUL.' },
          { number: '03', title: 'Sensibilisation', description: 'Campagnes de visibilité pour les maladies rares au Québec.' },
        ],
      },
      otherWays: {
        heading: 'Autres façons de contribuer',
        items: [
          { title: 'Bénévolat', description: 'Participez à nos événements et campagnes en tant que bénévole.' },
          { title: 'Partage', description: 'Partagez notre mission sur vos réseaux sociaux pour sensibiliser votre entourage.' },
          { title: 'Partenariat', description: 'Associez votre entreprise à notre mouvement pour un impact partagé.' },
        ],
      },
    };
  }
}
