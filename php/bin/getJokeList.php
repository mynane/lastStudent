<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$postData=file_get_contents('php://input', true);
	$request = json_decode ( $postData );
	$userId=$request->userId;
	$result='';
	if($userId==1){
		$sql='select * from joke where allowed > 0 and love > 10 order by id DESC';
		$result=$db->get_all($sql);
	}else if($userId==2){
		$sql='select * from joke where allowed > 0 and imgage_url IS NULL  order by id DESC';
		$result=$db->get_all($sql);
	}else if($userId==3){
		$sql='select * from joke where allowed > 0 and imgage_url IS NOT NULL order by id DESC';
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