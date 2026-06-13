import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ExperiencePage from "@/app/experience/page";

describe("ExperiencePage", () => {
  it("renders the resume header and all CV sections", () => {
    render(<ExperiencePage />);

    expect(screen.getByRole("heading", { level: 1, name: "Oguz Yilmaz" })).toBeInTheDocument();
    expect(screen.getByText("Software Test Engineer | ISTQB CTFL")).toBeInTheDocument();
    expect(screen.getByText("Izmir, Turkey")).toBeInTheDocument();

    for (const section of ["Profile", "Work Experience", "Certificates", "Education", "Languages"]) {
      expect(screen.getByRole("heading", { name: section })).toBeInTheDocument();
    }
  });

  it("renders work details as semantic list items", () => {
    render(<ExperiencePage />);

    expect(screen.getByRole("heading", { name: "Software Test Engineer" })).toBeInTheDocument();
    expect(screen.getByText(/ETB-Group \(outsource to HDI Versicherung Deutschland\)/)).toBeInTheDocument();

    const workSection = screen.getByRole("heading", { name: "Work Experience" }).closest("section");
    expect(workSection).not.toBeNull();
    expect(within(workSection as HTMLElement).getAllByRole("listitem")).toHaveLength(9);

    for (const technology of ["UFT", "VBScript", "HP Octane", "ALM.net", "SoapUI", "SQL"]) {
      expect(within(workSection as HTMLElement).getByText(new RegExp(technology, "i"))).toBeInTheDocument();
    }
  });

  it("renders certificates in order with secure external links", () => {
    render(<ExperiencePage />);

    const certificateSection = screen.getByRole("heading", { name: "Certificates" }).closest("section");
    expect(certificateSection).not.toBeNull();
    const items = within(certificateSection as HTMLElement).getAllByRole("listitem");
    expect(certificateSection?.querySelector("ul")).toBeInTheDocument();
    expect(certificateSection?.querySelector("ol")).not.toBeInTheDocument();
    expect(items.map((item) => item.textContent)).toEqual([
      "ISTQB Foundation Level (CTFL) Certificate",
      "Astound Europen QA Bootcamp",
      "React Web Development Bootcamp",
      "161. Trendyol Data Analytics Bootcamp",
    ]);

    const externalLinks = within(certificateSection as HTMLElement).getAllByRole("link");
    expect(externalLinks).toHaveLength(2);
    expect(externalLinks[0]).toHaveAttribute("href", "https://app.diplomasafe.com/en-US/diploma/d093917c60dafa743314dbcd85e8928eba00abbe5");
    expect(externalLinks[1]).toHaveAttribute("href", "https://verified.sertifier.com/en/verify/20912531044624/");
    for (const link of externalLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }

    expect(screen.getByText("Turkish")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("German")).toBeInTheDocument();
  });

  it("loads local certificate images only when their modal opens", async () => {
    const user = userEvent.setup();
    render(<ExperiencePage />);

    const trigger = screen.getByRole("button", { name: "Astound Europen QA Bootcamp" });
    expect(screen.queryByAltText("Astound Europen QA Bootcamp certificate for Oguz Yilmaz")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Astound Europen QA Bootcamp" })).toBeInTheDocument();
    expect(screen.getByAltText("Astound Europen QA Bootcamp certificate for Oguz Yilmaz")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close certificate" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    const reactTrigger = screen.getByRole("button", { name: "React Web Development Bootcamp" });
    await user.click(reactTrigger);
    expect(screen.getByAltText("React Web Development Bootcamp certificate for Oguz Yilmaz")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close certificate" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(reactTrigger).toHaveFocus();
  });
});
