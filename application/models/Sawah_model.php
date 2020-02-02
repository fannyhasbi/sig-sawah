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

  public function addSawah(){
    $data = array(
      "color" => $this->input->post('color'),
      "landowner" => $this->input->post('owner'),
      "crop" => $this->input->post('crop'),
      "hamlet" => $this->input->post('hamlet'),
      "planting_date" => $this->input->post('planting_date')
    );
    $this->db->insert('field', $data);
    
    $last_id = $this->db->insert_id();
    $this->addSawahGeometry($last_id);
  }

  private function addSawahGeometry($id_sawah){
    $data = array(
      "geo_type" => "Polygon",
      "coordinates" => $this->input->post('coordinates'),
      "field_id" => (int)$id_sawah
    );

    $this->db->insert('geometries', $data);
  }

}

/* End of file Sawah_model.php */
