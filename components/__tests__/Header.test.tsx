import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/Header";

describe("Header", () => {
  it("renders the brand and primary navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Oguz Yilmaz" })).toHaveAttribute("href", "/");

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(nav).getByRole("link", { name: "Experience" })).toHaveAttribute("href", "/experience");
    expect(within(nav).getByRole("link", { name: "Readings" })).toHaveAttribute("href", "/readings");
    expect(within(nav).getByRole("link", { name: "Photos" })).toHaveAttribute("href", "/photos");
    expect(screen.queryByLabelText(/dark|theme/i)).not.toBeInTheDocument();
  });

  it("opens and dismisses the accessible mobile navigation", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(mobileNav).getByRole("link", { name: "Photos" })).toHaveAttribute("href", "/photos");

    await user.click(document.body);

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });
});
