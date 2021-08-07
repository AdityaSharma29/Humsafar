//  register page 

fetch('../assets/users_data/auth.json')
        .then( res => res.json())
        .then(data => {
            let arr = [];
            for (i = 0; i < data.length; i++) arr.push(data[i].username);
            $('#username').keyup(function (e) { 
                let val = $('#username').val();
                if(arr.indexOf(val) !== -1){ $('#warning').text('username not available'); $('.register').prop('disabled',true) }
                else { $('#warning').text(''); $('.register').prop('disabled',false) }
            });
        });

