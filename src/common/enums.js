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

export { ORDER_BY, BUTTON_COLOR };
