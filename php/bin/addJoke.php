<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$postData=file_get_contents('php://input', true);
	$time=date("Y-m-d H:i:s",time());
	$request = json_decode ( $postData );
	$addUserId=$request->userId;
	$title=$request->title;
	$content=$request->content;
	$result='';
	if(strlen($content)<=150){
		$dataArr=array('up_userId'=>$addUserId,'joke_title'=>$title,'joke_content'=>$content,'create_time'=>$time);
		$result=$db->insert('joke',$dataArr);
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