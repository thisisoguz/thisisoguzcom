import Image from "next/image";
import { Button } from "@/components/Button";
import { HeroName } from "@/components/HeroName";
import { SocialLinks } from "@/components/SocialLinks";

export function Hero() {
  return (
    <main className="home-main">
      <section className="hero">
        <div className="profile-image"><Image src="/images/profile.jpg" alt="Quiet editorial profile placeholder for Oguz Yilmaz" width={780} height={780} priority sizes="(max-width: 900px) 0px, (max-width: 1023px) 300px, (max-width: 1439px) 360px, 390px" /></div>
        <div className="hero-copy">
          <h1 aria-label="Hi, I am O~uz.">Hi, I am <HeroName />.</h1>
          <p>I am a tester. I test things, automate repetitive work, and look for the details people might miss.</p>
          <p>A light personal archive of my work, readings and photos.</p>
          <div className="hero-actions">
            <Button href="/cv/oguz-yilmaz-cv.pdf">Visit CV</Button>
            <Button href="mailto:yilmazoguz@outlook.com" variant="secondary">Contact Me</Button>
          </div>
          <SocialLinks />
        </div>
      </section>
    </main>
  );
}
