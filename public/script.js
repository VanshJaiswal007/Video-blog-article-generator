// Helper function to extract YouTube video ID from URL
function getYouTubeVideoID(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  } catch {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  }
}

document.getElementById("videoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const videoUrl = document.getElementById("videoUrl").value;
  const resultDiv = document.getElementById("result");
  const errorP = document.getElementById("error");
  const loader = document.getElementById("loader");
  
  // Reset output and show loader
  resultDiv.textContent = "";
  errorP.textContent = "";
  loader.classList.remove("hidden");

  try {
    // Step 1: Fetch the transcript
    const transcriptRes = await fetch("/api/getTranscript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl }),
    });
    const transcriptJson = await transcriptRes.json();
    if (!transcriptJson.transcript) throw new Error("Transcript not found");

    // Step 2: Generate the article using the transcript
    const articleRes = await fetch("/api/generateArticle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: transcriptJson.transcript }),
    });
    const articleJson = await articleRes.json();
    if (articleJson.error) throw new Error(articleJson.error);

    // Extract video ID to build thumbnail URL
    const videoID = getYouTubeVideoID(videoUrl);
    const thumbnailUrl = videoID ? `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg` : "";

    // Build result HTML with thumbnail and article
    resultDiv.innerHTML = "";
    if (thumbnailUrl) {
      const img = document.createElement("img");
      img.src = thumbnailUrl;
      img.alt = "Video Thumbnail";
      img.style.width = "100%";
      img.style.borderRadius = "8px";
      img.style.marginBottom = "1rem";
      resultDiv.appendChild(img);
    }
    resultDiv.insertAdjacentHTML("beforeend", `<h2>Generated Article</h2><p>${articleJson.article}</p>`);
  } catch (err) {
    errorP.innerText = err.message;
  } finally {
    // Hide loader once complete
    loader.classList.add("hidden");
  }
});

