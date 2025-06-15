import axios from "axios";

const geoapi = axios.create({
    baseURL: 'https://api.geoapify.com/v1',
    params: {
        'apiKey': process.env.REACT_APP_GEO_API_KEY
    }
})

export default geoapi