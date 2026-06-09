import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { bookmarkSchema } from "@/lib/validations";

// GET /api/bookmarks - list user's bookmarks
export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";
    const filter = searchParams.get("filter") || "all"; // all | public | private

    const where: Record<string, unknown> = { userId: user.id };
    if (filter === "public") where.isPublic = true;
    if (filter === "private") where.isPublic = false;
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { url: { contains: search, mode: "insensitive" } },
        ];
    }

    const bookmarks = await prisma.bookmark.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks });
}

// POST /api/bookmarks - create a bookmark
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bookmarkSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    // Fetch favicon from Google's favicon service
    let faviconUrl: string | null = null;
    try {
        const domain = new URL(parsed.data.url).hostname;
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
        // favicon is optional
    }

    const bookmark = await prisma.bookmark.create({
        data: {
            ...parsed.data,
            userId: user.id,
            faviconUrl,
        },
    });

    return NextResponse.json({ bookmark }, { status: 201 });
}
