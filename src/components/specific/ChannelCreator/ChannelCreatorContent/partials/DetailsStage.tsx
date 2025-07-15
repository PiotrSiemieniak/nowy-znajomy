import { UserRoundSearch, Users } from "lucide-react";

type Props = {
  name: string;
  description: string;
  channelType: string;
};
const channelTypeIconsSx = "text-muted-foreground size-4 ml-1";
export function DetailsStage({ name, description, channelType }: Props) {
  const channelTypeIcon =
    channelType === "thematic" ? (
      <UserRoundSearch className={channelTypeIconsSx} />
    ) : (
      <Users className={channelTypeIconsSx} />
    );

  return (
    <div className="flex flex-col">
      {/* TODO: lepiej zrobić miniaturkę z listy kanałów i miniaturkę z wyświetlania kanału */}
      <p className="text-xs text-muted-foreground inline-flex">
        Nowy kanał <b className="ml-1">{channelType}</b> {channelTypeIcon}
      </p>
      <p className="inline-flex font-semibold">{name}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
