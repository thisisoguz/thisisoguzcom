import {
  certificates,
  education,
  languages,
  profile,
  resumeHeader,
  workExperience,
  type ResumeEntry,
} from "@/content/experience";
import { CertificateList } from "@/components/experience/CertificateList";
import { createMetadata } from "@/lib/seo";
import styles from "./experience.module.css";

export const metadata = createMetadata({
  title: "Experience",
  description: "The work experience, certificates, education and languages of Oguz Yilmaz.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <main className={styles.page}>
      <header className={styles.resumeHeader}>
        <h1>{resumeHeader.name}</h1>
        <p className={styles.role}>{resumeHeader.title}</p>
        <nav className={styles.contacts} aria-label="Resume contact links">
          {resumeHeader.contacts.map((contact) => (
            <a
              href={contact.href}
              key={contact.href}
              {...(contact.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {contact.label}
            </a>
          ))}
        </nav>
        <p className={styles.location}>{resumeHeader.location}</p>
      </header>

      <ResumeSection title="Profile">
        <p className={styles.profile}>{profile}</p>
      </ResumeSection>

      <ResumeSection title="Work Experience">
        <EntryList entries={workExperience} />
      </ResumeSection>

      <ResumeSection title="Certificates">
        <CertificateList certificates={certificates} />
      </ResumeSection>

      <ResumeSection title="Education">
        <EntryList entries={education} />
      </ResumeSection>

      <ResumeSection title="Languages">
        <dl className={styles.languages}>
          {languages.map((language) => (
            <div key={language.name}>
              <dt>{language.name}</dt>
              <dd>{language.level}</dd>
            </div>
          ))}
        </dl>
      </ResumeSection>
    </main>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  const headingId = `${title.toLowerCase().replace(/[^a-z]+/g, "-")}-heading`;

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      {children}
    </section>
  );
}

function EntryList({ entries }: { entries: ResumeEntry[] }) {
  return (
    <div className={styles.entryList}>
      {entries.map((entry) => (
        <article className={styles.entry} key={entry.id}>
          <div className={styles.entryMeta}>
            <time>{entry.period}</time>
            {entry.location && <span>{entry.location}</span>}
          </div>
          <div className={styles.entryContent}>
            <h3>{entry.title}</h3>
            <p className={styles.organization}>{entry.organization}</p>
            {entry.description && <p className={styles.description}>{entry.description}</p>}
            {entry.responsibilities && (
              <ul className={styles.responsibilities}>
                {entry.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
              </ul>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
