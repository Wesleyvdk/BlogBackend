import { readdirSync, statSync } from 'fs'
import { join } from 'path'

interface ApiRoute {
    path: string
    methods: string[]
}

export async function getApiRoutes(): Promise<ApiRoute[]> {
    const apiDirectory = join(process.cwd(), 'src', 'app', 'api')
    return scanDirectory(apiDirectory, '/api')
}

function scanDirectory(dir: string, basePath: string): ApiRoute[] {
    const routes: ApiRoute[] = []

    readdirSync(dir).forEach((file) => {
        const filePath = join(dir, file)
        const stat = statSync(filePath)

        if (stat.isDirectory()) {
            routes.push(...scanDirectory(filePath, `${basePath}/${file}`))
        } else if (file === 'route.ts' || file === 'route.js') {
            // Instead of trying to import the file, we'll assume all methods are available
            routes.push({
                path: basePath,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
            })
        }
    })

    return routes
}
