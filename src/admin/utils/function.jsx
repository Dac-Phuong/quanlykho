// set data
export function setUserData(data) {
  data = JSON.stringify(data);
  return localStorage.setItem("userData", data);
}

export function setArrayId(data) {
  data = JSON.stringify(data);
  return localStorage.setItem("checked", data);
}
export function setRemember(data) {
  data = JSON.stringify(data);
  return localStorage.setItem("remember", data);
}

// get data
export function getArrayId() {
  const data = localStorage.getItem("checked");
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return null;
  }
}
export function getUserData() {
  const data = localStorage.getItem("userData");
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return null;
  }
}

export function getRemember() {
  const data = localStorage.getItem("remember");
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return null;
  }
}
