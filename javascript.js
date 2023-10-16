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
      <td>${appointment.callData} ${appointment.callTime}</td>
      <td><button class="edit" data-index="${index}">Edit</button></td>
      <td><button class="delete" data-index="${index}">Delete</button></td>
    `;

    // Append the new row to the table
    tableBody.appendChild(newRow);
  }

  // Function to update an appointment in Crudcrud
  function updateAppointmentInCrudcrud(data, id) {
    const crudcrudEndpoint = `https://crudcrud.com/api/6354cb3298c846859ae893200a83e785/appointmentData/${id}`;

    axios
      .put(crudcrudEndpoint, data)
      .then((response) => {
        // Handle the response if needed
      })
      .catch((err) => {
        console.error("Error updating data in Crudcrud:", err);
      });
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

      if (submitButton.textContent === "Edit") {
        const editIndex = submitButton.getAttribute("data-edit-index");
        const appointmentId = savedCallData[editIndex]._id; // Assuming _id is present

        updateAppointmentInCrudcrud(appointment, appointmentId);

        // Update the local data (optional, if needed)
        savedCallData[editIndex] = appointment;

        // Update the table
        updateTable();

        // Reset the form
        clearFormInputs();
      } else {
        // Add the appointment to the table and send it to Crudcrud
        sendToCrudcrud(appointment);

        // Reset the form
        clearFormInputs();
      }
    } else {
      alert("Please fill in all fields.");
    }
  });

  function deleteAppointment(index) {
    const appointmentToDelete = savedCallData[index];
    if (appointmentToDelete) {
      const crudcrudEndpoint = `https://crudcrud.com/api/6354cb3298c846859ae893200a83e785/appointmentData/${appointmentToDelete._id}`;

      axios
        .delete(crudcrudEndpoint)
        .then((response) => {
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

    // Add event listeners for editing and deleting
    const editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = parseInt(button.getAttribute("data-index"));
        populateFormWithOldData(index);
        submitButton.textContent = "Edit";
        submitButton.setAttribute("data-edit-index", index);
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
    submitButton.removeAttribute("data-edit-index");
  }

  // Send the data to Crudcrud
  function sendToCrudcrud(data) {
    const crudcrudEndpoint =
      "https://crudcrud.com/api/6354cb3298c846859ae893200a83e785/appointmentData"; // Replace with your actual Crudcrud API endpoint

    axios
      .post(crudcrudEndpoint, data)
      .then((response) => {
        savedCallData.push(response.data); // Add data to the array
        updateTable(); // Update the table after receiving a response
      })
      .catch((err) => {
        console.error("Error sending data to Crudcrud:", err);
      });
  }

  // Load saved data on page load
  axios
    .get(
      "https://crudcrud.com/api/6354cb3298c846859ae893200a83e785/appointmentData"
    )
    .then((response) => {
      savedCallData = response.data;
      updateTable();
    })
    .catch((err) => {
      console.error("Error fetching data from Crudcrud:", err);
    });
});
