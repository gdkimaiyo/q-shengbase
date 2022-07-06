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

// Heler function for pagination - fetch next or previous page contents
export const fetchNextPage = (arr, page, perPage) => {
  if (arr?.length > 0) {
    if (page == 1) {
      if (page * perPage <= arr.length) {
        return arr.slice(page - 1, page * perPage);
      } else {
        return arr.slice(page - 1, arr.length);
      }
    } else {
      if (page * perPage <= arr.length) {
        return arr.slice(page * perPage - perPage, page * perPage);
      } else {
        return arr.slice(page * perPage - perPage, arr.length);
      }
    }
  } else {
    return [];
  }
};
// Generate a random number
export const randomNumber = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Remove duplicates in an array of objects
export const removeDuplicates = (arrObj, objKey) => {
  return [
    ...new Map(
      arrObj.map((item) => [item[objKey], item])
    ).values(),
  ];
};
