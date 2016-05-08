<?php 
/* 
* Created on 2010-4-17 
* 
* Order by Kove Wong 
*/ 
// $link=MySQL_connect('localhost','root','root'); 
// mysql_select_db('yun'); 
// mysql_query('set names utf8'); 

// $Page_size=10; 

// $result=mysql_query('select * from joke'); 
// $count = mysql_num_rows($result); 
// $page_count = ceil($count/$Page_size); 
//  $page_count;
// $init=1; 
// $page_len=7; 
// $max_p=$page_count; 
// $pages=$page_count; 

// //判断当前页码 
// if(empty($_REQUEST['page'])||$_REQUEST['page']<0){ 
// $page=1; 
// }else { 
// $page=$_REQUEST['page']; 
// } 
// $offset=$Page_size*($page-1); 
// $sql="select * from joke limit $offset,$Page_size"; 
// $result=mysql_query($sql,$link); 
// $row=mysql_fetch_array($result)
// print_r $row['joke_title'];
// 
// 
// 
require_once('../includes/Db.php');
$db= new DB();
$time=date("Y-m-d H:i:s",time());
$postData=file_get_contents('php://input', true);
$request = json_decode ( $postData );
//当前页码
$currPage = $request->page;
$table = $request->table;
$Page_query = $request->size;
$queryword = $request->queryWord;
// 每页显示多少条
if(empty($Page_query) || $Page_query<0){
	$Page_query=16;
}
$result = $db->query("select * from $table $queryword");
$count = mysql_num_rows($result);
$total = ceil($count);
$page_count = ceil($count/$Page_query);
if(empty($currPage) || $currPage<0){
	$currPage=1;
}
//偏移量
$offset = $Page_query*($currPage-1);
$result = $db->get_all("select * from $table $queryword order by id DESC limit $offset,$Page_query");
$jsonData=null;
if(count($result)>=0){
	$jsonData["data"]["list"] = $result;
	$jsonData["data"]["pages"] = $page_count;
	$jsonData["data"]["size"] = $Page_query;
	$jsonData["data"]["total"] = $total;
	$jsonData["meta"]["code"] = 200;
	$jsonData["meta"]["message"]= "成功";
}else{
 	$jsonData["data"]=null;
 	$jsonData["meta"]["code"]=500;
 	$jsonData["meta"]["message"]="查寻失败";
}
echo json_encode($jsonData);
?>