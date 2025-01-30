import { useRef, useState } from "react";
import { supabase } from "../common/supabase.js";
import IconButton from "./IconButton.jsx";
import SearchBarResults from "./SearchBarResults.jsx";
import TextInput from "./TextInput.jsx";
import SVGOutlineX from "./svgs/outline/SVGOutlineX.jsx";

function SearchBar() {
  const timerRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

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

  async function findQuestions(searchTerm) {
    setLoadingQuestions(true);
    const { data, error } = await supabase.rpc("search_questions", {
      prefix: searchTerm,
    });
    if (data) {
      setQuestions(data);
    }
    setLoadingQuestions(false);
  }

  async function search(event) {
    setSearchTerm(event.target.value);

    clearTimeout(timerRef.current);
    if (event.target.value && event.target.value.length > 0) {
      timerRef.current = setTimeout(async () => {
        await Promise.all([
          findPosts(event.target.value.split(" ").join("+")),
          findProfiles(event.target.value.split(" ").join("+")),
          findQuestions(event.target.value.split(" ").join("+")),
        ]);
      }, 1000);
    } else {
      clearSearchResults();
    }
  }

  function clearSearch() {
    setSearchTerm("");
    clearSearchResults();
  }

  function clearSearchResults() {
    setPosts([]);
    setProfiles([]);
  }

  return (
    <div className="sticky top-0 z-40 flex w-full flex-col gap-4 bg-black py-4">
      <div className="flex w-full items-center gap-2">
        <TextInput
          placeholder="Search"
          handleInput={search}
          value={searchTerm}
        />
        <IconButton handleClick={clearSearch}>
          <SVGOutlineX />
        </IconButton>
      </div>
      {(posts.length > 0 || profiles.length > 0) && (
        <SearchBarResults
          searchTerm={searchTerm}
          posts={posts}
          profiles={profiles}
          questions={questions}
          clearSearchResults={clearSearchResults}
        />
      )}
    </div>
  );
}

export default SearchBar;
