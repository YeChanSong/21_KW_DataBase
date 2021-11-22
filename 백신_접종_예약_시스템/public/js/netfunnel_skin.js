if(typeof NetFunnel == "object"){

    //blockSkin
    NetFunnel.SkinUtil.add('blockSkin',{
        prepareCallback:function(){
        },
        updateCallback:function(percent,nwait,totwait,timeleft){
        },
        htmlStr:
              '<div class="body-gray"> \
                <div class="box-notice"> \
                  <h2>사전예약 안내</h2> \
                  <p>20시부터 접수가 가능합니다.</p> \
                  <a class="close-this" onclick="NetFunnel_sendStop(); window.location.assign(\'/\');">닫기</a> \
                </div> \
              </div>'
    },'normal');
    
    NetFunnel.SkinUtil.add('blockSkin',{
        prepareCallback:function(){
        },
        updateCallback:function(percent,nwait,totwait,timeleft){
        },
        htmlStr:
              '<div class="body-gray"> \
                <div class="box-notice"> \
                  <h2>사전예약 안내</h2> \
                    <p>20시부터 접수가 가능합니다.</p> \
                  <a class="close-this" onclick="NetFunnel_sendStop(); window.location.assign(\'/\');">닫기</a> \
                </div> \
              </div>'
    },'mobile');

}
