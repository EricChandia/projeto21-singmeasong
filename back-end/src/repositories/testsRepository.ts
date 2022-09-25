import { prisma } from "../database.js"

export async function truncateRecomendations() {
    
    await prisma.$executeRaw`truncate table recommendations`;

}