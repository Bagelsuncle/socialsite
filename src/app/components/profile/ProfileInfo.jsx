import { useSession } from "next-auth/react";
import { User, Mail, Calendar, AtSign } from "lucide-react";

const ProfileInfo = ({ userData }) => {
  const { data: session } = useSession();

  return (
    <div className="flex-1 text-center md:text-left">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {session?.user?.name}
      </h1>

      <div className="font-mono text-xl md:text-2xl mb-6">
        <span className="text-gray-800">appname.com/</span>
        <span className="text-gray-600 font-bold">
          {session?.user?.username}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center md:justify-start text-gray-700">
          <AtSign className="h-5 w-5 text-gray-500 mr-2" />
          <span>{session?.user?.username}</span>
        </div>

        <div className="flex items-center justify-center md:justify-start text-gray-700">
          <Mail className="h-5 w-5 text-gray-500 mr-2" />
          <span>{session?.user?.email}</span>
        </div>

        {userData && (
          <div className="flex items-center justify-center md:justify-start text-gray-700">
            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
            <span>
              Member since {new Date(userData.created_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
