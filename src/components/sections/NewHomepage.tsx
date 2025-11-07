import NewNavbar from "./new/NewNavbar";
import NewHero from "./new/NewHero";
import ProblemSection from "./new/ProblemSection";
import SolutionSection from "./new/SolutionSection";
import HowItWorksNew from "./new/HowItWorksNew";
import FeaturesSection from "./new/FeaturesSection";
import LivebookSection from "./new/LivebookSection";
import LiaSection from "./new/LiaSection";
import MetricsSection from "./new/MetricsSection";
import PricingSectionNew from "./new/PricingSectionNew";
import FAQSectionNew from "./new/FAQSectionNew";
import DemoSection from "./new/DemoSection";
import FinalCTA from "./new/FinalCTA";
import ContactSection from "./new/ContactSection";
import NewFooter from "./new/NewFooter";

const NewHomepage = () => {
  return (
    <div className="min-h-screen">
      <NewNavbar />
      <main>
        <NewHero />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksNew />
        <FeaturesSection />
        <LivebookSection />
        <LiaSection />
        <MetricsSection />
        <PricingSectionNew />
        <FAQSectionNew />
        <DemoSection />
        <FinalCTA />
        <ContactSection />
      </main>
      <NewFooter />
    </div>
  );
};

export default NewHomepage;
