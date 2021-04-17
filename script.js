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

let loggedInUserId = "";
let loggedInUserInfo = "";

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

  fetch("http://localhost:3000/users/log-in", {
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
        console.log(userInfo);
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
      }
    });
});

create.addEventListener("click", () => {
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
});

saveChangesBtn.addEventListener("click", () => {
  console.log(document.getElementById("changeSubscription").checked);
  console.log(loggedInUserId);

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
      console.log(data);
    });
});
