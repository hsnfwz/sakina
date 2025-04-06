import { LoaderPinwheel } from 'lucide-react';

function Loading() {
  return (
    <div className="flex animate-spin self-start fill-sky-500">
      <LoaderPinwheel />
    </div>
  );
}

export default Loading;
