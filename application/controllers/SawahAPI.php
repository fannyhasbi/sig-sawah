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
      default:
        $this->get();
        break;
    }
  }

  private function get(){
    $all_sawah = $this->sawah_model->getAllSawah();
    $response = array(
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
      
      $response["features"][] = $temp;
    }

    return $this->output
            ->set_content_type('application/json')
            ->set_status_header(200)
            ->set_output(json_encode($response));
  }

  private function post(){
    echo "yoyoy";
  }

}

/* End of file SawahAPI.php */
