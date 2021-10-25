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
                formData.append(`fileUp_${i + 1}.png`, blob[i]);
            }
            formData.append('owner', owner)
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
    },
    getNearPost: async (postId) => {
        try {
            let res = await axios.get(process.env.API_KEY + `/searchFoundCat/getNearPost/${postId}`)
            return res;
        } catch (e) {
            return e.response;
        }
    },
    checkNearPost: async (lostPostId, foundPostId) => {
        try {
            let res = await axios.get(process.env.API_KEY + `/searchFoundCat/checkNearPost/${lostPostId}/${foundPostId}`)
            return res;
        } catch (e) {
            return e.response;
        }
    },
    checkCheckedLostPost: async (lostPostId) => {
        try {
            let res = await axios.get(process.env.API_KEY + `/searchLostCat/checkCheckedLostPost/${lostPostId}`)
            return res;
        } catch (e) {
            return e.response;
        }
    },
    update: async (date, sex, collar, description, owner, credential, postId, type) => {
        try {
            let endpoint = '';
            if (type == 'lost') {
                endpoint = 'postLostCat'
            } else if (type == 'found') {
                endpoint = 'postFoundCat'
            }
            let descriptionCheck;
            if (!description) {
                descriptionCheck = ' ';
            } else {
                descriptionCheck = description;
            }
            let res = await axios.put(process.env.API_KEY + `/${endpoint}/update`, {
                date: date,
                sex: sex,
                collar: collar,
                description: descriptionCheck,
                owner: owner,
                credential: credential,
                postId: postId
            });
            return res;
        } catch (e) {
            return e.response;
        }
    },
    addImage: async (owner, cipherCredential, postId, type, blob, rawFile, oldFile) => {
        try {
            let endpoint = '';
            if (type == 'lost') {
                endpoint = 'postLostCat'
            } else {
                endpoint = 'postFoundCat'
            }
            let formData = new FormData();
            for (let i = 0; i < blob.length; i++) {
                let fileRef = rawFile[i];
                for (let j = 0; j < oldFile.length; j++) {
                    if (fileRef == oldFile[j].fileName) {
                        fileRef = fileRef + 'New';
                    }
                }
                formData.append(`${fileRef}`, blob[i]);
            }
            formData.append('owner', owner);
            formData.append('cipherCredential', cipherCredential);
            formData.append('postId', postId);
            let res = await axios({
                method: "put",
                url: process.env.API_KEY + `/${endpoint}/addImage`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
            return res;
        } catch (e) {
            return e.response;
        }
    },
    deleteImage: async (postId, credential, fileRef, type) => {
        try {
            let endpoint = '';
            if (type == 'lost') {
                endpoint = 'postLostCat'
            } else {
                endpoint = 'postFoundCat'
            }
            let res = await axios.put(process.env.API_KEY + `/${endpoint}/deleteImage`, {
                fileRef: fileRef,
                credential: credential,
                postId: postId
            });
            return res;
        } catch (e) {
            return e.response;
        }
    },
    deletePost: async (postId, credential, type) => {
        try {
            let endpoint = '';
            if (type == 'lost') {
                endpoint = 'postLostCat'
            } else {
                endpoint = 'postFoundCat'
            }
            let res = await axios.put(process.env.API_KEY + `/${endpoint}/deletePost`, {
                credential: credential,
                postId: postId
            });
            return res;
        } catch (e) {
            return e.response;
        }
    },
    completePost: async (postId, credential, type) => {
        try {
            let endpoint = '';
            if (type == 'lost') {
                endpoint = 'postLostCat'
            } else {
                endpoint = 'postFoundCat'
            }
            let res = await axios.put(process.env.API_KEY + `/${endpoint}/completePost`, {
                credential: credential,
                postId: postId
            });
            return res;
        } catch (e) {
            return e.response;
        }
    },
    extendPost: async (postId, credential, type) => {
        try {
            let endpoint = '';
            if (type == 'lost') {
                endpoint = 'postLostCat'
            } else {
                endpoint = 'postFoundCat'
            }
            let res = await axios.put(process.env.API_KEY + `/${endpoint}/extendPost`, {
                credential: credential,
                postId: postId
            });
            return res;
        } catch (e) {
            return e.response;
        }
    }
}

export default allPostUtil;