export const fetchStoreData = async (): Promise<any[]> => {
    try {
      const response = await fetch("http://localhost:3000/api/stores"); // 📌 Fetch data from API
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json(); // Convert response to JSON
      console.log("Fetched Store Data from API:", data); // 🔍 Debugging
      return data; // Return the fetched store data
    } catch (error) {
      console.error("Error fetching store data from API:", error);
      return []; // Return an empty array in case of an error
    }
  };
  