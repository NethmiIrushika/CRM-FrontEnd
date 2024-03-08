import { jwtDecode } from "jwt-decode";

interface UserInfo {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
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