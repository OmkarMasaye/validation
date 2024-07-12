 document.addEventListener('DOMContentLoaded',()=>{

    document.querySelector('form').addEventListener('submit',async function(event){
        event.preventDefault();
        // const otp = Math.floor(1000 + Math.random() * 9000);
        // // Display the OTP in an alert (you can change this as needed)
        // alert('Your OTP is: ' + otp);
        // // Populate the OTP input field
        // document.getElementById('otp').value = otp;
    
        const formData=new FormData(event.target);
        // formData.append('otp', otp);
        const data=Object.fromEntries(formData.entries());
        console.log(data.number);
        // console.log(data.otp);

        try {
            const response = await fetch('http://localhost:2000/getotp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
            if(!data.number){
                alert("Number is required")
            }
        // console.log(response)
            if (response.ok) {
              const result = await response.json();
              console.log('Form submitted successfully:', result);
              alert("Your otp is "+result.otp)
              document.getElementById('otp').value = result.otp;
              // Handle success response
            } else {
              const errorData = await response.json();
              console.error('Error submitting form:', errorData);
              displayErrors(errorData.errors);
            }
          } catch (error) {
            console.error('Error:', error);
          }

            
    })
 })