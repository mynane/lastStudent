<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$time=date("Y-m-d H:i:s",time());
	$postData=file_get_contents('php://input', true);
	$request = json_decode ( $postData );

	$id=$request->id;
	$sql='select love from joke where id = '.$id;
	$result=$db->get_all($sql);
	// if(strlen($userName)>6 && strlen($userPassWord)>6){
	// 	$dataArr=array('name'=>$userName,'password'=>$userPassWord,'email'=>$userEmail,'create_time'=>$time);
	// 	$result=$db->insert('user',$dataArr);
	// }
	$loveAdd=++$result[0]['love'];
	echo $loveAdd;
	$result=$db->update('joke',["love"=>$loveAdd]);
	$jsonData=null;
	if($result){
		$jsonData["data"] = $result;
		$jsonData["meta"]["code"] = 200;
		$jsonData["meta"]["message"]= "插入成功";
	}else{
	 	$jsonData["data"]=null;
	 	$jsonData["meta"]["code"]=500;
	 	$jsonData["meta"]["message"]="插入失败";
	}
	echo json_encode($jsonData);
?>