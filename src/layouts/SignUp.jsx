import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  expectedUsernameFormat,
  expectedPasswordFormat,
} from '../common/helpers.js';
import { supabase } from '../common/supabase.js';
import TextInput from '../components/TextInput.jsx';
import Button from '../components/Button.jsx';
import { BUTTON_COLOR } from '../common/enums.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';

function SignUp() {
  const usernameCharacterMax = 40;
  const usernameCharacterMin = 2;
  const passwordCharacterMin = 8;

  const { authUser, isLoadingAuthUser } = useContext(AuthContext);
  const navigate = useNavigate('/');

  useEffect(() => {
    if (!isLoadingAuthUser && authUser) {
      navigate('/home');
    }
  }, [isLoadingAuthUser, authUser]);

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const timerRef = useRef();

  async function signUp() {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
        emailRedirectTo: 'http://localhost:5173',
      },
    });

    if (error) {
      console.log(JSON.stringify(error));

      if (error.code === 'weak_password') {
        setAuthMessage('WEAK_PASSWORD');
      } else if (error.code === 'validation_failed') {
        setAuthMessage('VALIDATION_FAILED');
      } else if (error.code === 'email_address_invalid') {
        setAuthMessage('EMAIL_ADDRESS_INVALID');
      } else if (error.code === 'over_email_send_rate_limit') {
        setAuthMessage('OVER_EMAIL_SEND_RATE_LIMIT');
      }
    } else {
      if (data.authUser?.identities?.length === 0) {
        setAuthMessage('EMAIL_EXISTS');
      } else {
        setAuthMessage('CONFIRM_EMAIL');
      }
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

        if (event.target.value === username) {
          setAuthMessage(null);
          return;
        }

        if (!expectedUsernameFormat(event.target.value)) {
          setAuthMessage('USERNAME_FORMAT');
          return;
        }

        if (data.length > 0 && event.target.value !== username) {
          setAuthMessage('USERNAME_EXISTS');
          return;
        }

        if (data.length === 0 && event.target.value !== username) {
          setAuthMessage(null);
          return;
        }
      }, 1000);
    } else {
      setAuthMessage(null);
    }
  }

  async function checkPassword(event) {
    setPassword(event.target.value);

    if (event.target.value.length === 0) {
      setAuthMessage(null);
      return;
    }

    if (!expectedPasswordFormat(event.target.value)) {
      setAuthMessage('PASSWORD_FORMAT');
      return;
    } else {
      setAuthMessage(null);
      return;
    }
  }

  async function checkReenterPassword(event) {
    setReenterPassword(event.target.value);

    if (event.target.value.length === 0) {
      setAuthMessage(null);
      return;
    }

    if (event.target.value !== password) {
      setAuthMessage('REENTER_PASSWORD_NOT_EQUAL');
      return;
    } else {
      setAuthMessage(null);
      return;
    }
  }

  return (
    <div className="m-auto flex w-full max-w-screen-md flex-col gap-4">
      {authMessage !== 'CONFIRM_EMAIL' && (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <TextInput
                label="*Username"
                handleInput={checkUsername}
                placeholder="Username"
                value={username}
              />
              <p
                className={`self-end ${username.length > usernameCharacterMax ? 'text-rose-500' : 'text-black'}`}
              >
                {username.length} / {usernameCharacterMax}
              </p>
            </div>
            {authMessage === 'USERNAME_EXISTS' && (
              <p className="text-rose-500">Username already exists.</p>
            )}
            {authMessage === 'USERNAME_FORMAT' && (
              <p className="text-rose-500">
                Only uppercase letters (A - Z), lowercase letters (a - z),
                underscores (_), and periods (.) allowed.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <TextInput
              label="*Email"
              handleInput={(e) => setEmail(e.target.value)}
              placeholder="Email"
              value={email}
            />
            {authMessage === 'VALIDATION_FAILED' && (
              <p className="text-rose-500">
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
              <p className="text-rose-500">
                Email already exists. Please try a different email.
              </p>
            )}
            {authMessage === 'OVER_EMAIL_SEND_RATE_LIMIT' && (
              <p className="text-rose-500">
                Email send limit reached. Please try again later.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <TextInput
                label="*Password"
                handleInput={checkPassword}
                placeholder="Password"
                value={password}
              />
              <p
                className={`self-end ${password.length < passwordCharacterMin ? 'text-rose-500' : 'text-black'}`}
              >
                {password.length}
              </p>
            </div>
            {authMessage === 'WEAK_PASSWORD' && (
              <p className="text-rose-500">
                Your password is weak. Please try a different password.
              </p>
            )}
            {authMessage === 'PASSWORD_FORMAT' && (
              <p className="text-rose-500">
                Must be at least 8 characters long and have at least 1 uppercase
                letter (A - Z), 1 lowercase letter (a - z), and 1 number.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <TextInput
                label="*Re-enter Password"
                handleInput={checkReenterPassword}
                placeholder="Re-enter Password"
                value={reenterPassword}
              />
              <p
                className={`self-end ${reenterPassword.length < passwordCharacterMin ? 'text-rose-500' : 'text-black'}`}
              >
                {reenterPassword.length}
              </p>
            </div>
            {authMessage === 'REENTER_PASSWORD_NOT_EQUAL' && (
              <p className="text-rose-500">Must match password.</p>
            )}
          </div>

          <Button
            isDisabled={
              isLoading ||
              username.length > usernameCharacterMax ||
              username.length < usernameCharacterMin ||
              !expectedUsernameFormat(username) ||
              authMessage === 'USERNAME_EXISTS' ||
              email.length === 0 ||
              !expectedPasswordFormat(password) ||
              password.length < passwordCharacterMin ||
              reenterPassword !== password
            }
            handleClick={async () => await signUp()}
            buttonColor={BUTTON_COLOR.BLUE}
          >
            Sign Up
          </Button>
        </div>
      )}

      {authMessage === 'CONFIRM_EMAIL' && (
        <p>
          A confirmation email has been sent to <strong>{email}</strong> with a
          link. Please click on the link to confirm your account and log in.
        </p>
      )}
    </div>
  );
}

export default SignUp;
