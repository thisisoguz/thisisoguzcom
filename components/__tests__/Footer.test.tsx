import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/Footer";

describe("Footer", () => {
  it("renders the compact global signature without social links", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("2026 Oguz Yilmaz.");
    expect(footer).toHaveTextContent("Made with ❤️ in Türkiye");
    expect(screen.getByLabelText("love")).toHaveTextContent("❤️");
    expect(footer.querySelectorAll("a")).toHaveLength(0);
  });
});
