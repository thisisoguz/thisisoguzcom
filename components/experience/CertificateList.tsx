"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Certificate, ImageCertificate } from "@/content/experience";
import styles from "@/app/experience/experience.module.css";

export function CertificateList({ certificates }: { certificates: Certificate[] }) {
  const [activeCertificate, setActiveCertificate] = useState<ImageCertificate | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeCertificate) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveCertificate(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      activeTriggerRef.current?.focus();
    };
  }, [activeCertificate]);

  return (
    <>
      <ul className={styles.certificateList}>
        {certificates.map((certificate) => (
          <li key={certificate.id}>
            {certificate.type === "external" ? (
              <a
                className={styles.certificateLink}
                href={certificate.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {certificate.title}
              </a>
            ) : (
              <button
                className={styles.certificateButton}
                type="button"
                onClick={(event) => {
                  activeTriggerRef.current = event.currentTarget;
                  setActiveCertificate(certificate);
                }}
              >
                {certificate.title}
              </button>
            )}
          </li>
        ))}
      </ul>

      {activeCertificate && (
        <div
          className={styles.certificateModal}
          role="dialog"
          aria-modal="true"
          aria-label={activeCertificate.title}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveCertificate(null);
          }}
        >
          <button
            ref={closeButtonRef}
            className={styles.certificateModalClose}
            type="button"
            aria-label="Close certificate"
            onClick={() => setActiveCertificate(null)}
          >
            ×
          </button>
          <div className={styles.certificateImageFrame}>
            <Image
              className={styles.certificateImage}
              src={activeCertificate.imageUrl}
              alt={activeCertificate.imageAlt}
              width={activeCertificate.width}
              height={activeCertificate.height}
              sizes="(max-width: 767px) calc(100vw - 32px), 1100px"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
