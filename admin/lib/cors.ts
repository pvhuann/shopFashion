
import { NextResponse } from "next/server";
export const setCorsHeaders = (response: NextResponse , method : string) => {
    response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:4000");
    response.headers.set("Access-Control-Allow-Methods", method);
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
}

export default setCorsHeaders;