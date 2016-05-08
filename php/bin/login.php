<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$postData=file_get_contents('php://input', true);
	$request = json_decode ( $postData );
	$loginUserName=$request->loginUserName;
	$loginUserPassWord=$request->loginUserPassWord;
	$result='';
	if(strlen($loginUserName)>6 && strlen($loginUserPassWord)>6){
		$sql='select * from user where name="'.$loginUserName.'" and password="'.$loginUserPassWord.'"';
		$result=$db->get_one($sql);
	}
	$jsonData=null;
	if($result){
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