import axios from "axios";

const api = axios.create({
    baseURL: 'https://api.weatherapi.com/v1',
    params: {
        'key': process.env.REACT_APP_WEATHER_API_KEY
    }
})

export default api