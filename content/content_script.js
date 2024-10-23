// content/content_script.js

// console.log("Content script loaded:", chrome.runtime.id);

// Inject our custom script into the page
const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject/inject.js");
(document.head || document.documentElement).appendChild(script);
script.onload = function () {
  script.remove();
};

// Listen for messages from the injected script
window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data || !event.data.type) return;

  if (event.data.type === "POST_RESPONSE") {
    // console.log("all", event.data);

    if (event.data.url.includes("booking/web_save")) {
      if (event.data.payload.result[0].status == "done") {
        console.log(event.data.payload.result);

        try {
          chrome.runtime.sendMessage({
            action: "save_form",
            data: event.data.payload,
            url: event.data.url,
          });
        } catch (error) {
          if (error.message.includes("Extension context invalidated")) {
            console.warn("Extension context invalidated. Retrying message...");
          } else {
            console.error("Error sending message:", error);
          }
        }
      }
    }
  }
});

// Request the saved data from background script
// chrome.runtime.sendMessage({ action: "get_saved_data" }, (response) => {
//   if (response.savedForms && response.savedForms.length > 0) {
//     const latestData = response.savedForms[response.savedForms.length - 1].data; // Get the latest saved form data
//     // fillForm(latestData);
//   }
// });
