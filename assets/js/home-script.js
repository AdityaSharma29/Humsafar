

// ---------------    OVERLAY ----------------------------


document.getElementById('close-btn-cnt').addEventListener("click", hideOverlay);
document.getElementById('show-overlay-btn').addEventListener("click", () => {
    showOverlay();
});

function hideOverlay(){ 
    const ele = document.getElementById('overlay-cnt');
    ele.classList.add('hide-overlay');
    ele.classList.remove('show-overlay');
}
function showOverlay(){ 
    const ele = document.getElementById('overlay-cnt');
    ele.classList.remove('hide-overlay');
    ele.classList.add('show-overlay');
}



// ------------------- SEARCH ENGINE ------------------------


$("body").not($("#search-engine-cnt")).click(function(){
    document.getElementById('result-cnt').style.display = "none";
});

function search_engine(){

    fetch('../assets/users_data/pseudo_placeAPI.json')
    .then(data => data.json())
    .then(data => {

        $("#search_input").keyup(function(){

            document.getElementById('result-cnt').style.display = "block";
            const val = $("#search_input").val().toUpperCase();
            var re = `(${val})`;
            let result =  data.filter(word => word.location.match(re) );
            
            result  = result.slice(0,5);
            let lis = '';
            result.forEach(element => {
                lis += "<button onclick=\"window.location.href='search?place='+this.innerHTML.toLowerCase()\" >" + element.location + '</button><hr>';
            });
            document.getElementById('geo-data').innerHTML = lis;
        });
    })

}


// ------------------- RANDOM POST FOR HOME PAGE ---------------


function display_home_data(){
    
    fetch('../assets/users_data/posts.json')
    .then(data => data.json())
    .then(data => {
        
        let num = Math.floor(Math.random() * data.length)%Math.floor(data.length/8)+1 ;
        console.log(num);
        console.log(data.length);

        let arr = [num-1, num*2-1, num*3-1, num*4-1, num*5-1, num*6-1, num*7-1,  num*8-1];
        console.log(arr);  
        
        let p_req = ``;

        arr.forEach(index => {
        
            let temp = `<div class="sub-post-cnt"><a href="/post/${data[index].post_id}" target="blank_" style="text-decoration: none; color: black;"><div class="post-header"><h3 class="post-place">${data[index].location_name}</h3>&nbsp;&nbsp; <h6 class="post-author">@${data[index].author}</h6></div><p class="post-text">${data[index].HIRT.slice(0, 400)} ...</p><div class="post-review-cnt"><p><i class="fas fa-eye"></i> : ${data[index].views}	&nbsp;	&nbsp; <i class="fas fa-thumbs-up"></i> : ${data[index].likes}	&nbsp;	&nbsp; <i class="fas fa-comments"></i> : ${data[index].comments_count}	&nbsp;</p> </div></a></div><br>`

            p_req += temp;

        });

        document.getElementById('home-post-cnt').innerHTML = p_req;
    })
    
}

