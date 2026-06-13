import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { photos } from "@/content/photos";

describe("PhotoGrid", () => {
  it("opens the clicked photo and closes the lightbox with Escape", async () => {
    const user = userEvent.setup();
    render(<PhotoGrid photos={photos} />);

    await user.click(screen.getByRole("button", { name: "Open Athens I" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Athens I" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
