<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class SawahGisAdmin extends CI_Controller {
  public function index(){
    $this->load->view('sawah_gis/admin/index_view');
  }

  public function list(){
    $this->load->model('sawah_model');
    $data['all_sawah'] = $this->sawah_model->getAllSawah();
    
    $this->load->view('sawah_gis/admin/list', $data);
  }

}
