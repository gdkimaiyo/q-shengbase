import AuthService from "../shared/services/auth.service";

// Returns true if user is verified
export const isVerified = async () => {
  const user = JSON.parse(localStorage.getItem("sb_user"));

  let verified = false;
  if (user === null) {
    return verified;
  }

  await AuthService.verifyUser({ token: user?.token, userId: user._id })
    .then((res) => {
      if (res.data === true) {
        verified = true;
      } else {
        verified = false;
        localStorage.removeItem("sb_user");
      }
    })
    .catch((error) => {
      verified = false;
      localStorage.removeItem("sb_user");
    });

  return verified;
};
