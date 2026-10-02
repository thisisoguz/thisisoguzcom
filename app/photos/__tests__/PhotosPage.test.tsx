import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PhotosPage from "@/app/photos/page";
import { photos } from "@/content/photos";

describe("PhotosPage", () => {
  it("renders the photo grid with meaningful image alternatives", () => {
    render(<PhotosPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Photos" })).toBeInTheDocument();
    expect(photos).toHaveLength(12);
    expect(photos.map(({ slug }) => slug)).toEqual([
      "bilbao-01",
      "bilbao-02",
      "bilbao-03",
      "athens-01",
      "athens-02",
      "athens-03",
      "stockholm-01",
      "stockholm-02",
      "stockholm-03",
      "stockholm-04",
      "stockholm-05",
      "stockholm-06",
    ]);
    for (const photo of photos) {
      expect(screen.getByRole("button", { name: `Open ${photo.title}` })).toBeInTheDocument();
      const alt = photo.description ? `${photo.title}. ${photo.description}` : `${photo.title} photo by Oguz Yilmaz`;
      expect(screen.getByAltText(alt)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Athens, Greece")).toHaveLength(3);
    expect(screen.getAllByText("March, 2026")).toHaveLength(3);
    expect(screen.getAllByText("Stockholm, Sweden")).toHaveLength(6);
    expect(screen.getAllByText("September, 2026")).toHaveLength(6);
    expect(screen.getAllByText("Bilbao, Spain")).toHaveLength(3);
    expect(screen.getAllByText("February, 2026")).toHaveLength(3);
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

    await user.click(screen.getByRole("button", { name: "Open Bilbao 01" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(screen.getByRole("heading", { name: "Stockholm VI" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByRole("heading", { name: "Bilbao 01" })).toBeInTheDocument();
  });

  it("opens every Bilbao photo in the existing lightbox", async () => {
    const user = userEvent.setup();
    render(<PhotosPage />);

    for (const title of ["Bilbao 01", "Bilbao 02", "Bilbao 03"]) {
      await user.click(screen.getByRole("button", { name: `Open ${title}` }));
      expect(await screen.findByRole("heading", { name: title })).toBeInTheDocument();
      expect(screen.getAllByText("Bilbao, Spain")).toHaveLength(4);
      expect(screen.getAllByText("February, 2026")).toHaveLength(4);
      await user.click(screen.getByRole("button", { name: "Close photo" }));
    }
  });
});
