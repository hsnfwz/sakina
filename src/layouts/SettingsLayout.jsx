import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ModalContext,
  SessionContext,
  UserContext,
} from '../common/contexts.js';
import { expectedUsernameFormat } from '../common/helpers.js';
import { supabase } from '../common/supabase.js';
import TextInput from '../components/TextInput.jsx';
import Textarea from '../components/Textarea.jsx';
import Button from '../components/Button.jsx';
import { BUTTON_COLOR } from '../common/enums.js';

function SettingsLayout() {
  const displayNameCharacterLimit = 40;
  const usernameCharacterMax = 40;
  const usernameCharacterMin = 2;
  const bioCharacterLimit = 200;

  const timerRef = useRef();

  const navigate = useNavigate();
  const { session, setSession } = useContext(SessionContext);
  const { user, setUser } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);

  const [isLoading, setIsLoading] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    if (session && user) {
      setEmail(session.user.email);
      setUsername(user.username);
      setDisplayName(user.display_name);
      setBio(user.bio);
    }
  }, [session, user]);

  async function updateUserEmail() {
    setIsLoading(true);

    const { data, error } = await supabase.auth.updateUser({ email });

    if (error) {
      console.log(JSON.stringify(error));

      if (error.code === 'email_exists') {
        setAuthMessage('EMAIL_EXISTS');
      } else if (error.code === 'validation_failed') {
        setAuthMessage('VALIDATION_FAILED');
      } else if (error.code === 'over_email_send_rate_limit') {
        setAuthMessage('OVER_EMAIL_SEND_RATE_LIMIT');
      }
    } else {
      setAuthMessage('CONFIRM_EMAIL_CHANGE');
    }

    setIsLoading(false);
  }

  async function updateUserDisplayName() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('users')
      .update({ display_name: displayName })
      .eq('id', user.id)
      .select('*');

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      const user = data[0];
      setUser(user);
    }

    setIsLoading(false);
  }

  async function updateUserBio() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('users')
      .update({ bio })
      .eq('id', user.id)
      .select('*');

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      const user = data[0];
      setUser(user);
      setAuthMessage('DONE_UPDATE_BIO');
    }

    setIsLoading(false);
  }

  async function updateUserUsername() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('users')
      .update({ username })
      .eq('id', user.id)
      .select('*');

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      const user = data[0];
      setUser(user);
      setAuthMessage('DONE_UPDATE_USERNAME');
    }

    setIsLoading(false);
  }

  async function checkUsername(event) {
    setUsername(event.target.value);

    clearTimeout(timerRef.current);
    if (event.target.value && event.target.value.length > 0) {
      timerRef.current = setTimeout(async () => {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('username', event.target.value);

        if (event.target.value === user.username) {
          setAuthMessage(null);
          return;
        }

        if (!expectedUsernameFormat(event.target.value)) {
          setAuthMessage('USERNAME_FORMAT');
          return;
        }

        if (data.length > 0 && event.target.value !== user.username) {
          setAuthMessage('USERNAME_EXISTS');
          return;
        }

        if (data.length === 0 && event.target.value !== user.username) {
          setAuthMessage('USERNAME_AVAILABLE');
          return;
        }
      }, 1000);
    } else {
      setAuthMessage(null);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <button
        type="button"
        onClick={() => setShowModal({ type: 'AVATAR_MODAL' })}
        className="w-full max-w-[128px] self-start rounded-full border-2 border-transparent hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
      >
        {user.avatar && (
          <img
            src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${user.avatar.name}`}
            alt={user.avatar.name}
            width={user.avatar.width}
            height={user.avatar.height}
            className="aspect-square w-full max-w-[128px] rounded-full bg-black object-cover"
          />
        )}
        {!user.avatar && (
          <div className="aspect-square w-full max-w-[128px] rounded-full bg-neutral-700"></div>
        )}
      </button>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p
            className={`self-end ${displayName.length > displayNameCharacterLimit ? 'text-rose-500' : 'text-white'}`}
          >
            {displayName.length} / {displayNameCharacterLimit}
          </p>
          <TextInput
            handleInput={(e) => setDisplayName(e.target.value)}
            label="Display Name"
            placeholder="Display Name"
            value={displayName}
          />
        </div>
        <div className="self-end">
          <Button
            buttonColor={BUTTON_COLOR.BLUE}
            isDisabled={
              isLoading ||
              user.display_name === displayName ||
              displayName.length > displayNameCharacterLimit
            }
            isLoading={isLoading}
            handleClick={async () => await updateUserDisplayName()}
          >
            Update Display Name
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p
            className={`self-end ${bio.length > bioCharacterLimit ? 'text-rose-500' : 'text-white'}`}
          >
            {bio.length} / {bioCharacterLimit}
          </p>
          <Textarea
            handleInput={(e) => setBio(e.target.value)}
            placeholder="Bio"
            label="Bio"
            value={bio}
          />
        </div>
        <div className="self-end">
          <Button
            buttonColor={BUTTON_COLOR.BLUE}
            isDisabled={
              isLoading || user.bio === bio || bio.length > bioCharacterLimit
            }
            isLoading={isLoading}
            handleClick={async () => await updateUserBio()}
          >
            Update Bio
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p
            className={`self-end ${username.length > usernameCharacterMax ? 'text-rose-500' : 'text-white'}`}
          >
            {username.length} / {usernameCharacterMax}
          </p>
          <TextInput
            handleInput={checkUsername}
            placeholder="Username"
            label="Username"
            value={username}
          />
          {authMessage === 'USERNAME_EXISTS' && (
            <p className="text-rose-500">Username already exists.</p>
          )}
          {authMessage === 'USERNAME_AVAILABLE' && (
            <p className="text-emerald-500">Username available!</p>
          )}
          {authMessage === 'USERNAME_FORMAT' && (
            <p className="text-rose-500">
              Only uppercase letters (A - Z), lowercase letters (a - z),
              underscores (_), and periods (.) allowed.
            </p>
          )}
        </div>
        <div className="self-end">
          <Button
            buttonColor={BUTTON_COLOR.BLUE}
            isDisabled={
              isLoading ||
              user.username === username ||
              username.length > usernameCharacterMax ||
              username.length < usernameCharacterMin ||
              !expectedUsernameFormat(username) ||
              authMessage === 'USERNAME_EXISTS'
            }
            isLoading={isLoading}
            handleClick={async () => await updateUserUsername()}
          >
            Update Username
          </Button>
        </div>
      </div>

      {authMessage !== 'CONFIRM_EMAIL_CHANGE' &&
        authMessage !== 'RESENT_EMAIL_CHANGE_CONFIRMATION' && (
          <>
            <TextInput
              handleInput={(e) => setEmail(e.target.value)}
              placeholder="Email"
              label="Email"
              value={email}
            />

            <div className="self-end">
              <Button
                isDisabled={isLoading || session.user.email === email}
                isLoading={isLoading}
                handleClick={async () => await updateUserEmail()}
                buttonColor={BUTTON_COLOR.BLUE}
              >
                Update Email
              </Button>
            </div>
          </>
        )}

      <Button
        buttonColor={BUTTON_COLOR.BLUE}
        isDisabled={isLoading}
        isLoading={isLoading}
        handleClick={async () => {
          setIsLoading(true);
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:5173/reset-password',
          });
          setAuthMessage('RESET');
          setIsLoading(false);
        }}
      >
        Reset Password
      </Button>

      <Button
        buttonColor={BUTTON_COLOR.RED}
        handleClick={async () => {
          await supabase.auth.signOut({ scope: 'local' });
          setSession(null);
          navigate('/');
        }}
      >
        Sign Out
      </Button>

      {authMessage === 'CONFIRM_EMAIL_CHANGE' && (
        <>
          <p>
            A confirmation email has been sent to your new email{' '}
            <strong>{email}</strong> and old email{' '}
            <strong>{session.user.email}</strong> with a link. Please click on
            the link from both emails to confirm your email change.
          </p>
          <Button
            buttonColor={BUTTON_COLOR.BLUE}
            isDisabled={isLoading}
            isLoading={isLoading}
            handleClick={async () => {
              setIsLoading(true);

              const { error } = await supabase.auth.resend({
                type: 'email_change',
                email,
              });

              if (error) console.log(JSON.stringify(error));

              setAuthMessage('RESENT_EMAIL_CHANGE_CONFIRMATION');
              setIsLoading(false);
            }}
          >
            Resend Email Change Confirmation
          </Button>
        </>
      )}

      {authMessage === 'RESET' && (
        <p>
          An email has been sent to <strong>{email}</strong> with a link. Please
          click on the link to reset your password.
        </p>
      )}

      {authMessage === 'VALIDATION_FAILED' && (
        <p>
          Your email is not in the expected format. Please try a different
          email.
        </p>
      )}

      {authMessage === 'EMAIL_EXISTS' && (
        <p>Email already exists. Please try a different email.</p>
      )}

      {authMessage === 'RESENT_EMAIL_CHANGE_CONFIRMATION' && (
        <p>
          A confirmation email has been resent to your new email{' '}
          <strong>{email}</strong> and old email{' '}
          <strong>{session.user.email}</strong> with a link. Please click on the
          link from both emails to confirm your email change.
        </p>
      )}

      {authMessage === 'OVER_EMAIL_SEND_RATE_LIMIT' && (
        <p>Email send limit reached. Please try again later.</p>
      )}
    </div>
  );
}

export default SettingsLayout;
