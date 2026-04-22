import { listTasks } from "@flowframe/core";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ tasks: await listTasks() });
}
