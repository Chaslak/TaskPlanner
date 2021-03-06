//Returns boolean if user is logged in
function isLoggedIn() {
  return sessionStorage.getItem("logindata") !== null;
}

//Redirects user to website path specified in parameter
function redirectUser(websitePath) {
  window.location.href = websitePath;
}

//Redirects user to website path specified in parameter if not logged in
function redirectNotAuthUser(websitePath) {
  if (!isLoggedIn()) {
    window.location.href = websitePath;
  }
}

var utilities = utilities || {};
utilities = (function() {
  async function requestToServer(path, content) {
    return fetch(path, content).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else if (resp.status > 202) {
        throw resp.json();
      }
    });
  }

  function isValidInput(input) {
    let pattern = /^[a-zA-Z0-9]{1,20}$/;
    let valid = pattern.test(input) ? true : false;
    return valid;
  }

  function getTagArray() {
    return [
      {
        text: "Not specified",
        value: "None"
      },
      {
        text: "Urgent",
        value: "Urgent"
      },
      {
        text: "In Progress",
        value: "In Progress"
      },
      {
        text: "Not Urgent",
        value: "Not Urgent"
      }
    ];
  }

  function getDateArray() {
    return [
      {
        text: "Not specified",
        value: "None"
      },
      {
        text: "Due Today",
        value: "today"
      },
      {
        text: "Due this Week",
        value: "week"
      },
      {
        text: "Due this Month",
        value: "month"
      }
    ];
  }

  async function markAsFinished(evt) {
    evt.stopPropagation();
    let elem = evt.target;
    if (elem.classList.contains("checked")) {
      elem.checked = false;
      elem.classList.remove("checked");
    } else {
      elem.classList.add("checked");
    }

    let taskid = { id: evt.target.id.split("-")[1] };
    let token = JSON.parse(sessionStorage.getItem("logindata")).token;
    url = "http://localhost:3000/tasks/finished";
    cfg = {
      method: "PATCH",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify(taskid)
    };

    try {
      await utilities.requestToServer(url, cfg);
      let oldTaskData = JSON.parse(localStorage.getItem("taskdata"));
      for (let i = 0; i < oldTaskData.length; i++) {
        if (oldTaskData[i].id == taskid.id) {
          oldTaskData[i].finished = !oldTaskData[i].finished;
        }
      }
      localStorage.setItem("taskdata", JSON.stringify(oldTaskData));
    } catch (err) {
      handleError(err);
    }
  }

  function checkNameInput(firstname, lastname) {
    let errormsg = document.getElementById("errormsg");
    if (isValidInput(firstname.value) && isValidInput(lastname.value)) {
      return true;
    } else {
      errormsg.innerHTML =
        "Please input valid first and last name - no special characters!";
      return false;
    }
  }

  function checkPasswords(password, password2) {
    let errormsg = document.getElementById("errormsg");
    if (password.value == password2.value) {
      return true;
    } else {
      errormsg.innerHTML = "Passwords do not match.";
      return false;
    }
  }

  async function isNewEmail(email) {
    let isEmail = null;
    let errormsg = document.getElementById("errormsg");

    let url = "http://localhost:3000/users/email/" + email.value;
    let cfg = {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };
    try {
      let data = await requestToServer(url, cfg);
      isEmail = data;
    } catch (err) {
      errormsg.innerHTML = err;
    }
    if (isEmail == false) {
      return true;
    } else {
      errormsg.innerHTML =
        "There already is an account registered with that email.";
      return false;
    }
  }

  function isNewOrOldEmail(email) {
    let oldEmail = JSON.parse(sessionStorage.getItem("logindata"));
    if (oldEmail.email != email.value) {
      isNewEmail(email);
    } else {
      return true;
    }
  }

  async function getUserByID(id, token) {
    let url = "http://localhost:3000/users/" + id;
    let cfg = {
      method: "GET",
      headers: { "Content-Type": "application/json", authorization: token }
    };

    try {
      return await requestToServer(url, cfg);
    } catch (err) {
      handleError(err);
    }
  }

  async function getListsByUserID(userid, token) {
    let listData = JSON.parse(localStorage.getItem("listdata"));

    if (listData == null || listData.length == 0) {
      let url = "http://localhost:3000/lists/all/" + userid;
      let cfg = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: token
        }
      };
      try {
        listData = await utilities.requestToServer(url, cfg);
        localStorage.setItem("listdata", JSON.stringify(listData));
      } catch (err) {
        utilities.handleError(err);
      }
    }
    return listData;
  }

  async function getTasksByListIDS(listData, token) {
    let taskData = [];
    if (listData.length > 0) {
      taskData = JSON.parse(localStorage.getItem("taskdata"));
      if (taskData == null || taskData.length == 0) {
        let ids;
        for (let i = 0; i < listData.length; i++) {
          if (i == 0) {
            ids = listData[i].id;
          } else {
            ids += "," + listData[i].id;
          }
        }
        let url = "http://localhost:3000/tasks/allTasksBySeveralIDS/" + ids;
        let cfg = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: token
          }
        };
        try {
          taskData = await utilities.requestToServer(url, cfg);
          localStorage.setItem("taskdata", JSON.stringify(taskData));
        } catch (err) {
          utilities.handleError(err);
        }
      }
    }
    return taskData;
  }

  async function handleError(err) {
    let error = await err;
    sessionStorage.removeItem("logindata");
    sessionStorage.setItem("errordata", JSON.stringify({ msg: error.msg }));
    redirectUser("index.html");
  }

  return {
    requestToServer: requestToServer,
    isValidInput: isValidInput,
    getTagArray: getTagArray,
    getDateArray: getDateArray,
    markAsFinished: markAsFinished,
    checkPasswords: checkPasswords,
    checkNameInput: checkNameInput,
    isNewEmail: isNewEmail,
    isNewOrOldEmail: isNewOrOldEmail,
    getUserByID: getUserByID,
    handleError: handleError,
    getListsByUserID: getListsByUserID,
    getTasksByListIDS: getTasksByListIDS
  };
})();
