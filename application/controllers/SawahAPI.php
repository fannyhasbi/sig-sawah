<?php
// Outputs are in GeoJSON format

defined('BASEPATH') OR exit('No direct script access allowed');

class SawahAPI extends CI_Controller {
  public function __construct(){
    parent::__construct();
    $this->load->model('sawah_model');
  }

  public function get(){
    $temp = $this->sawah_model->getAllSawah();
    
    header('Content-Type: application/json');
    echo json_encode($temp);
  }

}

/* End of file SawahAPI.php */
