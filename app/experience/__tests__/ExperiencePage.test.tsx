import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ExperiencePage from "@/app/experience/page";
import { CertificateList } from "@/components/experience/CertificateList";
import type { ImageCertificate } from "@/content/experience";

describe("ExperiencePage", () => {
  it("renders the updated resume header and CV sections in order", () => {
    render(<ExperiencePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Oguz Yilmaz" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Test Automation Engineer | ISTQB CTFL"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/thisisoguz/",
    );
    expect(
      screen.getByRole("link", { name: "github.com/thisisoguz" }),
    ).toHaveAttribute("href", "https://github.com/thisisoguz/");
    expect(
      screen.getByRole("link", { name: "yilmazoguz@outlook.com" }),
    ).toHaveAttribute("href", "mailto:yilmazoguz@outlook.com");
    expect(
      screen.getByRole("link", { name: "thisisoguz.com" }),
    ).toHaveAttribute("href", "https://thisisoguz.com/");

    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Profile",
      "Work Experience",
      "Certifications",
      "Skills",
      "Education",
      "Languages",
    ]);
    expect(screen.getByText(/4\+ years of experience/)).toBeInTheDocument();
  });

  it("renders the current work experience as eight semantic list items", () => {
    render(<ExperiencePage />);

    expect(
      screen.getByRole("heading", { name: "Software Test Engineer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ETB-Group — Client: HDI Insurance Germany"),
    ).toBeInTheDocument();
    expect(screen.getByText("06/2022 – Current")).toBeInTheDocument();

    const workSection = screen
      .getByRole("heading", { name: "Work Experience" })
      .closest("section");
    expect(workSection).not.toBeNull();
    expect(
      within(workSection as HTMLElement).getAllByRole("listitem"),
    ).toHaveLength(8);

    for (const technology of [
      "UFT",
      "VBScript",
      "GitLab CI/CD",
      "HP Octane",
      "HP ALM",
      "SoapUI",
      "SQL",
    ]) {
      expect(
        within(workSection as HTMLElement).getByText(
          new RegExp(technology.replace("/", "\\/"), "i"),
        ),
      ).toBeInTheDocument();
    }
  });

  it("renders the ISTQB certification with its existing external link", () => {
    render(<ExperiencePage />);

    const section = screen
      .getByRole("heading", { name: "Certifications" })
      .closest("section");
    expect(section).not.toBeNull();
    const certificationLink = within(
      section as HTMLElement,
    ).getByRole("link", {
      name: "ISTQB® Certified Tester Foundation Level (CTFL)",
    });
    expect(certificationLink).toHaveAttribute(
      "href",
      "https://app.diplomasafe.com/en-US/diploma/d093917c60dafa743314dbcd85e8928eba00abbe5",
    );
    expect(certificationLink).toHaveAttribute("target", "_blank");
    expect(certificationLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders grouped skills, education, and the two CV languages", () => {
    render(<ExperiencePage />);

    const skillsSection = screen
      .getByRole("heading", { name: "Skills" })
      .closest("section");
    expect(skillsSection).not.toBeNull();
    for (const skill of [
      "Playwright (TypeScript)",
      "UFT (VBScript)",
      "SoapUI",
      "GitLab CI/CD",
      "HP ALM",
      "HP Octane",
    ]) {
      expect(
        within(skillsSection as HTMLElement).getByText(
          new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        ),
      ).toBeInTheDocument();
    }

    for (const educationTitle of [
      "Software QA Engineer Trainee",
      "React.js Web Development Bootcamp, Front-end Development",
      "Data Analytics (Organized in collaboration with Trendyol)",
      "Bachelor's Degree in Geomatics Engineering (100% English)",
    ]) {
      expect(
        screen.getByRole("heading", { level: 3, name: educationTitle }),
      ).toBeInTheDocument();
    }

    const languagesSection = screen
      .getByRole("heading", { name: "Languages" })
      .closest("section");
    expect(languagesSection).not.toBeNull();
    expect(
      within(languagesSection as HTMLElement).getByText("English"),
    ).toBeInTheDocument();
    expect(
      within(languagesSection as HTMLElement).getByText(
        "C1 / Professional Working Proficiency",
      ),
    ).toBeInTheDocument();
    expect(
      within(languagesSection as HTMLElement).getByText("German"),
    ).toBeInTheDocument();
    expect(
      within(languagesSection as HTMLElement).getByText("Conversational"),
    ).toBeInTheDocument();
    expect(
      within(languagesSection as HTMLElement).queryByText("Turkish"),
    ).not.toBeInTheDocument();
  });

  it("preserves lazy certificate-image modal behavior", async () => {
    const user = userEvent.setup();
    const imageCertificate: ImageCertificate = {
      id: "sample-certificate",
      title: "Sample certificate",
      type: "image",
      imageUrl: "/certificates/astound_qabootcamp_certificate.jpg",
      imageAlt: "Sample certificate for Oguz Yilmaz",
      width: 1505,
      height: 2200,
    };
    render(<CertificateList certificates={[imageCertificate]} />);

    const trigger = screen.getByRole("button", { name: "Sample certificate" });
    expect(
      screen.queryByAltText("Sample certificate for Oguz Yilmaz"),
    ).not.toBeInTheDocument();

    await user.click(trigger);
    expect(
      screen.getByRole("dialog", { name: "Sample certificate" }),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Sample certificate for Oguz Yilmaz"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close certificate" }),
    ).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
