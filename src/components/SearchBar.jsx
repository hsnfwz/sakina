import { useState } from "react";
import { supabase } from "../common/supabase.js";
import IconButton from "./IconButton.jsx";
import SearchBarResults from "./SearchBarResults.jsx";
import TextInput from "./TextInput.jsx";

let timer;

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  async function findPosts(searchTerm) {
    setLoadingPosts(true);
    const { data, error } = await supabase.rpc("search_posts", {
      prefix: searchTerm,
    });
    if (data) {
      setPosts(data);
    }
    setLoadingPosts(false);
  }

  async function findProfiles(searchTerm) {
    setLoadingProfiles(true);
    const { data, error } = await supabase.rpc("search_users", {
      prefix: searchTerm,
    });
    if (data) {
      setProfiles(data);
    }
    setLoadingProfiles(false);
  }

  async function search(event) {
    setSearchTerm(event.target.value);

    clearTimeout(timer);
    if (event.target.value && event.target.value.length > 0) {
      timer = setTimeout(async () => {
        await Promise.all([
          findPosts(event.target.value.split(" ").join("+")),
          findProfiles(event.target.value.split(" ").join("+")),
        ]);
      }, 1000);
    } else {
      setPosts([]);
      setProfiles([]);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full gap-2">
        <TextInput
          placeholder="Search"
          handleInput={search}
          value={searchTerm}
        />
        <IconButton
          handleClick={() => {
            setSearchTerm("");
            setPosts([]);
            setProfiles([]);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>
      {(posts.length > 0 || profiles.length > 0) && (
        <SearchBarResults
          searchTerm={searchTerm}
          posts={posts}
          profiles={profiles}
        />
      )}
    </div>
  );
}

export default SearchBar;
