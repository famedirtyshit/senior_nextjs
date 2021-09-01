import axios from 'axios';

const allPostUtil = {
    search: async (lat, lng, sex, collar, radius, type, page, sortType, fromTo) => {
        try {
            let endpoint = '';
            if (type == 'lost') {
                endpoint = 'searchLostCat'
            } else if (type == 'found') {
                endpoint = 'searchFoundCat'
            } else {
                endpoint = 'searchAll'
            }
            let male = sex.male;
            let female = sex.female;
            let unknow = sex.unknow;
            let haveCollar = collar.haveCollar;
            let notHaveCollar = collar.notHaveCollar;
            let res = await axios.get(process.env.API_KEY + `/${endpoint}/get/${lat}/${lng}/${radius}/${male}/${female}/${unknow}/${haveCollar}/${notHaveCollar}/${page}/${sortType}/${fromTo[0]}/${fromTo[1]}`)
            return res;
        } catch (e) {
            return e.response;
        }
    },
    searchNoMap: async (sex, collar, type, page, fromTo) => {
        try {
            let endpoint = '';
            if (type == 'lost') {
                endpoint = 'searchLostCat'
            } else if (type == 'found') {
                endpoint = 'searchFoundCat'
            } else {
                endpoint = 'searchAll'
            }
            let male = sex.male;
            let female = sex.female;
            let unknow = sex.unknow;
            let haveCollar = collar.haveCollar;
            let notHaveCollar = collar.notHaveCollar;
            let res = await axios.get(process.env.API_KEY + `/${endpoint}/getAll/${male}/${female}/${unknow}/${haveCollar}/${notHaveCollar}/${page}/${fromTo[0]}/${fromTo[1]}`)
            return res;
        } catch (e) {
            return e.response;
        }
    },
    post: async (lat, lng, dateInput, sexInput, collarInput, descriptionInput, blob, type, owner) => {
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
                formData.append(`fileUp_ ${i + 1}.png`, blob[i]);
            }
            formData.append('owner',owner)
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