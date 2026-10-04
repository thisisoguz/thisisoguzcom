import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "@/components/Card";

describe("Card", () => {
  it("renders its content in the shared card surface", () => {
    render(
      <Card className="reading-example">
        <h2>Reading note</h2>
      </Card>,
    );
    expect(
      screen.getByRole("heading", { name: "Reading note" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveClass("card", "reading-example");
  });
});
