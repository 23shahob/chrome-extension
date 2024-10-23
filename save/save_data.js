// save_data.js

async function waitForPageLoad() {
  return new Promise((resolve) => {
    window.onload = resolve;
  });
}

async function fillFormAfterButtonClick() {
  await waitForPageLoad();

  // Get the button that the user will click
  const button = document.querySelector(".dt-button:first-child");

  if (button) {
    // Attach a click event listener to the button
    button.addEventListener("click", async () => {
      console.log("Button clicked by user!");

      // Save state in localStorage or a variable
      localStorage.setItem("plus_button", "true");

      // Wait for any necessary elements to load after the button click
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust timeout as needed

      // Now fill the form
      chrome.runtime.sendMessage({ action: "get_saved_data" }, (response) => {
        if (response.savedForms && response.savedForms.length > 0) {
          const latestData =
            response.savedForms[response.savedForms.length - 1].data;

          // Call the function to fill the form with the latest data
          fillForm(latestData);
        } else {
          console.error("No saved data found!");
        }
      });
    });
  } else {
    console.error("Button not found!");
  }
}

async function fillForm(savedData) {
  console.log(savedData);
  const data = savedData.result[0];
  // Proceed with filling the form only if 'plus_button' is true
  let plus_button = localStorage.getItem("plus_button") === "true";
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (plus_button) {
    const citizen = document.getElementById("id_citizen");
    if (citizen) {
      citizen.value = 173;
      console.log("Country set:", citizen.value);
    }

    var dateBirthInput = document.getElementById("datebirth");
    if (dateBirthInput) {
      dateBirthInput.value = "02-09-2005"; // Set the date value
      var inputEvent = new Event("input", { bubbles: true });
      dateBirthInput.dispatchEvent(inputEvent);
      var changeEvent = new Event("change", { bubbles: true });
      dateBirthInput.dispatchEvent(changeEvent);
      console.log("Date of birth set:", dateBirthInput.value);
    } else {
      console.error("Date of birth input not found!");
    }

    var passportInput = document.getElementById("passportNumber");
    if (passportInput) {
      passportInput.value = "AD1234567"; // Set the passport number
      passportInput.dispatchEvent(inputEvent);
      passportInput.dispatchEvent(changeEvent);
      console.log("Passport number set:", passportInput.value);
    } else {
      console.error("Passport number input not found!");
    }

    // Click the next button after filling the form
    document.getElementById("next_s1").click();

    await new Promise((resolve) => setTimeout(resolve, 2000));
    var surname = document.getElementById("surname");
    if (surname) {
      surname.value = "AD1234567"; // Set the passport number
      surname.dispatchEvent(inputEvent);
      surname.dispatchEvent(changeEvent);
      console.log("Surname set:", surname.value);
    } else {
      console.error("Surname input not found!");
    }

    var firstname = document.getElementById("firstname");
    if (firstname) {
      firstname.value = data.guest_id.display_name  ; // Set the passport number
      firstname.dispatchEvent(inputEvent);
      firstname.dispatchEvent(changeEvent);
      console.log("Firstname set:", firstname.value);
    } else {
      console.error("Firstname input not found!");
    }

    var lastname = document.getElementById("lastname");
    if (lastname) {
      lastname.value = "AD1234567"; // Set the passport number
      lastname.dispatchEvent(inputEvent);
      lastname.dispatchEvent(changeEvent);
      console.log("Lastname set:", lastname.value);
    } else {
      console.error("Lastname input not found!");
    }
    console.log(savedData);

    localStorage.setItem("plus_button", "false");
    console.log("plus_button state reset to false.");
  } else {
    console.error(
      "Form will not be filled because the button wasn't clicked by the user."
    );
  }
}

// Call the function to wait for the user to click the button
fillFormAfterButtonClick();
