import { NextRequest, NextResponse } from "next/server";
import { createChannel } from "@/lib/services/queries/channel";
import { Channel } from "@/lib/globalTypes/channel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/configs/authConfig";
import { queryFirestore, addDocumentToFirestore } from "@/lib/services/adapters/firebase/utils/queryFirestore";
import { isChannelNameTaken } from "@/lib/services/queries/channel";
import { validateChannelName, getUserIdFromSession } from "./utils";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id || null;
  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data: Channel = await req.json();

    // Walidacja długości nazwy kanału
    const nameError = validateChannelName(data.name);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    // Sprawdź, czy istnieje już kanał o tej nazwie (case-insensitive)
    const nameLower = data.name.trim().toLowerCase();
    const nameTaken = await isChannelNameTaken(data.name);
    if (nameTaken) {
      return NextResponse.json({ error: "Channel name already exists" }, { status: 409 });
    }

    // Przygotuj dane do kolekcji channels (tylko podstawowe pola)
    const now = new Date().toISOString();
    const channelId = data.id;
    const channelDoc: Channel = {
      id: channelId,
      name: data.name,
      type: data.type,
      isActive: true,
      regionCode: data.regionCode,
      estimatedUsers: data.estimatedUsers ?? 0,
      tags: data.tags,
      settings: data.settings,
      description: data.description,
      // Dodajemy nameLower do optymalnych kwerend
      nameLower,
    } as Channel & { nameLower: string };
    const id = await createChannel(channelDoc);
    if (!id) {
      return NextResponse.json({ error: "Channel creation failed" }, { status: 500 });
    }
    
    // Przygotuj dane do channelDetails
    const details = {
      createdAt: now,
      createdBy: userId,
      isStatic: false,
      lastActivityAt: now,
      usersOnline: [],
      isPrivate: data.settings?.isPrivate ?? false,
      stats: {},
      invitedUsers: data.settings?.invitedUsers ?? []
    };
    await addDocumentToFirestore("channelDetails", details, id);
    
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
