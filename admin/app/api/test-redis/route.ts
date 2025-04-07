
import { getRedisClient } from "@/lib/db/init.redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response:NextResponse) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || "defaultKey";
    const value = searchParams.get("value") || "defaultValue";
    
    try {
        const redis = await getRedisClient();
        // Assuming redis is already imported and configured
        await redis.set(key, value);
        const result = await redis.get(key);

        return NextResponse.json({ key, value: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to set or get value" }, { status: 500 });
    }
}

// export async function GET() {
//     await redis.set("key", "value");
//     const value = await redis.get("key");
//     return NextResponse.json({ message: value }, { status: 200 });
// }