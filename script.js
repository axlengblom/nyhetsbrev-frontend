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

let loggedInUserId = "";
let loggedInUserInfo = "";

let notValidEmail = false;
let notValidPassword = false;

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

if (isLoggedIn) {
  frontPageLoggedIn();
} else {
  frontPage();
}

let validateEmail = (inputText) => {
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (inputText.match(mailformat)) {
    return true;
  } else {
    return false;
  }
};

let validatePassword = (inputText) => {
  if (inputText.length < 8) {
    return false;
  } else {
    return true;
  }
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

signUpBtn.addEventListener("click", () => {
  main.innerHTML = "";
  singUpPage();
});

logInBtn.addEventListener("click", () => {
  main.innerHTML = "";
  logInPage();
});

logInPageBtn.addEventListener("click", () => {
  let userLogIn = {
    email: email.value,
    passWord: passWord.value,
  };

  fetch("http://localhost:3000/users/log-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userLogIn),
  })
    .then((res) => res.json())
    .then((data) => {
      userID = data[0].userid;

      if (data[0] == false) {
        main.innerHTML = "";
        logInPage();
        main.insertAdjacentHTML(
          "afterbegin",
          "<h3>Email-adressen finns inte registrerad eller lösenordet är fel, testa igen eller skapa ett konto</h3>"
        );
        main.appendChild(signUpBtn);
      } else {
        localStorage.setItem("userid", userID);
        main.innerHTML = "";
        loggedInPage(data[0]);
      }
    });
});

myPageBtn.addEventListener("click", () => {
  loggedInUserId = { userid: localStorage.getItem("userid") };

  fetch("http://localhost:3000/users/validate-logged-in-user", {
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

    fetch("http://localhost:3000/users/new-user", {
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

saveChangesBtn.addEventListener("click", () => {
  loggedInUserId = localStorage.getItem("userid");

  let subUpdate = {
    subscribed: document.getElementById("changeSubscription").checked,
    userid: loggedInUserId,
  };

  fetch("http://localhost:3000/users/update-sub", {
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

logOutBtn.addEventListener("click", () => {
  main.innerHTML = "";
  localStorage.clear();
  frontPage();
});

frontPageReturnBtn.addEventListener("click", () => {
  main.innerHTML = "";
  frontPageLoggedIn();
});
