import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SessionContext, UserContext } from "../common/contexts.js";
import { expectedUsernameFormat } from "../common/helpers.js";
import { supabase } from "../common/supabase.js";
import AvatarModal from "../components/AvatarModal.jsx";

function SettingsLayout() {
  const navigate = useNavigate();
  const { session, setSession } = useContext(SessionContext);
  const { user, setUser } = useContext(UserContext);

  const [disabled, setDisabled] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session && user) {
      setEmail(session.user.email);
      setUsername(user.username);
      setDisplayName(user.display_name);
      setBio(user.bio);
    }
  }, [session, user]);

  async function updateUserEmail() {
    setDisabled(true);

    if (email === session.user.email) {
      setAuthMessage("SAME_EMAIL");
      setDisabled(false);
      return;
    }

    const { data, error } = await supabase.auth.updateUser({ email });

    if (error) {
      console.log(JSON.stringify(error));

      if (error.code === "email_exists") {
        setAuthMessage("EMAIL_EXISTS");
      } else if (error.code === "validation_failed") {
        setAuthMessage("VALIDATION_FAILED");
      } else if (error.code === "over_email_send_rate_limit") {
        setAuthMessage("OVER_EMAIL_SEND_RATE_LIMIT");
      }
    } else {
      setAuthMessage("CONFIRM_EMAIL_CHANGE");
    }

    setDisabled(false);
  }

  async function updateUserDisplayName() {
    setDisabled(true);

    if (displayName === user.display_name) {
      setAuthMessage("SAME_DISPLAY_NAME");
      setDisabled(false);
      return;
    } else if (displayName.length > 40) {
      setAuthMessage("DISPLAY_NAME_LENGTH");
      setDisabled(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .update({ display_name: displayName })
      .eq("id", user.id)
      .select("*");

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      const user = data[0];
      setUser(user);
      setAuthMessage("DONE_UPDATE_DISPLAY_NAME");
    }

    setDisabled(false);
  }

  async function updateUserBio() {
    setDisabled(true);

    if (bio === user.bio) {
      setAuthMessage("SAME_BIO");
      setDisabled(false);
      return;
    } else if (bio.length > 200) {
      setAuthMessage("BIO_LENGTH");
      setDisabled(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .update({ bio })
      .eq("id", user.id)
      .select("*");

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      const user = data[0];
      setUser(user);
      setAuthMessage("DONE_UPDATE_BIO");
    }

    setDisabled(false);
  }

  async function updateUserUsername() {
    setDisabled(true);

    if (username === user.username) {
      setAuthMessage("SAME_USERNAME");
      setDisabled(false);
      return;
    } else if (username.length < 2 || username.length > 40) {
      setAuthMessage("USERNAME_LENGTH");
      setDisabled(false);
      return;
    } else if (!expectedUsernameFormat(username)) {
      setAuthMessage("USERNAME_CHARACTERS");
      setDisabled(false);
      return;
    }

    const { data: users } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);

    if (users.length > 0) {
      setAuthMessage("USERNAME_EXISTS");
      setDisabled(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .update({ username })
      .eq("id", user.id)
      .select("*");

    if (error) {
      console.log(JSON.stringify(error));
    } else {
      const user = data[0];
      setUser(user);
      setAuthMessage("DONE_UPDATE_USERNAME");
    }

    setDisabled(false);
  }

  return (
    <div>
      {session && user && (
        <>
          <div>
            <AvatarModal
              refreshUser={(user) => setUser(user)}
              showModal={showModal}
              hideModal={() => setShowModal(false)}
            />
            {user.avatar_file && (
              <img
                id={`img-${user.avatar_file}`}
                src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${user.avatar_file}`}
                alt={user.avatar_file}
                width=""
                height=""
                className="h-[360px] w-[360px] bg-black object-cover"
                onDoubleClick={() => {
                  const element = document.getElementById(
                    `img-${user.avatar_file}`,
                  );
                  setImageElement(element);

                  if (!document.fullscreenElement) {
                    element.requestFullscreen();
                  } else {
                    document.exitFullscreen();
                  }
                }}
              />
            )}

            {!user.avatar_file && (
              <div className="h-[360px] w-[360px] bg-neutral-200"></div>
            )}

            <button type="button" onClick={() => setShowModal(true)}>
              Upload Avatar
            </button>

            <input
              type="text"
              onInput={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              value={displayName}
              maxLength={40}
            />

            <button
              type="button"
              className="disabled:pointer-events-none disabled:opacity-50"
              disabled={disabled}
              onClick={async () => await updateUserDisplayName()}
            >
              Update Display Name
            </button>

            <textarea
              onInput={(e) => setBio(e.target.value)}
              placeholder="Bio"
              value={bio}
              maxLength={200}
            />

            <button
              type="button"
              className="disabled:pointer-events-none disabled:opacity-50"
              disabled={disabled}
              onClick={async () => await updateUserBio()}
            >
              Update Bio
            </button>

            <input
              type="text"
              onInput={(e) => setUsername(e.target.value)}
              placeholder="Username"
              value={username}
              maxLength={40}
            />

            <button
              type="button"
              className="disabled:pointer-events-none disabled:opacity-50"
              disabled={disabled}
              onClick={async () => await updateUserUsername()}
            >
              Update Username
            </button>

            {authMessage !== "CONFIRM_EMAIL_CHANGE" &&
              authMessage !== "RESENT_EMAIL_CHANGE_CONFIRMATION" && (
                <>
                  <input
                    type="text"
                    onInput={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    value={email}
                  />

                  <button
                    type="button"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    disabled={disabled}
                    onClick={async () => await updateUserEmail()}
                  >
                    Update Email
                  </button>
                </>
              )}
          </div>

          <button
            className="disabled:pointer-events-none disabled:opacity-50"
            type="button"
            disabled={disabled}
            onClick={async () => {
              setDisabled(true);
              await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: "http://localhost:5173/reset-password",
              });
              setAuthMessage("RESET");
              setDisabled(false);
            }}
          >
            Reset Password
          </button>

          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut({ scope: "local" });
              setSession(null);
              navigate("/");
            }}
          >
            Sign Out
          </button>

          {authMessage === "CONFIRM_EMAIL_CHANGE" && (
            <>
              <p>
                A confirmation email has been sent to your new email{" "}
                <strong>{email}</strong> and old email{" "}
                <strong>{session.user.email}</strong> with a link. Please click
                on the link from both emails to confirm your email change.
              </p>
              <button
                type="button"
                className="disabled:pointer-events-none disabled:opacity-50"
                disabled={disabled}
                onClick={async () => {
                  setDisabled(true);

                  const { error } = await supabase.auth.resend({
                    type: "email_change",
                    email,
                  });

                  if (error) console.log(JSON.stringify(error));

                  setAuthMessage("RESENT_EMAIL_CHANGE_CONFIRMATION");
                  setDisabled(false);
                }}
              >
                Resend Email Change Confirmation
              </button>
            </>
          )}

          {authMessage === "SAME_EMAIL" && (
            <p>
              Your new email cannot be the same as your old email. Please try a
              different email.
            </p>
          )}

          {authMessage === "RESET" && (
            <p>
              An email has been sent to <strong>{email}</strong> with a link.
              Please click on the link to reset your password.
            </p>
          )}

          {authMessage === "VALIDATION_FAILED" && (
            <p>
              Your email is not in the expected format. Please try a different
              email.
            </p>
          )}

          {authMessage === "EMAIL_EXISTS" && (
            <p>Email already exists. Please try a different email.</p>
          )}
        </>
      )}

      {authMessage === "RESENT_EMAIL_CHANGE_CONFIRMATION" && (
        <p>
          A confirmation email has been resent to your new email{" "}
          <strong>{email}</strong> and old email{" "}
          <strong>{session.user.email}</strong> with a link. Please click on the
          link from both emails to confirm your email change.
        </p>
      )}

      {authMessage === "SAME_DISPLAY_NAME" && (
        <p>
          Your new display name cannot be the same as your old display name.
          Please try a different display name.
        </p>
      )}

      {authMessage === "DONE_UPDATE_DISPLAY_NAME" && (
        <p>Your display name has been changed!</p>
      )}

      {authMessage === "SAME_USERNAME" && (
        <p>
          Your new username cannot be the same as your old username. Please try
          a different username.
        </p>
      )}

      {authMessage === "USERNAME_LENGTH" && (
        <p>
          Username must be between 2 and 40 characters. Please try a different
          username.
        </p>
      )}

      {authMessage === "USERNAME_CHARACTERS" && (
        <p>
          Username can only include uppercase letters (A-Z), lowercase letters
          (a-z), underscores (_), or periods(.). Please try a different
          username.
        </p>
      )}

      {authMessage === "USERNAME_EXISTS" && (
        <p>Username already exists. Please try a different username.</p>
      )}

      {authMessage === "DONE_UPDATE_USERNAME" && (
        <p>Your username has been changed!</p>
      )}

      {authMessage === "OVER_EMAIL_SEND_RATE_LIMIT" && (
        <p>Email send limit reached. Please try again later.</p>
      )}

      {authMessage === "SAME_BIO" && (
        <p>
          Your new bio cannot be the same as your old bio. Please try a
          different bio.
        </p>
      )}

      {authMessage === "DONE_UPDATE_BIO" && <p>Your bio has been changed!</p>}

      {authMessage === "BIO_LENGTH" && (
        <p>
          Bio cannot be more than 200 characters. Please try a different bio.
        </p>
      )}
    </div>
  );
}

export default SettingsLayout;
