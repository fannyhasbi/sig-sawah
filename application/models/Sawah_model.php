<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Sawah_model extends CI_Model {
  public function getAllSawah(){
    $q = $this->db->get('field');
    return $q->result();
  }

}

/* End of file Sawah_model.php */
