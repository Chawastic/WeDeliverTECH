document.getElementById('inventoryDropdown').addEventListener('mouseenter', function() {
    this.click();
});

document.getElementById('ordersDropdown').addEventListener('mouseenter', function() {
    this.click();
});

function staffUserGet() {
  const tbody = $('.table-frame:first').find('.custom-table-body');
    tbody.empty();

  $.ajax({
      url: 'https://randomuser.me/api/?results=5',
      dataType: 'json',
      success: function (data) {
          data.results.forEach(function (user) {
              const row = $('<tr>');
              row.html(`
                  <td><img src="${user.picture.thumbnail}" alt="User" class="rounded"></td>
                  <td>${user.name.first}</td>
                  <td>${user.name.last}</td>
                  <td>${user.email}</td>
                  <td>${'in'}</td>
                  <td>${''}</td>
                  <td>${''}</td>
                  <td>${''}</td>
              `);

              tbody.append(row);
          });
      },
      error: function (error) {
          console.log('Error fetching data from the API', error);
      }
  });
}

function staffOut(selectedRow) {
  const minutesOut = parseInt(prompt('Enter the minutes the user will be out:'), 10);
  if (!isNaN(minutesOut)) {
    const statusCell = $(selectedRow).find('td:nth-child(5)');
    statusCell.text('Out');

    const currentTime = new Date();
    const outTimeCell = $(selectedRow).find('td:nth-child(6)');
    outTimeCell.text(currentTime.toLocaleTimeString());

    const durationCell = $(selectedRow).find('td:nth-child(7)');
    const hours = Math.floor(minutesOut / 60);
    const remainingMinutes = minutesOut % 60;
    durationCell.text(`${hours} hr : ${remainingMinutes} min`);

    const expectedReturnTimeCell = $(selectedRow).find('td:nth-child(8)');
    const outTime = new Date(currentTime);
    outTime.setMinutes(outTime.getMinutes() + minutesOut);
    expectedReturnTimeCell.text(outTime.toLocaleTimeString());
  }
}

function staffIn(selectedRow) {

  const statusCell = $(selectedRow).find('td:nth-child(5)');
  statusCell.text('In');

 
  const outTimeCell = $(selectedRow).find('td:nth-child(6)');
  const durationCell = $(selectedRow).find('td:nth-child(7)');
  const expectedReturnTimeCell = $(selectedRow).find('td:nth-child(8)');
  outTimeCell.text('');
  durationCell.text('');
  expectedReturnTimeCell.text('');
}

$(document).ready(function() {
  staffUserGet();
  let selectedRow = null;

  $('.custom-table-body').on('click', 'tr', function() {
    if (selectedRow) {
      selectedRow.css('background-color', '');
    }

    $(this).css('background-color', 'green');

    selectedRow = $(this);
  });

  $('#outButton').on('click', function() {
    if (selectedRow) {
      staffOut(selectedRow);
    } else {
      alert('Please select a user before clicking "Out".');
    }
  });

  $('#inButton').on('click', function() {
    if (selectedRow) {
      staffIn(selectedRow);
    } else {
      alert('Please select a user before clicking "In".');
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
    flatpickr('#return-time', {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
    });
});

function addDelivery(vehicle, name, surname, telephone, address, returnTime) {
    const returnTableBody = document.getElementById('return-table-body');
    const newRow = returnTableBody.insertRow();
  
    const vehicleCell = newRow.insertCell(0);
    const nameCell = newRow.insertCell(1);
    const surnameCell = newRow.insertCell(2);
    const telephoneCell = newRow.insertCell(3);
    const addressCell = newRow.insertCell(4);
    const returnTimeCell = newRow.insertCell(5);
  
    vehicleCell.innerHTML = vehicle;
    nameCell.textContent = name;
    surnameCell.textContent = surname;
    telephoneCell.textContent = telephone;
    addressCell.textContent = address;
    returnTimeCell.textContent = returnTime;
  
    $('#notificationModal').modal('show');
    document.getElementById('deliveryTime').textContent = returnTime;
  
    clearInputFields();
  }
  
  function validateDelivery(name, surname, telephone, address, returnTime) {
    const letterRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^\d{8}$/;
    const addressRegex = /^[\w\s]+$/;
  
    if (!letterRegex.test(name) || !letterRegex.test(surname)) {
      alert('Please enter a valid name and surname with letters only.');
      return false;
    } else if (!phoneRegex.test(telephone)) {
      alert('Please enter a valid 8-digit phone number.');
      return false;
    } else if (!addressRegex.test(address)) {
      alert('Please enter a valid address with alphanumeric characters and spaces.');
      return false;
    } else if (returnTime === '') {
      alert('Please select a return time.');
      return false;
    }
    return true;
  }
  
  function digitalClock() {
    const dateTimeElement = document.getElementById('dateTime');
    const now = new Date();
  
    const dateOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
  
    dateTimeElement.textContent = `Date ${formattedDate} Time ${formattedTime}`;
  }
  
  digitalClock();


setInterval(digitalClock, 1000);
  
  
  function clearInputFields() {
    const nameInput = document.querySelector('.name-input');
    const surnameInput = document.querySelector('.surname-input');
    const telephoneInput = document.querySelector('.telephone-input');
    const addressInput = document.querySelector('.address-input');
    const returnTimeInput = document.getElementById('return-time');
  
    nameInput.value = '';
    surnameInput.value = '';
    telephoneInput.value = '';
    addressInput.value = '';
    returnTimeInput.value = '';
  }
  
  document.getElementById('addRowButton').addEventListener('click', function () {
    const nameInput = document.querySelector('.name-input');
    const surnameInput = document.querySelector('.surname-input');
    const telephoneInput = document.querySelector('.telephone-input');
    const addressInput = document.querySelector('.address-input');
    const returnTimeInput = document.getElementById('return-time');
    const vehicleSelect = document.querySelector('.vehicle-select');
  
    const nameValue = nameInput.value;
    const surnameValue = surnameInput.value;
    const telephoneValue = telephoneInput.value;
    const addressValue = addressInput.value;
    const returnTimeValue = returnTimeInput.value;
    const vehicleValue = vehicleSelect.options[vehicleSelect.selectedIndex].innerHTML;
  
    if (validateDelivery(nameValue, surnameValue, telephoneValue, addressValue, returnTimeValue)) {
      addDelivery(vehicleValue, nameValue, surnameValue, telephoneValue, addressValue, returnTimeValue);
      clearInputFields();
    }
  });

  document.getElementById('return-table-body').addEventListener('click', function (e) {
    const targetRow = e.target.closest('tr');
    const tableRows = this.querySelectorAll('tr');
    tableRows.forEach(row => row.classList.remove('active'));
  
    targetRow.classList.add('active');
  });
  
  document.getElementById('clearButton').addEventListener('click', function () {
    const activeRow = document.querySelector('#return-table-body tr.active');
  
    if (activeRow) {
      activeRow.remove();
    }
  });
  

  


  function checkLateStatus(expectedReturnTime) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;

    if (currentTime === expectedReturnTime) {
      return true;
    }

    return false;
  }

function staffMemberIsLate(userFirstName, userLastName, thumbnailImageURL) {
    const lateNotificationToast = $('#lateNotificationToast').clone();
    lateNotificationToast.removeAttr('id');
  
    lateNotificationToast.find('#thumbnailImage').attr('src', thumbnailImageURL);
  
    lateNotificationToast.find('#toastMessage').text(`${userFirstName} ${userLastName} is delayed.`);
  
    let minutesOut = 0;
    let hoursOut = 0;
  
    const updateOutOfOfficeTime = () => {
      minutesOut++;
      if (minutesOut === 60) {
        minutesOut = 0;
        hoursOut++;
      }
      lateNotificationToast.find('#timeOutOfOffice').text(`Time Out-of-Office: ${hoursOut} hrs ${minutesOut} mins`);
    };
  
    const outOfOfficeInterval = setInterval(updateOutOfOfficeTime, 60000);
  
    lateNotificationToast.addClass('show');
  
    lateNotificationToast.find('.btn-close').on('click', function () {
      clearInterval(outOfOfficeInterval);
      lateNotificationToast.removeClass('show');
    });
  
    lateNotificationToast.appendTo('.custom-table-body');
  
    
    const toastCount = $('.custom-toast.show').length;
    const topPosition = toastCount * 210;
    lateNotificationToast.css('top', `${topPosition}px`);
  }
  
  function checkForLateStaff() {
    setInterval(function () {
      $('#staff-table-body tr').each(function () {
        const cells = $(this).find('td');

        if (cells.length >= 8) {
          const expectedReturnTime = $(cells[7]).text();
          const thumbnailImageURL = $(cells[0]).find('img').attr('src');
          const userFirstName = $(cells[1]).text();
          const userLastName = $(cells[2]).text();

          if (checkLateStatus(expectedReturnTime)) {
            staffMemberIsLate(userFirstName, userLastName, thumbnailImageURL);
          }
        }
      });
    }, 1000);
  }

  checkForLateStaff();












  function deliveryDriverIsLate(data) {
    const deliveryLateToast = $('#deliveryLateToast').clone();
    deliveryLateToast.removeAttr('id');
  
    const [name, telephone, address, returnTime] = data.split('\n');
  
    deliveryLateToast.find('#deliveryLateMessage').html(`
      <div>
        <strong>Name:</strong> ${name}
      </div>
      <div>
        <strong>Telephone:</strong> ${telephone}
      </div>
      <div>
        <strong>Address:</strong> ${address}
      </div>
      <div>
        <strong>Estimated Return Time:</strong> ${returnTime}
      </div>
    `);
  
    deliveryLateToast.addClass('show');
  
    deliveryLateToast.appendTo('.custom-table-body');
  
    const toastCount = $('.delivery-custom-toast.show').length;
    const topPosition = toastCount * 210;
    deliveryLateToast.css('top', `${topPosition}px`);
  }
  
  // Bind click event to the "Trigger Delivery Toast" button
  $('#triggerDeliveryLateToastButton').on('click', function () {
    const deliveryData = [];
    $('#delivery-table tbody tr').each(function () {
      const cells = $(this).find('td');
      if (cells.length >= 6) {
        const name = $(cells[1]).text();
        const surname = $(cells[2]).text();
        const telephone = $(cells[3]).text();
        const address = $(cells[4]).text();
        const returnTime = $(cells[5]).text();
  
        const deliveryInfo = `${name} ${surname}\n${telephone}\n${address}\n${returnTime}`;
        deliveryData.push(deliveryInfo);
      }
    });
  
    if (deliveryData.length > 0) {
      deliveryDriverIsLate(deliveryData.join('\n\n'));
    } else {
      alert('No delivery data available.');
    }
  });
  
  function checkForLateDeliveries() {
    setInterval(function () {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
  
      $('#return-table-body tr').each(function () {
        const cells = $(this).find('td');
  
        if (cells.length >= 6) {
          const returnTime = $(cells[5]).text();
  
          if (returnTime === currentTime) {
            const deliveryData = [];
            const name = $(cells[1]).text();
            const surname = $(cells[2]).text();
            const telephone = $(cells[3]).text();
            const address = $(cells[4]).text();
            const deliveryInfo = `${name} ${surname}\n${telephone}\n${address}\n${returnTime}`;
            deliveryData.push(deliveryInfo);
            deliveryDriverIsLate(deliveryData.join('\n\n'));
          }
        }
      });
    }, 35000);
  }
  
  checkForLateDeliveries();