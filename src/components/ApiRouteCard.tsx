import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface ApiRoute {
  path: string;
  methods: string[];
}
export default function ApiRouteCard({ route }: { route: ApiRoute }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{route.path}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {route.methods.length > 0 ? (
            route.methods.map((method) => (
              <Badge
                key={method}
                variant="outline"
                className={`${getMethodColor(method)} font-mono`}
              >
                {method}
              </Badge>
            ))
          ) : (
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-800 border-gray-300 font-mono"
            >
              No methods found
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
function getMethodColor(method: string): string {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "POST":
      return "bg-green-100 text-green-800 border-green-300";
    case "PUT":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "DELETE":
      return "bg-red-100 text-red-800 border-red-300";
    case "PATCH":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "HEAD":
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    case "OPTIONS":
      return "bg-pink-100 text-pink-800 border-pink-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}
