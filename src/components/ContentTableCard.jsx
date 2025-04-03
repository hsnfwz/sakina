import { BUTTON_COLOR } from '../common/enums';
import Button from './Button';
import SVGOutlineArchive from './svgs/outline/SVGOutlineArchive';
import SVGOutlinePencil from './svgs/outline/SVGOutlinePencil';
import SVGOutlineUnarchive from './svgs/outline/SVGOutlineUnarchive';

function ContentTableCard({ content, handleEdit, handleHide, handleUnhide }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex flex-col gap-2">
        <h1>{content.title}</h1>
        {content.description && <p>{content.description}</p>}
      </div>
      <div className="flex gap-2">
        <Button color={BUTTON_COLOR.SOLID_BLUE} handleClick={handleEdit}>
          <SVGOutlinePencil />
        </Button>
        {handleHide && (
          <Button color={BUTTON_COLOR.SOLID_RED} handleClick={handleHide}>
            <SVGOutlineArchive />
          </Button>
        )}
        {handleUnhide && (
          <Button color={BUTTON_COLOR.SOLID_RED} handleClick={handleUnhide}>
            <SVGOutlineUnarchive />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ContentTableCard;
