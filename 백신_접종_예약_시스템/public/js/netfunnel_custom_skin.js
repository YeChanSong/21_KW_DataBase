if(typeof NetFunnel == "object") {
    NetFunnel.SkinUtil.add('custom', {
        prepareCallback:function() {
        },
        updateCallback:function(percent,nwait,totwait,timeleft) {
            var custom_timeLeft = document.getElementById("Custom_TimeLeft");
            var timeLeftStr = "";
            if(timeleft > 1800) {
                timeLeftStr = "30분 이상 예상됩니다.";
            } else if(timeleft > 600) {
                timeLeftStr = "10분 이상 예상됩니다.";
            } else {
                var min = parseInt((timeleft % 3600) / 60);
                var sec = timeleft % 60;

                if(min == 0) {
                    timeLeftStr = sec + "초 예상됩니다."
                } else {
                    timeLeftStr = min + "분 " + sec + "초 예상됩니다."
                }
            }

            custom_timeLeft.innerHTML = timeLeftStr;
        },
        htmlStr:
            '<div class="main-ready" id="NetFunnel_Skin_Top" style="background-color: #f0f2f4; width:900px; height: 500px; padding: 30px; margin-top: 50px; border: 3px solid dimgray;">' +
            '<div class="main-visual"><div class="head-visual">' +
            '<h2><strong class="-mr-3" style="margin: 0 !important;">본인 인증</strong>을 위해 서비스 접속 대기중 입니다.<br/>잠시만 기다려 주세요.</h2></div></div>' +
            '<p class="waiting-time" style="font-size: 1.5rem; text-align: right; font-weight: 500; padding-top: 3.5rem;">예상 대기 시간 : <span id="Custom_TimeLeft"></p>' +
            '<div class="progress-bar" style="width: 840px; max-width: 840px; height: 30px; max-height: fit-content;" id="NetFunnel_Loading_Popup_Progressbar"></div>' +
            '<br/><p style="margin-top: 25px;">현재 본인 인증 요청 수가 많아 대기 중이며, 잠시만 기다리시면 선택하신 인증 서비스로 자동 접속됩니다.</p><br/>' +
            // '<p class="progress-caution">※ 재접속하시면 대기 시간이 더 길어집니다.</p>' +
            '</div>'
    },'normal');
}
