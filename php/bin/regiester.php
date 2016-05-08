<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$time=date("Y-m-d H:i:s",time());
	$postData=file_get_contents('php://input', true);
	$request = json_decode ( $postData );
	$userName=$request->userName;
	$userEmail=$request->userEmail;
	$userPassWord=$request->userPassWord;
	$result='';
	if(strlen($userName)>6 && strlen($userPassWord)>6){
		$dataArr=array('name'=>$userName,'password'=>$userPassWord,'email'=>$userEmail,'create_time'=>$time);
		$result=$db->insert('user',$dataArr);
 	}
	$jsonData=null;
	if($result){
		$id = $db->get_one('select id from user where name="'.$userName.'" and password="'.$userPassWord.'"');
		$jsonData["data"] = $id;
		$jsonData["meta"]["code"] = 200;
		$jsonData["meta"]["message"]= "插入成功";
	}else{
	 	$jsonData["data"]=null;
	 	$jsonData["meta"]["code"]=500;
	 	$jsonData["meta"]["message"]="插入失败";
	}
	echo json_encode($jsonData);
?>