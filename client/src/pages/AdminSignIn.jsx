import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/SocialEcho.png";
import axios from "axios";
import { useState } from "react";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import { HiX } from "react-icons/hi";
import { IoIosArrowRoundBack } from "react-icons/io";
const BASE_URL = process.env.REACT_APP_API_URL;

const AdminSignIn = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    setSigningIn(true);
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };
    axios
      .post(`${BASE_URL}/admin/signin`, data)
      .then((res) => {
        setSigningIn(false);
        localStorage.setItem("admin", JSON.stringify(res.data));
        navigate("/admin");
      })
      .catch((err) => {
        setError(err.response.data.message);
        setSigningIn(false);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-md shadow-md">
        <div className="px-6 py-4">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-5" src={logo} alt="" />
          </div>

          <p className="mt-1 text-center text-gray-500">Sign in as admin</p>
          <form>
            <div className="w-full mt-4">
              <input
                onChange={handleUsernameChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md  focus:border-blue-400  focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                placeholder="Username"
                aria-label="Username"
              />
            </div>
            <div className="w-full mt-4">
              <input
                onChange={handlePasswordChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md  focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
                placeholder="Password"
                aria-label="Password"
              />
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mt-4 flex items-center justify-between">
                <span className="block sm:inline">{error}</span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
                >
                  <HiX />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <Link to="/">
                <IoIosArrowRoundBack className="inline-block w-4 h-4 mr-2" />
                Back to home
              </Link>
              <button
                disabled={signingIn}
                type="submit"
                onClick={(e) => handleSubmit(e)}
                className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                {signingIn ? (
                  <ButtonLoadingSpinner loadingText={"Signing in..."} />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
