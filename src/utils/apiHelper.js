const submitFormData = async (formData, url) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const jsonResponse = await response.json();
        throw jsonResponse.errors;
      }
     
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      throw error;
    }
  };

  const getData = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the data');
      }    
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error('Error submitting the form:', error.message);
      throw error;
    }
  };
  
  export { submitFormData, getData };