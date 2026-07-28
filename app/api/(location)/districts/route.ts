import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const {divisions_id} = await req.json()
    const res = await fetch(`https://bdapis.vercel.app/geo/v2.0/districts/${divisions_id}`);
    const data = await res.json();
    return Response.json(data);
}