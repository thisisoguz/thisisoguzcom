import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/Hero";

describe("Hero", () => {
  it("renders the accepted homepage copy and actions", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1, name: "Hi, I am O~uz." })).toBeInTheDocument();
    expect(screen.getByText("I am a tester. I test things, automate repetitive work, and look for the details people might miss.")).toBeInTheDocument();
    expect(screen.getByText("A light personal archive of my work, readings and photos.")).toBeInTheDocument();

    const cvLink = screen.getByRole("link", { name: "Visit CV" });
    const contactLink = screen.getByRole("link", { name: "Contact Me" });
    expect(cvLink).toHaveAttribute("href", "/cv/oguz-yilmaz-cv.pdf");
    expect(cvLink).toHaveClass("button--primary");
    expect(contactLink).toHaveAttribute("href", "mailto:yilmazoguz@outlook.com");
    expect(contactLink).toHaveClass("button--secondary");
    expect(contactLink).not.toHaveClass("button--primary");
  });

  it("renders only GitHub and LinkedIn social links", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: "Oguz Yilmaz on GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oguz Yilmaz on LinkedIn" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /instagram|twitter|x\.com/i })).not.toBeInTheDocument();
  });
});
