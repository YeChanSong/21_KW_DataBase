if(typeof NetFunnel == "object") {
    NetFunnel.SkinUtil.add('skin_mobile', {
        prepareCallback:function() {
        },
        updateCallback:function(percent,nwait,totwait,timeleft) {
            var custom_timeLeft = document.getElementById("Custom_TimeLeft");
            var timeLeftStr = "";
            if(timeleft > 1800) {
                timeLeftStr = "30遺� �댁긽 �덉긽�⑸땲��.";
            } else if(timeleft > 600) {
                timeLeftStr = "10遺� �댁긽 �덉긽�⑸땲��.";
            } else {
                var min = parseInt((timeleft % 3600) / 60);
                var sec = timeleft % 60;

                if(min == 0) {
                    timeLeftStr = sec + "珥� �덉긽�⑸땲��."
                } else {
                    timeLeftStr = min + "遺� " + sec + "珥� �덉긽�⑸땲��."
                }
            }
            custom_timeLeft.innerHTML = timeLeftStr;
        },
        htmlStr:
            '<div class="main-ready" id="NetFunnel_Skin_Top" style="background-color: #f0f2f4; width:100%; height: 31.25rem; padding: 1.875rem; margin-top: 3.125rem; border: 2px solid dimgray;">' +
            '<div class="main-visual"><div class="head-visual">' +
            '<h2><strong class="-mr-3" style="margin: 0 !important;">蹂몄씤 �몄쬆</strong>�� �꾪빐 �쒕퉬�� �묒냽 ��湲곗쨷 �낅땲��.<br/>�좎떆留� 湲곕떎�� 二쇱꽭��.</h2></div></div>' +
            '<p class="waiting-time" style="font-size: 1.5rem; text-align: right; font-weight: 500; padding-top: 3.5rem;">�덉긽 ��湲� �쒓컙 : <span id="Custom_TimeLeft" style="color:#0068B7 !important"></p>' +
            '<div class="progress-bar" style="width:320px; height:24px; max-height: fit-content; margin:0 auto;" id="NetFunnel_Loading_Popup_Progressbar"></div>' +
            '<br/><p style="margin-top: 1.25rem;">�꾩옱 蹂몄씤 �몄쬆 �붿껌 �섍� 留롮븘 ��湲� 以묒씠硫�, �좎떆留� 湲곕떎由ъ떆硫� �좏깮�섏떊 �몄쬆 �쒕퉬�ㅻ줈 �먮룞 �묒냽�⑸땲��.</p><br/>' +
            // '<p class="progress-caution">�� �ъ젒�랁븯�쒕㈃ ��湲� �쒓컙�� �� 湲몄뼱吏묐땲��.</p>' +
            '</div>'
    },'mobile');
}