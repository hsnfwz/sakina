import { useState } from "react";
import { supabase } from "../common/supabase";

function ForgotPasswordLayout() {
  const [disabled, setDisabled] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);
  const [email, setEmail] = useState("");

  return (
    <div>
      {authMessage !== "RESET" && (
        <>
          <input
            type="text"
            onInput={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <button
            className="disabled:pointer-events-none disabled:opacity-50"
            type="button"
            disabled={disabled || email === ""}
            onClick={async () => {
              setDisabled(true);
              await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: "http://localhost:5173/reset-password",
              });
              setAuthMessage("RESET");
              setDisabled(false);
            }}
          >
            Forgot Password
          </button>
        </>
      )}

      {authMessage === "RESET" && (
        <p>
          An email has been sent to <strong>{email}</strong> with a link. Please
          click on the link to reset your password.
        </p>
      )}
    </div>
  );
}

export default ForgotPasswordLayout;
