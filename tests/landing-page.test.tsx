import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { landingContent, sectionOrder } from "@/content/landing";

describe("landing page parity", () => {
  test("renders core copy from content map", () => {
    render(<HomePage />);

    expect(screen.getByText(landingContent.hero.badge)).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: landingContent.hero.title })[0]).toBeInTheDocument();
    expect(screen.getByText(landingContent.services.title)).toBeInTheDocument();
    expect(screen.getByText(landingContent.projects.title)).toBeInTheDocument();
    expect(screen.getByText(landingContent.pricing.title)).toBeInTheDocument();
    expect(screen.getByText(landingContent.faq.title)).toBeInTheDocument();
    expect(screen.getByText(landingContent.contact.form.submit)).toBeInTheDocument();
  });

  test("renders sections in expected order", () => {
    const { container } = render(<HomePage />);

    const renderedOrder = [...container.querySelectorAll("section[data-section]")].map((section) =>
      section.getAttribute("data-section")
    );

    expect(renderedOrder).toEqual(sectionOrder);
  });

  test("renders nav items from content map", () => {
    render(<HomePage />);

    for (const item of landingContent.nav) {
      expect(screen.getAllByText(item.label).length).toBeGreaterThan(0);
    }
  });
});
