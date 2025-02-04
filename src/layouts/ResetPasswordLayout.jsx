import { useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '../common/supabase.js';

function ResetPasswordLayout() {
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      {authMessage !== 'PASSWORD_RESET' && (
        <>
          <input
            type="text"
            onInput={(e) => setPassword(e.target.value)}
            placeholder="New Password"
          />
          <p>Password rules:</p>
          <ul>
            <li>Must be at least 8 characters long</li>
            <li>Must have at least 1 uppercase letter (A-Z)</li>
            <li>Must have at least 1 lowercase letter (a-z)</li>
            <li>Must have at least 1 number (0-9)</li>
          </ul>
          <button
            className="disabled:pointer-events-none disabled:opacity-50"
            type="button"
            disabled={disabled}
            onClick={async () => {
              setDisabled(true);
              const { data, error } = await supabase.auth.updateUser({
                password,
              });

              if (error) {
                console.log(JSON.stringify(error));

                if (error.code === 'weak_password') {
                  setAuthMessage('WEAK_PASSWORD');
                } else if (error.code === 'same_password') {
                  setAuthMessage('SAME_PASSWORD');
                } else if (error.code === 'over_email_send_rate_limit') {
                  setAuthMessage('OVER_EMAIL_SEND_RATE_LIMIT');
                }
              }

              if (!error) setAuthMessage('PASSWORD_RESET');

              setDisabled(false);
            }}
          >
            Save
          </button>
        </>
      )}

      {authMessage === 'PASSWORD_RESET' && (
        <>
          <p>Your password has been reset!</p>
          <p>
            Return to <Link to="/settings">Settings</Link>
          </p>
        </>
      )}

      {authMessage === 'WEAK_PASSWORD' && (
        <p>Your new password is weak. Please try a different password.</p>
      )}

      {authMessage === 'SAME_PASSWORD' && (
        <p>
          Your new password cannot be the same as your old password. Please try
          a different password.
        </p>
      )}

      {authMessage === 'OVER_EMAIL_SEND_RATE_LIMIT' && (
        <p>Email send limit reached. Please try again later.</p>
      )}
    </div>
  );
}

export default ResetPasswordLayout;
