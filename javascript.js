document.addEventListener("DOMContentLoaded", function () {
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
        addToLocalStorage(rowData);
      }

      updateTable();
      clearFormInputs();
    } else {
      alert("Please fill in all fields.");
    }
  });

  function addToLocalStorage(data) {
    let existingData = JSON.parse(localStorage.getItem("callDataArray")) || [];
    existingData.push(data);
    localStorage.setItem("callDataArray", JSON.stringify(existingData));
  }

  function editInLocalStorage(data, index) {
    let existingData = JSON.parse(localStorage.getItem("callDataArray")) || [];
    existingData[index] = data;
    localStorage.setItem("callDataArray", JSON.stringify(existingData));
  }

  function updateTable() {
    const data = JSON.parse(localStorage.getItem("callDataArray")) || [];

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
        deleteFromLocalStorage(index);
        updateTable();
      });
    });
  }

  function populateFormWithOldData(index) {
    const data = JSON.parse(localStorage.getItem("callDataArray")) || [];
    if (data[index]) {
      nameInput.value = data[index][0];
      emailInput.value = data[index][1];
      phoneInput.value = data[index][2];
      callDataInput.value = data[index][3];
      callTimeInput.value = data[index][4];
    }
  }

  function deleteFromLocalStorage(index) {
    let data = JSON.parse(localStorage.getItem("callDataArray")) || [];
    data.splice(index, 1);
    localStorage.setItem("callDataArray", JSON.stringify(data));
  }

  function clearFormInputs() {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    callDataInput.value = "";
    callTimeInput.value = "";
  }

  updateTable();
});
