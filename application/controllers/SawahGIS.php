<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class SawahGis extends CI_Controller {
  public function index(){
    $this->load->view('sawah_gis/index');
  }

}
