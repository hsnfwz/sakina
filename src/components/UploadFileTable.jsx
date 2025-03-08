import { useUppyEvent, useUppyState } from '@uppy/react';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import SortableFile from './SortableFile';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

function UploadFileTable({
  uppy,
  setUploadStarted,
  setUploadCompleted,
  uploadFileButtonRef,
}) {
  const uppyFiles = useUppyState(uppy, (state) => Object.values(state.files));

  useUppyEvent(uppy, 'file-removed', () => {
    uploadFileButtonRef.current.value = null;
  });

  useUppyEvent(uppy, 'upload-start', () => {
    if (setUploadStarted) setUploadStarted(true);
  });

  useUppyEvent(uppy, 'complete', () => {
    if (setUploadCompleted) setUploadCompleted(true);
    uploadFileButtonRef.current.value = null;
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        onDragStart={() => {
          console.log('drag start');
        }}
        onDragEnd={(event) => {
          console.log('drag end');

          const { active, over } = event;

          console.log(active, over);

          if (over && active.id !== over.id) {
            const oldIndex = uppyFiles.findIndex(
              (file) => file.id === active.id
            );
            const newIndex = uppyFiles.findIndex((file) => file.id === over.id);
            const newArray = arrayMove(uppyFiles, oldIndex, newIndex);
            // set state to be new array
          }
        }}
      >
        <SortableContext items={uppyFiles}>
          {uppyFiles.map((file, index) => (
            <SortableFile
              key={index}
              file={file}
              handlePauseResume={() => {
                uppy.pauseResume(file.id);
              }}
              handleCancel={() => {
                uppy.removeFile(file.id);

                if (uppy.getFiles().length === 0) {
                  if (setUploadStarted) {
                    setUploadStarted(false);
                  }
                }
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default UploadFileTable;
