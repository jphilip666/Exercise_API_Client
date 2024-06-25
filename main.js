
async function getAllSuppliersAndRates() 
{    
  try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/suppliers`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + $('#api_token_id').val(),
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });
      const data = await response.json();
      createAllSuppliersTable(data);

  } catch (err) {
      console.log(err.message)
  }
}

function getOverlappingSuppliersAndRates() 
{  
  const overlapping_supplier_id = $('#overlapping_supplier_id').val();
  let supplier_id = '';
  if (overlapping_supplier_id != '') {
    supplier_id = overlapping_supplier_id;
  }

  try {
      const data = fetch(`http://127.0.0.1:8000/api/v1/overlapping-suppliers/${supplier_id}`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + $('#api_token_id').val(),
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      }).then(response => response.json())
        .then(data => createOverlappingSuppliersTable(data));

  } catch (err) {
      console.log(err.message)
  }
}

function createAllSuppliersTable(data)
{  
  if (data.message != undefined && data.message == 'Unauthenticated.') {
    showAuthenticationFailure();
    return false;
  }

  if (data.status != 'success') {
    return false;
  }

  let html = '';

  for (let idx in data.suppliers) {

    let supplier = data.suppliers[idx];

    let html_supplier = `<table class="w-100 mb-3">
                          <tr>
                            <td class="w-25 fw-semibold">Name</td>
                            <td>${supplier.name}</td>
                          </tr>
                          <tr>
                            <td class="w-25 fw-semibold">Address</td>
                            <td>${supplier.address}</td>
                          </tr>
                          <tr>
                            <td class="w-25 fw-semibold">Created By User</td>
                            <td>${supplier.user}</td>
                          </tr>
                          <tr>
                            <td class="w-25 fw-semibold">Created At</td>
                            <td>${formatDate(supplier.created_at)}</td>
                          </tr>
                          <tr>
                            <td class="w-25 fw-semibold">Updated At</td>
                            <td>${formatDate(supplier.updated_at)}</td>
                          </tr>
                        </table>`;
                        
    let html_rates = '';
    if (data.suppliers[idx].rates.length > 0) {                        
      html_rates += '<table class="table table-light table-bordered">';
      html_rates += `<thead>
                        <tr>
                          <th>Currency</th>
                          <th>Rate Start Date</th>
                          <th>Rate End Date</th>
                          <th>Created By User</th>
                          <th>Created At</th>
                          <th>Updated At</th>
                        </tr>
                      </thead>
                      <tbody>`;
      for (let ridx in data.suppliers[idx].rates) {
        let rate = data.suppliers[idx].rates[ridx];
        html_rates += ` <tr>
                          <td>${rate.currency}</td>
                          <td>${rate.rate_start_date}</td>
                          <td>${rate.rate_end_date}</td>
                          <td>${rate.user}</td>
                          <td>${formatDate(rate.created_at)}</td>
                          <td>${formatDate(rate.updated_at)}</td>
                        </tr>
                      `;
      }
      html_rates += `<tbody>
                    </table>`;
    } else {
      html_rates += '<div>No Rates</div>';
    }

    html += `<div class="card text-bg-light mb-3 p-4">
              ${html_supplier}
              ${html_rates}
            </div>`;              
  }

  $('#api_data_container').html(html);
}

function createOverlappingSuppliersTable(data)
{
  if (data.message != undefined && data.message == 'Unauthenticated.') {
    showAuthenticationFailure();
    return false;
  }

  if (data.status != 'success') {
    return false;
  }

  let html_rates = '';
  if (data.supplier_rates.length > 0) {
    html_rates = '<table class="table table-light table-bordered">';
    html_rates += `<thead>
                      <tr>
                        <th>Supplier</th>
                        <th>Currency</th>
                        <th>Rate Start Date</th>
                        <th>Rate End Date</th>                        
                        <th>Created By User</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>`;
    for (let idx in data.supplier_rates) {
      let rate = data.supplier_rates[idx];
      html_rates += ` <tr>
                        <td>${rate.supplier.name}</td>
                        <td>${rate.currency}</td>
                        <td>${rate.rate_start_date}</td>
                        <td>${rate.rate_end_date}</td>                        
                        <td>${rate.user}</td>
                        <td>${formatDate(rate.created_at)}</td>
                        <td>${formatDate(rate.updated_at)}</td>
                      </tr>
                    `;
    }
    html_rates += `<tbody>
                  </table>`;
  } else {
    html_rates += '<div>No Rates</div>';
  }
  
  $('#api_data_container').html(html_rates);
}

function showAuthenticationFailure()
{
  var html = `<div class="text-center">
                <div><i class="fa-solid text-danger fa-triangle-exclamation fa-4x mb-4"></i></div>
                <div class="text-danger h4">Authentiction Failure !</div>
              </div>`;

  bootbox.dialog({
    message: html,
    backdrop: true,
    buttons: {
        confirm: {
          label: 'OK',
          className: 'btn-danger'
        }
      },
  });
}

function openCreateTokenModal()
{
  var html = `<div>
                  <div class="mb-3">
                      <label for="user_email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="user_email" placeholder="Enter Email"/>
                  </div>
                  <div class="mb-3">
                      <label for="user_password" class="form-label">Password</label>
                      <input type="password" class="form-control" id="user_password" placeholder="Enter Password">
                  </div>
                  <div class="my-3" id="new_token_access" style="display:none">
                      <label for="password" class="form-label">New Token</label>
                      <div class="input-group mb-3">
                        <input type="text" class="form-control" disabled id="new_token"/>
                        <button class="input-group-text" onclick="copyToClipboard()">Copy</button>
                      </div>                    
                  </div>
                  <div id="token_error" class="invalid-feedback text-center"></div>
              </div>`;
        let dialog = bootbox.dialog({
            title: '<span class="display-5">Create New Token</span>',
            message: html,
            size: 'large',
            buttons: {
                cancel: {
                    label: "Cancel",
                    className: 'btn-secondary',
                    callback: function(){
                        console.log('Custom cancel clicked');
                    }
                },
                ok: {
                    label: "Create New Token",
                    className: 'btn-success',
                    callback:  function() {

                      $('#new_token_access').hide();
                      $('#new_token').val('');
                      $('#token_error').html('');
                        
                      const response_json = fetch("http://127.0.0.1:8000/api/create-token", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json",
                              "Accept": "application/json",
                          },
                          body: JSON.stringify({
                              "email": $('#user_email').val(),
                              "password": $('#user_password').val()
                          }),                            
                      }).then(response => response.json())
                        .then((data) => {
                          if (data.status == 'success') {
                            $('#new_token_access').show();
                            $('#new_token').val(data.token);
                          } else if (data.status == 'error') {console.log(data);
                            $('#token_error').html(data.message);
                            $('#token_error').show();
                          }                          
                        });

                        return false;
                    }
                }
            }
        });
}

function copyToClipboard()
{
  var copyText = document.getElementById("new_token");
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices
  navigator.clipboard.writeText(copyText.value);
}

function formatDate(date_iso)
{
  return new Date(date_iso).toLocaleString();
}