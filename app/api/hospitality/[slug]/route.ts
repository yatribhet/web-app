import { NextRequest, NextResponse } from "next/server";
import { getPlaceHospitality } from "@/src/lib/places";
import { HospitalityType } from "@/src/types/place";

/**
 * Thin proxy so the browser can filter / load more hospitality without ever
 * seeing the server API key. getPlaceHospitality runs server-side and attaches
 * the x-api-key header.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("hospitalityType") as HospitalityType | null;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;

  try {
    const result = await getPlaceHospitality(params.slug, {
      hospitalityType: type ?? undefined,
      page,
      limit,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ data: [], pagination: {} }, { status: 200 });
  }
}
