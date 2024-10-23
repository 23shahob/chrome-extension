// background/background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save_form") {
    console.log("Received data to save:", message);

    // Clear previously saved data before saving new data
    chrome.storage.local.clear(() => {
      console.log("Previous data cleared.");

      let savedForms = [];
      savedForms.push({
        data: message.data,
        url: message.url,
        timestamp: new Date().toISOString(),
      });

      chrome.storage.local.set({ savedForms }, () => {
        console.log("New data saved successfully:", savedForms);
      });
    });
  } else if (message.action === "get_saved_data") {
    chrome.storage.local.get(["savedForms"], (result) => {
      sendResponse({ savedForms: result.savedForms });
    });
    return true; // Keep the message channel open for the async response
  }
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "save_form") {
//     console.log("Received data to save:", message);
//     chrome.storage.local.get(["savedForms"], (result) => {
//       let savedForms = result.savedForms || [];
//       savedForms.push({
//         data: message.data,
//         url: message.url,
//         timestamp: new Date().toISOString(),
//       });
//       chrome.storage.local.set({ savedForms }, () => {
//         console.log("Data saved successfully:", savedForms);
//       });
//     });
//   } else if (message.action === "get_saved_data") {
//     chrome.storage.local.get(["savedForms"], (result) => {
//       sendResponse({ savedForms: result.savedForms });
//     });
//     return true; // Keep the message channel open for the async response
//   }
// });
