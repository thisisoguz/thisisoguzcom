import { siteConfig } from "@/lib/site";

export function SocialLinks() {
  return (
    <div className="social-links">
      <a href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="Oguz Yilmaz on GitHub"><GitHubIcon /></a>
      <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" aria-label="Oguz Yilmaz on LinkedIn"><LinkedInIcon /></a>
    </div>
  );
}

function GitHubIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.82a9.4 9.4 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>;
}

function LinkedInIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.3H3V21h3.5V8.3ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.7c0-3.82-2.04-5.6-4.76-5.6-2.2 0-3.18 1.2-3.73 2.05V8.3H9V21h3.51v-6.3c0-1.66.32-3.28 2.38-3.28 2.03 0 2.06 1.9 2.06 3.39V21H21v-7.3Z" /></svg>;
}
