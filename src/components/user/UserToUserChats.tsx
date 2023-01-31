import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import {
  AdminDiscussionChat,
  AdminDiscussionRequest,
  User,
} from "@prisma/client";
import AdminDiscussionModal from "@/components/AdminDiscussionModal";
import UserDiscussionModal from "@/components/UserDiscussionModal";

async function getAllUsers() {
  const res = await fetch("/api/customer/");
  const data = await res.json();
  return data as User[];
}
async function requestDiscussionWithAdmin() {
  const res = await fetch("/api/customer/discussion/request", {
    method: "POST",
  });
  const data = await res.json();
  return data as AdminDiscussionRequest;
}
export default function UserToUserChats() {
  const allUsers = useQuery(["all-users"], getAllUsers);

  console.log(allUsers.data);
  const renderContent = () => {
    if (allUsers.isLoading)
      return (
        <div className="mt-4">
          <Loader />
        </div>
      );
    if (allUsers.isError) return <p>Une erreur est survenue</p>;
    if (allUsers.data?.count === 0)
      return <p className="mt-4">Aucun utilisateurs</p>;
    return (
      <div className="mt-4 flex flex-col gap-2">
        {allUsers.data.map((u) => (
          <div
            className="flex flex-row items-center justify-between"
            key={u.id}
          >
            <div className="flex-row flex items-center gap-4">
              <img className="w-20 h-20 rounded-full" src={u.image} />
              <span>{u.name}</span>
            </div>
            <div>
              <UserDiscussionModal chatId={u.id} name={u.name} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow mt-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Chatter avec un autre utilisateur
              </h3>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
