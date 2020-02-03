<?php
// Outputs are in GeoJSON format

defined('BASEPATH') OR exit('No direct script access allowed');

class SawahAPI extends CI_Controller {
  public function __construct(){
    parent::__construct();
    $this->load->model('sawah_model');
  }

  public function index(){
    switch ($this->input->method()) {
      case 'get':
        $this->get();
        break;
      case 'post':
        $this->post();
        break;
      case 'delete':
        $this->delete();
        break;
      default:
        $this->get();
        break;
    }
  }

  private function get(){
    $all_sawah = $this->sawah_model->getAllSawah();
    $sawah_response = array(
      "type" => "FeatureCollection",
      "features" => array()
    );

    foreach($all_sawah as $sawah){
      $temp = array(
        "type" => "Feature",
        "properties" => array(
          "color" => $sawah->color,
          "popupContent" => array(
            "ownerName" => $sawah->landowner,
            "crop" => $sawah->crop,
            "hamlet" => $sawah->hamlet,
            "plantingDate" => $sawah->planting_date
          )
        ),
        "geometry" => array(
          "type" => $sawah->geo_type,
          "coordinates" => json_decode($sawah->coordinates)
        )
      );
      
      $sawah_response["features"][] = $temp;
    }

    $response = array(
      "code" => 200,
      "status" => "success",
      "data" => $sawah_response
    );

    return $this->output
            ->set_content_type('application/json')
            ->set_status_header(200)
            ->set_output(json_encode($response));
  }

  private function post(){
    $this->sawah_model->addSawah();

    $response = array(
      "code" => 200,
      "status" => "success",
      "data" => null
    );

    return $this->output
            ->set_content_type('application/json')
            ->set_status_header(200)
            ->set_output(json_encode($response));
  }

  public function delete(){
    if($this->input->method() != 'post'){
      $response = array(
        "code" => 400,
        "message" => "Bad Requst"
      );

      return $this->output
            ->set_content_type('application/json')
            ->set_status_header(400)
            ->set_output(json_encode($response));
    }
      
    $this->sawah_model->deleteSawah($this->input->post('id'));

    $response = array(
      "code" => 200,
      "status" => "success",
    );

    return $this->output
            ->set_content_type('application/json')
            ->set_status_header(200)
            ->set_output(json_encode($response));
  }

}

/* End of file SawahAPI.php */
