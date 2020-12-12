// Initialize IndexedDB
const request = indexedDB.open("IncraMusic", 1);
let db;

// Handle database upgrade
request.onupgradeneeded = () => {
  db = request.result;

  // Initialize a "collection"
  db.createObjectStore("MusicFile", { keyPath: "id" });

  /*
    store.delete()
    store.put()
  */
};

// Request succeed
request.onsuccess = () => {
  db = request.result;
};

request.onblocked = () => {
  alert("Please close all other tabs wuth this site open");
};
