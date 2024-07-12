document.addEventListener('DOMContentLoaded',()=>{
   document.querySelector('form').addEventListener('submit',async function(event){
       event.preventDefault();
   
       const formData=new FormData(event.target);
       // formData.append('otp', otp);
       const data=Object.fromEntries(formData.entries());
   
       // console.log(data.otp);
   
       try {
           const response = await fetch('http://localhost:2000/submitotp', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json'
             },
             body: JSON.stringify(data)
           });
         
       // console.log(response)
           if (response.ok) {
             const result = await response.json();
             console.log(result)
             alert(result.message)
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