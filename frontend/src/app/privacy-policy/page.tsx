'use client';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Lock } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useT } from '@/lib/i18n/useT';

const SECTIONS = {
  en: [
    {
      title: '1. Who We Are',
      body: `riftApply ("we", "us", "our") operates the university admissions platform accessible at riftapply.vercel.app. We are committed to protecting the personal data and privacy of all users — students, agents, and university partners alike. This Privacy Policy explains what data we collect, why we collect it, how we use and protect it, and your rights regarding your data.`,
    },
    {
      title: '2. Data We Collect',
      body: `We collect the following categories of personal data:\n\n• Identity data: full name, date of birth, nationality, gender.\n• Contact data: email address, phone number, residential address, city, country.\n• Account data: username, encrypted password, role (student / agent / university), account status, registration date.\n• Academic data: transcripts, diplomas, academic certificates, language test scores (IELTS, TOEFL, PTE, DELF, etc.), personal statements, letters of recommendation, and study preferences.\n• Identity documents: passport copies, national identity cards (CNI), visas — uploaded solely for application purposes.\n• Company data (agents): business registration documents, company name, address, and agent type.\n• University data: institution name, accreditation documents, program lists, logos, website, and location.\n• Usage data: IP address, browser type, pages visited, session duration, login timestamps — collected automatically for security and analytics.\n• Communication data: messages sent through the Platform between users, agents, and administrators.`,
    },
    {
      title: '3. How We Use Your Data',
      body: `We use your personal data strictly for the following purposes:\n\n• To create and manage your account on the Platform.\n• To process and submit your university applications.\n• To verify the identity and eligibility of agents and universities.\n• To communicate with you about the status of your applications, account updates, and support requests.\n• To send email notifications including verification codes, application decisions, and important platform updates.\n• To detect and prevent fraud, document forgery, and unauthorised access.\n• To comply with legal obligations and respond to lawful requests from authorities.\n• To improve the Platform through aggregated, anonymised analytics.\n\nWe will never sell your personal data to any third party.`,
    },
    {
      title: '4. Document Storage & Security',
      body: `All documents uploaded to riftApply — including passports, transcripts, identity cards, and certificates — are stored securely using Cloudinary, an industry-standard cloud storage provider with end-to-end encryption. Documents are:\n\n• Stored with AES-256 encryption at rest.\n• Transmitted over HTTPS/TLS encrypted connections.\n• Accessible only to authorised personnel and the universities you have applied to.\n• Never shared with third parties without your explicit consent, except as required by law.\n• Retained for a maximum of 36 months after your last activity, unless you request earlier deletion.`,
    },
    {
      title: '5. Legal Basis for Processing',
      body: `We process your personal data on the following legal bases:\n\n• Contractual necessity: to provide the services described in our Terms of Service.\n• Legitimate interests: to prevent fraud, ensure platform security, and improve our services.\n• Legal obligation: to comply with applicable laws and regulations.\n• Consent: for optional communications and marketing messages — you may withdraw consent at any time.`,
    },
    {
      title: '6. Data Sharing',
      body: `We share your data only with:\n\n• Partner universities you apply to — only the application data and documents required for that specific application.\n• Verified agents acting on your behalf — only with your authorisation.\n• Infrastructure providers: MongoDB (database), Cloudinary (file storage), Resend (transactional email), Render (server hosting) — all bound by strict data processing agreements.\n• Law enforcement or regulatory bodies — only when legally required.\n\nWe do not sell, rent, or trade your personal data with any third party for marketing purposes.`,
    },
    {
      title: '7. Data Retention',
      body: `We retain your personal data for as long as your account is active, plus a period of 36 months thereafter to comply with legal obligations. Unverified accounts (where email verification was not completed) are automatically deleted after 5 minutes. You may request deletion of your account and associated data at any time by contacting privacy@riftapply.com. Documents specifically uploaded for university applications may be retained for the period required by the receiving institution.`,
    },
    {
      title: '8. Your Rights',
      body: `Depending on your jurisdiction, you have the following rights regarding your personal data:\n\n• Right of access: obtain a copy of the data we hold about you.\n• Right to rectification: correct inaccurate or incomplete data.\n• Right to erasure ("right to be forgotten"): request deletion of your data.\n• Right to restriction: request that we limit how we process your data.\n• Right to data portability: receive your data in a structured, machine-readable format.\n• Right to object: object to processing based on legitimate interests.\n• Right to withdraw consent: for any processing based on your consent.\n\nTo exercise any of these rights, contact us at: privacy@riftapply.com`,
    },
    {
      title: '9. Cookies & Tracking',
      body: `riftApply uses strictly necessary cookies for authentication (JWT tokens stored in localStorage) and session management. We do not use third-party advertising cookies or tracking pixels. Usage analytics are collected in an aggregated, anonymised form. You may clear cookies at any time through your browser settings.`,
    },
    {
      title: '10. Children\'s Privacy',
      body: `The Platform is not intended for children under the age of 16. We do not knowingly collect personal data from persons under 16 without verifiable parental consent. If we discover that a minor has registered without consent, we will delete their account and associated data promptly.`,
    },
    {
      title: '11. International Data Transfers',
      body: `Your data may be processed and stored on servers located outside your country of residence. By using riftApply, you consent to such transfers. We ensure that all international data transfers comply with applicable data protection laws through appropriate safeguards, including standard contractual clauses.`,
    },
    {
      title: '12. Security Measures',
      body: `We implement the following technical and organisational security measures:\n\n• All passwords are hashed using bcrypt with salt rounds.\n• All API communications are encrypted via HTTPS/TLS.\n• Database access is restricted to authorised services only.\n• Rate limiting and brute-force protection on all authentication endpoints.\n• Automatic deletion of unverified accounts after 5 minutes.\n• Regular security audits and vulnerability assessments.`,
    },
    {
      title: '13. Changes to This Policy',
      body: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify registered users via email or an in-Platform notice at least 14 days before any material changes take effect. The "Last updated" date at the top of this page always reflects the current version.`,
    },
    {
      title: '14. Contact & Data Protection Officer',
      body: `For any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact:\n\nEmail: privacy@riftapply.com\nSupport: support@riftapply.com\n\nWe aim to respond to all legitimate requests within 30 days.`,
    },
  ],
  fr: [
    {
      title: '1. Qui sommes-nous',
      body: `riftApply (« nous », « notre ») exploite la plateforme d'admission universitaire accessible sur riftapply.vercel.app. Nous nous engageons à protéger les données personnelles et la vie privée de tous les utilisateurs — étudiants, agents et universités partenaires. La présente Politique de confidentialité explique quelles données nous collectons, pourquoi nous les collectons, comment nous les utilisons et les protégeons, ainsi que vos droits concernant vos données.`,
    },
    {
      title: '2. Données collectées',
      body: `Nous collectons les catégories suivantes de données personnelles :\n\n• Données d'identité : nom complet, date de naissance, nationalité, genre.\n• Données de contact : adresse e-mail, numéro de téléphone, adresse résidentielle, ville, pays.\n• Données de compte : nom d'utilisateur, mot de passe chiffré, rôle (étudiant / agent / université), statut du compte, date d'inscription.\n• Données académiques : relevés de notes, diplômes, certificats académiques, résultats de tests linguistiques (IELTS, TOEFL, PTE, DELF, etc.), lettres de motivation, lettres de recommandation et préférences d'études.\n• Documents d'identité : copies de passeport, cartes nationales d'identité (CNI), visas — téléchargés uniquement à des fins de candidature.\n• Données d'entreprise (agents) : documents d'enregistrement d'entreprise, nom, adresse et type d'agent.\n• Données universitaires : nom de l'établissement, documents d'accréditation, listes de programmes, logos, site web et localisation.\n• Données d'utilisation : adresse IP, type de navigateur, pages visitées, durée de session, horodatage des connexions.\n• Données de communication : messages échangés entre utilisateurs, agents et administrateurs via la Plateforme.`,
    },
    {
      title: '3. Utilisation de vos données',
      body: `Nous utilisons vos données personnelles strictement aux fins suivantes :\n\n• Créer et gérer votre compte sur la Plateforme.\n• Traiter et soumettre vos candidatures universitaires.\n• Vérifier l'identité et l'éligibilité des agents et des universités.\n• Communiquer avec vous sur le statut de vos candidatures, les mises à jour du compte et les demandes d'assistance.\n• Envoyer des notifications par e-mail incluant codes de vérification, décisions d'admission et mises à jour importantes.\n• Détecter et prévenir la fraude, la falsification de documents et les accès non autorisés.\n• Se conformer aux obligations légales et répondre aux demandes légitimes des autorités.\n• Améliorer la Plateforme via des analyses agrégées et anonymisées.\n\nNous ne vendrons jamais vos données personnelles à des tiers.`,
    },
    {
      title: '4. Stockage et sécurité des documents',
      body: `Tous les documents téléchargés sur riftApply — passeports, relevés de notes, cartes d'identité et certificats — sont stockés de manière sécurisée via Cloudinary, un prestataire de stockage cloud standard avec chiffrement de bout en bout. Les documents sont :\n\n• Stockés avec chiffrement AES-256 au repos.\n• Transmis via des connexions chiffrées HTTPS/TLS.\n• Accessibles uniquement au personnel autorisé et aux universités auxquelles vous avez postulé.\n• Jamais partagés avec des tiers sans votre consentement explicite, sauf obligation légale.\n• Conservés 36 mois maximum après votre dernière activité, sauf demande de suppression anticipée.`,
    },
    {
      title: '5. Base légale du traitement',
      body: `Nous traitons vos données personnelles sur les bases légales suivantes :\n\n• Nécessité contractuelle : pour fournir les services décrits dans nos Conditions d'utilisation.\n• Intérêts légitimes : pour prévenir la fraude, assurer la sécurité de la plateforme et améliorer nos services.\n• Obligation légale : pour se conformer aux lois et réglementations applicables.\n• Consentement : pour les communications optionnelles — vous pouvez retirer votre consentement à tout moment.`,
    },
    {
      title: '6. Partage des données',
      body: `Nous partageons vos données uniquement avec :\n\n• Les universités partenaires auxquelles vous postulez — uniquement les données et documents requis pour cette candidature spécifique.\n• Les agents vérifiés agissant en votre nom — uniquement avec votre autorisation.\n• Les fournisseurs d'infrastructure : MongoDB (base de données), Cloudinary (stockage de fichiers), Resend (e-mail transactionnel), Render (hébergement serveur) — tous liés par des accords stricts de traitement des données.\n• Les forces de l'ordre ou organismes réglementaires — uniquement lorsque la loi l'exige.\n\nNous ne vendons, ne louons ni n'échangeons vos données personnelles à des fins commerciales.`,
    },
    {
      title: '7. Conservation des données',
      body: `Nous conservons vos données personnelles aussi longtemps que votre compte est actif, plus une période de 36 mois pour respecter les obligations légales. Les comptes non vérifiés (sans validation d'e-mail) sont automatiquement supprimés après 5 minutes. Vous pouvez demander la suppression de votre compte à tout moment en contactant privacy@riftapply.com. Les documents téléchargés pour des candidatures universitaires peuvent être conservés pour la durée requise par l'établissement destinataire.`,
    },
    {
      title: '8. Vos droits',
      body: `Selon votre juridiction, vous disposez des droits suivants sur vos données :\n\n• Droit d'accès : obtenir une copie des données que nous détenons sur vous.\n• Droit de rectification : corriger des données inexactes ou incomplètes.\n• Droit à l'effacement (« droit à l'oubli ») : demander la suppression de vos données.\n• Droit à la limitation : demander la limitation du traitement de vos données.\n• Droit à la portabilité : recevoir vos données dans un format structuré et lisible par machine.\n• Droit d'opposition : vous opposer au traitement fondé sur des intérêts légitimes.\n• Droit de retrait du consentement : pour tout traitement basé sur votre consentement.\n\nPour exercer ces droits, contactez-nous : privacy@riftapply.com`,
    },
    {
      title: '9. Cookies et suivi',
      body: `riftApply utilise uniquement des cookies strictement nécessaires pour l'authentification (jetons JWT stockés en localStorage) et la gestion de session. Nous n'utilisons pas de cookies publicitaires tiers ni de pixels de suivi. Les analyses d'utilisation sont collectées de manière agrégée et anonymisée. Vous pouvez effacer les cookies à tout moment via les paramètres de votre navigateur.`,
    },
    {
      title: '10. Protection des mineurs',
      body: `La Plateforme n'est pas destinée aux enfants de moins de 16 ans. Nous ne collectons pas sciemment de données personnelles de personnes de moins de 16 ans sans consentement parental vérifiable. Si nous découvrons qu'un mineur s'est inscrit sans consentement, nous supprimerons rapidement son compte et ses données associées.`,
    },
    {
      title: '11. Transferts internationaux de données',
      body: `Vos données peuvent être traitées et stockées sur des serveurs situés hors de votre pays de résidence. En utilisant riftApply, vous consentez à ces transferts. Nous veillons à ce que tous les transferts internationaux respectent les lois de protection des données applicables via des garanties appropriées, notamment des clauses contractuelles types.`,
    },
    {
      title: '12. Mesures de sécurité',
      body: `Nous mettons en œuvre les mesures de sécurité techniques et organisationnelles suivantes :\n\n• Tous les mots de passe sont hachés avec bcrypt et sel.\n• Toutes les communications API sont chiffrées via HTTPS/TLS.\n• L'accès à la base de données est restreint aux services autorisés.\n• Limitation du débit et protection contre la force brute sur tous les points d'authentification.\n• Suppression automatique des comptes non vérifiés après 5 minutes.\n• Audits de sécurité et évaluations régulières des vulnérabilités.`,
    },
    {
      title: '13. Modifications de la politique',
      body: `Nous pouvons mettre à jour cette Politique de confidentialité pour refléter des changements dans nos pratiques ou exigences légales. Nous notifierons les utilisateurs enregistrés par e-mail ou via un avis sur la Plateforme au moins 14 jours avant l'entrée en vigueur de tout changement important. La date « Dernière mise à jour » en haut de cette page reflète toujours la version actuelle.`,
    },
    {
      title: '14. Contact et délégué à la protection des données',
      body: `Pour toute question, préoccupation ou demande concernant la présente Politique de confidentialité ou vos données personnelles, veuillez contacter :\n\nE-mail : privacy@riftapply.com\nAssistance : support@riftapply.com\n\nNous nous engageons à répondre à toutes les demandes légitimes dans un délai de 30 jours.`,
    },
  ],
};

export default function PrivacyPolicyPage() {
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
              <Lock size={22} className="text-blue-300" />
            </div>
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{T(t.privacyPage.title)}</h1>
          <p className="text-blue-200 text-sm">{T(t.privacyPage.subtitle)}</p>
          <p className="text-blue-400 text-xs mt-3">
            {T(t.common.lastUpdated)}: {lang === 'en' ? 'May 26, 2026' : '26 mai 2026'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Intro banner */}
          <div className="bg-green-50 border-b border-green-100 px-8 py-5">
            <p className="text-sm text-green-800 leading-relaxed">
              {lang === 'en'
                ? 'At riftApply, your privacy is fundamental. We only collect what we need, we protect it rigorously, and we never sell it. This policy is written in plain language so you always know exactly what happens to your data.'
                : 'Chez riftApply, votre vie privée est fondamentale. Nous collectons uniquement ce dont nous avons besoin, nous le protégeons rigoureusement et ne le vendons jamais. Cette politique est rédigée en langage clair pour que vous sachiez toujours exactement ce qui arrive à vos données.'}
            </p>
          </div>

          {/* Sections */}
          <div className="px-8 py-6 space-y-8">
            {sections.map((s, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h2 className="text-lg font-bold text-[#0f2544] mb-3">{s.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 text-sm text-gray-500">
          <Link href="/terms-of-service" className="text-blue-600 hover:underline">
            {T(t.common.terms)}
          </Link>
          <Link href="/" className="hover:text-gray-700">
            {lang === 'en' ? '← Back to riftApply' : '← Retour à riftApply'}
          </Link>
        </div>
      </div>
    </div>
  );
}
