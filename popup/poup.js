document.addEventListener("DOMContentLoaded", function() {
    // Saqlangan formalarni olib kelish
    chrome.storage.local.get(["savedForms"], function(result) {
      const savedFormsDiv = document.getElementById("savedForms");
      const savedForms = result.savedForms || [];

      // Har bir formani ko'rsatish
      savedForms.forEach((form, index) => {
        const formElement = document.createElement("div");
        formElement.classList.add("form-entry");
        formElement.innerHTML = `<h3>Form #${index + 1}</h3><pre>${JSON.stringify(form, null, 2)}</pre>`;
        savedFormsDiv.appendChild(formElement);
      });
    });
  });
