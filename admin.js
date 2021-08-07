const express = require('express');
const fs = require('fs')
const posts = require('./assets/users_data/posts.json');
const users = require('./assets/users_data/auth.json');
const additionals = require('./assets/users_data/additionals.json');

const app = express();

const place = `Himachal Pradesh,Khajjiar, Manali, Shimla, Kasol, Dalhousie, Dharamshala, Bir, Jammu and Kashmir, Kashmir Valley, Ladakh, Gulmarg, Uttaranchal, Valley of Flowers, Roopkund Lake, Rishikesh, Auli, Nainital, Haridwar, Dehradun, Corbett National Park, Uttar Pradesh, Ghats in Varanasi, Agra, Mathura, Rajasthan, Jodhpur, Desert of Jaisalmer, Udaipur, Ranthambore, Jaipur, Pushkar, Bikaner, Bharatpur, Mount Abu, Goa, Dudhsagar Falls, Grand Island, North Goa, South Goa, Maharashtra, Mumbai, Pune, Lonavala, Kamshet, Mahabaleshwar, Kolad, Panchgani, Alibaug, Karnataka, Chikmagalur, Kabini, Bandipur, Coorg, Dandeli, Sakleshpur, Hampi, Gokarna, Mysore`;
let arr = place.split(',');


app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/sort', (req, res) => {

    fs.readFile('./assets/users_data/pseudo_placeAPI.json', 'utf8', (err,data) => {
        var db_data = JSON.parse(data);
        let i = 0; 
        db_data.forEach(element => {
            arr.sort();
            element.location = arr[i].replace(/^ +/gm, '').toLocaleUpperCase();
            element.lat = 101+i;
            element.lng = 101+i;
            i++;
        });
        fs.writeFile('./assets/users_data/pseudo_placeAPI.json', JSON.stringify(db_data, null, 4),'utf8',(err) => {
            if(err) throw err; 
            else {
                console.log({statusCode : 200,message : `updated`});
                res.send({});
            }
        })
        console.log(db_data);
        res.send(db_data);
    })
})

app.get('/admin/view-users', (req, res) => {
    res.send(users);
})

app.get('/admin/view-posts', (req, res) => {
    res.send(posts);
})

app.get('/admin/view-additionals', (req, res) => {
    res.send(additionals);
})

app.listen(3060, () => {
    console.log("admin server running.");
});
