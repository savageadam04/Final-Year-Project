const accountForm = document.getElementById('DispatchIQcreationForm');

accountForm.addEventListener('submit', function (event) {
    //Prevent page from refreshing 
    event.preventDefault();
// Collect the form information
    const name = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
//Dipslay the information in console for testing.
    console.log({
        name: name,
        email: email,
        role: role
    });
});