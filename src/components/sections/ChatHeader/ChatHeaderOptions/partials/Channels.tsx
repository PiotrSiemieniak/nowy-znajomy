import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { SlidersHorizontal } from "lucide-react";

export function Channels() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size={"sm"} className="rounded-xl inline-flex">
          Filtry i kanały <SlidersHorizontal className="ml-1" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-1 w-full max-h-3/4 h-fit">
        <div className="mx-auto max-w-96 w-full">
          <DrawerHeader>
            <DrawerTitle>Filtry</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <div className="growing overflow-y-auto p-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Exercitationem tempore nostrum deserunt, minima voluptate, nulla
            voluptates velit vel natus tempora autem cupiditate voluptatum
            dolore! Praesentium, harum voluptates. Quasi, maxime ipsa?
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose className="w-full">
              <Button variant="outline" className="w-full mt-2">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
