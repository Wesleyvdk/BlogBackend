import { getApiRoutes } from "@/lib/getApiRoutes";
import ApiRouteCard from "@/components/ApiRouteCard";

export default async function Home() {
  let apiRoutes: any[] = [];
  try {
    apiRoutes = await getApiRoutes();
  } catch (error) {
    console.error("Error fetching API routes:", error);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            API Routes Documentation
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {apiRoutes.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {apiRoutes.map((route) => (
                  <ApiRouteCard key={route.path} route={route} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No API routes found or there was an error fetching routes.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
