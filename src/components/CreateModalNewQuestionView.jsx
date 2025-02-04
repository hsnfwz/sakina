import { useContext, useState } from 'react';
import { ModalContext, UserContext } from '../common/contexts';
import { supabase } from '../common/supabase';
import Button from './Button';
import Modal from './Modal';
import TextInput from './TextInput';
import Textarea from './Textarea';
import Toggle from './Toggle';

const titleCharacterLimit = 100;
const descriptionCharacterLimit = 2000;

function CreateModalNewQuestionView() {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  async function addQuestion() {
    setIsAddingQuestion(true);
    const { data, error } = await supabase
      .from('questions')
      .insert({
        user_id: user.id,
        title,
        description,
        is_anonymous: isAnonymous,
      })
      .select('*');

    // if (error) {
    //   console.log(error);
    // } else {
    //   await supabase.rpc('increment', {
    //     table_name: 'questions',
    //     row_id: data[0].id,
    //     row_column: 'comments_count',
    //     increment_amount: 1,
    //   });
    // }
    setIsAddingQuestion(false);
    setTitle('');
    setDescription('');
    setIsAnonymous(true);
    setShowModal({
      type: null,
      data: null,
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold">New Question</h1>
      <div className="flex items-center gap-2">
        <Toggle
          handleChange={() => setIsAnonymous(!isAnonymous)}
          isChecked={isAnonymous}
        />
        <p>Anonymous</p>
      </div>
      <div className="flex flex-col gap-2">
        <p
          className={`self-end ${title.length > titleCharacterLimit ? 'text-rose-500' : 'text-white'}`}
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
          className={`self-end ${description.length > descriptionCharacterLimit ? 'text-rose-500' : 'text-white'}`}
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
            setTitle('');
            setDescription('');
            setShowModal({
              type: null,
              data: null,
            });
          }}
        >
          Clear
        </Button>
        <Button
          isDisabled={
            isAddingQuestion ||
            title === '' ||
            title.length > titleCharacterLimit ||
            description.length > descriptionCharacterLimit
          }
          isLoading={isAddingQuestion}
          handleClick={async () => await addQuestion()}
          isOutline={true}
        >
          Submit
        </Button>
      </div>
    </>
  );
}

export default CreateModalNewQuestionView;
