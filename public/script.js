document.getElementById("videoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const videoUrl = document.getElementById("videoUrl").value;
  const resultDiv = document.getElementById("result");
  const errorP = document.getElementById("error");
  resultDiv.textContent = "";
  errorP.textContent = "";

  try {
    const transcriptRes = await fetch("/api/getTranscript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl }),
    });

    const transcriptJson = await transcriptRes.json();
    if (!transcriptJson.transcript) throw new Error("Transcript not found");

    const articleRes = await fetch("/api/generateArticle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: transcriptJson.transcript }),
    });

    const articleJson = await articleRes.json();
    if (articleJson.error) throw new Error(articleJson.error);

    resultDiv.innerText = articleJson.article;
  } catch (err) {
    errorP.innerText = err.message;
  }
});
