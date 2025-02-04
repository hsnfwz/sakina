import SVGOutlineLoader from './svgs/outline/SVGOutlineLoader';

function Loading() {
  return (
    <div className="flex p-2">
      <div className="animate-spin self-start fill-sky-500">
        <SVGOutlineLoader />
      </div>
    </div>
  );
}

export default Loading;
