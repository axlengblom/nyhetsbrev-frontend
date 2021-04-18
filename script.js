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

let loggedInUserId = "";
let loggedInUserInfo = "";

logOutBtn.innerHTML = "Logga Ut";
signUpBtn.innerHTML = "Skapa Konto";
logInBtn.innerHTML = "Logga In";
logInPageBtn.innerHTML = "Logga In";

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

let frontPage = () => {
  main.appendChild(signUpBtn);
  main.appendChild(logInBtn);
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

frontPage();

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

  fetch("https://axelengblom-nyhetsbrev.herokuapp.com/users/log-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userLogIn),
  })
    .then((res) => res.json())
    .then((data) => {
      let userInfo = data;
      if (userInfo == false) {
        main.innerHTML = "";
        logInPage();
        main.insertAdjacentHTML(
          "afterbegin",
          "<h3>Email-adressen finns inte registrerad eller lösenordet är fel, testa igen eller skapa ett konto</h3>"
        );
        main.appendChild(signUpBtn);
      } else {
        loggedInUserId = userInfo[0].userid;

        main.innerHTML = "";
        main.insertAdjacentHTML(
          "beforeend",
          `<ul><li>Email-adress: ${userInfo[0].email}</li><li>Prenumerant: ${
            userInfo[0].subscribed ? "Ja" : "Nej"
          }</li><li>Ändra prenumerations Status</li><input id=changeSubscription type ="checkbox" ${
            userInfo[0].subscribed ? "Checked" : null
          } ><br></ul>`
        );
        main.appendChild(saveChangesBtn);
        main.appendChild(logOutBtn);
      }
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

    fetch("https://axelengblom-nyhetsbrev.herokuapp.com/users/new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        let alreadySubscribed = data;
        if (alreadySubscribed) {
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
          main.appendChild(logInBtn);
        }
      });
  } else if (!validatedEmail) {
    main.insertAdjacentHTML(
      "afterbegin",
      "<h3>Du skrev en felaktig email, försök med en annan.</h3>"
    );
  } else if (!validatedPassword) {
    main.insertAdjacentHTML(
      "afterbegin",
      "<h3>Lösenordet måste vara minst 8 tecken långt.</h3>"
    );
  }
});

saveChangesBtn.addEventListener("click", () => {
  let subUpdate = {
    subscribed: document.getElementById("changeSubscription").checked,
    userid: loggedInUserId,
  };

  fetch("https://axelengblom-nyhetsbrev.herokuapp.com/users/update-sub", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subUpdate),
  })
    .then((res) => res.json())
    .then((data) => {});
  main.insertAdjacentHTML("afterbegin", "<h3>Ändringar sparade</h3>");
});

logOutBtn.addEventListener("click", () => {
  main.innerHTML = "";
  frontPage();
});
