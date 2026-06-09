import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    // Check handle availability
    const existing = await prisma.user.findUnique({
        where: { handle: parsed.data.handle },
    });
    if (existing) {
        return NextResponse.json(
            { error: { handle: ["Handle is already taken"] } },
            { status: 409 }
        );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: {
                name: parsed.data.name,
                handle: parsed.data.handle,
            },
        },
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create user profile in DB
    if (data.user) {
        await prisma.user.create({
            data: {
                id: data.user.id,
                email: parsed.data.email,
                handle: parsed.data.handle,
                name: parsed.data.name,
            },
        });
    }

    return NextResponse.json({ success: true }, { status: 201 });
}
