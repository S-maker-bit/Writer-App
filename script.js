const editor = document.getElementById("editor");
    const status = document.getElementById("status");
    const wordCountEl = document.getElementById("wordCount");
    const docList = document.getElementById("docList");
    const themeSelect = document.getElementById("themeSelect");

    let currentDoc = null;
    let documents = JSON.parse(localStorage.getItem("writer-docs") || "{}");


 function refreshDocList() {
    docList.innerHTML = ""; 

    let defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Select Document";
    docList.appendChild(defaultOpt);


  for (let name in documents) {
    let opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    if (name === currentDoc) opt.selected = true; 
    docList.appendChild(opt);
  }
}
function renameDoc() {
  if (!currentDoc) {
    alert("No document is currently loaded!");
    return;
  }

  let newName = prompt("Enter a new name for the document:", currentDoc);
  if (!newName || newName === currentDoc) return;

  if (documents[newName]) {
    let confirmOverwrite = confirm(
      "A document with this name already exists. Overwrite?"
    );
    if (!confirmOverwrite) return;
  }


  documents[newName] = documents[currentDoc];

  delete documents[currentDoc];

  localStorage.setItem("writer-docs", JSON.stringify(documents));


  currentDoc = newName;
  status.textContent = "Renamed to '" + newName + "'";

  refreshDocList();
}

    function newDoc() {
      currentDoc = null;
      editor.value = "";
      updateCount();
      status.textContent = "New document";
    }


    function saveDoc() {
      let name = currentDoc || prompt("Enter document name:");
      if (!name) return;
      documents[name] = editor.value;
      localStorage.setItem("writer-docs", JSON.stringify(documents));
      currentDoc = name;
      status.textContent = "Saved as '" + name + "'";
      refreshDocList();
    }

    function loadDoc(name) {
      editor.value = documents[name];
      currentDoc = name;
      updateCount();
      status.textContent = "Loaded '" + name + "'";
    }


    function updateCount() {
      const text = editor.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      wordCountEl.textContent = `Words: ${words}`;
    }
    editor.addEventListener("input", () => {
      updateCount();
      autosave();
    });


    function autosave() {
      if (currentDoc) {
        documents[currentDoc] = editor.value;
        localStorage.setItem("writer-docs", JSON.stringify(documents));
        status.textContent = "Autosaved at " + new Date().toLocaleTimeString();
      }
    }


    function downloadDoc() {
      const text = editor.value;
      const blob = new Blob([text], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = (currentDoc || "my-document") + ".txt";
      link.click();
      status.textContent = "Downloaded";
    }

    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }

    function changeTheme() {
      document.body.className = themeSelect.value;
    }

    refreshDocList();
    updateCount();
