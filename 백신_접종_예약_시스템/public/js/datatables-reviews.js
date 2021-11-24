/* 
    column의 숫자 데이터를 별점 이미지(1~5)로 렌더링 하는 DataTable용 함수
    참고: https://datatables.net/reference/option/columns.render
*/
function renderStarRating(data, type) {
    if (type === 'display' && typeof data === 'number') { // 표시용 데이터에 대해서 데이터 타입이 숫자
        let rating = (data < 1) ? 1 : (data > 5) ? 5 : data;

        let starEl = '';
        for (let i = 1; i <= 5; ++i) {
            if (i <= rating) {
                starEl += '<span class="fas fa-star" style="color: orange;"></span>'
            }
            else {
                starEl += '<span class="far fa-star"></span>'
            }
        }

        return starEl;
    }

    return data;
}

/* 백신 접종 후기 테이블 DataTable 옵션 설정 */
$(document).ready(function() {
    $('#reviewTable').DataTable({
        columns: [
            { 
                data: "user_name" 
            },
            { 
                data: "content" 
            },
            { 
                data: "vaccine_name" 
            },
            { 
                data: "vaccine_rating",
                render: renderStarRating
            },
            { 
                data: "hospital_name" 
            },
            { 
                data: "hospital_rating",
                render: renderStarRating
            }
        ],

        serverSide: true,
        ajax: 'reviews/data-source',
        
        searching: false,
        ordering:  false,

        language: {
            decimal : "",
            emptyTable : "접종 후기가 없습니다.",
            info : "_START_ - _END_ (총 _TOTAL_ 개)",
            infoEmpty : "0개 항목",
            infoFiltered : "(전체 _MAX_ 개 중 검색결과)",
            infoPostFix : "",
            thousands : ",",
            lengthMenu : "_MENU_ 개씩 보기",
            loadingRecords : "로딩중...",
            processing : "처리중...",
            search : "검색 : ",
            zeroRecords : "검색된 접종 후기가 없습니다.",
            paginate : {
                first : "첫 페이지",
                last : "마지막 페이지",
                next : "다음",
                previous : "이전"
            },
            aria : {
                sortAscending : " :  오름차순 정렬",
                sortDescending : " :  내림차순 정렬"
            }
        }
    });
});