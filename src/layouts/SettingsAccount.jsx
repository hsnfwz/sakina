import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ModalContext } from '../common/context/ModalContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { expectedUsernameFormat } from '../common/helpers.js';
import { supabase } from '../common/supabase.js';
import { BUTTON_COLOR, CHARACTER_LIMIT } from '../common/enums.js';
import TextInput from '../components/TextInput.jsx';
import Textarea from '../components/Textarea.jsx';
import Button from '../components/Button.jsx';

function SettingsAccount() {
  const timerRef = useRef();

  const navigate = useNavigate();
  const { authSession, setAuthSession } = useContext(AuthContext);
  const { authUser, setAuthUser } = useContext(AuthContext);
  const { setModal } = useContext(ModalContext);

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    if (authSession && authUser) {
      setEmail(authSession.user.email);
      setUsername(authUser.username);
      setName(authUser.name);
      setBio(authUser.bio);
    }
  }, [authSession, authUser]);

  async function updateUserEmail() {
    setIsLoading(true);

    const { data, error } = await supabase.auth.updateUser({ email });

    if (error) {
      console.log(JSON.stringify(error));

      if (error.code === 'email_exists') {
        setAuthMessage('EMAIL_EXISTS');
      } else if (error.code === 'validation_failed') {
        setAuthMessage('VALIDATION_FAILED');
      } else if (error.code === 'email_address_invalid') {
        setAuthMessage('EMAIL_ADDRESS_INVALID');
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
      .update({ name: name })
      .eq('id', authUser.id)
      .select('*');

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      const user = data[0];
      setAuthUser(user);
    }

    setIsLoading(false);
  }

  async function updateUserBio() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('users')
      .update({ bio })
      .eq('id', authUser.id)
      .select('*');

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      const user = data[0];
      setAuthUser(user);
      setAuthMessage('DONE_UPDATE_BIO');
    }

    setIsLoading(false);
  }

  async function updateUserUsername() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('users')
      .update({ username })
      .eq('id', authUser.id)
      .select('*');

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      const user = data[0];
      setAuthUser(user);
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

        if (event.target.value === authUser.username) {
          setAuthMessage(null);
          return;
        }

        if (!expectedUsernameFormat(event.target.value)) {
          setAuthMessage('USERNAME_FORMAT');
          return;
        }

        if (data.length > 0 && event.target.value !== authUser.username) {
          setAuthMessage('USERNAME_EXISTS');
          return;
        }

        if (data.length === 0 && event.target.value !== authUser.username) {
          setAuthMessage('USERNAME_AVAILABLE');
          return;
        }
      }, 1000);
    } else {
      setAuthMessage(null);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="aspect-square w-full max-w-[128px] border-2 border-transparent">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          className={`flex w-full cursor-pointer rounded-full border-2 border-transparent transition-all hover:border-neutral-200 focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
          onClick={() => setModal({ type: 'AVATAR_MODAL' })}
        >
          {authUser.avatar_file_name && (
            <img
              src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${authUser.avatar_file_name}`}
              alt={authUser.avatar_file_name}
              width={128}
              height={128}
              className={`aspect-square w-full rounded-full object-center ${isLoadingImage ? 'hidden' : 'block'}`}
              onLoad={() => setIsLoadingImage(false)}
            />
          )}
          {!authUser.avatar_file_name && (
            <div className="aspect-square max-h-[128px] w-full max-w-[128px] rounded-full bg-neutral-100"></div>
          )}
          {authUser.avatar_file_name && (
            <div
              className={`aspect-square max-h-[128px] w-full max-w-[128px] animate-pulse rounded-full bg-neutral-100 ${isLoadingImage ? 'block' : 'hidden'}`}
            ></div>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <TextInput
          handleInput={(e) => setName(e.target.value)}
          label="Name"
          placeholder="Name"
          value={name}
          limit={CHARACTER_LIMIT.NAME}
          isError={name.length > CHARACTER_LIMIT.NAME.max}
        />
        <div className="self-end">
          <Button
            color={BUTTON_COLOR.SOLID_BLUE}
            isDisabled={
              isLoading ||
              authUser.name === name ||
              name.length > CHARACTER_LIMIT.NAME.max
            }
            handleClick={async () => await updateUserDisplayName()}
          >
            Update Name
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Textarea
          handleInput={(e) => setBio(e.target.value)}
          placeholder="Bio"
          label="Bio"
          value={bio}
          limit={CHARACTER_LIMIT.BIO}
          isError={bio.length > CHARACTER_LIMIT.BIO.max}
        />
        <div className="self-end">
          <Button
            color={BUTTON_COLOR.SOLID_BLUE}
            isDisabled={
              isLoading ||
              authUser.bio === bio ||
              bio.length > CHARACTER_LIMIT.BIO.max
            }
            handleClick={async () => await updateUserBio()}
          >
            Update Bio
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <TextInput
          handleInput={checkUsername}
          placeholder="Username"
          label="Username"
          value={username}
          limit={CHARACTER_LIMIT.USERNAME}
          isError={
            authMessage === 'USERNAME_EXISTS' ||
            authMessage === 'USERNAME_FORMAT'
          }
        />
        {authMessage === 'USERNAME_EXISTS' && (
          <p className="text-rose-500">Username already exists.</p>
        )}
        {authMessage === 'USERNAME_FORMAT' && (
          <p className="text-rose-500">
            Only uppercase letters (A - Z), lowercase letters (a - z),
            underscores (_), and periods (.) allowed.
          </p>
        )}
        <div className="self-end">
          <Button
            color={BUTTON_COLOR.SOLID_BLUE}
            isDisabled={
              isLoading ||
              authUser.username === username ||
              username.length > CHARACTER_LIMIT.USERNAME.max ||
              username.length < CHARACTER_LIMIT.USERNAME.min ||
              !expectedUsernameFormat(username) ||
              authMessage === 'USERNAME_EXISTS'
            }
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
              isError={
                authMessage === 'EMAIL_EXISTS' ||
                authMessage === 'VALIDATION_FAILED' ||
                authMessage === 'OVER_EMAIL_SEND_RATE_LIMIT' ||
                authMessage === 'EMAIL_ADDRESS_INVALID'
              }
            />

            <div className="self-end">
              <Button
                isDisabled={isLoading || authSession.user.email === email}
                handleClick={async () => await updateUserEmail()}
                color={BUTTON_COLOR.SOLID_BLUE}
              >
                Update Email
              </Button>
            </div>
          </>
        )}

      <Button
        color={BUTTON_COLOR.SOLID_BLUE}
        isDisabled={isLoading}
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
        isDisabled={isLoading}
        color={BUTTON_COLOR.SOLID_RED}
        handleClick={async () => {
          setIsLoading(true);
          await supabase.auth.signOut({ scope: 'local' });
          setIsLoading(false);
          setAuthSession(null);
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
            <strong>{authSession.user.email}</strong> with a link. Please click
            on the link from both emails to confirm your email change.
          </p>
          <Button
            color={BUTTON_COLOR.SOLID_BLUE}
            isDisabled={isLoading}
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

      {authMessage === 'VALIDATION_FAILED' && (
        <p>
          Your email is not in the expected format. Please try a different
          email.
        </p>
      )}

      {authMessage === 'EMAIL_ADDRESS_INVALID' && (
        <p className="text-rose-500">
          Your email is not accepted. Please try a different email.
        </p>
      )}

      {authMessage === 'EMAIL_EXISTS' && (
        <p>Email already exists. Please try a different email.</p>
      )}

      {authMessage === 'OVER_EMAIL_SEND_RATE_LIMIT' && (
        <p>Email send limit reached. Please try again later.</p>
      )}

      {authMessage === 'RESET' && (
        <p>
          An email has been sent to <strong>{email}</strong> with a link. Please
          click on the link to reset your password.
        </p>
      )}

      {authMessage === 'RESENT_EMAIL_CHANGE_CONFIRMATION' && (
        <p>
          A confirmation email has been resent to your new email{' '}
          <strong>{email}</strong> and old email{' '}
          <strong>{authSession.user.email}</strong> with a link. Please click on
          the link from both emails to confirm your email change.
        </p>
      )}
    </div>
  );
}

export default SettingsAccount;
