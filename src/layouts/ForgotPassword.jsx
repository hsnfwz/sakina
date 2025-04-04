import { useState } from 'react';
import { supabase } from '../common/supabase';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { BUTTON_COLOR } from '../common/enums';

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);
  const [email, setEmail] = useState('');

  return (
    <div className="m-auto flex w-full max-w-(--breakpoint-md) flex-col gap-4">
      {authMessage !== 'RESET' && (
        <>
          <TextInput
            handleInput={(e) => setEmail(e.target.value)}
            placeholder="Email"
            label="Email"
            value={email}
          />
          <Button
            color={BUTTON_COLOR.SOLID_BLUE}
            isDisabled={isLoading || email.length === 0}
            handleClick={async () => {
              setIsLoading(true);
              await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'http://localhost:5173/reset-password',
              });
              setAuthMessage('RESET');
              setIsLoading(false);
            }}
          >
            Get Link
          </Button>
        </>
      )}

      {authMessage === 'RESET' && (
        <p>
          An email has been sent to <strong>{email}</strong> with a link. Please
          click on the link to reset your password.
        </p>
      )}
    </div>
  );
}

export default ForgotPassword;
