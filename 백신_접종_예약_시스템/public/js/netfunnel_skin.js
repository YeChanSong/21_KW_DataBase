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
                  <h2>�ъ쟾�덉빟 �덈궡</h2> \
                  <p>20�쒕��� �묒닔媛� 媛��ν빀�덈떎.</p> \
                  <a class="close-this" onclick="NetFunnel_sendStop(); window.location.assign(\'/\');">�リ린</a> \
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
                  <h2>�ъ쟾�덉빟 �덈궡</h2> \
                    <p>20�쒕��� �묒닔媛� 媛��ν빀�덈떎.</p> \
                  <a class="close-this" onclick="NetFunnel_sendStop(); window.location.assign(\'/\');">�リ린</a> \
                </div> \
              </div>'
    },'mobile');

}