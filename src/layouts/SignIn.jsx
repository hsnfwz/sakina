import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { supabase } from '../common/supabase.js';
import Button from '../components/Button.jsx';
import TextInput from '../components/TextInput.jsx';
import { BUTTON_COLOR } from '../common/enums.js';

function SignIn() {
  const { authUser, isLoadingAuthUser, setAuthSession } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingAuthUser && authUser) {
      navigate('/home');
    }
  }, [isLoadingAuthUser, authUser]);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  async function signIn() {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log(JSON.stringify(error));

      if (error.code === 'invalid_credentials') {
        setAuthMessage('INVALID_CREDENTIALS');
      } else if (error.code === 'email_not_confirmed') {
        setAuthMessage('EMAIL_NOT_CONFIRMED');
      } else if (error.code === 'over_email_send_rate_limit') {
        setAuthMessage('OVER_EMAIL_SEND_RATE_LIMIT');
      }
    } else {
      setAuthSession(data.session);
      navigate('/home');
    }

    setIsLoading(false);
  }

  return (
    <div className="m-auto flex w-full max-w-(--breakpoint-md) flex-col gap-4">
      {authMessage !== 'RESENT_CONFIRMATION' && (
        <>
          <TextInput
            handleInput={(e) => setEmail(e.target.value)}
            placeholder="Email"
            label="Email"
            value={email}
          />

          <TextInput
            handleInput={(e) => setPassword(e.target.value)}
            placeholder="Password"
            label="Password"
            value={password}
          />

          <Button
            isDisabled={
              isLoading ||
              email.length === 0 ||
              password.length === 0 ||
              authMessage
            }
            handleClick={async () => await signIn()}
            color={BUTTON_COLOR.SOLID_BLUE}
          >
            Log In
          </Button>

          <Link
            to="/forgot-password"
            className="self-start text-sky-500 underline"
          >
            Forgot Password
          </Link>
        </>
      )}

      {authMessage === 'INVALID_CREDENTIALS' && (
        <p>Email or password is incorrect. Please try again.</p>
      )}

      {authMessage === 'EMAIL_NOT_CONFIRMED' && (
        <>
          <p>
            Your account has not been confirmed. Please click on the link sent
            to email <strong>{email}</strong> to confirm your account and log
            in.
          </p>
          <Button
            isDisabled={isLoading}
            color={BUTTON_COLOR.RED}
            handleClick={async () => {
              setIsLoading(true);

              const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                  emailRedirectTo: 'http://localhost:5173',
                },
              });

              if (error) console.log(JSON.stringify(error));

              setAuthMessage('RESENT_CONFIRMATION');
              setIsLoading(false);
            }}
          >
            Resend Confirmation Email
          </Button>
        </>
      )}

      {authMessage === 'RESENT_CONFIRMATION' && (
        <p>
          A confirmation email has been resent to <strong>{email}</strong> with
          a link. Please click on the link to confirm your account and log in.
        </p>
      )}

      {authMessage === 'OVER_EMAIL_SEND_RATE_LIMIT' && (
        <p>Email send limit reached. Please try again later.</p>
      )}
    </div>
  );
}

export default SignIn;
