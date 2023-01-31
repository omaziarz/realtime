import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { AdminDiscussionChatMessage } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

async function getMessages(id: string) {
  const res = await fetch("/api/discussion/" + id);
  const data = await res.json();
  return data as AdminDiscussionChatMessage[];
}

async function postMessage({ id, message }: { id: string; message: string }) {
  const res = await fetch("/api/discussion/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ content: message }),
  });
  const data = await res.json();
  return data as AdminDiscussionChatMessage[];
}

export default function AdminDiscussionModal({ chatId }: { chatId: string }) {
  let [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    window.socket.emit("chat_join", { chatId });
    openModal();
  };

  const session = useSession();

  const messages = useQuery(["messages", chatId], async () =>
    getMessages(chatId)
  );

  const isSender = (message: AdminDiscussionChatMessage) => {
    console.log("isSender", message.senderId, session);
    return message.senderId === session.data.id;
  };

  const sendMutation = useMutation(postMessage, {
    onSuccess: async () => {
      setMessage("");
      await messages.refetch();
      window.socket.emit("message", { chatId });
    },
  });

  function closeModal() {
    setIsOpen(false);
  }

  function handleClose() {
    window.socket.emit("chat_leave", { chatId });
    closeModal();
  }

  function openModal() {
    setIsOpen(true);
  }

  const [message, setMessage] = useState("");

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Ouvrir le chat
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Support
                  </Dialog.Title>
                  <div className="mt-2 scroll-auto flex flex-col gap-2">
                    {messages.data?.map((message) => (
                      <div
                        key={message.messageId}
                        className={`flex flex-row ${
                          isSender(message) ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`${
                            isSender(message)
                              ? "bg-blue-100 text-blue-900"
                              : "bg-gray-100 text-gray-900"
                          } inline-block p-2 rounded-lg`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-row gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full border-indigo-500 border-2 p-2 rounded-lg"
                      placeholder="taper votre message"
                    />
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() =>
                        sendMutation.mutateAsync({ id: chatId, message })
                      }
                    >
                      envoyer
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
