import { useContext, useEffect, useState } from "react";
import { UserContext } from "../common/contexts.js";
import { supabase } from "../common/supabase.js";
import Loading from "../components/Loading.jsx";

function NotificationsLayout() {
  const { user } = useContext(UserContext);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    async function initialize() {
      await getNotifications();
    }

    initialize();
  }, []);

  useEffect(() => {
    const notificationsInsertChannel = supabase
      .channel("notifications-insert")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          await getNotifications();
        },
      )
      .subscribe();

    return () => notificationsInsertChannel.unsubscribe();
  }, []);

  async function getNotifications() {
    setLoadingNotifications(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setNotifications(data);
    }
    setLoadingNotifications(false);
  }

  return (
    <div>
      {loadingNotifications && <Loading />}

      {!loadingNotifications && (
        <>
          {notifications.map((notification) => (
            <div key={notification.id}>
              {notification.message_type === "POST_ACCEPTED" && (
                <p className="bg-sky-500">{notification.message}</p>
              )}

              {notification.message_type === "POST_REJECTED" && (
                <p className="bg-rose-500">{notification.message}</p>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default NotificationsLayout;
