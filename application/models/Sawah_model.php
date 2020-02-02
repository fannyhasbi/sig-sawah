<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Sawah_model extends CI_Model {
  public function getAllSawah(){
    $this->db->select('f.id, f.color, f.landowner, f.crop, f.hamlet, f.planting_date, g.geo_type, g.coordinates');
    $this->db->from('field f');
    $this->db->join('geometries g', 'f.id = g.field_id');
    $q = $this->db->get();
    
    return $q->result();
  }

}

/* End of file Sawah_model.php */
