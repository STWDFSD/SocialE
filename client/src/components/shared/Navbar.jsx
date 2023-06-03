import { useRef, useState } from "react";
import Logo from "../../assets/SocialEcho.png";
import { Link } from "react-router-dom";
import Search from "./Search";
import { memo } from "react";
import { logoutAction } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";

const Navbar = ({ userData }) => {
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction());
    setLoggingOut(false);
  };

  return (
    <nav className="flex items-center justify-between bg-white px-36 p-2 sticky top-0 z-10 mb-5 border">
      <div className="w-36">
        <Link to="/">
          <img src={Logo} alt="" />
        </Link>
      </div>

      <Search />

      <div className="w-36 flex justify-end relative">
        <button
          type="button"
          className="inline-flex items-center justify-center h-8 w-8 rounded-full cursor-pointer"
          onClick={handleProfileClick}
        >
          <img
            src={userData.avatar}
            alt="profile"
            className="h-8 w-8 rounded-full"
          />
        </button>
        <Transition
          show={showDropdown}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {() => (
            <div
              ref={dropdownRef}
              className="origin-top-right absolute top-10 right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div className="py-1" role="none">
                <div className="flex flex-col items-center">
                  <img
                    src={userData.avatar}
                    alt="profile"
                    className="h-16 w-16 rounded-full mb-2"
                  />
                  <div className="text-sm text-gray-700 font-semibold hover:underline">
                    <Link to={`/profile`}>{userData.name}</Link>
                  </div>
                  <div className="text-sm text-gray-500">{userData.email}</div>
                </div>
                <hr className="my-2" />
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="block px-4 py-2 text-sm  w-full text-left hover:cursor-pointer hover:text-red-600 text-red-400"
                    role="menuitem"
                    onClick={logout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <div className="text-center">Logging out...</div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Logout</span>
                        <IoLogOutOutline className="ml-2" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </div>
    </nav>
  );
};

export default memo(Navbar);
