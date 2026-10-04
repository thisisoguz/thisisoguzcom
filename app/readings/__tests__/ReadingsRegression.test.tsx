import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import packageJson from "@/package.json";
import ExperiencePage from "@/app/experience/page";
import ReadingsPage from "@/app/readings/page";
import PhotosPage from "@/app/photos/page";
import HomePage from "@/app/page";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { readings } from "@/content/readings";

describe("Readings V2 regression guardrails", () => {
  it("keeps the site's primary navigation intact", () => {
    render(<Header />);
    const navigation = screen.getByRole("navigation", {
      name: "Main navigation",
    });
    expect(
      within(navigation).getByRole("link", { name: "Home" }),
    ).toHaveAttribute("href", "/");
    expect(
      within(navigation).getByRole("link", { name: "Experience" }),
    ).toHaveAttribute("href", "/experience");
    expect(
      within(navigation).getByRole("link", { name: "Readings" }),
    ).toHaveAttribute("href", "/readings");
    expect(
      within(navigation).getByRole("link", { name: "Photos" }),
    ).toHaveAttribute("href", "/photos");
  });

  it("keeps the global footer signature intact", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "2026 Oguz Yilmaz.",
    );
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "Made with ❤️ in Türkiye",
    );
  });

  it("preserves the accepted homepage hero content", () => {
    render(<HomePage />);
    expect(
      screen.getByText(
        "I am a tester. I test things, automate repetitive work, and look for the details people might miss.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A light personal archive of my work, readings and photos.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visit CV" })).toHaveAttribute(
      "href",
      "/cv/Oguz_Yilmaz_Resume.pdf",
    );
  });

  it("preserves the Photos page grid and twelve photo actions", () => {
    render(<PhotosPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Photos" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Open / })).toHaveLength(12);
  });

  it("preserves the Experience certification section", () => {
    render(<ExperiencePage />);
    const section = screen
      .getByRole("heading", { name: "Certifications" })
      .closest("section");
    expect(section).not.toBeNull();
    expect(
      within(section as HTMLElement).getAllByRole("listitem"),
    ).toHaveLength(1);
  });

  it("does not expose retired source labels in the visible Readings page", () => {
    render(<ReadingsPage />);
    const pageText = document.body.textContent ?? "";
    expect(pageText).not.toContain("litlab");
    expect(pageText).not.toContain("artemis-kitap-kulübü");
  });

  it("keeps third-party catalog services out of runtime dependencies and UI", () => {
    render(<ReadingsPage />);
    expect(
      Object.keys(packageJson.dependencies).some((name) =>
        name.toLowerCase().includes("goodreads"),
      ),
    ).toBe(false);
    expect(document.body.textContent?.toLowerCase()).not.toContain("goodreads");
  });

  it("keeps the reading archive image-free and photos on common browser formats", () => {
    render(<PhotosPage />);
    expect(
      JSON.stringify(readings).match(/\.(?:jpg|jpeg|png|webp)/i),
    ).toBeNull();
    for (const image of screen.getAllByRole("img")) {
      expect(image.getAttribute("src")).toMatch(
        /\.(?:jpg|jpeg|png|webp)(?:\?|$)/i,
      );
    }
  });
});
