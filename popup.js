document.getElementById("summarizeBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractTranscriptOrFallback
    }, async (injectionResults) => {
      const transcript = injectionResults[0].result || "This is a placeholder text to test summarization.";
      const summary = await fetchSummary(transcript);
      document.getElementById("summary").innerText = summary;
    });
  });
  
  // Dummy transcript extractor (improve later)
  function extractTranscriptOrFallback() {
    // Return placeholder or fetch from DOM (to be improved in phase 2)
    return "This video is about learning how to build a Chrome Extension using OpenAI.";
  }
  
  // Call OpenAI API
  async function fetchSummary(text) {
    const OPENAI_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your key
  
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful summarizer." },
          { role: "user", content: `Summarize this YouTube video:\n\n${text}` }
        ]
      })
    });
  
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "No summary available.";
  }