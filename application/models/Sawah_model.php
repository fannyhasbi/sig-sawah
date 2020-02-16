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

  public function checkSawahByID($id){
    return $this->db->get_where('field', ['id' => $id])->num_rows();
  }

  public function getSawahByID($id){
    $this->db->select('f.id, f.color, f.landowner, f.crop, f.hamlet, f.planting_date, g.geo_type, g.coordinates');
    $this->db->from('field f');
    $this->db->join('geometries g', 'f.id = g.field_id');
    $this->db->where('f.id', (int)$id);
    $q = $this->db->get();
    
    return $q->row();
  }

  public function updateSawahByID($id){
    $data = array(
      "landowner" => $this->input->post('owner'),
      "crop" => $this->input->post('crop'),
      "hamlet" => $this->input->post('hamlet'),
      "planting_date" => $this->input->post('planting_date')
    );

    $this->db->where('id', $id);
    $this->db->update('field', $data);

    return $this->db->error();
  }

  public function deleteSawah($id_sawah){
    $this->deleteGeometry($id_sawah);

    $this->db->where('id', $id_sawah);
    $this->db->delete('field');

    if($this->db->error()["message"]){
      log_message('error', $this->db->error());
    }
  }

  private function deleteGeometry($id_sawah){
    $this->db->where('field_id', $id_sawah);
    $this->db->delete('geometries');

    if($this->db->error()["message"]){
      log_message('error', $this->db->error());
    }
  }

}

/* End of file Sawah_model.php */
