'use client';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Shield } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useT } from '@/lib/i18n/useT';

const SECTIONS = {
  en: [
    {
      title: '1. Acceptance of Terms',
      body: `By accessing or using the riftApply platform ("Platform"), you agree to be legally bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you must not use the Platform. These Terms apply to all users including students, agents, university representatives, and administrators.`,
    },
    {
      title: '2. Description of Service',
      body: `riftApply is an online university admissions platform that facilitates the submission, tracking, and management of applications between students, verified agents, and partner universities. riftApply acts solely as an intermediary and does not guarantee admission to any institution.`,
    },
    {
      title: '3. User Accounts & Eligibility',
      body: `You must be at least 16 years of age to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. Each user may maintain only one account. Sharing account credentials is strictly prohibited.`,
    },
    {
      title: '4. Document Submission & Authenticity',
      body: `Users are solely responsible for the accuracy and authenticity of all documents uploaded to the Platform, including but not limited to: passports, national identity cards, academic transcripts, diplomas, language test certificates, letters of recommendation, and personal statements. Uploading forged, altered, or misleading documents constitutes fraud and may result in immediate account suspension, permanent ban, and referral to relevant legal authorities. riftApply reserves the right to verify documents through third-party verification services.`,
    },
    {
      title: '5. Agent Responsibilities',
      body: `Agents registered on riftApply must be duly authorised to represent students. Agents may not charge hidden fees to students beyond those disclosed on the Platform. Any fraudulent activity, misrepresentation, or abuse of the Platform by an agent will result in immediate removal and may be reported to regulatory authorities.`,
    },
    {
      title: '6. University Partner Obligations',
      body: `Universities listed on riftApply agree to process applications in good faith, provide accurate program information, and respond to student inquiries in a timely manner. riftApply reserves the right to remove any institution that does not comply with our quality standards.`,
    },
    {
      title: '7. Prohibited Activities',
      body: `You agree not to: (a) upload false or misleading information or documents; (b) impersonate any person or entity; (c) attempt to gain unauthorised access to the Platform or other user accounts; (d) use the Platform for any unlawful purpose; (e) transmit spam, malware, or harmful code; (f) scrape, crawl, or harvest data without express written permission; (g) interfere with the security or integrity of the Platform.`,
    },
    {
      title: '8. Intellectual Property',
      body: `All content on the Platform — including text, graphics, logos, software, and data — is the exclusive property of riftApply or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.`,
    },
    {
      title: '9. Payment & Fees',
      body: `Student registration and application submission are free of charge. Service fees may apply for premium features or agent services. All fees are clearly disclosed before any transaction. Payments are processed securely through third-party payment providers. riftApply does not store full payment card details.`,
    },
    {
      title: '10. Limitation of Liability',
      body: `To the maximum extent permitted by law, riftApply shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from: (a) your use of or inability to use the Platform; (b) admission decisions made by universities; (c) errors in documents submitted by users; (d) delays caused by third parties. riftApply's total aggregate liability shall not exceed the fees paid by the user in the twelve months preceding the claim.`,
    },
    {
      title: '11. Disclaimer of Warranties',
      body: `The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied. riftApply does not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.`,
    },
    {
      title: '12. Account Termination',
      body: `riftApply reserves the right to suspend or permanently terminate any account at its sole discretion, with or without notice, for violations of these Terms, fraudulent activity, or behaviour harmful to other users or the integrity of the Platform.`,
    },
    {
      title: '13. Modifications to Terms',
      body: `riftApply reserves the right to modify these Terms at any time. Continued use of the Platform after changes constitutes your acceptance of the revised Terms. We will notify registered users of material changes via email or an in-Platform notice.`,
    },
    {
      title: '14. Governing Law',
      body: `These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts in the jurisdiction where riftApply is registered.`,
    },
    {
      title: '15. Contact',
      body: `For questions regarding these Terms of Service, please contact us at: legal@riftapply.com`,
    },
  ],
  fr: [
    {
      title: '1. Acceptation des conditions',
      body: `En accédant ou en utilisant la plateforme riftApply (« Plateforme »), vous acceptez d'être légalement lié par les présentes Conditions d'utilisation (« Conditions »). Si vous n'acceptez pas une partie de ces Conditions, vous ne devez pas utiliser la Plateforme. Ces Conditions s'appliquent à tous les utilisateurs, notamment les étudiants, agents, représentants d'universités et administrateurs.`,
    },
    {
      title: '2. Description du service',
      body: `riftApply est une plateforme d'admission universitaire en ligne qui facilite la soumission, le suivi et la gestion des candidatures entre les étudiants, les agents vérifiés et les universités partenaires. riftApply agit uniquement en tant qu'intermédiaire et ne garantit pas l'admission dans un établissement.`,
    },
    {
      title: '3. Comptes utilisateurs et éligibilité',
      body: `Vous devez avoir au moins 16 ans pour créer un compte. Vous vous engagez à fournir des informations exactes, actuelles et complètes lors de l'inscription et à les mettre à jour. Chaque utilisateur ne peut maintenir qu'un seul compte. Le partage des identifiants est strictement interdit.`,
    },
    {
      title: '4. Soumission de documents et authenticité',
      body: `Les utilisateurs sont seuls responsables de l'exactitude et de l'authenticité de tous les documents téléchargés sur la Plateforme, notamment : passeports, cartes nationales d'identité, relevés de notes académiques, diplômes, certificats de tests linguistiques, lettres de recommandation et lettres de motivation. Le téléchargement de documents falsifiés, modifiés ou trompeurs constitue une fraude et peut entraîner la suspension immédiate du compte, un bannissement permanent et un signalement aux autorités compétentes. riftApply se réserve le droit de vérifier les documents via des services tiers.`,
    },
    {
      title: '5. Responsabilités des agents',
      body: `Les agents enregistrés sur riftApply doivent être dûment autorisés à représenter des étudiants. Les agents ne peuvent pas facturer des frais cachés aux étudiants au-delà de ceux divulgués sur la Plateforme. Toute activité frauduleuse ou abus de la Plateforme par un agent entraînera sa suppression immédiate et pourra être signalée aux autorités réglementaires.`,
    },
    {
      title: '6. Obligations des universités partenaires',
      body: `Les universités référencées sur riftApply s'engagent à traiter les candidatures de bonne foi, à fournir des informations exactes sur les programmes et à répondre rapidement aux demandes des étudiants. riftApply se réserve le droit de retirer tout établissement ne respectant pas ses standards de qualité.`,
    },
    {
      title: '7. Activités interdites',
      body: `Vous vous engagez à ne pas : (a) télécharger des informations ou documents faux ou trompeurs ; (b) usurper l'identité de toute personne ou entité ; (c) tenter d'accéder sans autorisation à la Plateforme ou à d'autres comptes ; (d) utiliser la Plateforme à des fins illégales ; (e) transmettre des spams, logiciels malveillants ou codes nuisibles ; (f) extraire des données sans autorisation écrite expresse ; (g) perturber la sécurité ou l'intégrité de la Plateforme.`,
    },
    {
      title: '8. Propriété intellectuelle',
      body: `Tout le contenu de la Plateforme — textes, graphiques, logos, logiciels et données — est la propriété exclusive de riftApply ou de ses concédants et est protégé par les lois sur la propriété intellectuelle. Vous ne pouvez pas reproduire, distribuer ou créer des œuvres dérivées sans consentement écrit préalable.`,
    },
    {
      title: '9. Paiements et frais',
      body: `L'inscription des étudiants et la soumission des candidatures sont gratuites. Des frais de service peuvent s'appliquer pour des fonctionnalités premium ou des services d'agents. Tous les frais sont clairement indiqués avant toute transaction. Les paiements sont traités de manière sécurisée via des prestataires de paiement tiers. riftApply ne stocke pas les données complètes de carte de paiement.`,
    },
    {
      title: '10. Limitation de responsabilité',
      body: `Dans les limites permises par la loi, riftApply ne saurait être tenu responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs résultant de : (a) votre utilisation ou incapacité à utiliser la Plateforme ; (b) décisions d'admission prises par des universités ; (c) erreurs dans les documents soumis par les utilisateurs ; (d) retards causés par des tiers. La responsabilité totale de riftApply ne dépassera pas les frais payés par l'utilisateur au cours des douze mois précédant la réclamation.`,
    },
    {
      title: '11. Exclusion de garanties',
      body: `La Plateforme est fournie « telle quelle » et « selon disponibilité », sans garantie d'aucune sorte, expresse ou implicite. riftApply ne garantit pas que la Plateforme sera ininterrompue, exempte d'erreurs ou de virus.`,
    },
    {
      title: '12. Résiliation du compte',
      body: `riftApply se réserve le droit de suspendre ou de résilier définitivement tout compte à sa seule discrétion, avec ou sans préavis, en cas de violations des présentes Conditions, d'activité frauduleuse ou de comportement nuisible à d'autres utilisateurs ou à l'intégrité de la Plateforme.`,
    },
    {
      title: '13. Modifications des conditions',
      body: `riftApply se réserve le droit de modifier les présentes Conditions à tout moment. La poursuite de l'utilisation de la Plateforme après les modifications constitue votre acceptation des Conditions révisées. Nous notifierons les utilisateurs enregistrés des modifications importantes par e-mail ou via un avis sur la Plateforme.`,
    },
    {
      title: '14. Droit applicable',
      body: `Les présentes Conditions sont régies et interprétées conformément aux lois applicables. Tout litige découlant de ces Conditions sera soumis à la compétence exclusive des tribunaux compétents dans la juridiction où riftApply est enregistré.`,
    },
    {
      title: '15. Contact',
      body: `Pour toute question concernant les présentes Conditions d'utilisation, veuillez nous contacter à : legal@riftapply.com`,
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
          <p className="text-blue-200 text-sm">{T(t.termsPage.subtitle)}</p>
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
                ? 'These Terms of Service govern your use of the riftApply platform. By registering or using any part of our service, you confirm that you have read, understood, and agreed to be bound by these Terms. riftApply reserves the right to modify these Terms at any time.'
                : 'Les présentes Conditions d\'utilisation régissent votre utilisation de la plateforme riftApply. En vous inscrivant ou en utilisant une partie de notre service, vous confirmez avoir lu, compris et accepté d\'être lié par ces Conditions. riftApply se réserve le droit de modifier ces Conditions à tout moment.'}
            </p>
          </div>

          {/* Sections */}
          <div className="px-8 py-6 space-y-8">
            {sections.map((s, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h2 className="text-lg font-bold text-[#0f2544] mb-3">{s.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
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
