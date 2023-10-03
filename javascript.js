function confirmCallSlot() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var callDate = document.getElementById("callTimeDate").value;
  var callTime = document.getElementById("callTime").value;

  if (phone.length !== 10) {
    alert("Phone number should be exactly 10 digits.");
    return;
  }

  // Retrieve existing user details or initialize an empty array
  var existingUserDetails =
    JSON.parse(localStorage.getItem("userDetails")) || [];

  // Create an object for the current user
  var userDetails = {
    name: name,
    email: email,
    phone: phone,
    callDate: callDate,
    callTime: callTime,
  };

  // Add the current user's details to the array
  existingUserDetails.push(userDetails);

  // Store the updated array in local storage
  localStorage.setItem("userDetails", JSON.stringify(existingUserDetails));

  // Reset the form
  document.querySelector("form").reset();
}
