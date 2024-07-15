document.addEventListener('DOMContentLoaded',()=>{
  const numberInput = document.getElementById('number');
  let cooldownTimer = null;
  let cooldownNumbers = new Set();
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

        if(!data.number){
          alert("Number is required")
      }

        if (cooldownNumbers.has(data.number)) {
          alert("This number is in cooldown period. Please try again later.");
          return;
      }

        try {
            const response = await fetch('http://localhost:2000/getotp', {
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
              alert("Your otp is "+result.otp)
              document.getElementById('otp').value = result.otp;
              // Handle success response
            } else {
                const errorData = await response.json();
                console.error('Error submitting form:', errorData);
                if (errorData.message.includes("Too many OTP requests")) {
                    alert(errorData.message);
                    getOtpBtn.disabled = true;
                    cooldownNumbers.add(data.number); // Add number to cooldown list

                    // Start cooldown timer to re-enable the button after 20 seconds
                    const cooldownPeriod = 20 * 1000; // 20 seconds in milliseconds
                    cooldownTimer = setTimeout(() => {
                        getOtpBtn.disabled = false;
                        cooldownNumbers.delete(data.number); // Remove number from cooldown list
                    }, cooldownPeriod);
                } else {
                    alert(errorData.message);
                }
                displayErrors(errorData.errors);
            }
          } catch (error) {
            console.error('Error:', error);
          }

            
    })
    document.querySelector('#verify-otp-form').addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
      console.log(data)

      if (!/^\d{4}$/.test(data.otp)) {
        alert('OTP must be a 4-digit number');
        return;
      }
console.log("click")
      try {
          const response = await fetch('http://localhost:2000/verifyotp', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });

          if (response.ok) {
              const result = await response.json();
              console.log('OTP verified successfully:', result);
              alert(result.message);
              // Handle success response, such as redirecting the user or updating the UI
          } else {
              const errorData = await response.json();
              console.error('Error verifying OTP:', errorData);
              alert(errorData.message);
          }
      } catch (error) {
          console.error('Error:', error);
      }
  });
  numberInput.addEventListener('input', () => {
    const currentNumber = numberInput.value;
        if (cooldownNumbers.has(currentNumber)) {
            getOtpBtn.disabled = true;
        } else {
            getOtpBtn.disabled = false;
        }
        
        if (cooldownTimer) {
            clearTimeout(cooldownTimer);
            cooldownTimer = null;
        }
    });
})