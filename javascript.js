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

  var userDetails = {
    name: name,
    email: email,
    phone: phone,
    callDate: callDate,
    callTime: callTime,
  };

  localStorage.setItem("userDetails", JSON.stringify(userDetails));

  document.querySelector("form").reset();
}
