const UPLOAD_TYPE = Object.freeze({
  IMAGE: {
    type: 'IMAGE',
    bucketName: 'images',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    sizeLimit: 50000000, // 50 MB
  },
  VIDEO: {
    type: 'VIDEO',
    bucketName: 'videos',
    mimeTypes: ['video/mp4', 'video/mov', 'video/avi'],
    sizeLimit: 50000000, // 50 MB
  },
  AVATAR: {
    type: 'AVATAR',
    bucketName: 'avatars',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    sizeLimit: 50000000, // 50 MB
  },
});

const ORDER_BY = Object.freeze({
  NEW: {
    columnName: 'created_at',
    isAscending: false,
  },
  OLD: {
    columnName: 'created_at',
    isAscending: true,
  },
  TOP: {
    columnName: 'likes_count',
    isAscending: false,
  },
});

const BUTTON_COLOR = Object.freeze({
  RED: {
    tailwindColor: 'bg-rose-500',
    tailwindColorHover: 'hover:bg-rose-700',
  },
  BLUE: {
    tailwindColor: 'bg-sky-500',
    tailwindColorHover: 'hover:bg-sky-700',
  },
  GREEN: {
    tailwindColor: 'bg-emerald-500',
    tailwindColorHover: 'hover:bg-emerald-700',
  },
});

const SEARCH_TYPE = Object.freeze({
  POST_IMAGES: {
    type: 'POST_IMAGES',
    placeholder: 'Search Images',
  },
  POST_VIDEOS: {
    type: 'POST_VIDEOS',
    placeholder: 'Search Videos',
  },
  POST_DISCUSSIONS: {
    type: 'POST_DISCUSSIONS',
    placeholder: 'Search Discussions',
  },
  PROFILES: {
    type: 'PROFILES',
    placeholder: 'Search Profiles',
  },
});

export { UPLOAD_TYPE, ORDER_BY, BUTTON_COLOR, SEARCH_TYPE };
