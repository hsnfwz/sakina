import SVGOutlineLoader from './svgs/outline/SVGOutlineLoader';

function Loading() {
  return (
    <div className="flex animate-spin self-start fill-sky-500">
      <SVGOutlineLoader />
    </div>
  );
}

export default Loading;
