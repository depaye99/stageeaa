import { NextRequest, NextResponse } from "next/server";
import { demandesService } from "@/lib/services/demandes-service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { commentaire } = await request.json();
    const demande = await demandesService.approuveDemande(
      params.id,
      commentaire,
    );
    return NextResponse.json(demande);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
