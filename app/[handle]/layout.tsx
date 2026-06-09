import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
    const { handle } = await params;
    const user = await prisma.user.findUnique({
        where: { handle },
        select: { name: true, bio: true },
    });

    if (!user) return { title: "User Not Found" };

    return {
        title: `${user.name} (@${handle}) · Bookmarks`,
        description: user.bio || `Check out the public bookmark collection of ${user.name} on Bookmarks.`,
    };
}

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
