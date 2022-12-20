import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

while (true) {
    try {
        let auth = await fetch('https://zont-online.ru/api/devices', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'X-ZONT-Client': `${process.env.EMAIL}`, 'X-ZONT-Token': `${process.env.TOKEN}` },
        })
        let data = await auth.json();
        fs.writeFileSync('./logs/app.log', JSON.stringify(data));
        console.log(data)
        let obj = fs.readFileSync('./logs/app.log', 'utf-8');
        let str = JSON.parse(obj);
        let bar = str.devices[0].gtw_p_water;

        if (bar < 0.8) {
            let temp = await fetch('https://zont-online.ru/api/update_device', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json', 'X-ZONT-Client': `${process.env.EMAIL}`,
                    auth: (`${process.env.LOGIN}, ${process.env.PASS}`),
                },
                body: {
                    'Content-Type': 'text/plain', 'device_id': `${process.env.DEVICEID}`,
                    'gtw_t_air_set_disp': 11,
                },
            })
        }
    }

    catch (e) {
        console.log(`${e}`);
    }
    await timeout(3600000);
}