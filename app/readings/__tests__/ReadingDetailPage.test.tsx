import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReadingDetailPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/readings/[slug]/page";
import { readings } from "@/content/readings";

describe("ReadingDetailPage", () => {
  it("statically generates a detail route for every reading", () => {
    expect(generateStaticParams()).toEqual(
      readings.map(({ id }) => ({ slug: id })),
    );
  });

  it("creates metadata from the English title and author", async () => {
    await expect(
      generateMetadata({ params: Promise.resolve({ slug: "the-vegetarian" }) }),
    ).resolves.toMatchObject({
      title: "The Vegetarian",
      description: "The Vegetarian by Han Kang.",
    });
  });

  it("renders reading information and its organizing metadata", async () => {
    const page = await ReadingDetailPage({
      params: Promise.resolve({ slug: "the-vegetarian" }),
    });
    render(page);
    expect(
      screen.getByRole("heading", { level: 1, name: "The Vegetarian" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Vejetaryen")).toBeInTheDocument();
    expect(
      screen.getByText("Discovered via Literary Lab Book Club."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Threads: Women / body / interiority"),
    ).toBeInTheDocument();
  });
});
