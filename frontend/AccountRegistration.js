const accountForm = document.getElementById('DispatchIQcreationForm');

accountForm.addEventListener('submit', async function (event) {

    //Prevent page from refreshing 
    event.preventDefault();

// Collect the form information
    const name = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    //Send the information to the backend
    try{
        const response = await fetch('/api/test-registration', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            //Converts object to JSON to send via HTTP request
            body: JSON.stringify({
                name: name,
                email: email,
                role: role
            })
        });

        //Receive backend response - convert back to Javascript object
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        console.log(result);
        
        alert(result.message);

    } catch (error) {
        console.error('Error:', error.message);
        alert('Something went wrong: ' + error.message);
    }
});