import { NextRequest, NextResponse } from "next/server";
import { demandesService } from "@/lib/services/demandes-service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { motif } = await request.json();
    const demande = await demandesService.rejeterDemande(params.id, motif);
    return NextResponse.json(demande);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}