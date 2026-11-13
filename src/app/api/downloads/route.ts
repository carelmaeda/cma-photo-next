import { NextResponse } from "next/server";
import {
  getDownloadCounts,
  incrementDownload,
  isDownloadId,
  probeDownloadStore,
  totalDownloads,
} from "@/lib/download-counts";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Download counter endpoint. The TrackedDownload link POSTs here with
 * navigator.sendBeacon (text/plain body: {"id":"recipe:vanilla-summer"}).
 * GET returns every count plus the total, for checking on a deploy preview.
 * GET ?debug=1 runs the Blobs probe (timings and errors per operation).
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
  } catch (error) {
    // Blobs unreachable or slow (local dev, an outage). The download itself
    // already happened; say why so a deploy preview check can see it.
    return NextResponse.json(
      {
        error: "Counter unavailable",
        detail: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      },
      { status: 503, headers: noStore }
    );
  }
}

export async function GET(request: Request) {
  if (new URL(request.url).searchParams.get("debug") === "1") {
    return NextResponse.json(await probeDownloadStore(), { headers: noStore });
  }
  const counts = await getDownloadCounts();
  return NextResponse.json(
    { counts, total: totalDownloads(counts) },
    { headers: noStore }
  );
}
