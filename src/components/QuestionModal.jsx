import { useContext, useState } from "react";
import { ModalContext, UserContext } from "../common/contexts";
import { supabase } from "../common/supabase";
import Button from "./Button";
import Modal from "./Modal";
import TextInput from "./TextInput";
import Textarea from "./Textarea";
import Toggle from "./Toggle";

const titleCharacterLimit = 100;
const descriptionCharacterLimit = 2000;

function QuestionModal() {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  async function addQuestion() {
    setIsAddingQuestion(true);
    const { data, error } = await supabase.from("questions").insert({
      user_id: user.id,
      title,
      description,
      is_anonymous: isAnonymous,
    });

    if (error) {
      console.log(error);
    }
    setIsAddingQuestion(false);
    setTitle("");
    setDescription("");
    setIsAnonymous(true);
    setShowModal(null);
  }

  return (
    <Modal>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">Ask a Question</h1>
        <Toggle
          handleChange={() => setIsAnonymous(!isAnonymous)}
          label="Anonymous"
          isChecked={isAnonymous}
        />
        <div className="flex flex-col gap-2">
          <p
            className={`self-end ${title.length > titleCharacterLimit ? "text-rose-500" : "text-white"}`}
          >
            {title.length} / {titleCharacterLimit}
          </p>
          <TextInput
            handleInput={(event) => setTitle(event.target.value)}
            placeholder="Title"
            value={title}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p
            className={`self-end ${description.length > descriptionCharacterLimit ? "text-rose-500" : "text-white"}`}
          >
            {description.length} / {descriptionCharacterLimit}
          </p>
          <Textarea
            handleInput={(event) => setDescription(event.target.value)}
            placeholder="Description"
            value={description}
          />
        </div>
        <div className="flex gap-2 self-end">
          <Button
            handleClick={() => {
              setTitle("");
              setDescription("");
              setShowModal(null);
            }}
          >
            Clear
          </Button>
          <Button
            isDisabled={
              isAddingQuestion ||
              title === "" ||
              title.length > titleCharacterLimit ||
              description.length > descriptionCharacterLimit
            }
            isLoading={isAddingQuestion}
            handleClick={async () => await addQuestion()}
            outline={true}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default QuestionModal;
