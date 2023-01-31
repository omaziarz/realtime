import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import { AdminDiscussionChat, AdminDiscussionRequest } from "@prisma/client";
import AdminDiscussionModal from "@/components/AdminDiscussionModal";

async function getAvailableAdmins() {
  const res = await fetch("/api/customer/admins/count");
  const data = await res.json();
  return data as { count: number };
}

async function getDiscussionRequest() {
  const res = await fetch("/api/customer/discussion/");
  const data = await res.json();
  return data as AdminDiscussionRequest & {
    adminDiscussionChat: AdminDiscussionChat | null;
  };
}
async function requestDiscussionWithAdmin() {
  const res = await fetch("/api/customer/discussion/request", {
    method: "POST",
  });
  const data = await res.json();
  return data as AdminDiscussionRequest;
}
export default function RequestAdmin() {
  const query = useQuery(["available-admins"], getAvailableAdmins);

  const queryDiscussionRequest = useQuery(
    ["discussion-request"],
    getDiscussionRequest
  );

  const requestDiscussionMutation = useMutation(requestDiscussionWithAdmin, {
    onSuccess: async () => {
      await queryDiscussionRequest.refetch();
      window.socket.emit("discussion-requested");
    },
  });

  const renderContent = () => {
    if (query.isLoading)
      return (
        <div className="mt-4">
          <Loader />
        </div>
      );
    if (query.isError) return <p>Une erreur est survenue</p>;
    if (query.data.count === 0)
      return <p className="mt-4">Aucun conseiller disponible</p>;
    if (queryDiscussionRequest.data) {
      if (queryDiscussionRequest.data.status === "PENDING")
        return <p className="mt-4">Demande en attente...</p>;
      if (queryDiscussionRequest.data.status === "ACCEPTED")
        return (
          <div className="mt-4">
            <AdminDiscussionModal chatId={queryDiscussionRequest.data.id} />
          </div>
        );
      if (queryDiscussionRequest.data.status === "REJECTED") {
        return (
          <div>
            <p className="mt-4">Demande rejetée</p>
            <button
              type="button"
              className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => requestDiscussionMutation.mutate()}
            >
              Réessayer
            </button>
          </div>
        );
      }
    } else {
      return (
        <button
          type="button"
          className=" mt-4 inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => requestDiscussionMutation.mutate()}
        >
          Demander un conseiller
        </button>
      );
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow mt-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Demander un conseiller de vente
              </h3>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
