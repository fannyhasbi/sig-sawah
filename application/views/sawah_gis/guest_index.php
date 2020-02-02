<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="<?= base_url('assets/css/bootstrap.min.css') ?>">

  <link rel="stylesheet" href="<?= base_url('assets/css/leaflet.css'); ?>">
  <link rel="stylesheet" href="<?= base_url('assets/css/easy-button.css'); ?>">
  <link rel="stylesheet" href="<?= base_url('assets/css/fontawesome.min.css'); ?>">
  <link rel="stylesheet" href="<?= base_url('assets/css/flatpickr.min.css'); ?>">
  <link rel="stylesheet" href="<?= base_url('assets/css/main.css'); ?>">
  <script src="<?= base_url('assets/js/leaflet.js'); ?>"></script>
  <script src="<?= base_url('assets/js/easy-button.js'); ?>"></script>
  <script src="<?= base_url('assets/js/sweetalert2.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/flatpickr.js'); ?>"></script>

  <title>Sistem Informasi Geografis Persawahan</title>
</head>
<body class="text-center">
  <div class="cover-container d-flex w-100 h-100 flex-column">
    <header class="masthead mb-auto">
      <div class="inner">
        <h3 class="masthead-brand">Sistem Informasi Geografis Sawah</h3>
      </div>
    </header>
  
    <main id="map-container" class="container-fluid p-0">
      <div id="mapid"></div>
    </main>
  
    <footer class="mastfoot mt-auto">
      <div class="inner">
        <p>Desa Karangsari, Kec. Brati, Kab. Grobogan.</p>
        <p>Made by KKN TIM I UNDIP Th. 2020.</p>
      </div>
    </footer>
  </div>
  
  <script src="<?= base_url('assets/js/jquery-3.4.1.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/popper.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/bootstrap.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/guest.js'); ?>"></script>
</body>
</html>