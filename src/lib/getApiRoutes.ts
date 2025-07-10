import { readdirSync, statSync, readFileSync } from "fs"
import { join } from "path"
interface ApiRoute {
    path: string
    methods: string[]
}
export async function getApiRoutes(): Promise<ApiRoute[]> {
    const apiDirectory = join(process.cwd(), "src", "app", "api")
    return scanDirectory(apiDirectory, "/api")
}
function scanDirectory(dir: string, basePath: string): ApiRoute[] {
    const routes: ApiRoute[] = []
    readdirSync(dir).forEach((file) => {
        const filePath = join(dir, file)
        const stat = statSync(filePath)
        if (stat.isDirectory()) {
            routes.push(...scanDirectory(filePath, `${basePath}/${file}`))
        } else if (file === "route.ts" || file === "route.js") {
            const methods = extractMethodsFromFile(filePath)
            routes.push({ path: basePath, methods })
        }
    })
    return routes
}
function extractMethodsFromFile(filePath: string): string[] {
    const content = readFileSync(filePath, "utf-8")
    const methodRegex = /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s*\(/g
    const methods: string[] = []
    let match
    while ((match = methodRegex.exec(content)) !== null) {
        methods.push(match[1])
    }
    return methods
}
