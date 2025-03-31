const UPLOAD_TYPE = Object.freeze({
  VIDEO: {
    type: 'VIDEO',
    bucketName: 'videos',
    mimeTypes: ['video/mp4', 'video/mov', 'video/avi'],
    sizeLimit: 50000000, // 50 MB
  },
  VIDEO_THUMBNAIL: {
    type: 'VIDEO_THUMBNAIL',
    bucketName: 'video-thumbnails',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
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
  SOLID_BLACK: {
    tailwindBackgroundColor: 'bg-black',
    tailwindHoverBackgroundColor: 'hover:bg-black',
    tailwindTextColor: 'text-white',
    tailwindFillColor: 'fill-white',
    tailwindBorderColor: 'border-black',
    tailwindHoverBorderColor: 'hover:border-black',
  },
  OUTLINE_BLACK: {
    tailwindBackgroundColor: 'bg-transparent',
    tailwindHoverBackgroundColor: 'hover:bg-transparent',
    tailwindTextColor: 'text-black',
    tailwindFillColor: 'fill-black',
    tailwindBorderColor: 'border-black',
    tailwindHoverBorderColor: 'hover:border-black',
  },
  SOLID_WHITE: {
    tailwindBackgroundColor: 'bg-white',
    tailwindHoverBackgroundColor: 'hover:bg-neutral-200',
    tailwindTextColor: 'text-black',
    tailwindFillColor: 'fill-black',
    tailwindBorderColor: 'border-black',
    tailwindHoverBorderColor: 'hover:border-black',
  },
  OUTLINE_WHITE: {
    tailwindBackgroundColor: 'bg-transparent',
    tailwindHoverBackgroundColor: 'hover:bg-transparent',
    tailwindTextColor: 'text-white',
    tailwindFillColor: 'fill-white',
    tailwindBorderColor: 'border-white',
    tailwindHoverBorderColor: 'hover:border-white',
  },
  SOLID_RED: {
    tailwindBackgroundColor: 'bg-rose-500',
    tailwindHoverBackgroundColor: 'hover:bg-rose-700',
    tailwindTextColor: 'text-white',
    tailwindFillColor: 'fill-white',
    tailwindBorderColor: 'border-rose-500',
    tailwindHoverBorderColor: 'hover:border-rose-500',
  },
  SOLID_BLUE: {
    tailwindBackgroundColor: 'bg-sky-500',
    tailwindHoverBackgroundColor: 'hover:bg-sky-700',
    tailwindTextColor: 'text-white',
    tailwindFillColor: 'fill-white',
    tailwindBorderColor: 'border-sky-500',
    tailwindHoverBorderColor: 'hover:border-sky-500',
  },
  SOLID_GREEN: {
    tailwindBackgroundColor: 'bg-emerald-500',
    tailwindHoverBackgroundColor: 'hover:bg-emerald-700',
    tailwindTextColor: 'text-white',
    tailwindFillColor: 'fill-white',
    tailwindBorderColor: 'border-emerald-500',
    tailwindHoverBorderColor: 'hover:border-emerald-500',
  },
});

const CHARACTER_LIMIT = Object.freeze({
  TITLE: {
    min: 1,
    max: 100,
  },
  DESCRIPTION: {
    min: 0,
    max: 2000,
  },
  USERNAME: {
    min: 3,
    max: 40,
  },
  PASSWORD: {
    min: 8,
  },
  NAME: {
    min: 0,
    max: 40,
  },
  BIO: {
    min: 0,
    max: 200,
  }
});

export { UPLOAD_TYPE, ORDER_BY, BUTTON_COLOR, CHARACTER_LIMIT };
