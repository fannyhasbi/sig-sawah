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

  <style>
  #header-banner {
    background: url('<?= base_url("assets/css/sawah.jpg"); ?>')
  }
  </style>

  <title>Sistem Informasi Geografis Persawahan Desa Karangsari</title>
</head>
<body>
  <header id="header-banner" class="jumbotron jumbotron-fluid text-center mx-auto my-0 bg-light">
    <h1 class="display-5 font-weight-normal text-dark">Sistem Informasi Geografis Persawahan Desa Karangsari</h1>
  </header>
  
  <main id="map-container" class="container-fluid p-0">
    <div id="mapid"></div>
  </main>

  <footer class="text-muted text-center p-2">
    <div class="container">
    <p>Desa Karangsari, Kec. Brati, Kab. Grobogan.</p>
      <p>Made by KKN TIM I UNDIP Th. 2020.</p>
    </div>
  </footer>
  
  <script src="<?= base_url('assets/js/jquery-3.4.1.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/popper.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/bootstrap.min.js'); ?>"></script>
  <script src="<?= base_url('assets/js/main.js'); ?>"></script>
</body>
</html>