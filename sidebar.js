// document.addEventListener("DOMContentLoaded", () => {
//   // Get the selected word from chrome.storage.local when the sidebar is opened
//   chrome.storage.local.get("selectedWord", (result) => {
//     const selectedWord = result.selectedWord || "No word selected";
//     updateSidebarContent(selectedWord);
//   });
// });
document.addEventListener('DOMContentLoaded', () => {
  // Get the selected word from chrome.storage.local
  chrome.storage.local.get('selectedWord', (result) => {
    const selectedWord = result.selectedWord || 'No word selected';
    updateSidebarContent(selectedWord);

    // Update the link with the selected word
    const sayadganjLink = document.getElementById('sayadganj-link');
    sayadganjLink.href = `https://sayadganj.online/search.php?query=${encodeURIComponent(selectedWord)}`;
  });
});
// Listen for messages to update the sidebar content dynamically
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateSidebar") {
    const selectedWord = request.word;
    updateSidebarContent(selectedWord);
  }
});

// Function to update the sidebar content
function updateSidebarContent(selectedWord) {
  // Display the word
  document.getElementById("selected-word").textContent = `"${selectedWord}" ءِ بزانت`

  // Get the dictionary from chrome.storage.local
  chrome.storage.local.get("dictionary", (result) => {
    const dictionary = result.dictionary || []; // Default to an empty array if undefined

    // Find the definitions for the selected word
    const definitions = findDefinitions(selectedWord, dictionary);
    displayDefinitions(definitions);
  });
}

// Function to find definitions in the dictionary
function findDefinitions(word, dictionary) {
  const matches = dictionary.filter(
    (item) =>
      item.full_word.toLowerCase() === word ||
      item.full_word_with_symbols.toLowerCase() === word
  );
  return matches.length > 0
    ? matches
    : [{ definition: "تئ پکاریں گالبند گوں ہچ بزانتءَ مئیل نہ وارت." }];
}

// Function to display definitions as an ordered list
function displayDefinitions(definitions) {
  const definitionContainer = document.getElementById("definition");
  definitionContainer.innerHTML = ""; // Clear previous definitions

  const ol = document.createElement("ol"); // Create an ordered list element

  definitions.forEach((entry) => {
    const li = document.createElement("li"); // Create a list item
    li.textContent = entry.definition; // Set the text of the list item
    ol.appendChild(li); // Append the list item to the ordered list
  });

  definitionContainer.appendChild(ol); // Append the ordered list to the definition container
}
