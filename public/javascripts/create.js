/*global document, window*/
/*eslint no-undef: "error"*/

const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const createForm = document.getElementById("create-form");
const createButton = document.getElementById("create");

window.onload = function() {
  createForm.reset();
};

const enableButton = function() {
  createButton.disabled = false;
  createButton.classList.remove("disabled-button");
};

const disableButton = function() {
  createButton.disabled = true;
  createButton.classList.add("disabled-button");
};

email.onkeyup = function(e) {
  if (e.target.value !== "" && (password.value == confirmPassword.value && password.value !== "")) {
    enableButton();
  } else {
    disableButton();
  }
};

password.onkeyup = function(e) {
  if (e.target.value == confirmPassword.value && e.target.value !== "" && email.value !== "") {
    enableButton();
  } else {
    disableButton();
  }
};

confirmPassword.onkeyup = function(e) {
  if (e.target.value == password.value && e.target.value !== "" && email.value !== "") {
    enableButton();
  } else {
    disableButton();
  }
};
