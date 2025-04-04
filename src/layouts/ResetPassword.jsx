import { useState } from 'react';
import { supabase } from '../common/supabase.js';
import TextInput from '../components/TextInput.jsx';
import Button from '../components/Button.jsx';
import { BUTTON_COLOR, CHARACTER_LIMIT } from '../common/enums.js';
import { expectedPasswordFormat } from '../common/helpers.js';
import Anchor from '../components/Anchor.jsx';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="m-auto flex w-full max-w-(--breakpoint-md) flex-col gap-4">
      {authMessage !== 'PASSWORD_RESET' && (
        <>
          <div className="flex flex-col gap-2">
              <TextInput
                handleInput={checkPassword}
                placeholder="New Password"
                label="New Password"
                value={password}
                limit={CHARACTER_LIMIT.PASSWORD}
                isError={authMessage === 'PASSWORD_FORMAT'}
              />
            {authMessage === 'PASSWORD_FORMAT' && (
              <p className="text-rose-500">
                Must be at least 8 characters long and have at least 1 uppercase
                letter (A - Z), 1 lowercase letter (a - z), and 1 number.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
              <TextInput
                handleInput={checkReenterPassword}
                placeholder="Repeat New Password"
                label="Repeat New Password"
                value={reenterPassword}
                limit={CHARACTER_LIMIT.PASSWORD}
                isError={authMessage === 'REENTER_PASSWORD_NOT_EQUAL'}
              />
            {authMessage === 'REENTER_PASSWORD_NOT_EQUAL' && (
              <p className="text-rose-500">Must match password.</p>
            )}
          </div>

          <Button
            color={BUTTON_COLOR.SOLID_BLUE}
            isDisabled={
              isLoading ||
              password.length === 0 ||
              reenterPassword !== password ||
              authMessage
            }
            handleClick={async () => {
              setIsLoading(true);
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

              setIsLoading(false);
            }}
          >
            Update Password
          </Button>
        </>
      )}

      {authMessage === 'PASSWORD_RESET' && (
        <>
          <p>Your password has been reset!</p>
          <Anchor to="/settings">Settings</Anchor>
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

export default ResetPassword;
