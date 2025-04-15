import { ChatMessageElement } from "./ChatMessageElement";

export function ChatMessages() {
  return (
    <div className="flex flex-col gap-4 h-full w-full p-2 fixed bottom-0 overflow-y-auto pt-52 pb-28">
      <div className="flex items-center justify-center flex-col py-10">
        <p className="text-xl font-semibold text-gray-50/50">
          Rozpoczęto rozmowę
        </p>
        <p className="text-gray-50/50">Kanał: xxx</p>
        <p className="text-gray-50/50 text-xs">Napisz coś, aby się przywitać</p>
      </div>

      <ChatMessageElement text="Cześć!" />
      <ChatMessageElement
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit."
      />
      <ChatMessageElement
        isItMe
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
        exercitationem sit rerum quidem impedit laudantium eveniet numquam, ex
        doloremque incidunt ducimus aliquam magni corporis nulla ipsa veniam a
        repellat reprehenderit."
      />
      <ChatMessageElement
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        ratione tempora commodi sunt ex, repellendus laborum voluptatem tempore
        autem et consequatur blanditiis iusto deserunt esse modi soluta ad
        itaque impedit."
      />
      <ChatMessageElement
        isItMe
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        ratione tempora commodi sunt ex, repellendus laborum voluptatem tempore
        autem et consequatur blanditiis iusto deserunt esse modi soluta ad
        itaque impedit."
      />
      <ChatMessageElement
        isItMe
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        ratione tempora commodi sunt ex, repellendus laborum voluptatem tempore
        autem et consequatur blanditiis iusto deserunt esse modi soluta ad
        itaque impedit."
      />
      <ChatMessageElement
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        ratione tempora commodi sunt ex, repellendus laborum voluptatem tempore
        autem et consequatur blanditiis iusto deserunt esse modi soluta ad
        itaque impedit."
      />
      <ChatMessageElement
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        ratione tempora commodi sunt ex, repellendus laborum voluptatem tempore
        autem et consequatur blanditiis iusto deserunt esse modi soluta ad
        itaque impedit."
      />
      <ChatMessageElement
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        ratione tempora commodi sunt ex, repellendus laborum voluptatem tempore
        autem et consequatur blanditiis iusto deserunt esse modi soluta ad
        itaque impedit."
      />
      <ChatMessageElement
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        ratione tempora commodi sunt ex, repellendus laborum voluptatem tempore
        autem et consequatur blanditiis iusto deserunt esse modi soluta ad
        itaque impedit."
      />
      <ChatMessageElement
        isItMe
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        ratione tempora commodi sunt ex, repellendus laborum voluptatem tempore
        autem et consequatur blanditiis iusto deserunt esse modi soluta ad
        itaque impedit."
      />
      <ChatMessageElement
        isItMe
        text="
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        ratione tempora commodi sunt ex, repellendus laborum voluptatem tempore
        autem et consequatur blanditiis iusto deserunt esse modi soluta ad
        itaque impedit."
      />
    </div>
  );
}
