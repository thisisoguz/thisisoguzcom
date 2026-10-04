import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders the primary variant", () => {
    render(<Button href="/example">Primary action</Button>);
    expect(screen.getByRole("link", { name: "Primary action" })).toHaveClass("button", "button--primary");
  });

  it("renders the secondary variant", () => {
    render(<Button href="/example" variant="secondary">Secondary action</Button>);
    const link = screen.getByRole("link", { name: "Secondary action" });
    expect(link).toHaveClass("button", "button--secondary");
    expect(link).not.toHaveClass("button--primary");
  });

  it("renders downloads as a normal anchor", () => {
    render(
      <Button href="/document.pdf" download="document.pdf">
        Download document
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Download document" });
    expect(link).toHaveAttribute("href", "/document.pdf");
    expect(link).toHaveAttribute("download", "document.pdf");
  });
});
