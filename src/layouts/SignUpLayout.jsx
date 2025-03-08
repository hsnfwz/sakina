import { useState } from 'react';
import { useNavigate } from 'react-router';
import { expectedUsernameFormat } from '../common/helpers.js';
import { supabase } from '../common/supabase.js';

function SignUpLayout() {
  const navigate = useNavigate('/');
  const [disabled, setDisabled] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  async function signUp() {
    setDisabled(true);

    if (username.length < 2 || username.length > 40) {
      setAuthMessage('USERNAME_LENGTH');
      setDisabled(false);
      return;
    } else if (!expectedUsernameFormat(username)) {
      setAuthMessage('USERNAME_CHARACTERS');
      setDisabled(false);
      return;
    }

    const { data: users } = await supabase
      .from('users')
      .select()
      .eq('username', username);

    if (users.length > 0) {
      setAuthMessage('USERNAME_EXISTS');
      setDisabled(false);
      return;
    }

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
      if (data.user?.identities?.length === 0) {
        setAuthMessage('EMAIL_EXISTS');
      } else {
        setAuthMessage('CONFIRM_EMAIL');
      }
    }

    setDisabled(false);
  }

  return (
    <div>
      {authMessage !== 'CONFIRM_EMAIL' && (
        <div>
          <input
            type="text"
            onInput={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <p>Username rules:</p>
          <ul>
            <li>Must be between 2 and 40 characters long</li>
            <li>May include uppercase letters (A-Z)</li>
            <li>May include lowercase letters (a-z)</li>
            <li>May include numbers (0-9)</li>
            <li>May include underscores (_)</li>
            <li>May include periods (.)</li>
          </ul>

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
          <p>Password rules:</p>
          <ul>
            <li>Must be at least 8 characters long</li>
            <li>Must have at least 1 uppercase letter (A-Z)</li>
            <li>Must have at least 1 lowercase letter (a-z)</li>
            <li>Must have at least 1 number (0-9)</li>
          </ul>

          <button
            type="button"
            className="disabled:pointer-events-none disabled:opacity-50"
            disabled={disabled}
            onClick={async () => await signUp()}
          >
            Sign Up
          </button>
        </div>
      )}

      {authMessage === 'CONFIRM_EMAIL' && (
        <p>
          A confirmation email has been sent to <strong>{email}</strong> with a
          link. Please click on the link to confirm your account and log in.
        </p>
      )}

      {authMessage === 'WEAK_PASSWORD' && (
        <p>Your password is weak. Please try a different password.</p>
      )}

      {authMessage === 'VALIDATION_FAILED' && (
        <p>
          Your email is not in the expected format. Please try a different
          email.
        </p>
      )}

      {authMessage === 'EMAIL_ADDRESS_INVALID' && (
        <p>Your email is not accepted. Please try a different email.</p>
      )}

      {authMessage === 'USERNAME_EXISTS' && (
        <p>Username already exists. Please try a different username.</p>
      )}

      {authMessage === 'EMAIL_EXISTS' && (
        <p>Email already exists. Please try a different email.</p>
      )}

      {authMessage === 'USERNAME_LENGTH' && (
        <p>
          Username must be between 2 and 40 characters. Please try a different
          username.
        </p>
      )}

      {authMessage === 'USERNAME_CHARACTERS' && (
        <p>
          Username can only include uppercase letters (A-Z), lowercase letters
          (a-z), underscores (_), or periods(.). Please try a different
          username.
        </p>
      )}

      {authMessage === 'OVER_EMAIL_SEND_RATE_LIMIT' && (
        <p>Email send limit reached. Please try again later.</p>
      )}
    </div>
  );
}

export default SignUpLayout;
