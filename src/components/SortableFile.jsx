import { useSortable } from '@dnd-kit/sortable';
import IconButton from './IconButton';
import SVGOutlinePlay from './svgs/outline/SVGOutlinePlay';
import SVGOutlinePause from './svgs/outline/SVGOutlinePause';
import SVGOutlineX from './svgs/outline/SVGOutlineX';
import SVGOutlineDraggable from './svgs/outline/SVGOutlineDraggable';
import { CSS } from '@dnd-kit/utilities';
import Button from './Button';

function SortableFile({ file, handleCancel, handlePauseResume }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dotted bg-black p-2 sm:flex-row"
    >
      <p className="w-full">{file.data.name}</p>
      {/* {!file.progress.uploadStarted && (
      <p className="w-full">
        {formatFileSize(file.data.size)}{" "}
        {formatFileSizeAbbreviation(file.data.size)}
      </p>
      )} */}
      {file.progress.uploadStarted && (
        <p className="w-full">
          {file.progress.percentage}%
          {/* ({formatFileSize(file.progress.bytesUploaded)}/
          {formatFileSize(file.progress.bytesTotal)}){" "}
          {formatFileSizeAbbreviation(file.data.size)} */}
        </p>
      )}
      <div className="ml-auto flex gap-2">
        {file.progress.uploadStarted && (
          <IconButton
            isDisabled={file.progress.uploadComplete}
            handleClick={handlePauseResume}
          >
            {file.isPaused ? <SVGOutlinePlay /> : <SVGOutlinePause />}
          </IconButton>
        )}
        <IconButton
          isDisabled={file.progress.uploadComplete}
          handleClick={handleCancel}
        >
          <SVGOutlineX />
        </IconButton>
      </div>
      <button
        {...attributes}
        {...listeners}
        className="cursor-move rounded-full fill-white p-2 hover:bg-neutral-700"
      >
        <SVGOutlineDraggable />
      </button>
    </div>
  );
}

export default SortableFile;
