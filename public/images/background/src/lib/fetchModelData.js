function fetchModel(url) {
  return fetch(`http://localhost:8081${url}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("fetchModel error:", error);
      throw error;
    });
}

export default fetchModel;
