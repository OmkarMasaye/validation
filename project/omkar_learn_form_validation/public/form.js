document.addEventListener('DOMContentLoaded', () => {
    // Attach an event listener to the form
    document.querySelector('form').addEventListener('submit',async function(event) {
      event.preventDefault();  // Prevent the default form submission behavior
  
      // Collect form data
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());  // Convert FormData to a plain object
  
      // Log the collected data to the console (optional)
      console.log('Form data:', data.email);
  if(!data.number){
    console.log("Phone required")
  }
      // Send data using the fetch API
      try {
        const response = await fetch('http://localhost:5000/submitForm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
    // console.log(response)
        if (response.ok) {
          const result = await response.json();
          console.log('Form submitted successfully:', result);
          alert(result.message)
          // Handle success response
        } else {
          const errorData = await response.json();
          console.error('Error submitting form:', errorData);
          displayErrors(errorData.errors);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
    
    function displayErrors(errors) {
      Object.keys(errors).forEach(field => {
          const element = document.getElementById(`${field}`);
          if (element) {
            const errorElement = document.getElementById(`${field}-error`);
            if (errorElement) {
              errorElement.textContent = errors[field].msg;
            }
          }
      });
  }
});
  