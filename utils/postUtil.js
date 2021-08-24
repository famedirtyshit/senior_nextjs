import axios from 'axios';

const allPostUtil = {
    search: async (lat,lng,sex,collar,radius,type) => {
        try {
            let endpoint = '';
            if (type == 'lost') {
                endpoint = 'searchLostCat'
            } else {
                endpoint = 'searchFoundCat'
            }
            let male = sex.male;
            let female = sex.female;
            let unknow = sex.unknow;
            let haveCollar = collar.haveCollar;
            let notHaveCollar = collar.notHaveCollar;
            let res = await axios.get(process.env.API_KEY + `/${endpoint}/get/${lat}/${lng}/${radius}/${male}/${female}/${unknow}/${haveCollar}/${notHaveCollar}`)
            return res;
        } catch (e) {
            return e.response;
        }
    },
    post: async (lat, lng, dateInput, sexInput, collarInput, descriptionInput, blob, type) => {
        let endpoint = '';
        if (type == 'lost') {
            endpoint = 'postLostCat'
        } else {
            endpoint = 'postFoundCat'
        }
        try {
            let formData = new FormData();
            formData.append('lat', lat)
            formData.append('lng', lng)
            formData.append('date', dateInput)
            if (sexInput != undefined) {
                formData.append('sex', sexInput)
            }
            if (collarInput != undefined) {
                formData.append('collar', collarInput)
            }
            if (descriptionInput != '') {
                formData.append('description', descriptionInput)
            }
            for (let i = 0; i < blob.length; i++) {
                formData.append(`fileUp_ ${i + 1}`, blob[i]);
            }
            // formData.append('blob',blob)
            let res = await axios({
                method: "post",
                url: process.env.API_KEY + `/${endpoint}/post`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
            return res;
        } catch (e) {
            // console.log(e)
            return e.response;
        }
    }
}

export default allPostUtil;