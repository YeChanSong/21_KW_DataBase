$(function(){
    let star_rating_options = {
        theme: 'krajee-svg', 
        size:'sm',
        showClear: false,
        minThreshold: 1,
        step: 1,
        starCaptions: { 1: '1점', 2: '2점', 3: '3점', 4: '4점', 5: '5점' },
        clearCaption: '평점을 선택하세요'
    };

    $("#vaccine_rating").rating(star_rating_options);
    $("#hospital_rating").rating(star_rating_options);
    
});