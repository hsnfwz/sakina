import { useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../common/context/AuthContextProvider';
import Loading from '../components/Loading';

function Welcome() {
  const { authUser, isLoadingAuthUser } = useContext(AuthContext);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-16 p-4">
      <Link
        className="absolute left-4 top-4 rounded-full border-2 border-transparent px-4 py-2 text-center text-2xl font-bold focus:border-2 focus:border-black focus:outline-hidden focus:ring-0"
        to="/"
      >
        Sakina
      </Link>
      <h1 className="text-center text-5xl font-bold md:text-7xl">
        The <span className="italic">only</span>{' '}
        <span className="text-emerald-500">Twelver Shia Islamic</span> social
        platform with <span className="text-yellow-500">verified</span> members
        and content
      </h1>

      {isLoadingAuthUser && <Loading />}

      {!isLoadingAuthUser && (
        <div className="flex flex-col items-center gap-4 md:flex-row">
          {authUser && (
            <Link
              className="rounded-full border-2 border-transparent bg-sky-500 px-4 py-2 text-center text-2xl text-white hover:bg-sky-700 focus:border-2 focus:border-black focus:outline-hidden focus:ring-0"
              to="/home"
            >
              Home
            </Link>
          )}
          {!authUser && (
            <>
              <div className="flex gap-2">
                <Link
                  className="rounded-full border-2 border-transparent bg-emerald-500 px-4 py-2 text-center text-2xl text-white hover:bg-emerald-700 focus:border-2 focus:border-black focus:outline-hidden focus:ring-0"
                  to="/sign-up"
                >
                  Sign Up
                </Link>
                <Link
                  className="rounded-full border-2 border-emerald-500 px-4 py-2 text-center text-2xl text-emerald-500 hover:border-emerald-700 focus:border-2 focus:border-black focus:outline-hidden focus:ring-0"
                  to="/sign-in"
                >
                  Sign In
                </Link>
              </div>
              <p className="text-center">or</p>
              <Link
                className="rounded-full border-2 border-transparent bg-sky-500 px-4 py-2 text-center text-2xl text-white hover:bg-sky-700 focus:border-2 focus:border-black focus:outline-hidden focus:ring-0"
                to="/explore"
              >
                Explore
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Welcome;
