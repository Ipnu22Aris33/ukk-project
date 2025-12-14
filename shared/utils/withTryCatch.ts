// server/utils/withTryCatch.ts
import { NextResponse } from "next/server";

export function withTryCatch(handler: () => Promise<any>) {
  return async () => {
    try {
      const result = await handler();
      return NextResponse.json(result);
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Something went wrong" },
        { status: 500 },
      );
    }
  };
}
