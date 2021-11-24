/**
 * 留덉�留됱씪 援ы븯湲�
 * @param {Object} pYear
 * @param {Object} pMonth
 */
 function getLastDay(pYear, pMonth){
    return new Date(pYear, pMonth, 0).getDate();
}

/**
 * Date�뺤쓣 (YYYYMMDD)�뺥깭�� String�쇰줈 �꾪솚
 * @param pDate
 * @returns
 */
function fncGetDate(pDate){
    var Date = pDate.getFullYear();
    if(pDate.getMonth() < 9){
       Date = Date + "0" + (pDate.getMonth() + 1);
    } else {
       Date = Date + "" + (pDate.getMonth() + 1);
    }
    if(pDate.getDate() < 10){
       Date = Date + "0" + pDate.getDate();
    } else {
       Date = Date + "" + pDate.getDate();
    }
    return Date;
}

/**
 * 
 * @param pStr
 * @param pDigit
 * @param pChar
 * @returns
 */
function lpad(pStr, pDigit, pChar) {
    if(pStr.length >= pDigit) {
        return pStr;
    }
    for(var i = 0; pStr.length < pDigit; i++) {
        pStr = pChar + pStr;
    }
    return pStr;
}

/**
 * 怨듬갚�쒓굅
 * @param {Object} pStr
 */
function trim(pStr) {
    return pStr.replace(/(^\s*)|(\s*$)/gi, "");
}

/**
 * �앸뀈�붿씪 援ы븯湲�
 * @param {Object} pRegnum
 */
function getBirthDayByRegNum(pRegnum) {
    if(pRegnum.length < 7) {
        return false;
    }
    var yearFlag = pRegnum.charAt(6);
    var yearPrefix = "";
    if(yearFlag == '1' || yearFlag == '2' || yearFlag == '5' || yearFlag == '6') {
        yearPrefix = "19";
    } else if(yearFlag == '0' || yearFlag == '9') {
        yearPrefix = "18";
    } else {
        yearPrefix = "20";
    }
    return yearPrefix + pRegnum.substring(0, 6);
}

/**
 * 荑좏궎 媛��몄샂
 * @param {Object} name
 */
function getCookie(name) {
    var dcookie = document.cookie;
    var cname = name + "=";
    var clen = dcookie.length;
    var cbegin = 0;
    while (cbegin < clen) {
        var vbegin = cbegin + cname.length;
        if (dcookie.substring(cbegin, vbegin) == cname) {
            var vend = dcookie.indexOf (";", vbegin);
            if (vend == -1) vend = clen;
            return unescape(dcookie.substring(vbegin, vend));
        }
        cbegin = dcookie.indexOf(" ", cbegin) + 1;
        if (cbegin == 0) break;
    }
    return "";
}

/**
 * �꾨줈�좎퐳 �몄텧
 * @param 
 */
var v_loc = document.location.href;
var a_loc = v_loc.split("/");

function docloc() {
    for(var i=0;i<a_loc.length;i++) {
        alert(i + " : " + a_loc[i]);
    }
    return a_loc;
}

function getRequestURL() {
    return v_loc;
}

function getProtocol() {
    var rst = "";
    if (a_loc.length > 0) {
        if (a_loc[0] == "https:") {
            rst = "https://";
        } else {
            rst = "http://";
        }
    } else {
        rst = document.location.protocol;
    }
    return rst;
}

function getDomain(){
    return a_loc[2];
}

/**
 * �쒓��먯뿉 ���� byte瑜� 怨꾩궛
 * @param 
 */
 function getByteLength(s) {

	if (s == null || s.length == 0) {
		return 0;
	}
	var size = 0;

	for ( var i = 0; i < s.length; i++) {
		size += this.charByteSize(s.charAt(i));
	}

	return size;
}
	
 /**
  * �낅젰�� 湲��� �꾩껜�� byte瑜� 怨꾩궛
  * @param 
  */
function cutByteLength(s, len) {

	if (s == null || s.length == 0) {
		return 0;
	}
	var size = 0;
	var rIndex = s.length;

	for ( var i = 0; i < s.length; i++) {
		size += this.charByteSize(s.charAt(i));
		if( size == len ) {
			rIndex = i + 1;
			break;
		} else if( size > len ) {
			rIndex = i;
			break;
		}
	}

	return s.substring(0, rIndex);
}

/**
 * �먰븯�� byte 留뚰겮 湲��먮� �섎씪�� 諛섑솚
 * @param 
 */
function charByteSize(ch) {

	if (ch == null || ch.length == 0) {
		return 0;
	}

	var charCode = ch.charCodeAt(0);

	if (charCode <= 0x00007F) {
		return 1;
	} else if (charCode <= 0x0007FF) {
		return 2;
	} else if (charCode <= 0x00FFFF) {
		return 3;
	} else {
		return 4;
	}
}

function getCookie( cookieName ){
	var search = cookieName + "=";
	var cookie = document.cookie;
 // �꾩옱 荑좏궎媛� 議댁옱�� 寃쎌슦
	if( cookie.length > 0 ){
  		// �대떦 荑좏궎紐낆씠 議댁옱�섎뒗吏� 寃��됲븳 �� 議댁옱�섎㈃ �꾩튂瑜� 由ы꽩.
		startIndex = cookie.indexOf( cookieName );
  		// 留뚯빟 議댁옱�쒕떎硫�
  		if( startIndex != -1 ){
	   		// 媛믪쓣 �살뼱�닿린 �꾪빐 �쒖옉 �몃뜳�� 議곗젅
	   		startIndex += cookieName.length;
	   		// 媛믪쓣 �살뼱�닿린 �꾪빐 醫낅즺 �몃뜳�� 異붿텧
	   		endIndex = cookie.indexOf( ";", startIndex );
   			// 留뚯빟 醫낅즺 �몃뜳�ㅻ� 紐살갼寃� �섎㈃ 荑좏궎 �꾩껜湲몄씠濡� �ㅼ젙
	   		if( endIndex == -1) endIndex = cookie.length;
   			// 荑좏궎媛믪쓣 異붿텧�섏뿬 由ы꽩
  			return unescape( cookie.substring( startIndex + 1, endIndex ) );
  		}else{
   			// 荑좏궎 �댁뿉 �대떦 荑좏궎媛� 議댁옱�섏� �딆쓣 寃쎌슦
   			return false;
  		}
 	}else{
  		// 荑좏궎 �먯껜媛� �놁쓣 寃쎌슦
		return false;
	}
}