document.getElementById('close-btn-cnt').addEventListener("click", hideOverlay);
document.getElementById('show-overlay-btn').addEventListener("click", showOverlay);
function hideOverlay(){ document.getElementById('overlay-cnt').style.display = 'none'; }
function showOverlay(){ document.getElementById('overlay-cnt').style.display = 'block'; }


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


// for profile page

function posts_array(p_arr) {

    fetch('../assets/users_data/posts.json')
    .then(data => data.json())
    .then(data => {

        let p_req = ``;
        
        p_arr.forEach(id => {
            
            let index = data.findIndex(ele => ele.post_id == id);
            if(index == -1) ;
            else {
                let temp = `<div class="sub-post-cnt"><a href="/post/${id}" target="blank_" style="text-decoration: none; color: black;"><div class="post-header"><h3 class="post-place">${data[index].location_name}</h3>&nbsp;&nbsp; <h6 class="post-author">@${data[index].author}</h6></div><p class="post-text">${data[index].HIRT.slice(0, 400)} ...</p><div class="post-review-cnt"><p><i class="fas fa-eye"></i> : ${data[index].views}	&nbsp;	&nbsp; <i class="fas fa-thumbs-up"></i> : ${data[index].likes}	&nbsp;	&nbsp; <i class="fas fa-comments"></i> : ${data[index].comments_count}	&nbsp;</p> </div></a></div><br>`

                p_req += temp;
            }
        });

        document.getElementById('home-post-cnt').innerHTML = p_req;
    })
}


function display_profile_data(){
    
    const req_user = location.pathname.split('/')[1];
    
    fetch('../assets/users_data/additionals.json')
    .then(data => data.json())
    .then(data => {
        let index = data.findIndex(ele => ele.username == req_user)
        if(index == -1){window.location.replace('/'); return; }
        
        const temp1 = '"><i id="instagram" class="fab fa-instagram"></i></a><a href="';
        let temp2 = '"><i id="linkedin" class="fab fa-linkedin-in"></i></a>';

        document.getElementById('username').innerHTML = data[index].username;
        document.getElementById('bio').innerHTML = data[index].bio;
        document.getElementById('profile-image').innerHTML = `<img src="../assets/users_data/profile_images/${data[index].profile_image_src}" alt="">`;
        document.getElementById('other_links').innerHTML = `<a href="${data[index].instagram}${temp1}${data[index].linkedin}${temp2}`;

        posts_array(data[index].posts);

    })
    
}

function redirect_edit(){
    window.location.href = location.pathname+'/edit';
}
