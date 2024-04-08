import { Auth } from "../Auth/Auth";
// import { authToken } from "../Auth/Auth";
import { useCookies } from "react-cookie";
export default function Manager() {
  const handleLogout = () => {
    removeCookie("authToken");
    removeCookie("Email");
    window.location.reload();
  };
  const [cookies, setCookie, removeCookie] = useCookies();
  return (
    <>
      {cookies.authToken ? (
        <div>
          <button onClick={() => handleLogout()}>Log Out</button>
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
}
