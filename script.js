let main = document.getElementById("main");
let signUpBtn = document.createElement("button");
let logInBtn = document.createElement("button");
let logInPageBtn = document.createElement("button");
let passWord = document.createElement("input");
let email = document.createElement("input");
let check = document.createElement("input");
let checkLabel = document.createElement("label");
let create = document.createElement("button");
let saveChangesBtn = document.createElement("button");
let logOutBtn = document.createElement("button");
let myPageBtn = document.createElement("button");
let frontPageReturnBtn = document.createElement("button");

fetchUrl = "https://axelengblom-nyhetsbrev.herokuapp.com";

let loggedInUserId = "";
let loggedInUserInfo = "";

let notValidEmail = false;
let notValidPassword = false;

//giving all elements their settings
logOutBtn.innerHTML = "Logga Ut";
signUpBtn.innerHTML = "Skapa Konto";
logInBtn.innerHTML = "Logga In";
logInPageBtn.innerHTML = "Logga In";
myPageBtn.innerHTML = "Min Sida";
frontPageReturnBtn.innerHTML = "Startsidan";
saveChangesBtn.innerHTML = "Spara Ändringar";
passWord.placeholder = "Password";
passWord.type = "password";
email.placeholder = "Email Adress";
check.type = "checkbox";
check.id = "newsLetterCheck";
checkLabel.for = "newsLetterCheck";
checkLabel.innerHTML = "Prenumerera på <br> nyhetsbrevet";
create.innerHTML = "Skapa Konto";
check.checked = true;
check.class = "checkbox";

let userID = "";
let isLoggedIn = localStorage.getItem("userid");

//functions for the pages to make it easier to create the pages when they are needed.
let frontPage = () => {
  main.appendChild(signUpBtn);
  main.appendChild(logInBtn);
};

let frontPageLoggedIn = () => {
  main.appendChild(signUpBtn);
  main.appendChild(myPageBtn);
};

let singUpPage = () => {
  main.appendChild(email);
  main.appendChild(passWord);
  main.appendChild(check);
  main.appendChild(checkLabel);
  main.appendChild(create);
};

let logInPage = () => {
  main.appendChild(email);
  main.appendChild(passWord);
  main.appendChild(logInPageBtn);
};

let loggedInPage = (userInfo) => {
  main.insertAdjacentHTML(
    "beforeend",
    `<ul><li>Email-adress: ${userInfo.email}</li><li>Prenumerant: ${
      userInfo.subscribed ? "Ja" : "Nej"
    }</li><li>Ändra prenumerations Status</li><input id=changeSubscription type ="checkbox" ${
      userInfo.subscribed ? "Checked" : null
    } ><br></ul>`
  );
  main.appendChild(saveChangesBtn);
  main.appendChild(logOutBtn);
  main.appendChild(frontPageReturnBtn);
};

//checks if there is a logged in user in localstorage
if (isLoggedIn) {
  frontPageLoggedIn();
} else {
  frontPage();
}

//validates the email so that it includes all the neccesary parts of an email.
let validateEmail = (inputText) => {
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (inputText.match(mailformat)) {
    return true;
  } else {
    return false;
  }
};
// sees if the password is shorter than 8 characters.
let validatePassword = (inputText) => {
  if (inputText.length < 8) {
    return false;
  } else {
    return true;
  }
};

signUpBtn.addEventListener("click", () => {
  main.innerHTML = "";
  singUpPage();
});

logInBtn.addEventListener("click", () => {
  main.innerHTML = "";
  logInPage();
});

//sends the entered information to the server and logs in if the information is correct.
logInPageBtn.addEventListener("click", () => {
  let userLogIn = {
    email: email.value,
    passWord: passWord.value,
  };

  fetch(fetchUrl + "/users/log-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userLogIn),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      if (data == false) {
        main.innerHTML = "";
        logInPage();
        main.insertAdjacentHTML(
          "afterbegin",
          "<h3>Email-adressen finns inte registrerad eller lösenordet är fel, testa igen eller skapa ett konto</h3>"
        );
        main.appendChild(signUpBtn);
      } else {
        userID = data[0].userid;
        localStorage.setItem("userid", userID);
        main.innerHTML = "";
        loggedInPage(data[0]);
      }
    });
});

//collets the information from the server and displays it for the user
myPageBtn.addEventListener("click", () => {
  loggedInUserId = { userid: localStorage.getItem("userid") };

  fetch(fetchUrl + "/users/validate-logged-in-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loggedInUserId),
  })
    .then((res) => res.json())
    .then((data) => {
      main.innerHTML = "";
      loggedInPage(data[0]);
    });
});

//sends the entered information to the server, and creates a new account if there isnt already a user witht the same email.
create.addEventListener("click", () => {
  let validatedEmail = validateEmail(email.value);
  let validatedPassword = validatePassword(passWord.value);

  if (validatedEmail && validatedPassword) {
    let newUser = {
      email: email.value,
      passWord: passWord.value,
      subscribed: check.checked,
      userid: "",
    };

    fetch(fetchUrl + "/users/new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        let userInfo = data;
        let alreadySubscribed = data;
        if (!alreadySubscribed) {
          main.insertAdjacentHTML(
            "afterbegin",
            "<h3>Det finns redan ett konto med den email-adressen, testa en annan</h3>"
          );
        } else {
          main.innerHTML = "";
          main.insertAdjacentHTML(
            "afterbegin",
            "<h3>Konto skapat, logga in för att ändra inställningar</h3>"
          );
          localStorage.setItem("userid", userInfo.userid);
          loggedInPage(userInfo);
        }
      });
  } else if (!validatedEmail) {
    main.innerHTML = "";
    main.insertAdjacentHTML(
      "afterbegin",
      "<h3>Du skrev en felaktig email, försök med en annan.</h3>"
    );
    singUpPage();
  } else if (!validatedPassword) {
    main.innerHTML = "";

    main.insertAdjacentHTML(
      "afterbegin",
      "<h3>Lösenordet måste vara minst 8 tecken långt.</h3>"
    );
    singUpPage();
  }
});

//sends the changes to the server and returns a new page with the new information.
saveChangesBtn.addEventListener("click", () => {
  loggedInUserId = localStorage.getItem("userid");

  let subUpdate = {
    subscribed: document.getElementById("changeSubscription").checked,
    userid: loggedInUserId,
  };

  fetch(fetchUrl + "/users/update-sub", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subUpdate),
  })
    .then((res) => res.json())
    .then((data) => {
      main.innerHTML = "";
      loggedInPage(data[0]);
    });
});

//logs out
logOutBtn.addEventListener("click", () => {
  main.innerHTML = "";
  localStorage.clear();
  frontPage();
});

//returns to front page without logging out
frontPageReturnBtn.addEventListener("click", () => {
  main.innerHTML = "";
  frontPageLoggedIn();
});
