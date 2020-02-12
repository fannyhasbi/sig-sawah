<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class SawahAPI extends CI_Controller {
  public function __construct(){
    parent::__construct();
    $this->load->model('sawah_model');
  }

  private $response400 = ["code" => 400, "message" => "Bad Request"];
  private $response404 = ["code" => 404, "message" => "Not Found"];

  private function sendResponse($code, $data = null){
    $r = $this->output
      ->set_content_type('application/json')
      ->set_status_header($code);
    return $data === null ? $r : $r->set_output(json_encode($data));
  }

  public function index(){
    switch ($this->input->method()) {
      case 'get':
        $this->getAllGeoJSON();
        break;
      case 'post':
        $this->post();
        break;
      default:
        $this->getAllGeoJSON();
        break;
    }
  }

  public function detail($id){
    switch ($this->input->method()) {
      case 'get':
        $this->fieldDetail($id);
        break;
      
      default:
        return $this->sendResponse(400, $this->response400);
        break;
    }
  }

  private function getAllGeoJSON(){
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

    return $this->sendResponse(200, $response);
  }

  private function post(){
    $this->sawah_model->addSawah();

    $response = array(
      "code" => 200,
      "status" => "success",
      "data" => null
    );

    return $this->sendResponse(200, $response);
  }

  public function update(){
    if($this->input->method() != 'post'){
      return $this->sendResponse(400, $this->response400);
    }

    if(empty($this->input->post('owner')) ||
      empty($this->input->post('crop')) ||
      empty($this->input->post('hamlet')) ||
      empty($this->input->post('planting_date'))){

        return $this->sendResponse(400, $this->response400);
    }

    if($this->sawah_model->checkSawahByID($this->input->post('id')) == 0){
      return $this->sendResponse(404, $this->response404);
    }

    $error = $this->sawah_model->updateSawahByID((int)$this->input->post('id'));
    if(!empty($error['message'])){
      return $this->sendResponse(500, ["code" => 500, "message" => $error['message']]);
    }

    $response = array(
      "code" => 200,
      "status" => "success"
    );

    return $this->sendResponse(200, $response);
  }

  public function delete(){
    if($this->input->method() != 'post'){
      return $this->sendResponse(400, $this->response400);
    }

    // $this->sawah_model->deleteSawah($this->input->post('id'));

    $response = array(
      "code" => 200,
      "status" => "success",
    );

    return $this->sendResponse(200, $response);
  }

  private function fieldDetail($id){
    if($this->sawah_model->checkSawahByID($id) == 0){
      return $this->sendResponse(404, [
        "code" => 404,
        "message" => "Field not found"
      ]);
    }

    $sawah = $this->sawah_model->getSawahByID($id);
    $response = array(
      "code" => 200,
      "status" => "success",
      "data" => $sawah
    );

    return $this->sendResponse(200, $response);
  }

}

/* End of file SawahAPI.php */
