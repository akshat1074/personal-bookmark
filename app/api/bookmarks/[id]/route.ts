import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { updateBookmarkSchema } from "@/lib/validations";

async function getAuthorizedBookmark(bookmarkId: string, userId: string) {
    const bookmark = await prisma.bookmark.findUnique({
        where: { id: bookmarkId },
    });
    if (!bookmark) return { error: "Not found", status: 404, bookmark: null };
    if (bookmark.userId !== userId) return { error: "Forbidden", status: 403, bookmark: null };
    return { bookmark, error: null, status: 200 };
}

// PATCH /api/bookmarks/[id]
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { error, status } = await getAuthorizedBookmark(id, user.id);
    if (error) return NextResponse.json({ error }, { status });

    const body = await request.json();
    const parsed = updateBookmarkSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const updated = await prisma.bookmark.update({
        where: { id },
        data: parsed.data,
    });

    return NextResponse.json({ bookmark: updated });
}

// DELETE /api/bookmarks/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { error, status } = await getAuthorizedBookmark(id, user.id);
    if (error) return NextResponse.json({ error }, { status });

    await prisma.bookmark.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
