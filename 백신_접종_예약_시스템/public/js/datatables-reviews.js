// 백신 접종 후기 테이블 DataTable 옵션 설정 
$(document).ready(function() {
    $('#reviewTable').DataTable({
        columns: [
            { "name": "user_name" },
            { "name": "content" },
            { "name": "vaccine_name" },
            { "name": "vaccine_rating" },
            { "name": "hospital_name" },
            { "name": "hospital_rating" }
        ],

        serverSide: true,
        ajax: 'reviews/data-source',
        
        searching: false,
        ordering:  false,

        language: {
            "decimal" : "",
            "emptyTable" : "접종 후기가 없습니다.",
            "info" : "_START_ - _END_ (총 _TOTAL_ 개)",
            "infoEmpty" : "0개 항목",
            "infoFiltered" : "(전체 _MAX_ 개 중 검색결과)",
            "infoPostFix" : "",
            "thousands" : ",",
            "lengthMenu" : "_MENU_ 개씩 보기",
            "loadingRecords" : "로딩중...",
            "processing" : "처리중...",
            "search" : "검색 : ",
            "zeroRecords" : "검색된 접종 후기가 없습니다.",
            "paginate" : {
                "first" : "첫 페이지",
                "last" : "마지막 페이지",
                "next" : "다음",
                "previous" : "이전"
            },
            "aria" : {
                "sortAscending" : " :  오름차순 정렬",
                "sortDescending" : " :  내림차순 정렬"
            }
        }
    });
});