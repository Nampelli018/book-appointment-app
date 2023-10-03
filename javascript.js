document.addEventListener("DOMContentLoaded", function () {
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
      const rowData = [name, email, phone, callData, callTime];
      addToLocalStorage(rowData);
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

  function updateTable() {
    const data = JSON.parse(localStorage.getItem("callDataArray")) || [];

    let tableHTML = "";
    data.forEach(function (row, index) {
      tableHTML += "<tr>";
      row.forEach(function (cell) {
        tableHTML += `<td>${cell}</td>`;
      });
      tableHTML += `<td><button class="delete" data-index="${index}">Delete</button></td></tr>`;
    });

    tableBody.innerHTML = tableHTML;

    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = parseInt(button.getAttribute("data-index"));
        deleteFromLocalStorage(index);
        updateTable();
      });
    });
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
