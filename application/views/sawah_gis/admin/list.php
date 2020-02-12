<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="<?= base_url('assets/css/bootstrap.min.css') ?>">
  <link rel="stylesheet" href="<?= base_url('assets/css/fontawesome.min.css'); ?>">
  <link rel="stylesheet" href="<?= base_url('assets/css/flatpickr.min.css'); ?>">
  <script src="<?= base_url('assets/js/sweetalert2.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/flatpickr.js'); ?>"></script>
  <script>
  function turn_overlay(state){
    state === true ? document.getElementById('loading-overlay').style.display = 'flex' : document.getElementById('loading-overlay').style.display = 'none';
  }
  
  function delete_sawah(id){
    Swal.fire({
      text: 'Yakin ingin menghapus?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Batalkan'
    }).then((result) => {
      if(!result.value) return;
      
      turn_overlay(true);
      $.ajax({
        url: `<?= site_url('api/sawah/delete'); ?>`,
        type: 'POST',
        cache: false,
        data: {
          id: id,
        },
        error: function(err){
            console.log('Error deleting data', err);
        },
        success: function(response){ 
          Swal.fire({
            icon: 'success',
            text: 'Lahan berhasil dihapus',
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 4000,
          });

          location.reload();
        }
      }).done(() => {
        turn_overlay(false);
      });
    })
  }

  function get_detail(id){
    turn_overlay(true);
    return $.ajax({
      url: `<?= base_url('api/sawah/'); ?>${id}`,
      type: 'GET',
      error: function(err){
        Swal.fire({
          title: 'Terjadi kesalahan',
          icon: 'error',
          toast: true
        });
        console.log('Error sending data', err);
      },
      success: function(response){
        if(response.code === 200){
          detail = response.data;
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Terjadi kesalahan',
            text: response.message,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 4000,
          });
          console.log('Error', response);
        }
      }
    }).done(() => {
      turn_overlay(false);
    });
  }

  async function show_form(id){
    get_detail(id).then( async () => {
      const { value: formValues, dismiss } = await Swal.fire({
        title: 'Isi Informasi Lahan',
        html: `
          <div id="field-form">
            <table>
              <tr>
                <th>Pemilik</th>
                <td><input type="text" id="owner-name" class="swal2-input" placeholder="Pemilik" value="${detail.landowner}"></td>
              </tr>
              <tr>
                <th>Tanaman</th>
                <td><input type="text" id="crop" class="swal2-input" placeholder="Tanaman" value="${detail.crop}"></td>
              </tr>
              <tr>
                <th>Dusun</th>
                <td><input type="text" id="hamlet" class="swal2-input" placeholder="Dusun" value="${detail.hamlet}"></td>
              </tr>
              <tr>
                <th>Tanggal Tanam</th>
                <td><input type="text" id="planting-date" class="swal2-input datepickr" placeholder="Tanggal Tanam" value="${detail.planting_date}"></td>
              </tr>
            </table>
          </div>
          `,
          focusConfirm: false,
          confirmButtonText: 'Simpan',
          confirmButtonColor: '#0c0',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showCancelButton: true,
          cancelButtonText: 'Batalkan',
        onOpen: () => {
          flatpickr(".datepickr", {});
        },
        preConfirm: () => {
          let v = {
            ownerName: document.getElementById('owner-name').value,
            crop: document.getElementById('crop').value,
            hamlet: document.getElementById('hamlet').value,
            plantingDate: document.getElementById('planting-date').value,
          }

          // check empty value
          for (let [, val] of Object.entries(v)) {
            if(val === ''){
              Swal.showValidationMessage(`Harap isi semua input yang ada`);
            }
          }

          if(!v.plantingDate.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/i)){
            Swal.showValidationMessage(`Format tanggal salah`);
          }

          v.id = id;
          return v;
        }
      });

      return formValues;
    }).then((data) => {
      if(data !== undefined){
        sendUpdate(data);
      }
    });
  }

  function sendUpdate(data){
    turn_overlay(true);
    $.ajax({
      url: `<?= base_url('api/sawah/update'); ?>`,
      type: 'POST',
      cache: false,
      data: {
        id: data.id,
        owner: data.ownerName,
        crop: data.crop,
        hamlet: data.hamlet,
        planting_date: data.plantingDate,
      },
      error: function(err){
        Swal.fire({
          title: 'Terjadi kesalahan',
          icon: 'error',
          toast: true
        });
        console.log('Error sending data', err);
      },
      success: function(response){
        if(response.code === 200){
          Swal.fire({
            icon: 'success',
            text: 'Lahan berhasil disimpan',
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 4000,
          });
          location.reload();
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Terjadi kesalahan',
            text: response.message,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 4000,
          });
          console.log('Error in response', response);
        }
      }
    }).done(() => {
      turn_overlay(false);
    });
  }
  </script>

  <title>Dashboard | Sistem Informasi Geografis Persawahan Desa Karangsari</title>
</head>
<body>
  <div id="loading-overlay" class="h-100 w-100 position-absolute justify-content-center align-items-center" style="display: flex; background-color: rgba(0, 0, 0, 0.4)">
    <div class="spinner-grow text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <h1>Daftar Petak Sawah <span class="text-muted">Desa Karangsari</span></h1>
  <table class="table table-bordered table-responsive">
    <tr>
      <th>No.</th>
      <th>Pemilik</th>
      <th>Dusun</th>
      <th>Tanaman</th>
      <th>Action</th>
    </tr>
    <?php $no = 1; foreach($all_sawah as $sawah): ?>
    <tr>
      <td><?= $no; ?></td>
      <td id="<?= 'td-owner-'.$sawah->id ?>"><?= $sawah->landowner; ?></td>
      <td id="<?= 'td-hamlet-'.$sawah->id ?>"><?= $sawah->hamlet; ?></td>
      <td id="<?= 'td-crop-'.$sawah->id ?>"><?= $sawah->crop; ?></td>
      <td>
        <button class="btn btn-sm btn-outline-secondary" onclick="show_form(<?= $sawah->id; ?>)"><i class="fa fa-pen"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="delete_sawah(<?= $sawah->id; ?>)"><i class="fa fa-times"></i></button>
      </td>
    </tr>
    <?php $no++; endforeach; ?>
  </table>

  <script src="<?= base_url('assets/js/jquery-3.4.1.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/popper.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/bootstrap.min.js'); ?>"></script>
  <script>
  document.getElementById('loading-overlay').style.display = 'none';
  </script>
</body>
</html>