import { HeroSection, MenuSection, AboutSection, ContactSection } from './components';

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <MenuSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}