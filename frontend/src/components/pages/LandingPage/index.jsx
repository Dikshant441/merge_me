import Nav from "../../features/landing/Nav";
import Hero from "../../features/landing/Hero";
import Gallery from "../../features/landing/Gallery";
import Features from "../../features/landing/Features";
import CtaStrip from "../../features/landing/CtaStrip";
import Footer from "../../shared/Footer";
import { useLocale } from "../../../helpers/useLocale";
import { getCopy } from "../../../constants/copy";

const Landing = () => {
  const locale = useLocale();
  const copy = getCopy(locale);
  const mobileSectionLinks = [
    { label: copy.navFeatures, href: "#gallery" },
    { label: copy.navHow, href: "#how" },
    { label: copy.navPricing, href: "#pricing" },
    { label: copy.navDocs, href: "#docs" },
  ];

  return (
    <div className="bg-mm-bg text-mm-ink font-sans antialiased min-h-full overflow-x-hidden">
      <div className="landing-bg" />
      <Nav copy={copy} />
      <Hero copy={copy} locale={locale} />
      <Gallery copy={copy} locale={locale} />
      <Features copy={copy} />
      <CtaStrip copy={copy} />
      <Footer mobileSectionLinks={mobileSectionLinks} />
    </div>
  );
};

export default Landing;
