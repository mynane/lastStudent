<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$postData=file_get_contents('php://input', true);
	$request = json_decode ( $postData );
	$joke_id=$request->joke_id;
	$result='';
	if($joke_id){
		$sql='select * from joke_comment where joke_id="'.$joke_id.'"';
		$result=$db->get_all($sql);
	}
	$jsonData=null;
	if(count($result)>=0){
		$jsonData["data"] = $result;
		$jsonData["meta"]["code"] = 200;
		$jsonData["meta"]["message"]= "成功";
	}else{
	 	$jsonData["data"]=null;
	 	$jsonData["meta"]["code"]=500;
	 	$jsonData["meta"]["message"]="查寻失败";
	}
	echo json_encode($jsonData);
?>