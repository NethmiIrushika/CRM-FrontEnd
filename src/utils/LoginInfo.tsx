import { jwtDecode } from "jwt-decode";

interface UserInfo {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  userType: string;
  department: string;
  username: string;
}
export const getLoginInfo = (): UserInfo | null => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken != null) {
    const userInfo: UserInfo = jwtDecode(accessToken);
    return userInfo;
  } else {
    return null;
  }
};