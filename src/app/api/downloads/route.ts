import { NextResponse } from "next/server";
import {
  getDownloadCounts,
  incrementDownload,
  isDownloadId,
  totalDownloads,
} from "@/lib/download-counts";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Download counter endpoint. The TrackedDownload link POSTs here with
 * navigator.sendBeacon (text/plain body: {"id":"recipe:vanilla-summer"}).
 * GET returns every count plus the total, for checking on a deploy preview.
 */

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!siteConfig.downloadCounts.enabled) {
    return new NextResponse(null, { status: 204, headers: noStore });
  }

  let id: unknown;
  try {
    id = (JSON.parse(await request.text()) as { id?: unknown }).id;
  } catch {
    return NextResponse.json({ error: "Bad body" }, { status: 400, headers: noStore });
  }
  if (typeof id !== "string" || !isDownloadId(id)) {
    return NextResponse.json({ error: "Unknown id" }, { status: 400, headers: noStore });
  }

  try {
    const count = await incrementDownload(id);
    return NextResponse.json({ id, count }, { headers: noStore });
  } catch {
    // Blobs unavailable (local dev). The download itself already happened.
    return NextResponse.json({ error: "Counter unavailable" }, { status: 503, headers: noStore });
  }
}

export async function GET() {
  const counts = await getDownloadCounts();
  return NextResponse.json(
    { counts, total: totalDownloads(counts) },
    { headers: noStore }
  );
}
