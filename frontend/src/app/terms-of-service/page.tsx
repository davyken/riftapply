'use client';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Shield } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useT } from '@/lib/i18n/useT';

interface Section {
  title: string;
  body?: string;
  list?: string[];
  note?: string;
}

const SECTIONS: Record<'en' | 'fr', Section[]> = {
  en: [
    {
      title: '1. Our Services',
      body: 'riftApply is an international university admissions platform owned by GreatRift Consultancy. We connect students with accredited universities across 30+ countries through a streamlined application process and a network of verified education agents.',
      list: [
        'Creating student profiles',
        'Browsing and applying to partner universities',
        'Connecting with verified agents',
        'Tracking applications',
        'Receiving support throughout the admission journey',
      ],
    },
    {
      title: '2. Eligibility',
      body: 'You must be at least 18 years old (or the age of majority in your jurisdiction) to use our Services. By using the Platform, you represent and warrant that you meet this requirement.',
      note: 'Students under 18 may only use the Platform with the consent and involvement of a parent or legal guardian.',
    },
    {
      title: '3. User Accounts',
      list: [
        'You must provide accurate, current, and complete information when registering.',
        'You are responsible for keeping your account credentials confidential.',
        'Notify us immediately of any unauthorized access to your account.',
        'We reserve the right to suspend or terminate accounts involved in violations of these Terms.',
      ],
    },
    {
      title: '4. User Roles',
      body: 'The Platform supports:',
      list: [
        'Students: Individuals seeking university admission.',
        'Agents: Verified education consultants.',
        'University Representatives: Authorized personnel from partner institutions.',
      ],
      note: 'Misrepresenting your role may lead to immediate account termination.',
    },
    {
      title: '5. Acceptable Use',
      body: 'You agree not to:',
      list: [
        'Use the Platform for any illegal or fraudulent activity.',
        'Upload or submit false, misleading, or forged documents.',
        'Harass, threaten, or abuse other users.',
        'Attempt to reverse engineer, scrape, or unauthorizedly access the Platform.',
        'Transmit spam, viruses, or harmful code.',
      ],
    },
    {
      title: '6. Agent Services',
      list: [
        'Agents on riftApply are verified by GreatRift Consultancy, but we do not guarantee the quality or success of their individual services.',
        'All arrangements and payments between students and agents are made directly between them. riftApply / GreatRift Consultancy acts only as a platform facilitator.',
        'Any fees charged by agents are separate from our platform services.',
      ],
    },
    {
      title: '7. University Applications',
      list: [
        'We do not guarantee admission to any university.',
        'All admission decisions are made solely by the respective universities.',
        'We are not responsible for visa outcomes, scholarship results, or changes in university policies.',
      ],
    },
    {
      title: '8. Intellectual Property',
      body: 'All content, logos, designs, and software on riftApply are the property of GreatRift Consultancy. You are granted a limited, revocable, non-exclusive license to use the Services for personal educational purposes only. You retain ownership of the documents you upload but grant us a royalty-free license to use them as needed to provide the Services.',
    },
    {
      title: '9. Privacy',
      body: 'Your privacy is important to us. Please read our Privacy Policy for details on how we collect, use, and protect your data.',
    },
    {
      title: '10. Fees and Payments',
      list: [
        'Basic use of the platform is currently free.',
        'Premium features, agent services, or third-party services may attract fees.',
        'Refunds (if any) are governed by the specific provider\'s policy.',
      ],
    },
    {
      title: '11. Disclaimers',
      body: 'The Services are provided "AS IS" and "AS AVAILABLE" without any warranties, express or implied. We do not guarantee uninterrupted access, error-free operation, or successful admission outcomes.',
    },
    {
      title: '12. Limitation of Liability',
      body: 'To the fullest extent permitted by law, GreatRift Consultancy shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our maximum liability shall not exceed the total amount paid by you (if any) in the twelve (12) months prior to the claim.',
    },
    {
      title: '13. Termination',
      body: 'We may suspend or terminate your access to the Services at any time, with or without notice, for any reason, including breach of these Terms.',
    },
    {
      title: '14. Governing Law',
      body: 'These Terms are governed by the laws of the Republic of Cameroon. Any disputes shall be resolved exclusively in the courts located in Yaoundé, Cameroon.',
    },
    {
      title: '15. Changes to Terms',
      body: 'We may revise these Terms from time to time. We will notify you of significant changes by updating the Effective Date and posting the new version on this page. Continued use of the Platform after changes constitutes your acceptance of the updated Terms.',
    },
    {
      title: '16. Contact Us',
      body: 'For any questions regarding these Terms, please contact us at:',
      list: [
        'Email: support@riftapply.com',
        'Phone: +237 693230485',
        'Address: Yaoundé, Cameroon',
      ],
    },
  ],
  fr: [
    {
      title: '1. Nos Services',
      body: 'riftApply est une plateforme internationale d\'admission universitaire détenue par GreatRift Consultancy. Nous mettons en relation les étudiants avec des universités accréditées dans plus de 30 pays via un processus de candidature simplifié et un réseau d\'agents éducatifs vérifiés.',
      list: [
        'Création de profils étudiants',
        'Recherche et candidature auprès des universités partenaires',
        'Mise en relation avec des agents vérifiés',
        'Suivi des candidatures',
        'Accompagnement tout au long du parcours d\'admission',
      ],
    },
    {
      title: '2. Éligibilité',
      body: 'Vous devez avoir au moins 18 ans (ou l\'âge de la majorité dans votre juridiction) pour utiliser nos Services. En utilisant la Plateforme, vous déclarez et garantissez que vous remplissez cette condition.',
      note: 'Les étudiants de moins de 18 ans ne peuvent utiliser la Plateforme qu\'avec le consentement et la participation d\'un parent ou d\'un tuteur légal.',
    },
    {
      title: '3. Comptes Utilisateurs',
      list: [
        'Vous devez fournir des informations exactes, actuelles et complètes lors de votre inscription.',
        'Vous êtes responsable de la confidentialité de vos identifiants de connexion.',
        'Informez-nous immédiatement de tout accès non autorisé à votre compte.',
        'Nous nous réservons le droit de suspendre ou de résilier les comptes impliqués dans des violations des présentes Conditions.',
      ],
    },
    {
      title: '4. Rôles des Utilisateurs',
      body: 'La Plateforme prend en charge :',
      list: [
        'Étudiants : personnes cherchant à être admises dans une université.',
        'Agents : consultants en éducation vérifiés.',
        'Représentants d\'universités : personnel autorisé des établissements partenaires.',
      ],
      note: 'Toute fausse représentation de votre rôle peut entraîner la résiliation immédiate de votre compte.',
    },
    {
      title: '5. Utilisation Acceptable',
      body: 'Vous vous engagez à ne pas :',
      list: [
        'Utiliser la Plateforme à des fins illégales ou frauduleuses.',
        'Télécharger ou soumettre des documents faux, trompeurs ou falsifiés.',
        'Harceler, menacer ou maltraiter d\'autres utilisateurs.',
        'Tenter d\'effectuer de la rétro-ingénierie, du scraping ou d\'accéder sans autorisation à la Plateforme.',
        'Transmettre des spams, des virus ou des codes nuisibles.',
      ],
    },
    {
      title: '6. Services des Agents',
      list: [
        'Les agents sur riftApply sont vérifiés par GreatRift Consultancy, mais nous ne garantissons pas la qualité ou le succès de leurs services individuels.',
        'Tous les arrangements et paiements entre étudiants et agents se font directement entre eux. riftApply / GreatRift Consultancy agit uniquement comme facilitateur de plateforme.',
        'Tous les frais facturés par les agents sont distincts des services de notre plateforme.',
      ],
    },
    {
      title: '7. Candidatures Universitaires',
      list: [
        'Nous ne garantissons pas l\'admission dans une université.',
        'Toutes les décisions d\'admission sont prises uniquement par les universités respectives.',
        'Nous ne sommes pas responsables des résultats de visa, des résultats de bourses ou des changements de politique universitaire.',
      ],
    },
    {
      title: '8. Propriété Intellectuelle',
      body: 'Tout le contenu, les logos, les designs et les logiciels de riftApply sont la propriété de GreatRift Consultancy. Vous bénéficiez d\'une licence limitée, révocable et non exclusive pour utiliser les Services à des fins éducatives personnelles uniquement. Vous conservez la propriété des documents que vous téléchargez, mais nous accordez une licence sans redevance pour les utiliser dans le cadre de la fourniture des Services.',
    },
    {
      title: '9. Confidentialité',
      body: 'Votre vie privée est importante pour nous. Veuillez consulter notre Politique de Confidentialité pour en savoir plus sur la façon dont nous collectons, utilisons et protégeons vos données.',
    },
    {
      title: '10. Frais et Paiements',
      list: [
        'L\'utilisation de base de la plateforme est actuellement gratuite.',
        'Des fonctionnalités premium, des services d\'agents ou des services tiers peuvent entraîner des frais.',
        'Les remboursements (le cas échéant) sont régis par la politique du prestataire concerné.',
      ],
    },
    {
      title: '11. Avertissements',
      body: 'Les Services sont fournis « EN L\'ÉTAT » et « SELON DISPONIBILITÉ », sans aucune garantie, expresse ou implicite. Nous ne garantissons pas un accès ininterrompu, un fonctionnement sans erreur ni des résultats d\'admission réussis.',
    },
    {
      title: '12. Limitation de Responsabilité',
      body: 'Dans toute la mesure permise par la loi, GreatRift Consultancy ne saurait être tenue responsable des dommages indirects, accessoires ou consécutifs résultant de votre utilisation de la Plateforme. Notre responsabilité maximale ne dépassera pas le montant total payé par vous (le cas échéant) au cours des douze (12) mois précédant la réclamation.',
    },
    {
      title: '13. Résiliation',
      body: 'Nous pouvons suspendre ou résilier votre accès aux Services à tout moment, avec ou sans préavis, pour quelque raison que ce soit, y compris en cas de violation des présentes Conditions.',
    },
    {
      title: '14. Droit Applicable',
      body: 'Les présentes Conditions sont régies par les lois de la République du Cameroun. Tout litige sera résolu exclusivement devant les tribunaux compétents de Yaoundé, Cameroun.',
    },
    {
      title: '15. Modifications des Conditions',
      body: 'Nous pouvons réviser les présentes Conditions de temps à autre. Nous vous informerons des modifications importantes en mettant à jour la Date d\'entrée en vigueur et en publiant la nouvelle version sur cette page. La poursuite de l\'utilisation de la Plateforme après les modifications constitue votre acceptation des Conditions mises à jour.',
    },
    {
      title: '16. Contactez-nous',
      body: 'Pour toute question concernant les présentes Conditions, veuillez nous contacter à :',
      list: [
        'E-mail : support@riftapply.com',
        'Téléphone : +237 693230485',
        'Adresse : Yaoundé, Cameroun',
      ],
    },
  ],
};

export default function TermsOfServicePage() {
  const { T, lang, t } = useT();
  const sections = SECTIONS[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f2544] text-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm">
              <ArrowLeft size={16} />
              {lang === 'en' ? 'Back to Home' : 'Retour à l\'accueil'}
            </Link>
            <LanguageToggle />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Shield size={22} className="text-blue-300" />
            </div>
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{T(t.termsPage.title)}</h1>
          <p className="text-blue-200 text-sm">
            {lang === 'en'
              ? 'riftApply · Owned and operated by GreatRift Consultancy, Yaoundé, Cameroon'
              : 'riftApply · Détenu et exploité par GreatRift Consultancy, Yaoundé, Cameroun'}
          </p>
          <p className="text-blue-400 text-xs mt-3">
            {T(t.common.lastUpdated)}: {lang === 'en' ? 'May 26, 2026' : '26 mai 2026'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Intro banner */}
          <div className="bg-blue-50 border-b border-blue-100 px-8 py-5">
            <p className="text-sm text-blue-800 leading-relaxed">
              {lang === 'en'
                ? 'By accessing or using our website https://riftapply.com and any related services, you agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not use our Services.'
                : 'En accédant ou en utilisant notre site https://riftapply.com et tout service associé, vous acceptez d\'être lié par les présentes Conditions d\'utilisation. Si vous n\'acceptez pas ces Conditions, veuillez ne pas utiliser nos Services.'}
            </p>
          </div>

          {/* Sections */}
          <div className="px-8 py-6 space-y-8">
            {sections.map((s, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h2 className="text-lg font-bold text-[#0f2544] mb-3">{s.title}</h2>
                {s.body && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{s.body}</p>
                )}
                {s.list && (
                  <ul className="list-disc list-inside space-y-1.5 mb-3">
                    {s.list.map((item, j) => (
                      <li key={j} className="text-gray-600 text-sm leading-relaxed">{item}</li>
                    ))}
                  </ul>
                )}
                {s.note && (
                  <p className="text-gray-500 text-sm italic leading-relaxed">{s.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 text-sm text-gray-500">
          <Link href="/privacy-policy" className="text-blue-600 hover:underline">
            {T(t.common.privacy)}
          </Link>
          <Link href="/" className="hover:text-gray-700">
            {lang === 'en' ? '← Back to riftApply' : '← Retour à riftApply'}
          </Link>
        </div>
      </div>
    </div>
  );
}
