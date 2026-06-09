import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/[handle] - public profile
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ handle: string }> }
) {
    const { handle } = await params;

    const user = await prisma.user.findUnique({
        where: { handle },
        select: {
            id: true,
            handle: true,
            name: true,
            avatarUrl: true,
            bio: true,
            website: true,
            twitter: true,
            github: true,
            createdAt: true,
            bookmarks: {
                where: { isPublic: true },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    url: true,
                    description: true,
                    faviconUrl: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
        { user },
        {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            },
        }
    );
}
