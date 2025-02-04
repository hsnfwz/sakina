import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { SessionContext } from '../common/contexts.js';
import { supabase } from '../common/supabase.js';

function LogInLayout() {
  const { setSession } = useContext(SessionContext);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  async function signIn() {
    setDisabled(true);

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
      setSession(data.session);
      navigate('/');
    }

    setDisabled(false);
  }

  return (
    <div>
      {authMessage !== 'RESENT_CONFIRMATION' && (
        <>
          <input
            type="text"
            onInput={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="text"
            onInput={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button
            type="button"
            className="disabled:pointer-events-none disabled:opacity-50"
            disabled={disabled}
            onClick={async () => await signIn()}
          >
            Log In
          </button>

          <Link to="/forgot-password">Forgot Password</Link>
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
          <button
            type="button"
            className="disabled:pointer-events-none disabled:opacity-50"
            disabled={disabled}
            onClick={async () => {
              setDisabled(true);

              const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                  emailRedirectTo: 'http://localhost:5173',
                },
              });

              if (error) console.log(JSON.stringify(error));

              setAuthMessage('RESENT_CONFIRMATION');
              setDisabled(false);
            }}
          >
            Resend Confirmation Email
          </button>
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

export default LogInLayout;
