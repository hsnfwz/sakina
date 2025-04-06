import { Pen, ArchiveX, ArchiveRestore } from 'lucide-react';
import { BUTTON_COLOR } from '../common/enums';
import Button from './Button';

function ContentTableCard({
  content,
  handleEdit,
  handleHide,
  handleUnhide,
  elementRef,
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 py-2"
      ref={elementRef}
    >
      <div className="flex flex-col gap-2">
        <h1>{content.title}</h1>
        {content.description && <p>{content.description}</p>}
      </div>
      <div className="flex gap-2">
        <Button
          isRound={true}
          color={BUTTON_COLOR.SOLID_BLUE}
          handleClick={handleEdit}
        >
          <Pen />
        </Button>
        {handleHide && (
          <Button
            isRound={true}
            color={BUTTON_COLOR.OUTLINE_RED}
            handleClick={handleHide}
          >
            <ArchiveX />
          </Button>
        )}
        {handleUnhide && (
          <Button
            isRound={true}
            color={BUTTON_COLOR.SOLID_RED}
            handleClick={handleUnhide}
          >
            <ArchiveRestore />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ContentTableCard;
