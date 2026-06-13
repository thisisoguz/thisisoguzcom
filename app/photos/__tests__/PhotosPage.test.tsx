import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PhotosPage from "@/app/photos/page";
import { photos } from "@/content/photos";

describe("PhotosPage", () => {
  it("renders the photo grid with meaningful image alternatives", () => {
    render(<PhotosPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Photos" })).toBeInTheDocument();
    expect(photos).toHaveLength(3);
    for (const photo of photos) {
      expect(screen.getByRole("button", { name: `Open ${photo.title}` })).toBeInTheDocument();
      const alt = photo.description ? `${photo.title}. ${photo.description}` : `${photo.title} photo by Oguz Yilmaz`;
      expect(screen.getByAltText(alt)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Athens, Greece")).toHaveLength(3);
    expect(screen.getAllByText("March, 2026")).toHaveLength(3);
  });

  it("opens, navigates and closes the lightbox with the keyboard", async () => {
    const user = userEvent.setup();
    render(<PhotosPage />);

    await user.click(screen.getByRole("button", { name: "Open Athens I" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Athens I" })).toBeInTheDocument();
    expect(screen.getAllByText("Athens, Greece")).toHaveLength(4);
    expect(screen.getAllByText("March, 2026")).toHaveLength(4);
    expect(screen.getByText("A photo I took in Athens.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous photo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next photo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close photo" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("heading", { name: "Athens II" })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("heading", { name: "Athens I" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("wraps around with visible previous and next controls", async () => {
    const user = userEvent.setup();
    render(<PhotosPage />);

    await user.click(screen.getByRole("button", { name: "Open Athens I" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(screen.getByRole("heading", { name: "Athens III" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByRole("heading", { name: "Athens I" })).toBeInTheDocument();
  });
});
