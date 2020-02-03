<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="<?= base_url('assets/css/bootstrap.min.css') ?>">
  <link rel="stylesheet" href="<?= base_url('assets/css/fontawesome.min.css'); ?>">
  <script src="<?= base_url('assets/js/sweetalert2.min.js'); ?>"></script>
  <script>
  function delete_sawah(id){
    Swal.fire({
      text: 'Yakin ingin menghapus?',
      icon: 'warning',
      showCancelButton: true,
      preConfirm: () => {
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
        });
      }
    });
  }
  </script>

  <title>Dashboard | Sistem Informasi Geografis Persawahan Desa Karangsari</title>
</head>
<body>
  <h1>Daftar Petak Sawah <span class="text-muted">Desa Karangsari</span></h1>
  <table>
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
      <td><?= $sawah->landowner; ?></td>
      <td><?= $sawah->hamlet; ?></td>
      <td><?= $sawah->crop; ?></td>
      <td><button class="btn btn-danger" onclick="delete_sawah(<?= $sawah->id; ?>)"><i class="fa fa-times"></i></button></td>
    </tr>
    <?php $no++; endforeach; ?>
  </table>

  <script src="<?= base_url('assets/js/jquery-3.4.1.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/popper.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/bootstrap.min.js'); ?>"></script>
</body>
</html>