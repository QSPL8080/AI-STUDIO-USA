import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getIndustryBySlug } from "@/components/site/industries-data";
import { IndustrySubpage } from "@/components/site/industry-subpage";

export const Route = createFileRoute("/industries/$slug")({
  head: ({ params }) => {
    const data = getIndustryBySlug(params.slug);
    const title = data
      ? `${data.name} AI Video Production | Quickupp AI Studio`
      : "Industry AI Video Production | Quickupp AI Studio";
    const description = data
      ? data.heroSubheading
      : "Professional AI video production services tailored for your industry.";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
    };
  },
  loader: ({ params }) => {
    const data = getIndustryBySlug(params.slug);
    if (!data) {
      throw notFound();
    }
    return { data };
  },
  component: IndustryRouteComponent,
  notFoundComponent: IndustryNotFoundComponent,
});

function IndustryRouteComponent() {
  const { data } = Route.useLoaderData();
  return <IndustrySubpage data={data} />;
}

function IndustryNotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-black text-slate-900">404</h1>
        <h2 className="mt-4 text-xl font-bold text-slate-800">
          Industry Subpage Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          We couldn't find the industry page you were looking for. Explore all of our specialized industry solutions below.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/industries"
            className="inline-flex items-center justify-center rounded-full bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700"
          >
            View All Industries
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:border-purple-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
