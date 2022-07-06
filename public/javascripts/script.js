let navBtn = document.querySelectorAll("a.btn-nav");
let input = document.getElementById("name");
let error = document.getElementById("error");

navBtn.forEach((nav) => {
  nav.addEventListener("mouseover", () => {
    nav.classList.add("btn-primary");
  });
});

navBtn.forEach((nav) => {
  nav.addEventListener("mouseout", () => {
    nav.classList.remove("btn-primary");
  });
});

function Input() {
  if (input) {
    input.addEventListener("keydown", () => {
      error.remove();
    });
  } else {
    return false;
  }
}

Input();

function isChecked() {
  let checkboxes = document.querySelectorAll('[name="genre"]');
  checkboxes.forEach((data) => {
    if (data.dataset.checked === "true") {
      data.checked = true;
    }
  });
}

isChecked();

function getBirthDate() {
  let date_of_birth = document.querySelector('[name="date_of_birth"]');
  const BIRTHDATE = date_of_birth.dataset.birthdate;

  var date = new Date(BIRTHDATE);
  var date_formatted =
    date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate();
  date_of_birth.value = date_formatted;
}
getBirthDate();

function getDeathDate() {
  let date_of_death = document.querySelector('[name="date_of_death"]');
  const DEATHDATE = date_of_death.dataset.deathdate;

  var date = new Date(DEATHDATE);
  if (isNaN(date)) {
    date_of_death.value = "";
  } else {
    var date_formatted =
      date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate();

    date_of_death.value = date_formatted;
  }
}

getDeathDate();
