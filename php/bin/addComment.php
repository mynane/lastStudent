<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$postData=file_get_contents('php://input', true);
	$time=date("Y-m-d H:i:s",time());
	$request = json_decode ( $postData );
	$addUserId=$request->addUserId;
	$joke_id=$request->joke_id;
	$content=$request->content;
	$CommentLength=$request->CommentLength;
	$CommentLength++;
	$result='';
	if(strlen($content)<=150){
		$dataArr=array('joke_id'=>$joke_id,'coment_userId'=>$addUserId,'comment_createTime'=>$time,'content'=>$content);
		$result=$db->insert('joke_comment',$dataArr);
		$sql=array('comment'=>$CommentLength);
		$result=$db->update('joke',$sql,'id='.$joke_id);
	}
	if($result){
		$sql='select * from joke_comment where joke_id="'.$joke_id.'"';
		$result=$db->get_all($sql);
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