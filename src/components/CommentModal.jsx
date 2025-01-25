import { useContext, useState } from "react";
import { ModalContext, UserContext } from "../common/contexts";
import { supabase } from "../common/supabase";
import Button from "./Button";
import Modal from "./Modal";
import Textarea from "./Textarea";
import Toggle from "./Toggle";

const descriptionCharacterLimit = 2000;

function CommentModal() {
  const { user } = useContext(UserContext);
  const { showModal, setShowModal } = useContext(ModalContext);

  const [isAddingQuestionComment, setIsAddingQuestionComment] = useState(false);

  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  async function addQuestionComment() {
    setIsAddingQuestionComment(true);
    const { data, error } = await supabase
      .from("question_comments")
      .insert({
        user_id: user.id,
        question_id: showModal.data.questionId,
        parent_question_comment_id: showModal.data.parentQuestionCommentId,
        description,
        is_anonymous: isAnonymous,
      })
      .select("*");

    if (error) {
      console.log(error);
    }
    setIsAddingQuestionComment(false);
    setDescription("");
    setIsAnonymous(true);
    setShowModal(null);
  }

  return (
    <Modal>
      <div className="flex flex-col gap-2">
        <Toggle
          handleChange={() => setIsAnonymous(!isAnonymous)}
          label="Anonymous"
          isChecked={isAnonymous}
        />
        <p
          className={`self-end ${description.length > descriptionCharacterLimit ? "text-rose-500" : "text-white"}`}
        >
          {description.length} / {descriptionCharacterLimit}
        </p>
        <Textarea
          handleInput={(event) => setDescription(event.target.value)}
          placeholder="Comment"
          value={description}
        />
        <div className="flex gap-2 self-end">
          <Button handleClick={() => setDescription("")}>Clear</Button>
          <Button
            isDisabled={
              isAddingQuestionComment ||
              description === "" ||
              description.length > descriptionCharacterLimit
            }
            isLoading={isAddingQuestionComment}
            handleClick={async () => await addQuestionComment()}
            outline={true}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CommentModal;
