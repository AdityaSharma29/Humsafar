
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


// FOR SPECIFIC POST DATA WITH POST ID

document.getElementById('like-btn').addEventListener("click", toggle_like);
document.getElementById('report-btn').addEventListener("click", report_post);

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
                                <p><strong>@${cmmnt.comm_author}</strong> ${cmmnt.comm_text}</p>
                                <p style="visibility: hidden;height: 0;" class="comment_id">${cmmnt.comm_id}</p>`;
                placer +=      `<button onclick="like_comment(this.previousElementSibling.innerHTML)"><i class="fa fa-arrow-circle-up" aria-hidden="true"></i></button><button onclick="reply_to_comment(this.previousElementSibling, this.nextElementSibling.innerHTML)"><i class="fa fa-reply" aria-hidden="true"></i></button>
                                <p style="visibility: hidden;height: 0;" class="comment_username">${cmmnt.comm_author}</p>
                                
                                <div class="reply-section">`;
                                console.log(cmmnt.reply.length);  

                if(cmmnt.reply.length){

                    cmmnt.reply.forEach(element => {

                        console.log(element);

                        placer +=      `<div>
                                            <p><strong>@${element.replier_username}</strong> to <strong>@${element.replying_to}</strong> ${element.replier_text}</p>
                                            <p style="visibility: hidden;height: 0;" class="comment_id">${cmmnt.comm_id}</p>`;
                        placer +=          `<button onclick="reply_to_comment(this, this.nextElementSibling.innerHTML)"><i class="fa fa-reply" aria-hidden="true"></i></button>
                                            <p style="visibility: hidden;height: 0;" class="replying_author">${element.replier_username}</p>
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

// post fetch for ... like comment report 

function toggle_like(){

    if(document.getElementById("like-btn").getAttribute("class") == "liked"){
        let url = `/post/${req_post}/dislike`;
        fetch(url).then(response => response.json()).then(json => console.log(json));
    }
    else{
        let url = `/post/${req_post}/like`;
        fetch(url).then(response => response.json()).then(json => console.log(json));
    }
    $('#like-btn').toggleClass('liked')
}

function report_post(){
    let url = `/post/${req_post}/report`;
    fetch(url).then(response => response.json()).then(json => console.log(json));
}

function add_comment(){

    const value  = $('#cmmnt_inpt').val();
    
    if(value == ''){

        window.alert("Please add some text to comment !!");
        document.getElementById('cmmnt_inpt').focus();
        return;
        
    }

    let data = { "comment_text": value } ;
    fetch(`/post/${req_post}/add-comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    window.location.replace(`/post/${req_post}`);
}


// incomplete
function like_comment(comment){
    console.log(comment);
}


function reply_to_comment(cmnt_id_ele, cmnt_author){

    const id = cmnt_id_ele.previousElementSibling.innerHTML;
    console.log(id);
    console.log(cmnt_author);
    $('#reply_inpt').prop('disabled',false)
    document.getElementById('reply_inpt').focus();
    $('#submit_reply').prop('disabled',false)
    $('#submit_reply').click(function (e) { 
        const text = $('#reply_inpt').val();
        if(text !== '') {
            let data = {
                "comm_id": id,
                "replying_to": cmnt_author,
                "reply_text": text
            }
    
            fetch(`/post/${req_post}/add-reply`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            console.log(data);
        }
        else {
            $('#reply_inpt').prop('disabled',true)
            $('#submit_reply').prop('disabled',true)
            window.alert("Please add some text to reply !!");
            return;
        }
        window.location.replace(`/post/${req_post}`); 
    });
};

