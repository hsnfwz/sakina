import { useContext, useEffect, useState } from "react";
import { UserContext } from "../common/contexts";
import { getIslamicDate } from "../common/helpers.js";
import { supabase } from "../common/supabase.js";
import Loading from "../components/Loading.jsx";

function HomeLayout() {
  const { user } = useContext(UserContext);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  async function getPosts() {
    setLoadingPosts(true);

    const { data: followersData, error: followersError } = await supabase
      .from("followers")
      .select("*")
      .eq("sender_user_id", user.id);

    if (followersError) {
      console.log(followersError);
    }

    const receiverUserIds = followersData.map(
      (follower) => follower.receiver_user_id,
    );

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .in("user_id", receiverUserIds)
      .eq("status", "ACCEPTED")
      .order("created_at", { ascending: false });

    if (postsError) {
      console.log(postsError);
    }

    setPosts(postsData);
    setLoadingPosts(false);
  }

  useEffect(() => {
    async function initialize() {
      await getPosts();
    }

    if (user) initialize();
  }, [user]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-4">
        {!user && (
          <>
            <h1 className="text-center text-2xl">Salam!</h1>
            <p className="text-center">Welcome to Project 313.</p>
          </>
        )}
        {user && (
          <>
            <h1 className="text-center text-2xl">Salam {user.username}!</h1>
            <p className="text-center">
              Welcome back. Your feed is up to date for{" "}
              {getIslamicDate(new Date())}
            </p>
          </>
        )}
      </div>
      {loadingPosts && <Loading />}
      {!loadingPosts && (
        <>
          {posts.map((post) => (
            <div key={post.id}></div>
          ))}
        </>
      )}
    </div>
  );
}

export default HomeLayout;
