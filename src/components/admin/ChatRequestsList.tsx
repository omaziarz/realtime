import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AdminDiscussionRequest, User } from "@prisma/client";
import Loader from "@/components/Loader";

async function getProfile() {
  const res = await fetch("/api/me");
  const data = await res.json();
  return data as { role: string; isAvailable: boolean };
}

async function setAvailable() {
  const res = await fetch("/api/me/available", {
    method: "POST",
  });
  const data = await res.json();
  return data as { role: string; isAvailable: boolean };
}

async function setUnavailable() {
  const res = await fetch("/api/me/unavailable", {
    method: "POST",
  });
  const data = await res.json();
  return data as { role: string; isAvailable: boolean };
}

async function getChatRequests() {
  const res = await fetch("/api/admin/discussion/list");
  const data = await res.json();
  return data as (AdminDiscussionRequest & { user: User })[];
}

async function acceptChatRequest({ id }: { id: string }) {
  console.log("acceptChatRequest", id);
  const res = await fetch(`/api/admin/discussion/accept`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  return data as { role: string; isAvailable: boolean };
}

async function declineChatRequest({ id }: { id: string }) {
  console.log("declineChatRequest", id);
  const res = await fetch(`/api/admin/discussion/decline`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  return data as { role: string; isAvailable: boolean };
}

export default function ChatRequestsList() {
  const query = useQuery(["profile"], getProfile);

  const chatRequestsQuery = useQuery(["chat-requests"], getChatRequests);

  console.log("chatRequestsQuery", chatRequestsQuery.data);

  const availableMutation = useMutation(setAvailable, {
    onSuccess: async () => {
      toast("Vous êtes maintenant disponible", { type: "success" });
      console.log("emit", window.socket);
      window.socket.emit("admin-available");
      await query.refetch();
    },
    onError: () => {
      toast("Une erreur est survenue", { type: "error" });
    },
  });

  const unavailableMutation = useMutation(setUnavailable, {
    onSuccess: async () => {
      toast("Vous êtes maintenant indisponible", { type: "success" });
      window.socket.emit("admin-unavailable");
      await query.refetch();
    },
    onError: () => {
      toast("Une erreur est survenue", { type: "error" });
    },
  });

  const acceptChatRequestMutation = useMutation(acceptChatRequest, {
    onSuccess: async (data, variables, context) => {
      console.log(variables);
      window.socket.emit("update-discussion-request", { id: variables.id });
      await chatRequestsQuery.refetch();
    },
  });

  const declineChatRequestMutation = useMutation(declineChatRequest, {
    onSuccess: async (data, variables, context) => {
      console.log(variables);
      window.socket.emit("update-discussion-request", { id: variables.id });
      await chatRequestsQuery.refetch();
    },
  });

  const renderContent = () => {
    if (chatRequestsQuery.isLoading)
      return (
        <div className="mt-4">
          <Loader />
        </div>
      );
    if (chatRequestsQuery.isError)
      return <div className="mt-4">Une erreur est survenue</div>;
    if (chatRequestsQuery.data?.length === 0)
      return <div className="mt-4">Aucune demande de chat</div>;
    return (
      <ul role="list" className="divide-y divide-gray-200">
        {chatRequestsQuery.data.map((item) => (
          <li key={item.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={item.user.image}
                  alt=""
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.user.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {item.user.email}
                </p>
              </div>
              {item.status === "PENDING" && (
                <div className="flex-shrink-0 self-center flex gap-2">
                  <button
                    onClick={() =>
                      acceptChatRequestMutation.mutateAsync({ id: item.userId })
                    }
                    type="button"
                    className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() =>
                      declineChatRequestMutation.mutateAsync({
                        id: item.userId,
                      })
                    }
                    type="button"
                    className="inline-flex items-center rounded border border-transparent bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Refuser
                  </button>
                </div>
              )}
              {item.status === "ACCEPTED" && (
                <div className="flex gap-2 items-center">
                  <div className="flex-shrink-0 self-center flex">
                    <button
                      className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      type="button"
                    >
                      ouvrir le chat
                    </button>
                  </div>
                  <div className="flex-shrink-0 self-center flex">
                    <button
                      onClick={() =>
                        declineChatRequestMutation.mutateAsync({
                          id: item.userId,
                        })
                      }
                      type="button"
                      className="inline-flex items-center rounded border border-transparent bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Refuser
                    </button>
                  </div>
                </div>
              )}
              {item.status === "REJECTED" && (
                <div className="flex-shrink-0 self-center flex">
                  <button
                    onClick={() =>
                      acceptChatRequestMutation.mutateAsync({ id: item.userId })
                    }
                    type="button"
                    className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Re-accepter
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow mt-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-b border-gray-200 pb-5 flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Chat requests
              </h3>
              <button
                onClick={() =>
                  !query.data?.isAvailable
                    ? availableMutation.mutateAsync()
                    : unavailableMutation.mutateAsync()
                }
                type="button"
                className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {!query.data?.isAvailable
                  ? "Passer en disponible"
                  : "Passer en indisponible"}
              </button>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
