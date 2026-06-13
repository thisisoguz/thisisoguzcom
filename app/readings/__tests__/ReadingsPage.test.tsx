import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReadingsPage from "@/app/readings/page";

describe("ReadingsPage", () => {
  it("renders only the accepted heading and introduction", () => {
    render(<ReadingsPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Readings" })).toBeInTheDocument();
    expect(screen.getByText("Not a rating shelf. This is a small map of books, questions and ideas, including the paths that connect them.")).toBeInTheDocument();
    expect(screen.queryByText("Kaçırdıklarımız")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "A small reading map" })).not.toBeInTheDocument();
    expect(document.querySelector(".reading-card, .reading-map, .bubble")).not.toBeInTheDocument();
  });
});
