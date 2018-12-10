const url = require('url');
const http = require('http');
const mariadb = require('mariadb');
const pool = mariadb.createPool({ host : 'localhost', port : 3306, user : 'timo',  password : 'kangwon123', database : 'kangwon_univ', connectionLimit : 5 });
var moment = require("moment");

console.log("start server..");




//로그인 요청 -완료
var login = async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("select * from users where id = ? and password = ?", params);

		console.log(JSON.stringify(rows));
		console.log(Object.keys(rows).length +"접속 성공은 2일 경우만 ...");
		var data = new Object();
		data.type = keytype;
		if(Object.keys(rows).length==2){
			data.status = "SUCC";
		}
		else{
			data.status = "FAIL";
		}
		console.log(data);
		list.push(data);
		console.log(list);
		res.end(JSON.stringify(list));
	} catch (err) {
		console.log(err);
		var errors = new Object();
		errors.type = type;	
		errors.status = "FAIL";
		list.push(data);
		res.end(JSON.stringify(list));
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};

//회원가입 -- 완료
var signin = async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("insert into users(id, name, password) select ?, ?, ? where not exists(select * from users where id = ?) ", params);
		
		console.log(JSON.stringify(rows));
		var data = new Object();
		data.type = keytype;
		if(rows.affectedRows == 0){
			data.status = "FAIL";
		}
		else{
			data.status = "SUCC";
		}
		console.log(data);
		list.push(data);
		console.log(list);
		res.end(JSON.stringify(list));
	} catch (err) {
		console.log(err);
		var errors = new Object();
		errors.type = type;	
		errors.status = "FAIL";
		list.push(data);
		res.end(JSON.stringify(list));
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};


//모든 리스트 보기 - 완성
var alllist = async function (type, params, res) {
	let conn;
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("select lec.lec_name as classname, lec.instructor_id as instructor, tim.start_time as starttime, tim.end_time as endtime , lec.start_date as startdate, lec.end_date as enddate, tim.location as classplace, tim.lecture_day as day from lecture as lec join timeTable as tim on (lec.lec_name = tim.lec_name and lec.instructor_id = tim.instructor_id) where exists(select* from users as uu where uu.id = ? and uu.password = ?)", params);
		console.log("[[***arrays : " + rows + "***]]");
		for(var i =0 ; i<rows.length; i++)
			{
				 rows[i].type = keytype;
			}
			console.log(JSON.stringify(rows));
			res.end(JSON.stringify(rows));
	} catch (err) {
		console.log(err);
		res.end(new Array());
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};

/////////////학생용/////////////////////
//강의 참가하기 - 테스트 완료
var joinlecture = async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {

		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("insert into student(id, lec_name, instructor_id) select ?,?,? where exists(select * from lecture as l, users as u where u.id = ? and u.password = ? and l.lec_name = ? and l.instructor_id = ?) and not exists(select * from student as s where s.id = ? and s.lec_name = ? and s.instructor_id = ?)", params);

		console.log(JSON.stringify(rows));
		console.log("rows.affectedRows :" + rows.affectedRows);
		var data = new Object();
		data.type = keytype;
		if(rows.affectedRows == 0){
			data.status = "FAIL";
		}
		else{
			data.status = "SUCC";

		}
		console.log(data);
		list.push(data);
		console.log(list);
		res.end(JSON.stringify(list));
	} catch (err) {
		console.log(err);
		var errors = new Object();
		errors.type = type;	
		errors.status = "FAIL";
		list.push(data);
		res.end(JSON.stringify(list));
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};

//학생 타임 테이블 보기 -완료
var studenttimetable = async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("select l.lec_name as classname, l.instructor_id as instructor, t.start_time as starttime, t.end_time as endtime , l.start_date as startdate, l.end_date as enddate, t.location as classplace, t.lecture_day as day from users as u, student as s, lecture as l, timeTable as t where u.id = s.id and s.lec_name = l.lec_name and s.instructor_id = l.instructor_id and l.instructor_id = t.instructor_id and l.lec_name = t.lec_name and exists(select * from users where id = ? and password = ?)", params);
		console.log("[[***arrays : " + JSON.stringify(rows) + "***]]");
		for(var i =0 ; i<rows.length; i++)
			{
				 rows[i].type = keytype;
			}
			console.log(JSON.stringify(rows));
			res.end(JSON.stringify(rows));
	} catch (err) {
		console.log(err);
		res.end(new Array());
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};


////////////////////////////////////////////
//출석 체크하기 - 쿼리 완료 테스트 필요
var checkattandance = async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");

		var time = moment().format("YYYY-MM-DD");
		var date = moment().format("HH:mm:ss");
		console.log(params);
		console.log("시간과 날짜" + [date, time]);
		params.splice(3, 0, date, time);
		
		console.log("list : " + params);
		conn = await pool.getConnection();
		//qr.classname, qr.instructor, q.id, q.password
		const rows = await conn.query("insert into attandance(lec_name, instructor_id, id, check_date, check_time) select ?, ?, ?, ?, ? where exists(select * from lecture as l, users as u, student as s where l.lec_name = ? and l.instructor_id = ? and l.enable_attandance = 1 and u.id = ? and u.password = ? and l.auth=? and u.id=s.id and l.lec_name =s.lec_name and l.instructor_id = s.instructor_id) ", params);

		console.log(JSON.stringify(rows));
		
		var data = new Object();
		data.type = keytype;
		if(rows.affectedRows==0){
			data.status = "FAIL";
		}
		else{
			data.status = "SUCC";
		}
		console.log(data);
		list.push(data);
		console.log(list);
		res.end(JSON.stringify(list));
	} catch (err) {
		console.log(err);
		var errors = new Object();
		errors.type = type;	
		errors.status = "FAIL";
		list.push(data);
		res.end(JSON.stringify(list));
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};
//출석 체크 리스트 - 
var attandancelist =async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("select a.lec_name as classname, a.instructor_id as instructor, s.id as student, a.check_date as checkdate, a.check_time as time from attandance as a, student as s where s.id = a.id and a.lec_name = s.lec_name and a.instructor_id = s.instructor_id and exists(select * from users as uu where uu.id = ? and uu.password = ? ) and a.lec_name = ? and a.instructor_id = ?", params);
		console.log("[[***arrays : " + JSON.stringify(rows) + "***]]");
		for(var i =0 ; i<rows.length; i++)
			{
				 rows[i].type = keytype;
			}
			console.log(JSON.stringify(rows));
			res.end(JSON.stringify(rows));
	} catch (err) {
		console.log(err);
		res.end(new Array());
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};


////////////강의자용//////////////////////
//강의 생성 -완료
var openlecture = async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	var data = new Object();
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		//일단 강의 넣고 강의 시간표 구성
		//강의는 1번 강의 시간표는 반복문으로 계속해서 넣어줘야 함.
		if(Object.keys(params).length >8){
		const instructor = params.id[0];
		const classname = params.classname[0];
		const id = params.id[0];
		const password = params.password[0];
		var sortedarray = [classname, instructor, params.startdate[0], params.enddate[0], id, password, classname, instructor];
		console.log(sortedarray);
		const rows1 = await conn.query("insert into lecture(lec_name, instructor_id, start_date, end_date, enable_attandance, auth) select ?, ?, ?, ?, 0, 0 where exists(select * from users as u where u.id = ? and u.password = ?) and not exists(select * from lecture as l where l.lec_name =? and l.instructor_id = ?)", sortedarray);
		var rows2;
		if(rows1.affectedRows != 0){
		console.log("length param" + params.classname.length);
		for(var i = 0 ; i<params.classname.length; i++)
		{
			
			sortedarray = [classname, instructor, params.day[i], params.classplace[i], params.starttime[i], params.endtime[i], id, password, classname, instructor];
			console.log(sortedarray);
			rows2 = await conn.query("insert into timeTable(lec_name, instructor_id, lecture_day, location, start_time, end_time) select ?, ?, ?, ?, ?, ? where exists(select * from users as u, lecture as l where u.id = ? and u.password = ? and l.lec_name = ? and l.instructor_id=?)", sortedarray);
		}

		sortedarray = [classname, id, password];
		const row = await conn.query("select count(*) as c from timeTable as t, users as u where u.id = t.instructor_id and t.lec_name = ? and u.id = ? and password=?", sortedarray);
		console.log(row);
		
		data.type = keytype;
		if(params.classname.length == row[0].c){
			data.status = "SUCC";
		
		}
		else 
			data.status = "FAIL";
		}
		else{
			data.type = keytype;
			data.status = "FAIL";
		}
	}
	else{
		data.type = keytype;
		data.status = "FAIL";
		}
		console.log(data);
		list.push(data);
		console.log(list);
		res.end(JSON.stringify(list));
	} catch (err) {
		console.log(err);
		var errors = new Object();
		errors.type = type;	
		errors.status = "FAIL";
		list.push(data);
		res.end(JSON.stringify(list));
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};

//강의 제거  - 완료
var closelecture = async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("delete from lecture where exists(select * from users as u where lecture.lec_name =? and lecture.instructor_id = u.id and  u.id = ? and u.password = ?);", params);
		console.log("rows" + rows);
		var data = new Object();
		data.type = keytype;
		if(rows.affectedRows == 0){
			data.status = "FAIL";
		}
		else{
			data.status = "SUCC";
		}
		console.log(data);
		list.push(data);
		console.log(list);
		res.end(JSON.stringify(list));
	} catch (err) {
		console.log(err);
		var errors = new Object();
		errors.type = type;	
		errors.status = "FAIL";
		list.push(data);
		res.end(JSON.stringify(list));
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};

//강의자 타임 테이블 보기
var instructortimetable = async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		
		const rows = await conn.query("select l.lec_name as classname, l.instructor_id as instructor, t.start_time as starttime, t.end_time as endtime , l.start_date as startdate, l.end_date as enddate, t.location as classplace, t.lecture_day as day from users as u, lecture as l, timeTable as t where u.id = l.instructor_id and  l.instructor_id = t.instructor_id and l.lec_name = t.lec_name and exists(select * from users where u.id = ? and u.password = ?)", params);
		for(var i =0 ; i<rows.length; i++)
			{
				 rows[i].type = keytype;
			}
			console.log(JSON.stringify(rows));
			res.end(JSON.stringify(rows));
	} catch (err) {
		console.log(err);
		res.end(new Array());
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};
//출석 체크 열기
var openattandance = async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("update lecture as l set enable_attandance = 1, auth = ? where exists(select * from users as u where u.id = l.instructor_id and l.lec_name = ? and u.id = ? and u.password = ?)", params);

		console.log("rows 는 > " + JSON.stringify(rows));
		var data = new Object();
		data.type = keytype;
		if(rows.affectedRows == 0){
			data.status = "FAIL";
		}
		else{
			data.status = "SUCC";
		}
		console.log(data);
		list.push(data);
		console.log(list);
		res.end(JSON.stringify(list));
	} catch (err) {
		console.log(err);
		var errors = new Object();
		errors.type = type;	
		errors.status = "FAIL";
		list.push(data);
		res.end(JSON.stringify(list));
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};

//강사 - 출석체크 닫기
var closeattandance =async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("update lecture as l set enable_attandance = 0, auth = 0 where exists(select * from users as u where u.id = l.instructor_id and l.lec_name = ? and u.id = ? and u.password = ?)", params);
		console.log("rows 는 > " + JSON.stringify(rows));
		var data = new Object();
		data.type = keytype;
		if(rows.affectedRows == 0){
			data.status = "FAIL";
		}
		else{
			data.status = "SUCC";
		}
		console.log(data);
		list.push(data);
		console.log(list);
		res.end(JSON.stringify(list));
	} catch (err) {
		console.log(err);
		var errors = new Object();
		errors.type = type;	
		errors.status = "FAIL";
		list.push(data);
		res.end(JSON.stringify(list));
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};

// 강사-학생 출석리스트
var instructorattandancelist =async function (type, params, res) {
	let conn;
	var list = new Array();
	var keytype = type.substring(1);
	try {
		console.log(type+"중...");
		conn = await pool.getConnection();
		const rows = await conn.query("select a.lec_name as classname, a.instructor_id as instructor, a.id as student, a.check_date as checkdate, a.check_time as time from attandance as a, users as u where u.id = a.instructor_id and exists(select * from users as uu where uu.id = ? and uu.password = ? )", params);
		console.log("[[***arrays : " + JSON.stringify(rows) + "***]]");
		for(var i =0 ; i<rows.length; i++)
			{
				 rows[i].type = keytype;
			}
			console.log(JSON.stringify(rows));
			res.end(JSON.stringify(rows));
	} catch (err) {
		console.log(err);
		res.end(new Array());
		throw err;
	} finally {
		if (conn) return conn.end();
	}
};

var app = http.createServer((req, res) => {
	q = url.parse(req.url, true);
	console.log(q);
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	console.log(q.query);
	qr = q.query;
	//로그인
	if (q.pathname == "/login" && qr.id != null && qr.password != null) {
		login(q.pathname,[qr.id, qr.password], res);
	}
	//회원가입
	else if (q.pathname == "/signin" && qr.id != null && qr.name != null && qr.password != null) {
		signin(q.pathname ,[qr.id, qr.name, qr.password, qr.id], res);
	}
	else if(q.pathname == "/alllist" && qr.id != null  && qr.password != null){
		alllist(q.pathname, [qr.id, qr.password], res);
	}
	//학생 - 강의 참석
	else if (q.pathname == "/joinlecture" && qr.id != null && qr.password != null && qr.classname !=null && qr.instructor != null ) {
		joinlecture(q.pathname, [qr.id, qr.classname, qr.instructor, qr.id, qr.password, qr.classname, qr.instructor, qr.id, qr.classname, qr.instructor], res);
	}
	//학생 - 시간표 보기
	else if (q.pathname == "/studenttimetable" && qr.id != null && qr.password != null){
		studenttimetable(q.pathname, [qr.id, qr.password], res);
	}
	//학생 - 출석 체크
	else if (q.pathname == "/checkattandance" && qr.id != null && qr.password != null && qr.classname != null && qr.instructor != null && qr.auth){
		checkattandance(q.pathname, [qr.classname, qr.instructor, qr.id, qr.classname, qr.instructor, qr.id, qr.password, qr.auth], res);
	}
	//학생 - 출석 체크 리스트 요청
	else if (q.pathname == "/attandancelist"  && qr.id != null && qr.password != null && qr.classname != null && qr.instructor != null){
		attandancelist(q.pathname, [ qr.id, qr.password, qr.classname, qr.instructor], res);
	}
	//강사- 강의 만들기
	else if (q.pathname == "/openlecture" && qr.id != null && qr.password != null && qr.classname != null){
		openlecture(q.pathname, qr, res); // 아직 미완
	}
	//강사 - 강의 삭제 하기
	else if (q.pathname == "/closelecture" && qr.id != null && qr.classname != null && qr.password != null){
		closelecture(q.pathname, [qr.classname, qr.id, qr.password], res);
	}
	//강사 - 시간표
	else if (q.pathname == "/instructortimetable" && qr.id != null && qr.password != null ){
		instructortimetable(q.pathname, [qr.id, qr.password], res);
	}
	//강사 - 출석부 열기
	else if (q.pathname == "/openattandance" &&qr.auth != null && qr.id != null && qr.password != null && qr.classname != null ){
		openattandance(q.pathname, [qr.auth, qr.classname, qr.id, qr.password], res);
	}
	//강사 - 출석부 닫기
	else if (q.pathname == "/closeattandance" && qr.id != null && qr.password != null && qr.classname != null){
		closeattandance(q.pathname, [qr.classname, qr.id, qr.password], res);
	}
	//강사 - 강사 출석부 보기
	else if(q.pathname == "/instructorattandancelist" && qr.id != null && qr.password != null && qr.classname != null){
		instructorattandancelist(q.pathname, [qr.id, qr.password], res)
	}
	else {
		res.end();
	}
});

app.listen(8080);
