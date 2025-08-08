import type { TradeDataPopoverOpen } from "@/components/providers/ChatProvider/types";
import { Button } from "@/components/ui/Button";
import { FormElement } from "@/components/ui/FormElement";
import { LABEL_TRANSLATIONS } from "../../consts";
import {
  useChatAction,
  useChatState,
} from "@/components/providers/ChatProvider";
import { getSessionKey } from "@/lib/getSessionKey";
import { Badge } from "@/components/ui/Badge";
import { Lock } from "lucide-react";

type Props = {
  value: TradeDataPopoverOpen;
};
// TODO: dostosować pod czat grupowy (np. roomUsersInfo)
export function DataRecord({ value }: Props) {
  const { roomUsersInfo } = useChatState();
  const { changeTradeDataPopoverOpen } = useChatAction();

  if (!value) {
    throw new Error("Value is required for DataRecord component");
  }
  const label = LABEL_TRANSLATIONS[value];

  if (!label) {
    throw new Error(`No label found for value: ${value} (DataRecord.tsx)`);
  }

  const mySessionKey = getSessionKey();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [mySessionKey]: _, ...roomUsersInfoButMe } = roomUsersInfo;

  const my = Object.values(roomUsersInfoButMe)[0];
  const myDetails = my?.details as Record<string, string | undefined>;
  const myDataValueOfThis = myDetails?.[value as string];

  const interlocutor = Object.values(roomUsersInfoButMe)[0];
  const interlocutorDetails = interlocutor?.details as Record<
    string,
    string | undefined
  >;
  const interlocutorDataValueOfThis = interlocutorDetails?.[value as string];

  const handleClick = changeTradeDataPopoverOpen.bind(null, value);

  return (
    <FormElement label={label}>
      <div className="flex justify-between items-center">
        <div>
          {interlocutorDataValueOfThis ? (
            <p className="text-muted-foreground text-sm">
              {interlocutorDataValueOfThis}
            </p>
          ) : (
            <Badge>
              <Lock />
            </Badge>
          )}
        </div>
        <div className="space-x-2">
          {myDataValueOfThis && <Badge variant={"secondary"}>Odkryłeś</Badge>}
          <Button variant={"outline"} size={"sm"} onClick={handleClick}>
            Akcja
          </Button>
        </div>
      </div>
    </FormElement>
  );
}
