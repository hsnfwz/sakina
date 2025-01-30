import { useContext } from "react";
import { Link } from "react-router";
import { useLocation } from "react-router";
import { ModalContext, UserContext } from "../common/contexts";
import Footer from "./Footer";
import Button from "./Button";
import SVGSolidHome from "./svgs/solid/SVGSolidHome";
import SVGOutlineHome from "./svgs/outline/SVGOutlineHome";
import SVGSolidCompass from "./svgs/solid/SVGSolidCompass";
import SVGOutlineCompass from "./svgs/outline/SVGOutlineCompass";
import SVGSolidChat from "./svgs/solid/SVGSolidChat";
import SVGOutlineChat from "./svgs/outline/SVGOutlineChat";
import SVGSolidBell from "./svgs/solid/SVGSolidBell";
import SVGOutlineBell from "./svgs/outline/SVGOutlineBell";
import SVGSolidUser from "./svgs/solid/SVGSolidUser";
import SVGOutlineUser from "./svgs/outline/SVGOutlineUser";
import SVGSolidSettings from "./svgs/solid/SVGSolidSettings";
import SVGOutlineSettings from "./svgs/outline/SVGOutlineSettings";
import SVGSolidShield from "./svgs/solid/SVGSolidShield";
import SVGOutlineShield from "./svgs/outline/SVGOutlineShield";
import SVGOutlinePlus from "./svgs/outline/SVGOutlinePlus";
import Modal from "./Modal";
import SVGSolidUserArrow from "./svgs/solid/SVGSolidUserArrow";
import SVGSolidUserPlus from "./svgs/solid/SVGSolidUserPlus";
import SVGOutlineUserArrow from "./svgs/outline/SVGOutlineUserArrow";
import SVGOutlineUserPlus from "./svgs/outline/SVGOutlineUserPlus";

function NavBarMobileModal() {
  const { user } = useContext(UserContext);
  const { setShowModal } = useContext(ModalContext);
  const location = useLocation();

  return (
    <Modal>
      <nav className="flex h-full w-full flex-col gap-2">
        {/* <h1 className="text-2xl">
          Project <span className="font-bold">313</span>
        </h1> */}
        <Link
          onClick={() => setShowModal(false)}
          to="/"
          className={`${location.pathname === "/" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === "/" && <SVGSolidHome />}
          {location.pathname !== "/" && <SVGOutlineHome />}
          <span
            className={`${location.pathname === "/" ? "text-sky-500" : "text-white"}`}
          >
            Home
          </span>
        </Link>
        <Link
          onClick={() => setShowModal(false)}
          to="/explore"
          className={`${location.pathname === "/explore" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === "/explore" && <SVGSolidCompass />}
          {location.pathname !== "/explore" && <SVGOutlineCompass />}
          <span
            className={`${location.pathname === "/explore" ? "text-sky-500" : "text-white"}`}
          >
            Explore
          </span>
        </Link>
        <Link
          onClick={() => setShowModal(false)}
          to="/questions"
          className={`${location.pathname === "/questions" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === "/questions" && <SVGSolidChat />}
          {location.pathname !== "/questions" && <SVGOutlineChat />}
          <span
            className={`${location.pathname === "/questions" ? "text-sky-500" : "text-white"}`}
          >
            Questions
          </span>
        </Link>
        {user && (
          <Link
            onClick={() => setShowModal(false)}
            to="/notifications"
            className={`${location.pathname === "/notifications" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            {location.pathname === "/notifications" && <SVGSolidBell />}
            {location.pathname !== "/notifications" && <SVGOutlineBell />}
            <span
              className={`${location.pathname === "/notifications" ? "text-sky-500" : "text-white"}`}
            >
              Notifications
            </span>
          </Link>
        )}
        {user && (
          <Link
            onClick={() => setShowModal(false)}
            to={`/profile/${user.username}#posts`}
            state={{ profile: user }}
            className={`${location.pathname === `/profile/${user.username}` ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            {location.pathname === `/profile/${user.username}` && (
              <SVGSolidUser />
            )}
            {location.pathname !== `/profile/${user.username}` && (
              <SVGOutlineUser />
            )}
            <span
              className={`${location.pathname === `/profile/${user.username}` ? "text-sky-500" : "text-white"}`}
            >
              Profile
            </span>
          </Link>
        )}
        <Link
          onClick={() => setShowModal(false)}
          to="/settings"
          className={`${location.pathname === "/settings" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
        >
          {location.pathname === "/settings" && <SVGSolidSettings />}
          {location.pathname !== "/settings" && <SVGOutlineSettings />}
          <span
            className={`${location.pathname === "/settings" ? "text-sky-500" : "text-white"}`}
          >
            Settings
          </span>
        </Link>
        {user && user.user_role === "SUPER_ADMIN" && (
          <Link
            onClick={() => setShowModal(false)}
            to="/admin"
            className={`${location.pathname === "/admin" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
          >
            {location.pathname === "/admin" && <SVGSolidShield />}
            {location.pathname !== "/admin" && <SVGOutlineShield />}
            <span
              className={`${location.pathname === "/admin" ? "text-sky-500" : "text-white"}`}
            >
              Admin
            </span>
          </Link>
        )}
        {user && (
          <Button
            handleClick={() => setShowModal({ type: "CREATE_MODAL" })}
            tailwindColor="emerald"
          >
            <SVGOutlinePlus />
            <span>Create</span>
          </Button>
        )}
        {!user && (
          <>
            <Link
              onClick={() => setShowModal(false)}
              to="/log-in"
              className={`${location.pathname === "/log-in" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
            >
              {location.pathname === "/log-in" && <SVGSolidUserArrow />}
              {location.pathname !== "/log-in" && <SVGOutlineUserArrow />}
              <span
                className={`${location.pathname === "/log-in" ? "text-sky-500" : "text-white"}`}
              >
                Log In
              </span>
            </Link>
            <Link
              onClick={() => setShowModal(false)}
              to="/sign-up"
              className={`${location.pathname === "/sign-up" ? "fill-sky-500" : "fill-white"} flex gap-2 rounded-lg border-2 border-transparent bg-black p-2 hover:bg-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0`}
            >
              {location.pathname === "/sign-up" && <SVGSolidUserPlus />}
              {location.pathname !== "/sign-up" && <SVGOutlineUserPlus />}
              <span
                className={`${location.pathname === "/sign-up" ? "text-sky-500" : "text-white"}`}
              >
                Sign Up
              </span>
            </Link>
          </>
        )}
        <Footer />
      </nav>
    </Modal>
  );
}

export default NavBarMobileModal;
