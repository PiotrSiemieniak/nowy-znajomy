import ChatPage from "@/components/views/ChatPage/ChatPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}) {
  const { id } = await searchParams;

  return <ChatPage chatId={id} />;
}
