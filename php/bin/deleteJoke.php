<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$time=date("Y-m-d H:i:s",time());
	$postData=file_get_contents('php://input', true);
	$request = json_decode ( $postData );
	$id=$request->id;
	$result='';
	$result = $db->delete('joke',"id=$id");
	$jsonData=null;
	if($result){
		$jsonData["data"] = $result;
		$jsonData["meta"]["code"] = 200;
		$jsonData["meta"]["message"]= "删除成功";
	}else{
	 	$jsonData["data"]=null;
	 	$jsonData["meta"]["code"]=500;
	 	$jsonData["meta"]["message"]="插入失败";
	}
	echo json_encode($jsonData);
?>