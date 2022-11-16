import * as geolib from 'geolib';

export const GetDistance = (lat1, lon1, lat2, lon2) => {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    }
};


export const getCloseDriver = (userLocation, drivers, reqObj = {}) => {
    if (reqObj.distance > 50) {
        drivers = drivers.filter((item) => {
            if (item.outstation_status == 1) {
                return item;
            }
        })
    }
    //Passing user current location and all available driver array
    const closet = drivers.map((driver) => {
        console.log("Closet driver", driver);
        const coord = driver.location;
        const id = driver.provider_id;
        const single_driver = driver;
        return { id, single_driver, coord, dist: geolib.getDistance(userLocation, coord) }
    })
        .sort((a, b) => a.dist - b.dist)[0]

    // console.log("Closet driver", closet); return;

    return closet;
}