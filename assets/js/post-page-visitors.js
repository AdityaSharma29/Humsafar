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


// FOR SPECIFIC POST DATA WITH POST ID

const req_post = location.pathname.slice(6, 25);

function myMap(lat, lng) {
    return mapProp= {
      center:new google.maps.LatLng(lat, lng),
      zoom:15,
    }   
}
function display_post_data() {

    fetch('../assets/users_data/posts.json')
    .then(data => data.json())
    .then(data => {
        let index = data.findIndex(ele => ele.post_id == req_post)
        if(index == -1){window.location.replace('/'); return; }
        let lat = data[index].latitude;
        let lng = data[index].longitude;
        let Prop = myMap(lat, lng);
        var map = new google.maps.Map(document.getElementById("googleMap"), Prop);
        document.getElementById('title').innerHTML = data[index].location_name;
        document.getElementById('HIRT').innerHTML = data[index].HIRT;
        document.getElementById('author').innerHTML = data[index].author;

        if(data[index].image_source.length){
            var imgs = "";
            data[index].image_source.forEach(element => imgs += `<img src='../assets/users_data/posts_images/${element}'>` );        
            document.getElementById('inner-img-cnt').innerHTML = imgs;
        }

        if(data[index].additional_query.length){
            var placer = "";
            data[index].additional_query.forEach(element => {
                placer = placer + "<h3>" + element.heading + "</h3>";
                placer = placer + "<p>" + element.text + "</p><br>";
            });        
            document.getElementById('additional').innerHTML = placer;
        }

        if(data[index].comments.length){

            var placer = '';

            data[index].comments.forEach(cmmnt => {
                
                placer += `<div class="inner_cmmnt_cnt">
                                <p>@<strong>${cmmnt.comm_author}</strong> ${cmmnt.comm_text}</p>
                                <p style="visibility: hidden;" class="comment_id">${cmmnt.comm_id}</p>`;
                placer +=      `<button onclick="" disabled><i class="fa fa-arrow-circle-up" aria-hidden="true"></i></button><button onclick="" disabled><i class="fa fa-reply" aria-hidden="true"></i></button>
                                <p style="visibility: hidden;" class="comment_username">${cmmnt.comm_author}</p>
                                
                                <div class="reply-section">`;
                                console.log(cmmnt.reply.length);  

                if(cmmnt.reply.length){

                    cmmnt.reply.forEach(element => {

                        console.log(element);

                        placer +=      `<div>
                                            <p>@<strong>${element.replier_username}</strong> to @<strong>${element.replying_to}</strong> ${element.replier_text}</p>
                                            <p style="visibility: hidden;" class="comment_id">${cmmnt.comm_id}</p>`;
                        placer +=          `<button onclick="" disabled><i class="fa fa-reply" aria-hidden="true"></i></button>
                                            <p style="visibility: hidden;" class="replying_author">${element.replier_username}</p>
                                        </div>`
                    })
                }
            
                placer +=      `</div>
                            </div>`
            })

            document.getElementById('show-comment').innerHTML = placer;
        }
    })
}
