import { BrandName } from "@/components/BrandName";

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer-primary">
        <span>2026 </span>
        <BrandName />
        <span>.</span>
      </p>
      <p className="site-footer-secondary">
        Made with <span aria-label="love">❤️</span> in Türkiye
      </p>
    </footer>
  );
}
