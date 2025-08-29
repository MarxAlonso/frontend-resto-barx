import { HeroSection, MenuSection, AboutSection, ContactSection } from './components';
import NavbarSection from './components/NavbarSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavbarSection />
      <main className="flex-1">
        <HeroSection />
        <div id="menu">
          <MenuSection />
        </div>
        <div id="about">
          <AboutSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
      </main>
    </div>
  );
}