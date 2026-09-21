import { createFileRoute } from "@tanstack/react-router";
import { IndustriesDirectoryHub } from "@/components/site/industry-subpage";

export const Route = createFileRoute("/industries/")({
  head: () => ({
    meta: [
      { title: "Industries We Scale | Quickupp AI Studio" },
      {
        name: "description",
        content:
          "Explore AI video production solutions tailored for Healthcare, Real Estate, IT & SaaS, eCommerce, Professional Services, Hospitality, Education, Home Services, and Interior Design.",
      },
      {
        property: "og:title",
        content: "Industries We Scale | Quickupp AI Studio",
      },
      {
        property: "og:description",
        content:
          "Professional AI video production services tailored for 9 key commercial industries.",
      },
    ],
  }),
  component: IndustriesDirectoryHub,
});
