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

// Helper function for pagination - fetch next or previous page contents
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

export const validateFullName = (name) => {
  if (name) {
    const re = /^[a-zA-Z\-’']+( [a-zA-Z\-’']+)+$/;
    return re.test(name);
  } else {
    return false;
  }
};

export const validateEmail = (email) => {
  if (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  } else {
    return false;
  }
};

export const validateMobile = (phone) => {
  const re = /^\d{10}$/;
  const re2 = /^\+?([0-9]{3})\)?([0-9]{9})$/;
  if (phone) {
    if (phone.match(re) || phone.match(re2)) {
      return true;
    }
    return false;
  }
  return true; // To change to false if cell phone number is required
};

// Get firstname and lastname from fullname
export const getName = (name, fullname) => { // name is either firstname or lastname
  if (name === "first") {
    let arr = fullname?.split(" ");
    return titleCase(arr[0]);
  } else {
    let arr = fullname?.split(" ");
    return titleCase(arr[1]);
  }
};

export const titleCase = (str) => {
  return str?.toLowerCase()?.replace(/\b\S/g, function (t) {
    return t?.toUpperCase();
  });
};
