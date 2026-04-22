import { submitTemplateTask } from "@flowframe/core";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const task = await submitTemplateTask(payload);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Task submit failed" },
      { status: 400 }
    );
  }
}
