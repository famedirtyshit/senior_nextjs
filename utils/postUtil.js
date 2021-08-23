import axios from 'axios';

const allPostUtil = {
    search: async () => {
        try {
            // if(sexInput==undefined){
            //     sexInput = null;
            // }
            // if(collarInput==undefined){
            //     collarInput = null;
            // }
            let res = await axios.get(process.env.API_KEY + `/searchLostCat/get/d01/null/null`)
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