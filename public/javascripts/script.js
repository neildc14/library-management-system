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
  if (checkboxes) {
    checkboxes.forEach((data) => {
      if (data.dataset.checked === "true") {
        data.checked = true;
      }
    });
  }
}

isChecked();

function getBirthDate() {
  let date_of_birth = document.querySelector('[name="date_of_birth"]');
  if (date_of_birth) {
    const BIRTHDATE = date_of_birth.dataset.birthdate;
    let birth_date = new Date(BIRTHDATE);

    if (isNaN(birth_date)) return (date_of_birth.value = "");

    let month = birth_date.getMonth() + 1;
    if (month < 10) {
      month = `0${birth_date.getMonth() + 1}`;
    }

    let date = birth_date.getDate();
    if (date < 10) {
      date = `0${birth_date.getDate()}`;
    }

    let date_formatted = `${birth_date.getFullYear()}-${month}-${date}`;
    date_of_birth.value = date_formatted;
  }
}
getBirthDate();

function getDeathDate() {
  let date_of_death = document.querySelector('[name="date_of_death"]');
  if (date_of_death) {
    const DEATHDATE = date_of_death.dataset.deathdate;
    let death_date = new Date(DEATHDATE);

    if (isNaN(death_date)) return (date_of_death.value = "");

    let month = death_date.getMonth() + 1;
    if (month < 10) {
      month = `0${death_date.getMonth() + 1}`;
    }

    let date = death_date.getDate();
    if (date < 10) {
      date = `0${death_date.getDate()}`;
    }

    let date_formatted = `${death_date.getFullYear()}-${month}-${date}`;
    date_of_death.value = date_formatted;
  }
}

getDeathDate();

function dueBack() {
  let due_back = document.querySelector("input.due_back-update");
  if (due_back) {
    let dueTime = due_back.dataset.due_back;
    let convertedDueTime = new Date(dueTime);
    if (isNaN(convertedDueTime)) return (due_back.value = "");

    let month = convertedDueTime.getMonth() + 1;
    if (month < 10) {
      month = `0${convertedDueTime.getMonth() + 1}`;
    }

    let date = convertedDueTime.getDate();
    if (date < 10) {
      date = `0${convertedDueTime.getDate()}`;
    }

    let date_formatted = `${convertedDueTime.getFullYear()}-${month}-${date}`;
    due_back.value = date_formatted;
  }
}

dueBack();
