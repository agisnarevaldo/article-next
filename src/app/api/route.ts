import { PrismaClient } from "@prisma/client";

import mime from "mime";
import { mkdir, stat, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import _ from "lodash";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const title = formData.get("title") as string || null;
    const content = formData.get("content") as string || null;
    const image = formData.get("image") as File || null;



    const buffer = Buffer.from(await image.arrayBuffer());
    const relativeUploadDir = `/uploads/${new Date(Date.now()
    ).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
        .replace(/\//g, "-")}`;

    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    try {
        await stat(uploadDir);
    } catch (e: any) {
        if (e.code === "ENOENT") {
            // this is for checking if the directory exists
            await mkdir(uploadDir, { recursive: true });
        } else {
            console.error("Error where trying to create directory when uploading a file\n", e);
            return NextResponse.json(
                { error: "Error where trying to create directory when uploading a file" },
                { status: 500 }
            );
        };
    }
    try {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${image.name.replace(
            /\.[^/.]+$/,
            ""
        )}-${uniqueSuffix}.${mime.getExtension(image.type)}`;
        await writeFile(`${uploadDir}/${filename}`, buffer);
        const fileUrl = `${relativeUploadDir}/${filename}`;

        // Save to database
        const result = await prisma.article.create({
            data: {
                title,
                content,
                image: fileUrl,
            },
        });

        return NextResponse.json(result);
    } catch (e) {
        console.error("Error when uploading a file\n", e);
        return NextResponse.json(
            { error: "Error when uploading a file" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const articles = await prisma.article.findMany();
    return NextResponse.json(articles);
}