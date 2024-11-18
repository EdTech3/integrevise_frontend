import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request){
    const searchParams = new URL(request.url).searchParams;
    const documentId = searchParams.get("documentId")

try{
    if (!documentId) {
        return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
    }

    const document = await prisma.document.findUnique({
        where: {id: documentId},
    })

    console.log("Document", document) 

    if (!document) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const filePath = document.filePath

    if (!filePath) {
        return NextResponse.json({ error: 'Document file path not found' }, { status: 404 });
    }

    const {data: file, error} = await supabase.storage.from('documents').download(filePath)

    if (error) {
        console.log("Error downloading file", error)
        return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer()


    return new Response(arrayBuffer, {
        headers: {
            "Content-Type": file.type,
            "Content-Length": file.size.toString(),
            "X-File-Name": document.fileName || "Placeholder Name",
            "X-Last-Modified": document.updatedAt?.getTime()?.toString() || new Date().getTime().toString(),
        }
    })
}catch(error){
    console.log("Error downloading file", error)
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
}

}