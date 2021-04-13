let main = document.getElementById("main");
let singUp = document.createElement("button");
let logIn = document.createElement("button");
let firstName = document.createElement("input");
let lastName = document.createElement("input");
let email = document.createElement("input");
let check = document.createElement("input");
let checkLabel = document.createElement("label");
let create = document.createElement("button");

singUp.innerHTML = "Skapa Konto";
logIn.innerHTML = "Logga In";

firstName.placeholder = "First name";
lastName.placeholder = "Last name";
email.placeholder = "Email Adress";
check.type = "checkbox";
check.id = "newsLetterCheck";
checkLabel.for = "newsLetterCheck";
checkLabel.innerHTML = "Prenumerera på <br> nyhetsbrevet";
create.innerHTML = "Skapa Konto";
check.checked = true;
check.class = "checkbox";

main.appendChild(singUp);
main.appendChild(logIn);

singUp.addEventListener("click", () => {
  console.log("fluff");
  main.innerHTML = "";
  main.appendChild(firstName);
  main.appendChild(lastName);
  main.appendChild(email);
  main.appendChild(check);
  main.appendChild(checkLabel);
  main.appendChild(create);
});

create.addEventListener("click", () => {
  let newUser = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    subscribed: check.checked,
    userid: "",
  };
  console.log(newUser);

  fetch("http://localhost:3000/users/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
});
