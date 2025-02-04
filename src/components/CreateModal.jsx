import Modal from './Modal';
import { Link } from 'react-router';

import { useState } from 'react';
import CreateModalNewPostView from './CreateModalNewPostView';
import CreateModalNewQuestionView from './CreateModalNewQuestionView';

function CreateModal() {
  const [view, setView] = useState('NEW_POST');

  return (
    <Modal>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          to="#"
          onClick={() => {
            setView('NEW_POST');
          }}
          className={`${view === 'NEW_POST' ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
        >
          <span className="capitalize">New Post</span>
        </Link>
        <Link
          to="#"
          onClick={() => {
            setView('NEW_QUESTION');
          }}
          className={`${view === 'NEW_QUESTION' ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
        >
          <span className="capitalize">New Question</span>
        </Link>
      </div>
      {view === 'NEW_POST' && <CreateModalNewPostView />}

      {view === 'NEW_QUESTION' && <CreateModalNewQuestionView />}
    </Modal>
  );
}

export default CreateModal;
