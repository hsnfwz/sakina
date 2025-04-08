import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import {
  getDiscussions,
  getDiscussionsByUserId,
  getHiddenDiscussionsByUserId,
  getDiscussionById,
  getDiscussionCommentsByParentDiscussionId,
} from '../database/discussions';
import { DataContext } from '../context/DataContextProvider';
import { AuthContext } from '../context/AuthContextProvider';

function useDiscussion(id) {
  const location = useLocation();
  const { discussions } = useContext(DataContext);
  const [discussion, setDiscussion] = useState(null);
  const [fetchingDiscussion, setFetchingDiscussion] = useState(false);

  useEffect(() => {
    async function getData() {
      setFetchingDiscussion(true);

      let _discussion;

      if (discussions.current[id]) {
        _discussion = discussions.current[id];
      } else {
        if (location.state && location.state.discussion) {
          _discussion = location.state.discussion;
        } else {
          const data = await getDiscussionById(id);
          _discussion = data;
        }

        discussions.current[id] = _discussion;
      }

      setDiscussion(_discussion);

      setFetchingDiscussion(false);
    }

    getData();
  }, [location]);

  return [discussion, fetchingDiscussion];
}

function useDiscussionComments(discussion, intersectingElement) {
  const { discussions } = useContext(DataContext);
  const [discussionComments, setDiscussionComments] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });
  const [fetchingDiscussionComments, setFetchingDiscussionComments] = useState(false);

  useEffect(() => {
    if (discussion && !discussionComments.hasInitialized) {
      getData();
    }
  }, [discussion]);

  useEffect(() => {
    if (intersectingElement && discussionComments.hasMore) {
      getData();
    }
  }, [intersectingElement]);

  async function getData() {
    setFetchingDiscussionComments(true);

    const { data, hasMore } = await getDiscussionCommentsByParentDiscussionId(
      discussion.id,
      discussionComments.data.length
    );
    
    // TODO: save discussionComments to the discussions object

    const _discussionComments = { ...discussionComments };

    if (data.length > 0) {
      _discussionComments.data = [...discussionComments.data, ...data];
    }

    _discussionComments.hasMore = hasMore;
    _discussionComments.hasInitialized = true;

    setDiscussionComments(_discussionComments);

    setFetchingDiscussionComments(false);
  }

  return [discussionComments, fetchingDiscussionComments];
}

function useUserDiscussions(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { userDiscussions, setUserDiscussions } = useContext(DataContext);
  const [fetchingUserDiscussions, setFetchingUserDiscussions] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (!userDiscussions.hasInitialized) {
        fetchUserDiscussions();
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && userDiscussions.hasMore) {
      fetchUserDiscussions();
    }
  }, [intersectingElement]);

  async function fetchUserDiscussions() {
    setFetchingUserDiscussions(true);

    const { data, hasMore } = await getDiscussionsByUserId(
      authUser.id,
      userDiscussions.data.length
    );

    const _userDiscussions = { ...userDiscussions };

    if (data.length > 0) {
      _userDiscussions.data = [...userDiscussions.data, ...data];
    }

    _userDiscussions.hasMore = hasMore;
    _userDiscussions.hasInitialized = true;

    setUserDiscussions(_userDiscussions);

    setFetchingUserDiscussions(false);
  }

  return [userDiscussions, fetchingUserDiscussions];
}

function useUserHiddenDiscussions(intersectingElement) {
  const { authUser } = useContext(AuthContext);
  const { userHiddenDiscussions, setUserHiddenDiscussions } =
    useContext(DataContext);
  const [fetchingUserHiddenDiscussions, setFetchingUserHiddenDiscussions] =
    useState(false);

  useEffect(() => {
    if (authUser) {
      if (!userHiddenDiscussions.hasInitialized) {
        fetchUserDiscussions();
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && userHiddenDiscussions.hasMore) {
      fetchUserDiscussions();
    }
  }, [intersectingElement]);

  async function fetchUserDiscussions() {
    setFetchingUserHiddenDiscussions(true);

    const { data, hasMore } = await getHiddenDiscussionsByUserId(
      authUser.id,
      userHiddenDiscussions.data.length
    );

    const _userHiddenDiscussions = { ...userHiddenDiscussions };

    if (data.length > 0) {
      _userHiddenDiscussions.data = [...userHiddenDiscussions.data, ...data];
    }

    _userHiddenDiscussions.hasMore = hasMore;
    _userHiddenDiscussions.hasInitialized = true;

    setUserHiddenDiscussions(_userHiddenDiscussions);

    setFetchingUserHiddenDiscussions(false);
  }

  return [userHiddenDiscussions, fetchingUserHiddenDiscussions];
}

function useExploreDiscussions() {
  const { discussions, exploreDiscussions, setExploreDiscussions } =
    useContext(DataContext);
  const [fetchingExploreDiscussions, setFetchingExploreDiscussions] =
    useState(false);

  useEffect(() => {
    if (!exploreDiscussions.hasInitialized) {
      fetchData();
    }
  }, []);

  async function fetchData() {
    setFetchingExploreDiscussions(true);

    const { data, hasMore } = await getDiscussions(
      exploreDiscussions.keys.length
    );
    data.forEach((row) => (discussions.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _exploreDiscussions = { ...exploreDiscussions };

    if (data.length > 0) {
      _exploreDiscussions.keys = [...exploreDiscussions.keys, ...ids];
    }

    _exploreDiscussions.hasMore = hasMore;
    _exploreDiscussions.hasInitialized = true;

    setExploreDiscussions(_exploreDiscussions);

    setFetchingExploreDiscussions(false);
  }

  return [exploreDiscussions, fetchingExploreDiscussions];
}

function useViewAllDiscussions(intersectingElement) {
  const { discussions, viewAllDiscussions, setViewAllDiscussions } =
    useContext(DataContext);
  const [fetchingViewAllDiscussions, setFetchingViewAllDiscussions] =
    useState(false);

  useEffect(() => {
    if (!viewAllDiscussions.hasInitialized) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (intersectingElement && viewAllDiscussions.hasMore) {
      fetchData();
    }
  }, [intersectingElement]);

  async function fetchData() {
    setFetchingViewAllDiscussions(true);

    const { data, hasMore } = await getDiscussions(
      viewAllDiscussions.keys.length
    );
    data.forEach((row) => (discussions.current[row.id] = row));
    const ids = data.map((row) => row.id);

    const _viewAllDiscussions = { ...viewAllDiscussions };

    if (data.length > 0) {
      _viewAllDiscussions.keys = [...viewAllDiscussions.keys, ...ids];
    }

    _viewAllDiscussions.hasMore = hasMore;
    _viewAllDiscussions.hasInitialized = true;

    setViewAllDiscussions(_viewAllDiscussions);

    setFetchingViewAllDiscussions(false);
  }

  return [viewAllDiscussions, fetchingViewAllDiscussions];
}

export {
  useDiscussion,
  useDiscussionComments,
  useUserDiscussions,
  useUserHiddenDiscussions,
  useExploreDiscussions,
  useViewAllDiscussions,
};
