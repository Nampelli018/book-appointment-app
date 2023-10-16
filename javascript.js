$(document).ready(function () {
  var savedCallData = [];

  // Function to add an appointment to the table
  function addAppointmentToTable(appointment, index) {
    // Create a new row in the table
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${appointment.name}</td>
      <td>${appointment.email}</td>
      <td>${appointment.phone}</td>
      <td><button class="edit" data-index="${index}">Edit</button></td>
      <td><button class="delete" data-index="${index}">Delete</button></td>
    `;

    // Append the new row to the table
    tableBody.appendChild(newRow);
  }

  const form = document.getElementById("myForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const callDataInput = document.getElementById("callData");
  const callTimeInput = document.getElementById("callTime");
  const submitButton = document.getElementById("submit");
  const tableBody = document.getElementById("tableBody");

  submitButton.addEventListener("click", function () {
    const name = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const callData = callDataInput.value;
    const callTime = callTimeInput.value;

    if (name && email && phone && callData && callTime) {
      const appointment = {
        name: name,
        email: email,
        phone: phone,
        callData: callData,
        callTime: callTime,
      };

      // Add the appointment to the table and send it to Crudcrud
      addAppointmentToTable(appointment, savedCallData.length);
      sendToCrudcrud(appointment);

      // Reset the form
      clearFormInputs();
    } else {
      alert("Please fill in all fields.");
    }
  });

  function deleteAppointment(index) {
    const appointmentToDelete = savedCallData[index];
    if (appointmentToDelete) {
      const crudcrudEndpoint = `https://crudcrud.com/api/6c69ec4a8dc84965b7659947263445c1/appontmenData/${appointmentToDelete._id}`;

      axios
        .delete(crudcrudEndpoint)
        .then((response) => {
          // Handle the response if needed
          savedCallData.splice(index, 1); // Remove data from the array
          updateTable(); // Update the table after successful deletion
        })
        .catch((err) => {
          console.error("Error deleting data from Crudcrud:", err);
        });
    }
  }

  function updateTable() {
    let tableHTML = "";
    savedCallData.forEach(function (row, index) {
      tableHTML += "<tr>";
      tableHTML += `<td>${row.name}</td>`;
      tableHTML += `<td>${row.email}</td>`;
      tableHTML += `<td>${row.phone}</td>`;
      tableHTML += `<td>${row.callData} ${row.callTime}</td>`;
      tableHTML += `<td><button class="edit" data-index="${index}">Edit</button></td>`;
      tableHTML += `<td><button class="delete" data-index="${index}">Delete</button></td>`;
      tableHTML += "</tr>";
    });

    tableBody.innerHTML = tableHTML;

    const editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = parseInt(button.getAttribute("data-index"));
        populateFormWithOldData(index);
        submitButton.textContent = "Edit";

        // Remove the row for editing
        tableBody.removeChild(button.parentElement.parentElement);
      });
    });

    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = parseInt(button.getAttribute("data-index"));
        deleteAppointment(index);
      });
    });
  }

  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const index = parseInt(button.getAttribute("data-index"));
      deleteAppointment(index);
    });
  });

  function populateFormWithOldData(index) {
    const data = savedCallData[index];
    if (data) {
      nameInput.value = data.name;
      emailInput.value = data.email;
      phoneInput.value = data.phone;
      callDataInput.value = data.callData;
      callTimeInput.value = data.callTime;
    }
  }

  function clearFormInputs() {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    callDataInput.value = "";
    callTimeInput.value = "";
    submitButton.textContent = "GET A CALL";
  }

  // Send the data to Crudcrud
  function sendToCrudcrud(data) {
    const crudcrudEndpoint =
      "https://crudcrud.com/api/6c69ec4a8dc84965b7659947263445c1/appontmenData"; // Replace with your actual Crudcrud API endpoint

    axios
      .post(crudcrudEndpoint, data)
      .then((response) => {
        // Handle the response if needed
        savedCallData.push(data); // Add data to the array
        updateTable(); // Update the table after receiving a response
      })
      .catch((err) => {
        console.error("Error sending data to Crudcrud:", err);
      });
  }

  // Load saved data on page load
  axios
    .get(
      "https://crudcrud.com/api/6c69ec4a8dc84965b7659947263445c1/appontmenData"
    )
    .then((response) => {
      savedCallData = response.data;
      updateTable();
    })
    .catch((err) => {
      console.error("Error fetching data from Crudcrud:", err);
    });
});
