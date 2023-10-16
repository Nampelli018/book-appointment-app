$(document).ready(function () {
  var savedCallData = JSON.parse(localStorage.getItem("callDataArray")) || [];

  // Function to add an appointment to the table
  function addAppointmentToTable(appointment) {
    // Create a new row in the table
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${appointment.name}</td>
      <td>${appointment.email}</td>
      <td>${appointment.phone}</td>
      <td><button class="edit">Edit</button></td>
      <td><button class="delete">Delete</button></td>
    `;

    // Append the new row to the table
    tableBody.appendChild(newRow);

    const editButtons = newRow.querySelectorAll(".edit");
    editButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Array.from(newRow.parentElement.children).indexOf(newRow);
        editIndex = index; // Set the edit index
        populateFormWithOldData(index);
        submitButton.textContent = "Edit";
      });
    });

    const deleteButtons = newRow.querySelectorAll(".delete");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Array.from(newRow.parentElement.children).indexOf(newRow);
        deleteAppointment(index);
        updateTable();
      });
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
  let editIndex = -1; // Track the index for editing

  submitButton.addEventListener("click", function () {
    const name = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const callData = callDataInput.value;
    const callTime = callTimeInput.value;

    if (name && email && phone && callData && callTime) {
      const rowData = [name, email, phone, callData, callTime];

      if (editIndex !== -1) {
        editInLocalStorage(rowData, editIndex);
        editIndex = -1; // Reset the edit index
        submitButton.textContent = "Submit";
      } else {
        // Send the data to Crudcrud
        sendToCrudcrud(rowData);
      }

      updateTable();
      clearFormInputs();
    } else {
      alert("Please fill in all fields.");
    }
  });

  function addToLocalStorage(data) {
    savedCallData.push(data);
    localStorage.setItem("callDataArray", JSON.stringify(savedCallData));
  }

  function editInLocalStorage(data, index) {
    savedCallData[index] = data;
    localStorage.setItem("callDataArray", JSON.stringify(savedCallData));
  }

  function deleteAppointment(index) {
    savedCallData.splice(index, 1);
    localStorage.setItem("callDataArray", JSON.stringify(savedCallData));
  }

  function updateTable() {
    const data = savedCallData;

    let tableHTML = "";
    data.forEach(function (row, index) {
      tableHTML += "<tr>";
      row.forEach(function (cell) {
        tableHTML += `<td>${cell}</td>`;
      });
      tableHTML += `<td><button class="edit" data-index="${index}">Edit</button></td>`;
      tableHTML += `<td><button class="delete" data-index="${index}">Delete</button></td></tr>`;
    });

    tableBody.innerHTML = tableHTML;

    const editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = parseInt(button.getAttribute("data-index"));
        editIndex = index; // Set the edit index
        populateFormWithOldData(index);
        submitButton.textContent = "Edit";
      });
    });

    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = parseInt(button.getAttribute("data-index"));
        deleteAppointment(index);
        updateTable();
      });
    });
  }

  function populateFormWithOldData(index) {
    const data = savedCallData;
    if (data[index]) {
      nameInput.value = data[index][0];
      emailInput.value = data[index][1];
      phoneInput.value = data[index][2];
      callDataInput.value = data[index][3];
      callTimeInput.value = data[index][4];
    }
  }

  function clearFormInputs() {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    callDataInput.value = "";
    callTimeInput.value = "";
  }

  // Send the data to Crudcrud
  function sendToCrudcrud(data) {
    const crudcrudEndpoint =
      "https://crudcrud.com/api/307db7265d1245e6abf490120ab1f1fe/appointmentappData"; // Replace with your actual Crudcrud API endpoint

    axios
      .post(crudcrudEndpoint, { data: data })
      .then((response) => {
        // Handle the response if needed
      })
      .catch((err) => {
        console.error("Error sending data to Crudcrud:", err);
      });
  }

  // Add an event listener to the form to handle appointment submissions
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const name = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;

    if (name && email && phone) {
      const appointment = {
        name: name,
        email: email,
        phone: phone,
      };

      // Add the appointment to the table
      addAppointmentToTable(appointment);

      // Reset the form
      clearFormInputs();
    } else {
      alert("Please fill in all appointment fields.");
    }
  });
});
