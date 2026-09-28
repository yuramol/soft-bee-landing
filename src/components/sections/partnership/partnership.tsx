import './partnership.css';
import PartnershipHero from './components/partnership-hero';
import PartnershipWhoItsFor from './components/partnership-who-its-for';
import PartnershipHowItWorks from './components/partnership-how-it-works';
import PartnershipContact from './components/partnership-contact';

export function Partnership() {
  return (
    <>
      <PartnershipHero />
      <PartnershipWhoItsFor />
      <PartnershipHowItWorks />
      <PartnershipContact />
    </>
  );
}
