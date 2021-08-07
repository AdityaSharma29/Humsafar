document.getElementById('close-btn-cnt').addEventListener("click", hideOverlay);
document.getElementById('show-overlay-btn').addEventListener("click", showOverlay);
function hideOverlay(){ document.getElementById('overlay-cnt').style.display = 'none'; }
function showOverlay(){ document.getElementById('overlay-cnt').style.display = 'block'; }


$("body").not($("#search-engine-cnt")).click(function(){
    document.getElementById('result-cnt').style.display = "none";
});

function search_engine(){

    fetch('../../assets/users_data/pseudo_placeAPI.json')
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
                lis += "<button onclick=\"window.location.href='../../search?place='+this.innerHTML.toLowerCase()\" >" + element.location + '</button><hr>';
            });
            document.getElementById('geo-data').innerHTML = lis;
        });
    })

}


//###############################################################################


function edit_profile_data(texts){

    fetch('../../assets/users_data/additionals.json')
    .then(data => data.json())
    .then(data => {

        const req_user = location.pathname.split('/')[1];
        let index = data.findIndex(ele => ele.username == req_user);
        if(index == -1){window.location.replace('/'); return; }
        
        document.getElementById('profile-image').innerHTML = `<img id="fetched_image" src="../../assets/users_data/profile_images/${data[index].profile_image_src}" alt="img">`;
        
        if(texts){
            document.getElementById('username').innerHTML = data[index].username;
            document.getElementById('bio_inpt').value = data[index].bio;
            document.getElementById('instagram_inpt').value = data[index].instagram;
            document.getElementById('linkedin_inpt').value = data[index].linkedin;
        }
    })

}

function green(){

    console.log("green");
    let imgInp = document.getElementById('image_inpt');
    const [file] = imgInp.files
    if (file) {
        document.getElementById('fetched_image').src = URL.createObjectURL(file)
    }
    $('#remove_image').prop('disabled',false)
}


function remove_image(){

    let url = document.getElementById('fetched_image').src;
    URL.revokeObjectURL(url);
    $('#remove_image').prop('disabled',true)
    edit_profile_data(false);
}



